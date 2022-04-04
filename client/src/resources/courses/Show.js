import {Link, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {isValidHttpUrl, isEmpty} from "../../components/Func"
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
    const [click, setClick] = useState({
        id: null
    });
    const [course, setCourse] = useState([]);
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

    useEffect(() => {
        // console.log(continueView.current.children);
        var i = continueView.current.children.length
        // console.log(i);
        try {
            while(continueView.current.children[i-1].className.includes("lockCourse")) {
                // console.log(i, videoID)
                if(!videoID) {
                    continueView.current.children[i-2].click()
                }
                i--
            }
        } catch (err) {}
    })


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

    useEffect(() => {
        axios({
            method: "post",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/thamGia/${slug}`
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
    // console.log(user);

    const viewMore = (e) => {
        $("#viewMore").toggle()
        if ($("#btnViewMore").html()==='Xem thêm <i class="fas fa-caret-down"></i>')
            $("#btnViewMore").html('Thu gọn <i class="fas fa-caret-up"></i>');
        else $("#btnViewMore").html('Xem thêm <i class="fas fa-caret-down"></i>');
    }

    const unlockVideoByID = (_id) =>  {
        // console.log(_id);
        axios({
            method: "post",
            data: {
                _id: _id
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/unlockVideo`
        })
        .then(async ketqua => {
            if(ketqua.data) {
                refreshCourse()
            }
        })
    };

    const iconControlVideo = (className, classnameIcon, index) => {
        return (
            <div className={classnameIcon}>
                {className.includes("lockCourse") ?
                    (
                        <i className="fas fa-lock"></i>
                    ) : ((index === click.id) ? (<i className="fas fa-play" style={{color: "#8a038c"}}></i>) : true)
                }
            </div>
            )
    }

    const clickVideo = (videoID, className, index) => (e) => {
        // console.log(videoID);
        if (!className.includes("lockCourse")) {
            setvideoID(videoID)
            refreshComment(videoID) 
            setClick({
                ...click,
                id: index
            })
        }
    }
    // console.log(click);
    
    const ListVideo = () => {
        let className = "row pb-3 pt-1 course lockCourse"
        let classnameIcon = "col-sm-1 imgCenter status text-center"
        return (!isEmpty(course.video) ? course.video.map((video, index) => {
            if(user) {
                if (!index) {
                    if(!firstTime.current) {
                        unlockVideoByID(video._id)
                        firstTime.current = 1
                    }
                    className =  className.replace('lockCourse', 'readyCourse');
                } else if (video.unlock.includes(user._id)) {
                    className =  className.replace('lockCourse', 'readyCourse');
                } else {
                    className =  className.replace('readyCourse', 'lockCourse');
                }
                return (
                    <div className={className} key={index}
                        style={index === click.id ? {backgroundColor: "hsl(240, 0%, 75%)"}:null} 
                        onClick={clickVideo(video.videoID, className, index)}
                    >
                            {iconControlVideo(className, classnameIcon, index)}
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
                )
            }
            return true
        }) 
        :
        (
            <div className="row mt-3 mb-3">
                <h5 className="mb-0 text-center">Không có video nào cho khóa học này!</h5>
                <Link to="/courses" className="mb-0 text-center"><i className="fas fa-arrow-left"></i> Quay lại</Link>
            </div>
        ))
    }

    const unlockVideoNextByID = (e) => {
        var _id = $(selectList[click.id+1]).find(".mb-0.text2line.mt.id").text();
        // console.log(_id, videoID);
        if (_id) {
            axios({
                method: "post",
                data: {
                    _id: _id
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
        // console.log(videoID);
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
                // console.log(ketqua.data);
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
        // console.log(comment);
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
                    // console.log(ketqua.data);
                    setMessage("")
                    refreshComment(videoID)
                }
            })
        }
    }

    const cancelCmt = () => {
        setMessage("")
    }

    const watchVideo = (e) => {
        // console.log(startInt);
        if(!startInt.current) {
            startInt.current = setInterval(() => {
                if (e.target.getCurrentTime() >= 2/3*e.target.getDuration()) {
                    // console.log('aa');
                    unlockVideoNextByID()
                    clearInterval(startInt.current)
                    startInt.current = null
                }
                else if (!e.target.getCurrentTime()) {
                    // console.log("bb");
                    clearInterval(startInt.current)
                    startInt.current = null
                } 
                // else {
                //     console.log(e.target.getCurrentTime(), e.target.getDuration())
                // }
            }, 2000)
        }
    }

    const watchVideoRP = (process) => {
        clearInterval(startInt.current)
        startInt.current = null
        // console.log(startInt, process.playedSeconds, duration);
        if (process.playedSeconds >= 2/3*duration) {
            unlockVideoNextByID()
        }
    }

    const progess = (listVideo, actor) => {
        let unlocked = 0
        listVideo.forEach(video => {
            if (video.unlock.includes(actor)) {
                unlocked++
            }
        })
        // console.log(listVideo.length, unlocked);
        return (unlocked / listVideo.length)
    }

    // console.log(Object.keys(course).length !== 0 ? progess(course.video, course.actor) : "0%");

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
                        onPlay={watchVideo}                     // defaults -> noop
                        />
                        :
                        <ReactPlayer width={'100%'} height={'35%'}
                        url={`${REACT_APP_SERVER}/video/${videoID}`}
                        onProgress={(process) => watchVideoRP(process)}
                        onDuration={(duration) => setDuration(duration)}
                        controls
                        />
                    }

                    <div className="mt-2" style={{color: "black"}}>
                        <h3><b className="title">{!isEmpty(course.video) ? (course.video[click.id] ? course.video[click.id].name : true) : "N/A"}</b></h3>
                        <p className="description mb-4">{!isEmpty(course.video) ? (course.video[click.id] ? course.video[click.id].description : true) : "N/A"}</p>
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
                                style={{width: `${Object.keys(course).length != 0 ? progess(course.video, user._id)*100 : "0" }%`}}
                                aria-valuenow={Object.keys(course).length !== 0 ? progess(course.video, user._id)*100 : "0"}
                                aria-valuemin="0"
                                aria-valuemax="100"
                            >{Object.keys(course).length !== 0 ? progess(course.video, user._id)*100 : "0"}%</div>
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
                        <div className="list-group-item list-group-item-action" ref={continueView}>
                            {
                                <ListVideo />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Show