import { Link, useNavigate, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
import VideoPlayer from '../../components/VideoPlayer'
import { SocketContext } from '../../components/SocketContext'
import {makeStyles} from '@material-ui/core/styles'
import {isValidHttpUrl} from "../../components/Func"
import prettyBytes from 'pretty-bytes';
import Switch from "react-switch";


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
        display: "table",
    },
    listChat: {
        display: "table-row",
        // height: "85%",
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
    document.title = "Livestream"
    const {listBan, setListBan, banAll, setBanAll, setLoad, load, upload, download, blobContainer, stopRecord, startRecord, record, setRecord, socket, listUser, setListUser, addChat, messages, changeStream, micro, video, toggleCam, toggleMic, me, stream, name, setName, course, setCourse, description, setDescription, user, setUser, broadcaster, start, isBroadcaster, setIsBroadcaster , watcher } = useContext(SocketContext)
    const classes = useStyle()
    const [message, setMessage] = useState('')
    const [dataToModal, setDataToModal] = useState(0)
    
    const refMenu = useRef()
    const refMember = useRef()
    const refInfo = useRef()
    const listComment = useRef()

    const params = useParams()
    const navi = useNavigate()

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

    const check = async (arrID, ID) => {
        if (arrID.includes(ID)) {
            return false
        }
        return true
    }

    useEffect(async () =>{
        if (user.user && course) {
            if (params.host) {
                var vari = await check(user.user.banned, course._id)
                if (vari) {
                    watcher(params.host)
                } else 
                navi(`/courses`)
            } else {
                if (user.user._id === course.actor) {
                    start()
                    setIsBroadcaster(true)
                }
            }
        }
    }, [user, course])

    useEffect(() => {
        if (isBroadcaster) {
            setListUser([...listUser, {
                socketID: socket.id,
                userID: user.user._id,
                username: user.user.username,
                image: user.user.image,
            }])
            setListBan([...listBan, {
                userID: user.user._id,
                banned: false,
            }])
        } 
    }, [isBroadcaster, user])

    useEffect(() => {
        listComment.current.scrollTop = listComment.current.scrollHeight
    }, [messages])

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
            axios({
                method: "post",
                data: {
                    courseID: course._id,
                    link: `/livestream/${params.id}/${me}`,
                    subject: `${user.user.username} đang phát trực tiếp`,
                    content: `${name}`,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/addNotification`
            })
            .then(ketqua => {})
            $("#registerLive").toggle()
            $("#inforLive").toggle()
            if (record) {
                startRecord()
            }
        }
    }

    const inputChat = (e) => {
        if (e.key === 'Enter') {
            sendChat()
        }
    }

    const sendChat = () => {
        if (message) {
            addChat(message)
            setMessage("")
        }
    }
    
    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const handleRecord = () => {
        if (record)
            setRecord(false)
        else setRecord(true)
    }

    const handleChangeBanAll = (checked) => {
        setBanAll(checked)
        socket.emit("banAllToBroatcaster", checked);

    }

    const offChat = (userID) => {
        try {
            const found = listBan.find(element => element.userID === userID)
            if (found) 
                return found.banned
        } catch (err) {return false}
    } 

    const ban1User = (userID) => {
        if (isBroadcaster) {
            socket.emit("ban1User", userID);
        } else {
            alert("Bạn không thể thực hiện chức năng này!")
        }
    }

    // console.log(listBan);

    return (
        <div className={"row " + classes.wrapper}>

            <VideoPlayer />

            <div className={classes.menu} ref={refMenu} style={{display: "none"}}>
                <div className="mb-2">
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                {isBroadcaster ? (<div className="row mb-2">
                    <div className="col-9 text-justify">
                        <span>Tắt chat tất cả mọi người</span>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <Switch 
                            onChange={handleChangeBanAll} 
                            checked={banAll}
                            onColor="#86d3ff"
                            onHandleColor="#2693e6"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                        />
                    </div>
                </div>) : null}
                    <div className={"comments-list " + classes.listChat} id="comments-list" ref={listComment} style={{height: isBroadcaster ? "85%" : "90%"}}>
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
                <div className="d-flex justify-content-start align-items-center">
                    <input disabled = {user.user && offChat(user.user._id) ? "disabled" : ""} type="text" className="form-control form-control-lg" autoComplete="off" id="exampleFormControlInput1" placeholder="Type message" onKeyDown={inputChat} onChange={handleMessage} value={message}/>
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
                                        <div className='mt-0 mb-0'>
                                            {element.username} &nbsp;{element.userID === course.actor ? (<i className="fas fa-crown" style={{color: "red", fontSize: "15px"}}></i>) : null}
                                            <a className="m-3" href="#" onClick={() => ban1User(element.userID)}>{(element.userID !== listUser[0].userID) ? (offChat(element.userID) ? (<i className="fas fa-comment-slash" style={{color: "#583d8d"}}></i>) : (<i className="fas fa-comment" style={{color: "#583d8d"}}></i>)): null}</a>
                                        </div>
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
                                            <input className="form-check-input" type="checkbox" checked={record} onChange={handleRecord} id="form1Example3"/>
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
                        { 
                            isBroadcaster ? (
                                record ? 
                                (
                                    <button type="button" className="btn btn-danger btn-sm mt-3" onClick={() => {stopRecord()}}><i className="far fa-stop-circle fa-lg fa-fade fa-spin"></i> &nbsp; Dừng lưu lại</button>
                                )
                                :
                                (
                                    <div>   
                                        <button type="button" className="btn btn-success btn-sm mt-3" onClick={() => {startRecord()}}><i className="far fa-save fa-lg"></i> &nbsp; Lưu lại video</button>
                                        <p className="mt-2 text-danger"><small>Vui lòng tùy chỉnh stream trước khi bắt đầu lưu video!</small></p>
                                    </div>
                                )
                            ) : null
                        }
                    {(blobContainer.length > 0) ? (<div className={"comments-list mt-3 " + classes.listChat} id="comments-list" style={{border: "solid 2px", height: "30vh"}}>
                        <div>
                            {blobContainer.map((element, index) => (
                                <div className="media" key={index}>
                                    <div className='media-body text-center'>
                                        <a href="#" className="btn-link mt-0 mb-0" onClick={() => {setDataToModal(index); setLoad(blobContainer[index].load)}} data-mdb-toggle="modal" data-mdb-target="#exampleModal">{element.liveID} ({moment(element.timeStop).fromNow()})</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>): null}

                    </div>                     
                </div>
            </div>
            
            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Thông tin file</h5>
                        <button type="button" className="btn-close" data-mdb-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p><b>Tên tệp:</b> {blobContainer.length > 0 ? blobContainer[dataToModal].liveID : null}</p>
                        <p><b>Kích thước:</b>{blobContainer.length > 0 ? prettyBytes(blobContainer[dataToModal].data.size) : null}</p>
                        {load === 100 ?
                            (<p className="text-danger"><small>Tải lên thành công!</small></p>)
                            :
                            ((load !== 0) ? (<div className="progress" style={{height: "20px"}}>
                                <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: `${load}%`}} aria-valuenow={load} aria-valuemin="0" aria-valuemax="100">{load}%</div>
                            </div>) : null)
                        }
                    </div>
                    <div className="modal-footer">
                        {load !== 100 ? (<button type="button" className="btn btn-success" onClick={() => upload(dataToModal, params.id)}><i className="fas fa-file-upload fa-lg"></i> &nbsp; Upload lên hệ thống</button>) : null}
                        <button type="button" className="btn btn-primary" onClick={() => {download(dataToModal); document.getElementById("exampleModal").click()}}><i className="fas fa-file-download fa-lg"></i> &nbsp; Tải xuống</button>
                        <button type="button" className="btn btn-secondary" data-mdb-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
            </div>

            <div className={"row " + classes.appBar}>
                <div className="col d-flex justify-content-center align-items-center">
                    {isBroadcaster && !record && (
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
                    <a className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#c61118"}} role="button" href={`/me/stored/courses`}>
                        <i className="fas fa-lg fa-sign-out-alt fa-rotate-180" style={{color: "white"}}></i>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default LiveStream