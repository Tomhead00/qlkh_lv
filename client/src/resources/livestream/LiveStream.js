import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
// import Notifications from '../../components/Notifications'
import VideoPlayer from '../../components/VideoPlayer'
import { SocketContext } from '../../components/SocketContext'
import {makeStyles} from '@material-ui/core/styles'
import { ListSubheader } from "@material-ui/core"
import {isValidHttpUrl} from "../../components/Func"


const {REACT_APP_SERVER, REACT_APP_CLIENT} = process.env

const useStyle = makeStyles((theme) => ({
    appBar: {
        backgroundColor: '#BDBDBD',
        position: 'fixed',
        bottom: '0',
        // border: '1px solid',
        width: '100%',
        height: '10vh',
        padding: 0,
        margin: 0,
    },
    wrapper: {
        top: 0,
        left: 0,
        position: 'relative',
        margin: '0px',
        padding: '0px',
        height: '90vh',
        // display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexFlow: 'row nowrap',
    },
    menu: {
        margin: 0,
        padding: '15px',
        position: 'relative',
        height: '100%',
        width: '25vw',
        justifyContent: 'center',
        right: 0,
        backgroundColor: "#DCDCDC",
        // border: '1px solid',
        flex: '1 1 auto',
    },
    listChat: {
        height: "85%",
        scrollBehavior: "smooth",
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',

        overflowY: 'scroll',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
    }
})) 

function LiveStream () {
    const {socket, listUser, setListUser, addChat, messages, changeStream, micro, video, toggleCam, toggleMic, me, stream, name, setName, course, setCourse, description, setDescription, user, setUser, broadcaster, start, isBroadcaster, setIsBroadcaster , watcher } = useContext(SocketContext)
    const classes = useStyle()
    const [save, setSave] = useState(true)
    const [message, setMessage] = useState('')

    const params = useParams()
    const navi = useNavigate()

    const refMenu = useRef()
    const refMember = useRef()
    const refInfo = useRef()
    const listComment = useRef()

    useEffect(() =>{
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/livestream/getCourse/${params.id}`
        })
        .then(ketqua => {
            setCourse(ketqua.data);
        })
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/getUser`
        })
        .then(ketqua => {
            setUser(ketqua.data);
        })
    }, [])

    useEffect(() => {
        if (isBroadcaster) {
            setListUser([...listUser, {
                socketID: socket.id,
                userID: user.user._id,
                username: user.user.username,
                image: user.user.image,
            }])
        }
    }, [isBroadcaster, user])

    useEffect(() => {
        listComment.current.scrollTop = listComment.current.scrollHeight
    }, [messages])

    useEffect(() =>{
        if (user.user && course) {
            if (params.host) {
                watcher(params.host)
            } else {
                start()
                setIsBroadcaster(true)
            }
        }
    }, [user, course])

    useEffect(() => {
        if (params.host && name) {
            $("#registerLive").toggle()
            $("#inforLive").toggle()
        }
    },[name])

    const closeMenu = (e) => {
        $(refMenu.current).hide("slow")
        $(refMember.current).hide("slow")
        $(refInfo.current).hide("slow")
    }

    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleDesciption = (e) => {
        setDescription(e.target.value)
    }
    const startLive = async (e) => {
        if(name) {
            await broadcaster()
            navi(`/livestream/${params.id}/${me}`)
            $("#registerLive").toggle()
            $("#inforLive").toggle()
        }
    }

    const inputChat = (e) => {
        if (e.key === 'Enter') {
            sendChat()
        }
    }

    const sendChat = () => {
        // console.log("sendChat");
        if (message) {
            addChat(message)
            setMessage("")
        }
    }
    
    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    return (
        <div className={"row " + classes.wrapper}>

            <VideoPlayer />

            <div className={classes.menu} ref={refMenu} style={{display: "none"}}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className={"comments-list " + classes.listChat} id="comments-list" ref={listComment}>
                    <div>
                        {messages.map((element, index) => (
                            <div className="media" key={index}>
                                <div className='media-body'>
                                    {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                    <div className='mt-0 mb-0'><b>{element.actor}</b> <i><small className="timeComments">{moment(element.time).fromNow()}</small></i></div>
                                    <div className='mb-0'>
                                        {element.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="d-flex justify-content-start align-items-center mb-2">
                    <input type="text" className="form-control form-control-lg" autoComplete="off" id="exampleFormControlInput1" placeholder="Type message" onKeyDown={inputChat} onChange={handleMessage} value={message}/>
                    <a className="m-3" href="#" onClick={() => {sendChat()}}><i className="fas fa-paper-plane"></i></a>
                </div>
            </div>
            <div className={classes.menu} ref={refMember} style={{display: "none"}}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Tham gia</b> <span><small>({listUser.length})</small></span> </h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">
                    <div>
                        {listUser.map((element, index) => {
                            return (
                                <div className="media pt-2 pb-2" key={index}>
                                    <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={isValidHttpUrl(element.image) ? element.image : `${REACT_APP_SERVER + element.image}`} alt='' width="40" height="40" />
                                    <div className='media-body align-self-center'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                            <div className='mt-0 mb-0'>{element.username} &nbsp;{element.userID === course.actor ? (<i className="fas fa-crown" style={{color: "red", fontSize: "15px"}}></i>) : null}</div>
                                    </div>
                                </div>
                        )})}
                    </div>
                </div>
            </div>
            <div className={classes.menu} ref={refInfo}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Chi tiết</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    
                    <h5 className="mt-4"><b>Khóa học: {course.name}</b></h5>
                    {isBroadcaster && (
                        <div id="registerLive">
                            <p className="text-center mt-4">Vui lòng điền vài thông tin để bắt đầu livestream hôm nay!</p>
                            <form id="formLive" onSubmit={e => e.preventDefault()}>
                                <div className="mb-4">
                                    <input type="text" id="form1Example1" className="form-control" placeholder="Tiêu đề" autoComplete="off" required onChange={handleName}/>
                                </div>

                                <div className="mb-4">
                                    <input type="text" id="form1Example2" className="form-control" placeholder="Miêu tả" autoComplete="off" onChange={handleDesciption}/>
                                </div>

                                <div className="row">
                                    <div className="col d-flex">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" id="form1Example3" checked={save} onChange={(e) => {setSave(e.target.checked)}}/>
                                            <label className="form-check-label" htmlFor="form1Example3"> Lưu lại video </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary float-end" onClick={startLive}>Bắt đầu</button>
                            </form>
                        </div>
                    )}
                    <div className={"mt-3"} id="inforLive" style={{display: "none"}}>
                        <h6>Tiêu đề: {name}</h6>
                        <h6>Miêu tả: {description}</h6>
                        <h6 className="mt-3 fw-bolder">Livestream đã bắt đầu!</h6>
                    </div>                     
                </div>
            </div>

            <div className={"row " + classes.appBar}>
                <div className="col d-flex justify-content-center align-items-center">
                    {isBroadcaster && (
                        <div>
                            {/* mic */}
                            <Link className={`btn btn-lg btn-floating m-2 ${micro.current ? "btn-light" : "btn-danger"}`} to="#" role="button" onClick={() => {
                                toggleMic()
                            }}>
                                {micro.current ? (<i className="fas fa-microphone"></i>) : (<i className="fas fa-microphone-slash"></i>)}
                            </Link>
                            {/* camera */}
                            <Link className={`btn btn-lg btn-floating m-2 ${video.current ? "btn-light" : "btn-danger"}`} to="#" role="button" onClick={() => {
                                toggleCam()
                            }}>
                                {video.current ? (<i className="fas fa-video"></i>) : (<i className="fas fa-video-slash"></i>)}
                            </Link>
                            {/* share man hinh */}
                            <Link className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#FFA900"}} to="#" role="button" onClick={ () => {
                                changeStream()
                            }}>
                                <i className="fas fa-chalkboard" style={{color: "white"}}></i>
                            </Link>
                        </div>
                    )}
                    {/* tin nhan */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" style={{backgroundColor: "#39C0ED"}} role="button" onClick={() => {
                        if ($(refMember.current).css("display") === "block" || $(refInfo.current).css("display") === "block") {
                            $(refMenu.current).toggle()
                        } else 
                            $(refMenu.current).toggle('slow')
                        $(refMember.current).hide()
                        $(refInfo.current).hide()
                    }}>
                        <i className="fas fa-comment-alt" style={{color: "white"}}></i>
                    </Link>
                    {/* Thanh vien */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" style={{backgroundColor: "#39C0ED"}} role="button" onClick={() => {
                        if ($(refMenu.current).css("display") === "block" || $(refInfo.current).css("display") === "block") {
                            $(refMember.current).toggle()
                        } else 
                            $(refMember.current).toggle('slow')
                        $(refMenu.current).hide()
                        $(refInfo.current).hide()
                    }}>
                        <i className="far fa-list-alt" style={{color: "white"}}></i>
                    </Link>
                    {/* Thong bao */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" role="button" onClick={() => {
                        if ($(refMenu.current).css("display") === "block" || $(refMember.current).css("display") === "block") {
                            $(refInfo.current).toggle()
                        } else 
                            $(refInfo.current).toggle('slow')
                        $(refMenu.current).hide()
                        $(refMember.current).hide()
                    }}>
                        <i className="fas fa-ellipsis-v"></i>                    
                    </Link>
                    {/* Thoat */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#c61118"}} to="#" role="button">
                        <i className="fas fa-lg fa-sign-out-alt fa-rotate-180" style={{color: "white"}}></i>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LiveStream