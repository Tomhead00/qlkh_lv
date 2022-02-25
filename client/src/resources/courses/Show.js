import { useNavigate, Link, useLocation } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {isValidHttpUrl} from "../../components/nav/Func"
import moment from "moment"
import YouTube from 'react-youtube';

const {REACT_APP_SERVER} = process.env

function Show() {
    // Khai bao
    const navigate = useNavigate()
    const location = useLocation()
    const [course, setCourse] = useState([]);
    const string = useRef("")
    string.current = location.pathname.substring(14, location.pathname.length)
    const opts = {
        height: '720',
        width: '100%',
    };

    document.title = string.current

    useEffect(() => {
        axios({
            method: "post",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/thamGia/${string.current}`
        })
    }, [])

    

    return (
        <div className="mt-3 ml-4 mr-4">
            <div className="row">
                <div className="col-xl-8">
                    <YouTube 
                    videoId="e3rybHc5Of4"                  // defaults -> null
                    id="player"                      // defaults -> null
                    className="player"               // defaults -> null
                    // containerClassName={string}       // defaults -> ''
                    // title={string}                    // defaults -> null
                    opts={opts}                       // defaults -> {}
                    // onReady={func}                    // defaults -> noop
                    // onPlay={func}                     // defaults -> noop
                    // onPause={func}                    // defaults -> noop
                    // onEnd={func}                      // defaults -> noop
                    // onError={func}                    // defaults -> noop
                    // onStateChange={func}              // defaults -> noop
                    // onPlaybackRateChange={func}       // defaults -> noop
                    // onPlaybackQualityChange={func}    // defaults -> noop
                    />
                    <div className="mt-2" style={{color: "black"}}>
                        <h3><b className="title">N/A</b></h3>
                        <p className="description mb-4">N/A</p>
                    </div>
                    <div className="row">
                        <div className="page-header">
                            <h4><small id="totalComment" className="pull-right mb-4">N/A comments</small> <b>Bình luận</b> </h4>
                        </div>

                        <form className="border-0" style={{backgroundColor: "#f8f9fa"}}>
                            <div className="d-flex flex-start w-100">
                                <img
                                    className="rounded-circle shadow-1-strong me-3"
                                    src="'username.user.image'"
                                    alt="avatar"
                                    width="40"
                                    height="40"
                                />
                                <div className="form-outline w-100">
                                    <textarea
                                    className="form-control"
                                    id="textAreaExample"
                                    rows="3"
                                    style={{background: "#fff"}}
                                    required></textarea>
                                    <label className="form-label" htmlFor="textAreaExample">Message</label>
                                </div>
                            </div>
                            <div className="float-end mt-2 pt-1">
                                <button type="submit" className="btn btn-primary btn-sm">Post comment</button>
                                <button type="reset" className="btn btn-outline-primary btn-sm">Cancel</button>
                            </div>
                        </form>

                        <div className="comments-list" id="comments-list"></div>

                        <div className="mb-5 pb-5"></div>
                    </div>

                </div>
                <div className="col-xl-4">
                    <div className="list-group">
                        <div className="list-group-item list-group-item-dark" aria-current="true">
                            <div className="d-flex w-100 justify-content-between">
                                <h4 className="mb-1"><b>'course.name'</b></h4>
                            </div>
                            <div className="mb-1">
                                <p className="mb-1 mt">'course.mieuta'</p>
                            </div>
                        </div>
                        <div className="list-group-item list-group-item-action">
                            '#each course.video'
                                <div className="row pb-3 pt-1 course lockCourse">
                                    <div className="col-sm-1 imgCenter status text-center">
                                        <i className="fas fa-lock"></i>
                                    </div>
                                    <div className="col-sm-3 imgCenter">
                                        <img src="http://img.youtube.com/vi/'this.videoID'/default.jpg" alt="'this.image'" className="img-responsive center-block d-block mx-auto" />
                                    </div>
                                    <div className="col-sm-8 pl-0">
                                        <h5 className="mb-1 text2line"><b>'this.name'</b></h5>
                                        <p className="mb-0 text2line mt">'this.mieuta'</p>
                                        <p className="mb-0 text2line mt id" style={{display: "none"}}>'this._id'</p>
                                        <small className="text-muted time">'this.updatedAt'</small>
                                    </div>
                                </div>
                            'else'
                                <div className="row mt-3 mb-3">
                                    <h5 className="mb-0 text-center">Không có video nào cho khóa học này!</h5>
                                    <a href="/back" className="mb-0 text-center"><i className="fas fa-arrow-left"></i> Quay lại</a>
                                </div>
                            '/each'
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Show


{/* 

'!--  JS --'
<script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.6.0/mdb.min.js"></script>
'!-- moment --'
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>

<script>
    // Khai bao
    var videoPlaying = 0;
    var videoIDs = null;
    var firstLoading = true;

    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '720',
        width: '100%',
        videoId: '',
        playerVars: {
        'playsinline': 1
        },
        events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
        }
    });
    }
    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
        // status = true;
        unlockVideoServer(0);
        // console.log(new Date());

    }
    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.ENDED && !done) {
            nextVideo();
        }
    }

    var cancelForm = $(".btn.btn-danger.cancel.float-right");
    // change videoID embed
    var selectList = $(".course");
    var embed = $("#embed");

    // Xai moment change time
    function updateTime() {
        $(".time").map(function() {
            // console.log($(this).text());
            $(this).text(moment($(this).text()).fromNow());
        }).get();
    }
    function updateTimeComments() {
        $(".timeComments").map(function() {
            // console.log($(this).text());
            $(this).text(moment($(this).text()).fromNow());
        }).get();
    }

    // change videoID embed
    // console.log(selectList);
    selectList.on("click", function() {
        // console.log($(this).hasClassName("lockCourse"));
        if ($(this).hasClassName("lockCourse")) return true;
        else {
            // chut css cho the ko bi khoa
            var link = $(this).find("img").attr("src");
            // console.log(link);
            var videoID = link.substring(link.indexOf("vi/")+3, link.indexOf("vi/")+14)
            videoIDs = videoID;
            // console.log(videoID);
            selectList.find(".fas").removeClassName("fa-play").attr("style",false);
            selectList.attr("style",false);
            $(this).find(".fas").addClassName("fa-play").attr("style","color: #8a038c");
            $(this).attr("style","background-color: hsl(240, 0%, 75%)");
            player.cueVideoById({'videoId': videoID});
            // get name va description
            var title = $(this).find(".mb-1.text2line").text();
            var description = $(this).find(".mb-0.text2line").html();
            $(".title").text(title);
            $(".description").html(description);

            var i = selectList.index($(this));
            videoPlaying = i;
            // console.log(videoPlaying);
            autoCheckUnlock();
            refreshComment(videoIDs);
        }
    })

    // Unlock video
    function unlockVideo(i) {
        $(selectList[i]).removeClassName("lockCourse");
        $(selectList[i]).addClassName("readyCourse");
        $(selectList[i]).find(".fa-lock").removeClassName("fa-lock");
    }

    // lock course
    function checkUnlockCourse(i) {
        // console.log($(selectList[i]))
        var _id = $(selectList[i]).find(".mb-0.text2line.mt.id").text();

        $.ajax({
            url: '/courses/checkUnlock',
            type: 'POST',
            data: {
                _id: _id,
            }
        }).done(function(ketqua) {
            //console.log(ketqua);
            // console.log($(selectList).length);
            if (ketqua == "true") {
                unlockVideo(i);
            }
            if(i < $(selectList).length-1) {
                checkUnlockCourse(i+1);
            }
            if (i == $(selectList).length-1 && firstLoading == true) {
                // console.log(i);
                runLastVideoUnlock();
                firstLoading = false;
            }
        });
    };

    // unlock first video
    function unlockVideoServer(i) {
        var _id = $(selectList[i]).find(".mb-0.text2line.mt.id").text();
        // console.log(id);
        var a = $.ajax({
            url: '/courses/unlockVideo',
            type: 'POST',
            data: {
                _id: _id,
            }
        })
        $.when(a).done(function() {
            checkUnlockCourse(i);
        });

    };

    // run last video unlock
    function runLastVideoUnlock() {
        // console.log(selectList);
        for(var i = selectList.length-1; i >= 0; i--) {
            // console.log($(selectList[i]));
            // console.log($(selectList[i]).hasClassName("lockCourse"));
            if($(selectList[i]).hasClassName("lockCourse")) {
                continue;
            } else {
                myVar = setInterval(function() { 
                    // console.log(status);
                    if (status == "true") {
                        $(selectList[i]).click();
                        clearTimeout(myVar);
                    }
                }, 200)
                $(selectList[i]).click();
                break;
            }
        }
        updateTime();
        // refreshComment();
    }
    
    function nextVideo() {
        // console.log($(selectList[videoPlaying+1]).hasClassName("lockCourse"));
        if($(selectList[videoPlaying+1]).hasClassName("lockCourse")) return;
        else {
            $(selectList[videoPlaying+1]).click();
        }
    }

    function autoCheckUnlock() {
        myVar = setInterval(function() { 
            // console.log(player.getDuration());
            // console.log(player.getCurrentTime());
            var totalVideo = player.getDuration();
            var currentVideo = player.getCurrentTime();
            if (currentVideo >= (2/3)*totalVideo) {
                // console.log("right");
                if (videoPlaying != $(selectList).length-1) {
                    unlockVideoServer(videoPlaying+1);
                }
                clearTimeout(myVar);
            }
        }, 2000)
    }

    function checkJoinCourse() {
        // check join khoa hoc
        $.ajax({
            url: '/courses/checkThamgia',
            type: 'POST',
            data: {
                slug: `'course.slug'`,
            }
        }).done(function(ketqua) {
            // console.log(ketqua);
            if (ketqua == 0) {
                $.ajax({
                    url: '/courses/thamGia/' + `'course.slug'`,
                    type: 'POST',
                })                    
                // joinCourseForm.action = "/courses/thamGia/" + slugCourse;
            }
        });
    }
    checkJoinCourse();

    // Comment
    var btnSubComment = $(".btn.btn-primary.btn-sm");
    var btnCancel = $(".btn.btn-outline-primary.btn-sm");
    var textArea = $("#textAreaExample");
    var totalComment = $("#totalComment");
    // console.log(courseID);

    // list comment
    var listComment = $("#comments-list");

    function refreshComment(videoID) {
        $.ajax({
            url: '/courses/refreshComment',
            type: 'POST',
            data: {
                videoID: videoID,
            }
        })
        .done(function(ketqua) {
            var allCommnet = "";
            ketqua.forEach(element => {
                // console.log(element);
                var content = element.content;
                var contentProcess = content.replace(/\n/g, "<br/>");
                allCommnet += (`
                    <div className='media'>
                        <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src='` + element.actor.image + `' alt='' width="40" height="40">
                        <div className='media-body mt-2 mb-2 pt-2 pb-2'>
                            <h5 className='mt-0 mb-0'><b>`+ element.actor.username +`</b> <small className="timeComments">`+ element.createdAt +`</small></h5>
                            <p className='mb-0'>`+ contentProcess +`</p>
                        </div>
                    </div>
                `)
            });
            listComment.html(allCommnet);

            // console.log(ketqua.length + " comments");
            totalComment.text(ketqua.length + " comments");

            updateTimeComments();
        });
    }

    btnSubComment.on("click", function (e) {
        // console.log(textArea.val());
        // console.log(videoIDs);
        content = textArea.val();
        if (content != "") {
            e.preventDefault();
            $.ajax({
                url: '/courses/addComment',
                type: 'POST',
                data: {
                    content: content,
                    videoID: videoIDs,
                }
            })
            .done(function(ketqua) {
                // console.log(ketqua);
            });
            btnCancel.click();
            refreshComment(videoIDs);
        }
    })
</script> */}