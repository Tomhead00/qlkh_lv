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
    const streamPeer = useRef(null)
    const switchCameraToScreen = useRef(false)
    const mic = useRef(true)
    const video = useRef(true)
    
    useEffect(() => {
        CamAndScreen()
        socket.on('me', (id) => {
            setMe(id)
        })
        socket.on('calluser', ({signal, from, name: callerName}) => {
            console.log("Nhan cuoc goi");
            // console.log({signal, from, name: callerName});
            setCall({isReceivedCall: true, from, name: callerName, signal})
        })
    },[])


    const getScreenshareWithMicrophone = async () => {
        let audio = await navigator.mediaDevices.getUserMedia({audio: mic.current});
        let stream = await navigator.mediaDevices.getDisplayMedia({video: true});
        // console.log(audio.getTracks()[0], stream.getTracks()[0]);
        if (mic.current)
            return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]]);
        else
            return new MediaStream([stream.getTracks()[0]]);
    }

    const getCameraWithMicrophone = async () => {
        let stream = await navigator.mediaDevices.getUserMedia({audio: mic.current, video: video.current });
        // console.log(stream.getTracks()[0], stream.getTracks()[1]);
        return new MediaStream(stream.getTracks());
    }

    const CamAndScreen = async () => {
        if (switchCameraToScreen.current) {
            var streamSw = await getScreenshareWithMicrophone()
            streamSw.getVideoTracks()[0].onended = () => {
                switchCameraToScreen.current = false
                CamAndScreen()
            };
        }
        else
            var streamSw = await getCameraWithMicrophone()
    
        try {
            if(stream) {
                stream.getAudioTracks()[0].stop()
                stream.getVideoTracks()[0].stop()
            }
        } catch(err) {}

        if(connectionRef.current) {
            if (video.current) {
                connectionRef.current.addTrack(streamSw.getVideoTracks()[0], streamPeer.current)
                connectionRef.current.replaceTrack(streamPeer.current.getVideoTracks()[0], streamSw.getVideoTracks()[0], streamPeer.current)
            }
            if (mic.current) {
                connectionRef.current.addTrack(streamSw.getAudioTracks()[0], streamPeer.current)
                connectionRef.current.replaceTrack(streamPeer.current.getAudioTracks()[0], streamSw.getAudioTracks()[0], streamPeer.current)
            }
        } else {
            streamPeer.current = streamSw
        }
        setStream(streamSw)
        myVideo.current.srcObject = streamSw
    };

    const answerCall = () => {
        console.log("join cuoc goi");
        setCallAccepted(true)
        var peer = new Peer({initiator: false, trickle: false, stream})
        peer.on('signal', (data) => {
            // console.log(data);
            socket.emit('answercall', { signal: data, to: call.from })
        })
        peer.on('stream', (currentStream) => {
            console.log(currentStream + " stream cua nguoi goi");
            userVideo.current.srcObject = currentStream
        })
        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const changeStream = async () => {
        try {
            console.log("Doi stream hien tai");
            if (switchCameraToScreen.current) {
                switchCameraToScreen.current = false
                await CamAndScreen()
            }
            else {
                switchCameraToScreen.current = true
                await CamAndScreen()
            }
        } catch (DOMException) {
            switchCameraToScreen.current = false
        }
    }

    const callUser = (id) => {
        console.log("bat dau cuoc goi");
        var peer = new Peer({initiator: true, trickle: false, stream})
        peer.on('signal', (data) => {
            // console.log(data);
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name })
        })
        peer.on('stream', (currentStream) => {
            console.log(currentStream + " stream cua nguoi nhan cuoc goi");
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
            streamPeer,
            mic,
            video,
            changeStream,
            CamAndScreen,
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
            answerCall,
            connectionRef,
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext }