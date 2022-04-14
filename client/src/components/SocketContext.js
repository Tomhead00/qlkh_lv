import { useState, useEffect, useRef, createContext } from "react"
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const {REACT_APP_SERVER} = process.env
const SocketContext = createContext()
const socket = io(REACT_APP_SERVER);

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
        var stream = await getCameraWithMicrophone()
        oldStream.current = stream
        setStream(stream)
        myVideo.current.srcObject = stream
        // console.log(stream);
        if(stream) {
            socket.on('calluser', ({signal, from, name: callerName}) => {
                console.log("Nhan cuoc goi");
                setCall({isReceivedCall: true, from, name: callerName, signal})
            })
        }
    }
    
    useEffect(() => {
        socket.on('me', (id) => {
            setMe(id)
        })
        start()
    },[])
    
    const answerCall = () => {
            console.log("join cuoc goi");
            setCallAccepted(true)
        var peer = new Peer({initiator: false, trickle: false, stream})
        peer.on('signal', (data) => {
            socket.emit('answercall', { signal: data, to: call.from })
        })
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })
        peer.signal(call.signal);

        connectionRef.current = peer;
    }
    
    const callUser = (id) => {
        console.log("bat dau cuoc goi");
        var peer = new Peer({initiator: true, trickle: false, stream})
        peer.on('signal', (data) => {
            // console.log(data);
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })
        peer.on('stream', (currentStream) => {
            userVideo.current.srcObject = currentStream
        })
        socket.on('callaccepted', (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })
        connectionRef.current = peer;
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
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }