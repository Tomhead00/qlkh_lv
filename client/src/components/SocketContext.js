import { useState, useEffect, useRef, createContext } from "react"
import { io } from 'socket.io-client'
import Peer from 'simple-peer'
import axios from "axios"

const {REACT_APP_SERVER} = process.env
const SocketContext = createContext()
const socket = io.connect(REACT_APP_SERVER);

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
    const [call, setCall] = useState({})
    const [callAccepted, setCallAccepted] = useState(false)
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')


    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    const oldStream = useRef(null)
    const switchCameraToScreen = useRef(false)
    const micro = useRef(true)
    const video = useRef(true)

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

    const updateCamStreamAndPeer = (cam) => {
        var newStream = stream.clone()
        newStream.removeTrack(newStream.getVideoTracks()[0])
        newStream.addTrack(cam)
        if(connectionRef.current) {
            // connectionRef.current.removeTrack(oldStream.current.getVideoTracks()[0], stream)
            connectionRef.current.addTrack(cam, oldStream.current)
            connectionRef.current.replaceTrack(oldStream.current.getVideoTracks()[0], cam, oldStream.current)
        } else 
            oldStream.current = newStream
            setStream(newStream)
            myVideo.current.srcObject = newStream
        }
        
        const updateMicStreamAndPeer = (mic) => {
            var newStream = stream.clone()
            newStream.removeTrack(newStream.getAudioTracks()[0])
            newStream.addTrack(mic)
            if(connectionRef.current) {
                // connectionRef.current.removeTrack(oldStream.current.getAudioTracks()[0], stream)
                connectionRef.current.addTrack(mic, oldStream.current)
                connectionRef.current.replaceTrack(oldStream.current.getAudioTracks()[0], mic, oldStream.current)
            } else 
            oldStream.current = newStream
            setStream(newStream)
            myVideo.current.srcObject = newStream
        }
        
        const ChangeCamAndScreen = async () => {
            if (switchCameraToScreen.current) {
                var cam = await getScreen()
                stream.getVideoTracks()[0].stop()
            cam.onended = () => {
                switchCameraToScreen.current = false
                ChangeCamAndScreen()
            };
        }
        else if (video.current)
        var cam = await getCamera()
        else {
            stream.getVideoTracks()[0].enabled = false
            const test = () => {
                stream.getVideoTracks()[0].stop()
            }
            setTimeout(test, 500);
            return;
        }
        updateCamStreamAndPeer(cam)
    };
    
    const toggleCam = async () => {
        if (switchCameraToScreen.current) {
            if(video.current) video.current = false
            else video.current = true
        } else if(video.current) {
            stream.getVideoTracks()[0].enabled = false
            const test = () => {
                stream.getVideoTracks()[0].stop()
            }
            setTimeout(test, 500);
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
        if (switchCameraToScreen.current) {
            switchCameraToScreen.current = false
            await ChangeCamAndScreen()
        }
        else {
            switchCameraToScreen.current = true
            await ChangeCamAndScreen()
        }
    }

    const start = async () => {
        console.log('start');
        var stream = await getCameraWithMicrophone()
        oldStream.current = stream
        setStream(stream)
        myVideo.current.srcObject = stream
        socket.emit("broadcaster");
    }

    const broadcaster = () => {
        console.log("broadcaster");
        socket.on("watcher", id => {
            console.log("watcher");
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;
    
            console.log(stream.getTracks());
            stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
              
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
        
        socket.on("answer", (id, description) => {
            console.log("answer");
            peerConnections[id].setRemoteDescription(description);
        });
        
        socket.on("candidate", (id, candidate) => {
            console.log("candidate");
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });
    
        socket.on("disconnectPeer", id => {
            console.log("disconnectPeer");
            peerConnections[id].close();
            delete peerConnections[id];
        });
        
        window.onunload = window.onbeforeunload = () => {
            socket.close();
        };
    }

    // // watcher
    const watcher = (idSocket) => {
        console.log("watcher: " + idSocket);
        
        socket.emit("watcher", idSocket);
        let peerConnection;
        socket.on("offer", (id, description) => {
            console.log("offer");
            peerConnection = new RTCPeerConnection(config);
            peerConnection
            .setRemoteDescription(description)
            .then(() => peerConnection.createAnswer())
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
                socket.emit("answer", id, peerConnection.localDescription);
            });
            peerConnection.ontrack = event => {
                console.log(event.streams[0].getTracks());
                setStream(event.streams[0])
                myVideo.current.srcObject = event.streams[0]
            };
            peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit("candidate", id, event.candidate);
            }
            };
        });
        socket.on("candidate", (id, candidate) => {
            console.log("candidate");
            peerConnection
            .addIceCandidate(new RTCIceCandidate(candidate))
            .catch(e => console.error(e));
        });
        
        
        socket.on("broadcaster", () => {
            console.log("broadcaster");
            socket.emit("watcher");
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

    
    const answerCall = () => {
        console.log("join cuoc goi");
        var peer1 = new Peer({initiator: false, trickle: false, stream})
        setCallAccepted(true)
        peer1.on('signal', (data) => {
            console.log({ signal: data, to: call.from });
            socket.emit('answercall', { signal: data, to: call.from })
        })
        // peer.on('stream', (currentStream) => {
        //     userVideo.current.srcObject = currentStream
        // })
        peer1.signal(call.signal);

        connectionRef.current = peer1;
    }
    
    const callUser = (id) => {
        console.log("bat dau cuoc goi");
        // console.log(stream);
        var peerx = new Peer({initiator: true, trickle: false, stream})
        peerx.on('signal', (data) => {
            console.log({ userToCall: id, signalData: data, from: me, name });
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })

        peerx.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })

        socket.on('callaccepted', (signal) => {
            setCallAccepted(true)
            peerx.signal(signal)
        })
        connectionRef.current = peerx;
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy();
        window.location.reload()
    }
    
    return (
        <SocketContext.Provider value={{
            toggleCam,
            toggleMic,
            micro,
            video,
            changeStream,
            ChangeCamAndScreen,
            switchCameraToScreen,
            call, 
            callAccepted,
            myVideo,
            userVideo,
            stream,
            setStream,
            name,
            setName,
            callEnded,
            me,
            callUser,
            leaveCall,
            connectionRef,
            answerCall,
            start,
            broadcaster,
            watcher,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }