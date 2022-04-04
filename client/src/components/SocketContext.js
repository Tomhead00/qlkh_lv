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
    const oldTrackAudio = useRef(null)
    const oldTrackVideo = useRef(null)
    const switchCameraToScreen = useRef(false)

    
    useEffect(() => {
        streamFn()
        socket.on('me', (id) => {
            setMe(id)
        })
        socket.on('calluser', ({from, name: callerName, signal}) => {
            console.log("Nhan cuoc goi");
            setCall({isReceivedCall: true, from, name: callerName, signal})
        })
    },[])


    const getScreenshareWithMicrophone = async () => {
        const audio = await navigator.mediaDevices.getUserMedia({audio: true});
        const stream = await navigator.mediaDevices.getDisplayMedia({video: true});
        oldTrackAudio.current = audio.getTracks()[0]
        oldTrackVideo.current = stream.getTracks()[0]
        // console.log(oldTrackVideo.current, oldTrackAudio.current);
        return new MediaStream([audio.getTracks()[0], stream.getTracks()[0]]);
    }
    const getCameraWithMicrophone = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true });
        oldTrackAudio.current = stream.getTracks()[0]
        oldTrackVideo.current = stream.getTracks()[1]
        // console.log(oldTrackVideo.current, oldTrackAudio.current);
        return new MediaStream([stream.getTracks()[0], stream.getTracks()[1]]);
    }
    const streamFn = async () => {
        // console.log(oldTrackAudio.current, oldTrackVideo.current, "Ham chay", switchCameraToScreen);
        if (switchCameraToScreen.current)
            var streamSw = await getScreenshareWithMicrophone()
        else
            var streamSw = await getCameraWithMicrophone()
        // if(stream) {
        //     stream.getTracks()[0].stop()
        //     stream.getTracks()[1].stop()
        // }
        if(connectionRef.current) {
            console.log("Da ket noi");
            // connectionRef.current.removeStream(stream)
            connectionRef.current.addStream(streamSw)
            // connectionRef.current.addTrack(stream.getVideoTracks(), stream)
            // connectionRef.current.replaceTrack(oldTrackAudio.current, stream.getAudioTracks(), stream)
            // connectionRef.current.replaceTrack(oldTrackVideo.current, stream.getVideoTracks(), stream)
        }
        setStream(streamSw)
        myVideo.current.srcObject = streamSw
    };

    const answerCall = () => {
        console.log("tra loi cuoc goi");
        // console.log(oldTrackAudio.current, oldTrackVideo.current);
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

    const changeStream = async () => {
        console.log("Doi stream hien tai");
        if (switchCameraToScreen.current) {
            switchCameraToScreen.current = false
            await streamFn()
        }
        else {
            switchCameraToScreen.current = true
            await streamFn()
        }
        // console.log(oldTrackAudio.current, stream.getTracks()[0]);
        // console.log(oldTrackVideo.current, stream.getTracks()[1]);
        if(connectionRef.current) {
            console.log("Da ket noi");
            // connectionRef.current.addTrack(stream.getAudioTracks(), stream)
            // connectionRef.current.addTrack(stream.getVideoTracks(), stream)
            // connectionRef.current.replaceTrack(oldTrackAudio.current, stream.getAudioTracks(), stream)
            // connectionRef.current.replaceTrack(oldTrackVideo.current, stream.getVideoTracks(), stream)
        }
    }

    const callUser = (id) => {
        console.log("goi nguoi khac");
        var peer = new Peer({initiator: true, trickle: false, stream})
        peer.on('signal', (data) => {
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
            getScreenshareWithMicrophone,
            getCameraWithMicrophone,
            changeStream,
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