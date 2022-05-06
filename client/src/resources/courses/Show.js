import {Link, useNavigate, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {isValidHttpUrl, isEmpty, getAllVideo} from "../../components/Func"
import moment from "moment"
import YouTube from 'react-youtube';
import ReactPlayer from 'react-player'
const {REACT_APP_SERVER} = process.env

function Show() {
    // Khai bao
    const startInt = useRef(null)
    const firstTime = useRef(null)
    const selectList = $(".course");
    const [message, setMessage] = useState('');
    const [user, setUser] = useState([]);
    const [click, setClick] = useState({});
    const [course, setCourse] = useState({});
    const [comment, setComment] = useState([]);
    const [videoID, setvideoID] = useState('')
    const [duration, setDuration] = useState(null)

    const params = useParams()
    const {slug} = params
    const opts = {
        height: '720',
        width: '100%',
    };
    const continueView = useRef()
    const navigate = useNavigate()
    var className = "row pb-3 pt-1 course"
    var classnameIcon = "col-sm-1 imgCenter status text-center"
    
    // function
    document.title = slug

    const refreshCourse = () => {
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/show/${slug}`
        })
        .then((ketqua) => {
            if(ketqua.data) {
                setCourse(ketqua.data)
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    const unLockVideo = (videoID) => {
        axios({
            method: "post",
            data: {
                _id: videoID
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/unlockVideo`
        })
        .then(async ketqua => {
            if(ketqua.data) {
                refreshCourse()
            }
        })
    }

    useEffect(() => {
        axios({
            method: "post",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/thamGia/${slug}`
        })
        .then(ketqua => {
            if (!ketqua.data) {
                alert("Bạn không thể tham gia khóa học này do đã bị chặn bởi người khởi tạo!")
                navigate("/courses")
            }
        })
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/getUser`
        })
        .then(ketqua => {
            // console.log(ketqua.data.user);
            if (JSON.stringify(ketqua.data.user) !== JSON.stringify(user))
                setUser(ketqua.data.user)
        })
        refreshCourse()
    },[slug])

    useEffect(() => {
        console.log(course);
        if(Object.keys(course).length && course.sections.length) {
            unLockVideo(course.sections[0].videos[0]._id)
        }
    }, [course])

    const viewMore = (e) => {
        $("#viewMore").toggle()
        if ($("#btnViewMore").html()==='Xem thêm <i class="fas fa-caret-down"></i>')
            $("#btnViewMore").html('Thu gọn <i class="fas fa-caret-up"></i>');
        else $("#btnViewMore").html('Xem thêm <i class="fas fa-caret-down"></i>');
    }

    // Comment
    // useEffect(() => {
    //     const commentInt = setInterval(() => {
    //         // console.log("Hello");
    //         refreshComment(videoID)
    //     }, 2000)
    //     return () => clearInterval(commentInt);
    // }, [videoID])

    const refreshComment = (videoID) => {
        axios({
            method: "post",
            data: {
                videoID: videoID,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/refreshComment`
        })
        .then(async ketqua => {
            if(ketqua.data) {
                setComment(ketqua.data)
            }
        })
    }
    const postCmt = (e) => {
        setMessage(e.target.value)
    }

    const subCmt = (e) => {
        $(".comments").submit(() => {
            return false;
        })
        if (message !== '') {
            axios({
                method: "post",
                data: {
                    content: message,
                    videoID: videoID,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/courses/addComment`
            })
            .then(async ketqua => {
                if(ketqua.data) {
                    setMessage("")
                    refreshComment(videoID)
                }
            })
        }
    }

    const cancelCmt = () => {
        setMessage("")
    }

    // const watchVideo = (e) => {
    //     // console.log(startInt);
    //     if(!startInt.current) {
    //         startInt.current = setInterval(() => {
    //             if (e.target.getCurrentTime() >= 2/3*e.target.getDuration()) {
    //                 // console.log('aa');
    //                 unlockVideoNextByID()
    //                 clearInterval(startInt.current)
    //                 startInt.current = null
    //             }
    //             else if (!e.target.getCurrentTime()) {
    //                 // console.log("bb");
    //                 clearInterval(startInt.current)
    //                 startInt.current = null
    //             } 
    //             // else {
    //             //     console.log(e.target.getCurrentTime(), e.target.getDuration())
    //             // }
    //         }, 2000)
    //     }
    // }

    // const watchVideoRP = (process) => {
    //     clearInterval(startInt.current)
    //     startInt.current = null
    //     // console.log(startInt, process.playedSeconds, duration);
    //     if (process.playedSeconds >= 2/3*duration) {
    //         unlockVideoNextByID()
    //     }
    // }

    const progess = (listVideo, actor) => {
        let unlocked = 0
        listVideo.forEach(video => {
            if (video.unlock.includes(actor)) {
                unlocked++
            }
        })
        return Math.round((unlocked / listVideo.length) * 100) / 100
    }

    const clickVideo = (sectionID, video, className) => (e) => {
        // console.log(videoID, sectionID, videoId, className);
        if (!className.includes("lockCourse")) {
            setvideoID(video.videoID)
            refreshComment(video.videoID)
            setClick(video)
        }
    }

    const setClass = (videoID, videoUnlock) => {
        if (videoUnlock.includes(user._id)) {
            return `${className} readyCourse`
        } else
        return `${className} lockCourse`
    }

    return (
        <div className="mt-3 ml-4 mr-4">
            <div className="row">
                <div className="col-xl-8">
                    {(videoID.length < 13) ? 
                            <YouTube
                            videoId={videoID}                  // defaults -> null
                            id="player"                      // defaults -> null
                            className="player"               // defaults -> null
                            opts={opts}                       // defaults -> {}
                            // onPlay={watchVideo}                     // defaults -> noop
                            />
                        :
                            <ReactPlayer width={'100%'} height={'35%'}
                            url={`${REACT_APP_SERVER}/video/${videoID}`}
                            // onProgress={(process) => watchVideoRP(process)}
                            onDuration={(duration) => setDuration(duration)}
                            controls
                            />
                    }

                    <div className="mt-2" style={{color: "black"}}>
                        <h3><b className="title">{!isEmpty(click) ? (click.name) : "N/A"}</b></h3>
                        <p className="description mb-4">{!isEmpty(click) ? (click.description): "N/A"}</p>
                    </div>
                    <div className="row">
                        <div className="page-header">
                            <h4><small id="totalComment" className="pull-right mb-4">{comment.length} comments</small> <b>Bình luận</b> </h4>
                        </div>

                        <form className="border-0 comments" style={{backgroundColor: "#f8f9fa"}}>
                            <div className="d-flex flex-start w-100">
                                <img
                                    className="rounded-circle shadow-1-strong me-3"
                                    src={isValidHttpUrl(user.image) ? user.image : `${REACT_APP_SERVER + user.image}`}
                                    alt="avatar"
                                    width="40"
                                    height="40"
                                />
                                <div className="w-100">
                                    <textarea
                                    className="form-control"
                                    id="textAreaExample"
                                    rows="3"
                                    style={{background: "#fff"}}
                                    required
                                    value={message} onChange={postCmt}
                                    placeholder="Comment"></textarea>
                                </div>
                            </div>
                            <div className="float-end mt-2 pt-1">
                                <button type="submit" className="btn btn-primary btn-sm" onClick={subCmt}>Post comment</button>
                                <button type="reset" className="btn btn-outline-primary btn-sm" onClick={cancelCmt}>Cancel</button>
                            </div>
                        </form>

                        <div className="comments-list" id="comments-list">
                            {/* Comment here */}
                            <div>
                                {comment.map((element, index) => (
                                    <div className="media" key={index}>
                                        <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={isValidHttpUrl(element.actor.image) ? element.actor.image : `${REACT_APP_SERVER + element.actor.image}`} alt='' width="40" height="40" />
                                        <div className='media-body mt-2 mb-2 pt-2 pb-2'>
                                            <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5>
                                            <div className='mb-0'>
                                                <div>{
                                                    element.content.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-5 pb-5"></div>
                    </div>

                </div>
                <div className="col-xl-4">
                    <div className="list-group">
                        <div className="progress" style={{height: "15px"}}>
                            <div
                                className={'progress-bar progress-bar-striped progress-bar-animated'}
                                role="progressbar"
                                style={{width: `${Object.keys(course).length ? progess(getAllVideo(course), user._id)*100 : "0" }%`}}
                                aria-valuenow={Object.keys(course).length ? progess(getAllVideo(course), user._id)*100 : "0"}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >
                                {Object.keys(course).length !== 0 ? progess(getAllVideo(course), user._id)*100 : "0"}%
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-dark" aria-current="true">
                            <div className="d-flex w-100 justify-content-between">
                                <h4 className="mb-1"><b>{course.name}</b></h4>
                            </div>
                            <div className="mb-1">
                                <div className="mb-3">
                                    {course.description ?
                                        course.description.split('\n').map(
                                            (str,index) => <div key={index}>{str}</div>)
                                        : course.description}
                                </div>
                            </div>
                            {Object.keys(course).length && <p className="m-0 p-0"><i><small><i className="far fa-clock"> </i> {`(${moment.utc(course.time*1000).format('HH:mm:ss')})`} {` - ${getAllVideo(course).length} video`}</small></i></p>}
                            <div className="row">
                                <Link to="#" className="link-primary text-end" id="btnViewMore" onClick={viewMore}>Xem thêm <i className="fas fa-caret-down"></i></Link>
                                <div className="viewMore" id="viewMore" style={{display: "none"}}>
                                    <p className="mb-0"><b>Yêu cầu:</b></p>
                                    <div className="mb-3">
                                        {course.req ?
                                            course.req.split('\n').map(
                                                (str,index) => <div key={index}>{str}</div>)
                                            : course.req}
                                    </div>
                                    <p className="mb-0"><b>Kết quả đạt được:</b></p>
                                    <div className="mb-3">
                                        {course.result ?
                                            course.result.split('\n').map(
                                                (str,index) => <div key={index}>{str}</div>)
                                            : course.result}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action p-0" ref={continueView}>
                            <div className="accordion" id="accordionPanelsStayOpenExample">
                                {!isEmpty(course.sections) ? 
                                    course.sections.map((section, index) => (
                                        <div className="accordion-item" key={index}>
                                            <h2 className="accordion-header" id="headingOne">
                                            <button className="accordion-button collapsed " type="button" data-mdb-toggle="collapse" data-mdb-target={`#collapse${index}`} aria-expanded={`${index ? "false" : "true"}`} aria-controls="collapseOne">
                                                <strong>{section.name} {` (${section.videos.length})`}</strong>
                                            </button>
                                            </h2>
                                            <div id={`collapse${index}`} className={`accordion-collapse collapse`} aria-labelledby="headingOne" data-mdb-parent="#accordionExample">
                                                <div className="accordion-body">
                                                    {section.videos.map((video,index) => (
                                                        // <div className={video._id === course.sections[0].videos[0]._id ? `${className} readyCourse`:`${className} lockCourse`} key={index}
                                                        <div className={setClass(video._id, video.unlock)} key={index}
                                                            style={video._id === click._id ? {backgroundColor: "hsl(240, 0%, 75%)"}:null} 
                                                            onClick={clickVideo(section._id, video, setClass(video._id, video.unlock))}
                                                        >
                                                            <div className={classnameIcon}>
                                                                {video.unlock.includes(user._id) ?
                                                                    (video._id === click._id ? (<i className="fas fa-play" style={{color: "#8a038c"}}></i>) : null) :(<i className="fas fa-lock"></i>) 
                                                                }
                                                            </div>
                                                            <div className="col-sm-3 imgCenter">
                                                                {/* <img src={`http://img.youtube.com/vi/${video.videoID}/default.jpg`} alt={video.name} className="img-responsive center-block d-block mx-auto" /> */}
                                                                <img className="img-responsive center-block d-block mx-auto" width={'120px'} height={'90px'} src={(isValidHttpUrl(video.image)) ?
                                                                        `http://img.youtube.com/vi/${video.videoID}/default.jpg` : 
                                                                        `${REACT_APP_SERVER}/${video.image}`
                                                                    }
                                                                    alt={video.image} 
                                                                />
                                                            </div>
                                                            <div className="col-sm-8 pl-0">
                                                                <h5 className="mb-1 text2line"><b>{video.name}</b></h5>
                                                                <p className="mb-0 text2line mt">{video.description}</p>
                                                                <p className="mb-0 text2line mt id" style={{display: "none"}}>{video._id}</p>
                                                                <small className="text-muted time">{moment.utc(video.time*1000).format('HH:mm:ss')} | {moment(video.updatedAt).fromNow()}</small>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {section.docs.map((doc,index) => (
                                                        <div key={index} className = "row p-1" style={{backgroundColor: "hsl(240, 0%, 95%)"}}>
                                                            <div className="col-sm-1 text-center p-0">
                                                                <i className="fas fa-angle-right"></i> &nbsp;
                                                                <i className="far fa-file"></i>
                                                            </div>
                                                            <div className="col-sm-11 pl-0" style={{whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
                                                                {/* <h5 className="mb-1 text2line"><b>{doc.name}</b></h5> */}
                                                                <a style={{color: "black"}} target={"_blank"} href={`${REACT_APP_SERVER}/docs/${doc.name}`} title={doc.name}>{doc.name} </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                :
                                    (
                                        <div className="row mt-3 mb-3">
                                            <h5 className="mb-0 text-center">Không có nội dung nào trong khóa học này (^.^)!</h5>
                                            <Link to="/courses" className="mb-0 text-center"><i className="fas fa-arrow-left"></i> Quay lại</Link>
                                        </div>
                                    )
                                }
                                
                                {/* LiveStream */}
                                <p className="mt-3 ml-3"><strong>{Object.keys(course).length > 0 && course.livestreams.length ? "Livestream:" : ""}</strong></p>
                                {Object.keys(course).length > 0 && course.livestreams.map((live, index) => {
                                    return (
                                        <div className={"row pt-2 pb-2 mt-3 ml-2 mr-2"} key={index}
                                            style={{backgroundColor: "hsl(240, 0%, 92%)"}} 
                                            onClick={clickVideo(live.liveID, null, live._id)}
                                        >
                                            <div className="col-sm-3 imgCenter">
                                                <img 
                                                    className="img-responsive center-block d-block mx-auto" 
                                                    width={'120px'} 
                                                    height={'90px'} 
                                                    src={
                                                        `${REACT_APP_SERVER}/${live.image}`
                                                    }
                                                    alt={live.image} 
                                                />
                                            </div>
                                            <div className="col-sm-8 pl-0">
                                                <h5 className="mb-1 text2line"><b>{live.name}</b></h5>
                                                <p className="mb-0 text2line mt">{live.description}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Show