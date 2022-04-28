import { useState, useEffect, useRef, createContext, useReducer } from "react"
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import axios from "axios"
import moment from "moment"

const {REACT_APP_SERVER} = process.env
const SocketContext = createContext()
const socket = io.connect(REACT_APP_SERVER);

const blobContainer = []
const peerConnections = {};
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
    const [record, setRecord] = useState(true)

    const myVideo = useRef()
    // const connectionRef = useRef()
    const oldStream = useRef(null)
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
                    return s.track.kind == cam.kind;
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
                    return s.track.kind == mic.kind;
                });
                sender.replaceTrack(mic);
            }
        }
    }

    const start = async () => {
        console.log('start');
        var stream = await getCameraWithMicrophone()
        oldStream.current = stream
        setStream(stream)
        socket.emit("broadcaster");
    }

    const startRecord = () => {
        mediaRecorder.current = new MediaRecorder(stream, {
            audioBitsPerSecond : 128000,
            videoBitsPerSecond : 2500000,
            mimeType : 'video/webm; codecs=vp9'
        });
        mediaRecorder.current.start()
        console.log(mediaRecorder.current);

        mediaRecorder.current.ondataavailable = (e) => {
            console.log(e.data);
            blobContainer.push(e.data)
            console.log(window.URL.createObjectURL(new Blob(blobContainer)))
        }
        setRecord(true)
    }

    const stopRecord = () => {
        setRecord(false)
        mediaRecorder.current.stop()
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
                let newList = pre.filter(user => user.socketID != id);
                socket.emit("joinLive", newList)
                return newList
            })
        });

        socket.on("mess", (id, newMessage) => {
            if (socket.id != id)
                setMessages((prevMessages) => [...prevMessages, newMessage])
        });

        socket.on("joinLive", (newUser) => {
            // console.log("joinLive");
            setListUser((prev) => {
                let newList = [...prev, newUser]
                socket.emit("joinLive", newList)
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
            if (socket.id != id)
                setMessages((prevMessages) => [...prevMessages, newMessage])
        });

        socket.on("joinLive", (newUser) => {
            // console.log("joinLive");
            setListUser(newUser)
        });
        
        window.onunload = window.onbeforeunload = () => {
            socket.close();
            peerConnection.close();
        };
    }


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
            name, 
            setName, 
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
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }