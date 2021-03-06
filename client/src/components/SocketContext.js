import { useState, useEffect, useRef, createContext } from "react"
import { io } from 'socket.io-client'
import axios from "axios"
import moment from "moment"
import FileSaver from 'file-saver';
import {slugify} from "./Func"
// import ysFixWebmDuration from "fix-webm-duration";


const {REACT_APP_SERVER} = process.env
const SocketContext = createContext()
const socket = io.connect(REACT_APP_SERVER);

const peerConnections = {};
// var duration;
const config = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"]
    }
  ]
};

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null)
    const [me, setMe] = useState('')
    const [isBroadcaster, setIsBroadcaster] = useState(false)
    const [course, setCourse] = useState([])
    const [name, setName] = useState(null)
    const [description, setDescription] = useState(null)
    const [user, setUser] = useState([])
    const [messages, setMessages] = useState([])
    const [listUser, setListUser] = useState([])
    const [listBan, setListBan] = useState([])
    const [record, setRecord] = useState(false)
    const [blobContainer, setBlobContainer] = useState([])
    const [load, setLoad] = useState(0)
    const [banAll, setBanAll] = useState(false)

    const myVideo = useRef()
    // const connectionRef = useRef()
    const switchCameraToScreen = useRef(false)
    const micro = useRef(true)
    const video = useRef(true)
    const mediaRecorder = useRef()


    const getScreenshareWithMicrophone = async () => {
        let audio = await navigator.mediaDevices.getUserMedia({audio: true});
        let stream = await navigator.mediaDevices.getDisplayMedia({video: true});
        // console.log(audio.getTracks()[0], stream.getTracks()[0]);
        if (micro.current)
            return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]]);
        else
            return new MediaStream([stream.getTracks()[0]]);
    }

    const getCameraWithMicrophone = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
        // console.log(stream.getTracks()[0], stream.getTracks()[1]);
        return new MediaStream(stream.getTracks());
    }

    const getCamera = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({video: true });
        return (stream.getVideoTracks()[0])
    }
    const getScreen = async () => {
        let stream = await navigator.mediaDevices.getDisplayMedia({video: true });
        return (stream.getVideoTracks()[0])
    }
    const getMic = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({audio: true });
        return (stream.getAudioTracks()[0])
    }
    
    const toggleCam = async () => {
        if (switchCameraToScreen.current) {
            if(video.current) video.current = false
            else video.current = true
        } 
        else if(video.current) {
            stream.getVideoTracks()[0].stop()
            video.current = false
        }
        else {
            video.current = true
            var cam = await getCamera()
            updateCamStreamAndPeer(cam)
        }
    }
    
    const toggleMic = async () => {
        if(micro.current) {
            stream.getAudioTracks()[0].enabled = false
            const test = () => {
                stream.getAudioTracks()[0].stop()
            }
            setTimeout(test, 500);
            micro.current = false
        }
        else {
            micro.current = true
            var mic = await getMic()
            updateMicStreamAndPeer(mic)
        }
    }
    
    const changeStream = async () => {
        try {
            if (switchCameraToScreen.current) {
                switchCameraToScreen.current = false
                await ChangeCamAndScreen()
            }
            else {
                switchCameraToScreen.current = true
                await ChangeCamAndScreen()
            }
        } catch (err) {
            switchCameraToScreen.current = false
        }
    }

    const ChangeCamAndScreen = async () => {
        if (switchCameraToScreen.current) {
            var cam = await getScreen()
            cam.onended = () => {
                switchCameraToScreen.current = false
                ChangeCamAndScreen()
            };
        }
        else if (video.current)
                var cam = await getCamera()
        updateCamStreamAndPeer(cam)
    };

    const updateCamStreamAndPeer = (cam) => {
        stream.getVideoTracks().forEach((track) => {
            stream.removeTrack(track)
            track.stop()
        })
        stream.addTrack(cam)

        if(peerConnections) {
            // console.log(connectionRef.current);
            for (const [key, value] of Object.entries(peerConnections)) {
                var sender = value.getSenders().find(function(s) {
                    return s.track.kind === cam.kind;
                });
                sender.replaceTrack(cam);
            }
        }
    }
        
    const updateMicStreamAndPeer = (mic) => {
        stream.getAudioTracks().forEach((track) => {
            stream.removeTrack(track)
            track.stop()
        })
        stream.addTrack(mic)
        
        if(peerConnections) {
            for (const [key, value] of Object.entries(peerConnections)) {
                var sender = value.getSenders().find(function(s) {
                    return s.track.kind === mic.kind;
                });
                sender.replaceTrack(mic);
            }
        }
    }

    const start = async () => {
        console.log('start');
        var stream = await getCameraWithMicrophone()
        setStream(stream)
        socket.emit("broadcaster");
    }

    const startRecord = () => {
        // var startTime = Date.now();
        mediaRecorder.current = new MediaRecorder(stream, {
            audioBitsPerSecond : 128000,
            videoBitsPerSecond : 2500000,
            // videoBitsPerSecond : 783216000,
            mimeType : 'video/webm;codecs=vp9'
        });
        // console.log(mediaRecorder.current);
        mediaRecorder.current.ondataavailable = (e) => {
            setBlobContainer((prev) => {
                return [...prev, {
                    data: e.data,
                    liveID: `${slugify(moment().format()+"-"+name)}.webm`,
                    timeStop: `${moment().format()}`,
                    load: 0,
                }]
            })
            // console.log(window.URL.createObjectURL(new Blob(blobContainer)))
        }
        mediaRecorder.current.onstop = () => {
            // duration = Date.now() - startTime;
            alert("B???n ghi ???? k???t th??c!")
            setRecord(false)
        };
        mediaRecorder.current.start()
        setRecord(true)
    }

    const download = async (dataToModal) => {
        console.log(blobContainer[dataToModal]);
        var buggyBlob = new Blob([blobContainer[dataToModal].data], { type: 'video/webm;codecs=vp9' });
        // const fixedBlob = await ysFixWebmDuration(buggyBlob, duration);
        FileSaver.saveAs(buggyBlob, blobContainer[dataToModal].liveID);
    };

    const stopRecord = () => {
        mediaRecorder.current.stop()
        setRecord(false)
    }

    const addChat = (message) => {
        setMessages((prevMessages) => {
            var actor = listUser.find(user => user.socketID === socket.id)
            var newMessage = {
                message: message,
                actor: actor.username,
                time: `${moment().format()}`,
            }
            socket.emit("mess", socket.id, newMessage, listUser)
            return [...prevMessages, newMessage]
        })
    }

    const upload = (dataToModal, id) => {
        // console.log(element, name, description);
        var formData = new FormData()
        formData.append('blobFile', new Blob([blobContainer[dataToModal].data], { type: 'video/webm;codecs=vp9' }), blobContainer[dataToModal].liveID)
        formData.append('name', name)
        formData.append('description', description)
        formData.append('liveID', blobContainer[dataToModal].liveID)
        // for (var p of formData) {
        //     console.log(p);
        // }

        axios.post(`${REACT_APP_SERVER}/livestream/${id}/addVideo`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {
                const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
                if (totalLength !== null) {
                    setBlobContainer(prev => {
                        prev[dataToModal].load = Math.round((progressEvent.loaded * 100) / totalLength )
                        return prev;
                    })
                    setLoad(blobContainer[dataToModal].load)
                    // console.log(Math.round((progressEvent.loaded * 100) / totalLength ));
                }
            }
        })
        .then(ketqua => {
            if(ketqua.data) {
                alert("T???i l??n th??nh c??ng!")
            } else {
                alert("L???i, kh??ng th??? t???i l??n h??? th???ng!")
            }
        })
    }

    // broatcaster
    const broadcaster = () => {
        console.log("broadcaster");
        socket.on("watcher", id => {
            const peerConnection = new RTCPeerConnection(config);
            // connectionRef.current = peerConnection
            peerConnections[id] = peerConnection;
            // console.log("watcher", peerConnection, peerConnections[id]);
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
            // console.log(peerConnection.getSenders());

            peerConnection.onicecandidate = event => {
              if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
              }
            };
          
            peerConnection
              .createOffer()
              .then(sdp => peerConnection.setLocalDescription(sdp))
              .then(() => {
                socket.emit("offer", id, peerConnection.localDescription);
              });
        });
        
        socket.on("answer", (id, Description) => {
            // console.log("answer");
            // console.log(user, course, name, description);
            socket.emit("infor", id, name, description);
            peerConnections[id].setRemoteDescription(Description);
            // console.log(peerConnections);
        });
        
        socket.on("candidate", (id, candidate) => {
            // console.log("candidate");
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });
    
        socket.on("disconnectPeer", id => {
            console.log("disconnectPeer", id);
            peerConnections[id].close();
            delete peerConnections[id];
            setListUser(pre => {
                // let listBans
                let newList = pre.filter(user => user.socketID !== id);
                // setListBan(prev => {
                //     listBans = prev
                //     console.log(listBans);
                //     return prev
                // })
                socket.emit("joinLive", newList, listBan)
                return newList
            })
        });

        socket.on("mess", (id, newMessage) => {
            if (socket.id !== id)
                setMessages((prevMessages) => [...prevMessages, newMessage])
        });

        socket.on("joinLive", (newUser) => {
            var listUsers, listBans
            setListUser((prev) => {
                listUsers = [...prev, newUser]
                return listUsers
            })
            setListBan((prev) => {
                const found = prev.find(element => element.userID === newUser.userID);
                if (found) {
                    listBans = prev
                    return prev
                }
                else {
                    listBans = [...prev, {
                        userID: newUser.userID,
                        banned: banAll,
                    }]
                    return listBans
                }
            })
            socket.emit("joinLive", listUsers, listBans)
        });

        socket.on("banAllToBroatcaster", (checked) => {
            setBanAll(checked)
            setListBan(prev => {
                var newList = prev
                newList.map((element, index) => {
                    if (index === 0 || element.userID === user.user._id)
                        element.banned = false
                    else 
                        element.banned = checked
                    return true
                })
                var listUsers
                setListUser(prev => {
                    listUsers = prev
                    return prev
                })
                socket.emit("joinLive", listUsers, newList);
                return newList
            })
        });

        socket.on("joinLiveRefeshList", (listUsers, listBans) => {
            // console.log("joinLive");
            setListUser(listUsers)
            setListBan(listBans)
        });

        socket.on("ban1User", (userID) => {
            setListBan(prev => {
                var newList = prev
                for (var i = 0; i < newList.length; i++) {
                    if (newList[i].userID === userID) {
                        var res = newList[i].banned
                        newList[i].banned = !res
                        break;
                    }
                }
                var listUsers
                setListUser(prev => {
                    listUsers = prev
                    return prev
                })
                socket.emit("joinLive", listUsers, newList);
                return newList
            })
        });
        
        window.onunload = window.onbeforeunload = () => {
            socket.close();
        };
    }

    // // watcher
    const watcher = (idSocket) => {
        let newUser = {
            socketID: socket.id,
            userID: user.user._id,
            username: user.user.username,
            image: user.user.image,
        }
        console.log("watcher: " + socket.id);
        socket.emit("watcher", idSocket, newUser);
        let peerConnection;
        socket.on("offer", (id, description) => {
            console.log("offer");
            peerConnection = new RTCPeerConnection(config);
            try {
                peerConnection
                .setRemoteDescription(description)
                .then(() => peerConnection.createAnswer())
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("answer", id, peerConnection.localDescription);
                });
            } catch (err) {
                window.location.reload();
            }
            peerConnection.ontrack = event => {
                // console.log(event.streams[0].getTracks());
                setStream(event.streams[0])
            };
            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", id, event.candidate);
                }
            };
        });
        socket.on("candidate", (id, candidate) => {
            // console.log("candidate");
            peerConnection
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error(e));
        });

        socket.on("infor", (name, description) => {
            // console.log(name, description);
            setName(name)
            setDescription(description)
        });

        socket.on("mess", (id, newMessage) => {
            if (socket.id !== id)
                setMessages((prevMessages) => [...prevMessages, newMessage])
        });

        socket.on("joinLive", (listUsers, listBans) => {
            // console.log("joinLive");
            setListUser(listUsers)
            setListBan(listBans)
        });

        socket.on("banChat", (checked) => {
            console.log(checked);
            setBanAll(checked)
        });
        
        window.onunload = window.onbeforeunload = () => {
            socket.close();
            peerConnection.close();
        };
    }

    // console.log(listUser, banAll);

    useEffect(() => {
        socket.on("getID", (id) => {
            setMe(id)
        })
    },[])
 
    return (
        <SocketContext.Provider value={{
            toggleCam,
            toggleMic,
            micro,
            video,
            changeStream,
            ChangeCamAndScreen,
            switchCameraToScreen,
            myVideo,
            stream,
            setStream,
            name,
            setName,
            me,
            start,
            broadcaster,
            watcher,
            isBroadcaster,
            setIsBroadcaster, 
            course, 
            setCourse, 
            description, 
            setDescription, 
            user, 
            setUser,
            addChat,
            messages,
            listUser,
            setListUser,
            socket,
            record,
            setRecord,
            startRecord,
            stopRecord,
            blobContainer,
            download,
            upload,
            load,
            setLoad,
            banAll, 
            setBanAll,
            listBan, 
            setListBan,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }