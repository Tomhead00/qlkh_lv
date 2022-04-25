import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
import { Typography, AppBar } from '@material-ui/core'
import Options from '../../components/Options'
// import Notifications from '../../components/Notifications'
import VideoPlayer from '../../components/VideoPlayer'
import { SocketContext } from '../../components/SocketContext'
import {makeStyles} from '@material-ui/core/styles'


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
        // border: '1px solid',
        flex: '1 1 auto',

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
    },
})) 

function LiveStream () {
    const {changeStream, micro, video, toggleCam, toggleMic, me, callUser, stream, answer, broadcaster, start, isBroadcaster, setIsBroadcaster , watcher } = useContext(SocketContext)
    const classes = useStyle()
    const [course, setCourse] = useState([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [user, setUser] = useState([])
    const [save, setSave] = useState(true)
    const params = useParams()
    const navi = useNavigate()

    const refMenu = useRef()
    const refMember = useRef()
    const refInfo = useRef()

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
    const startLive = (e) => {
        if(name) {
            navi(`/livestream/${params.id}/${me}`)
            broadcaster()
            $("#registerLive").toggle()
            $("#inforLive").toggle()
        }
    }

    return (
        <div className={"row " + classes.wrapper} style={{height: isBroadcaster ? '90vh' : '100vh'}}>

            <VideoPlayer />

            <div className={classes.menu} ref={refMenu} style={{display: "none"}}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">

                    <div>
                        {/* {comment.map((element, index) => ( */}
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000 giờ trước</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                        {/* ))} */}
                    </div>
                </div>
            </div>
            <div className={classes.menu} ref={refMember} style={{display: "none"}}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Mọi người</b> <span><small>(5000)</small></span> </h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">
                    <div>
                        {/* {comment.map((element, index) => ( */}
                                <div className="media pt-2 pb-2">
                                    <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={'http://localhost:3001/img/user/1644482160278default.jpg'} alt='' width="40" height="40" />
                                    <div className='media-body align-self-center'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                            <div className='mt-0 mb-0'>Trần Quốc Bảo</div>
                                    </div>
                                </div>
                                <div className="media pt-2 pb-2">
                                    <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={'http://localhost:3001/img/user/1644482160278default.jpg'} alt='' width="40" height="40" />
                                    <div className='media-body align-self-center'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                            <div className='mt-0 mb-0'>Trần Quốc Bảo</div>
                                    </div>
                                </div>
                        {/* ))} */}
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
                    <div className={"mt-3"} id="inforLive" style={{display: "none"}}>
                        <h6>Tiêu đề: {name}</h6>
                        <h6>Miêu tả: {description}</h6>
                        <h6 className="mt-3 fw-bolder">Livestream đã bắt đầu!</h6>
                    </div>                        
                </div>
            </div>

            {/* <Options>
                <Notifications />
            </Options> */}

            {isBroadcaster && (
                <div className={"row " + classes.appBar}>
                        <div className="col d-flex justify-content-center align-items-center">
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
                                <i className="fas fa-phone-slash" style={{color: "white"}}></i>
                            </Link>
                        </div>
                </div>
            )}
        </div>
    )
}

export default LiveStream