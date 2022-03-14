import { Link, useLocation, useNavigate } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState } from "react"
import {youtube_parser} from '../../components/nav/Func'
// import YouTube from 'react-youtube';

const {REACT_APP_SERVER} = process.env

function UpdateVideo() {
    // Khai báo
    const location = useLocation()
    const [course, setCourse] = useState(location.state.course);
    const [video, setVideo] = useState(location.state.video);
    // const [tempVid, setTempVid] = useState(`https://www.youtube.com/watch?v=${video.videoID}`);
    // const [time, setTime] = useState(0)


    // console.log(video);

    // Function
    const navigate = useNavigate()
    document.title = "Cập nhật video " + video.name
    const handleName = (e) => {
        setVideo({
            ...video,
            name: e.target.value
        })
    }
    const handleDescription = (e) => {
        setVideo({
            ...video,
            description: e.target.value
        })
    }
    // const handleVideoID = (e) => {
    //     if(youtube_parser(e.target.value)) {
    //         $("#alert-link").text('')
    //         $("#link").attr('style', 'false');
    //         setVideo({
    //             ...video,
    //             videoID: youtube_parser(e.target.value)
    //         })
    //         setTempVid(e.target.value)
    //     } else {
    //         $("#link").attr('style', 'border: 2px solid red;');
    //         $("#alert-link").text("Link chưa hợp lệ, Vui lòng thử lại (^.^)!")
    //         setTempVid(e.target.value)
    //     }
    // }

    const submit = () => {
        $("#formVideo").submit(() => {
            return false;
        })
        if(video.name !== '' && video.description !== '' && video.videoID !== '') {
            axios({
                method: "put",
                data: {
                    video,
                    // time: time,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${course._id}/edit/${video._id}/update`
            })
            .then(ketqua => {
                // console.log(ketqua.data);
                if(ketqua.data) {
                    alert('Cập nhật khóa học thành công!')
                    navigate(`/me/stored/${course._id}/EditCourse`)
                } else {
                    alert('Lỗi!')
                }
            })
        }
    }
    // const ReadyYT = (e) => {
    //     console.log(e.target.getDuration());
    //     setTime(e.target.getDuration())
    // }

    return (
        <div className="container">
            <div className="mt-4">
                <h3><b>Cập nhật video cho khóa học:</b></h3>
                <h3 className="ml-3">{course.name}</h3>
                <form className="mt-4 pl-5 pr-5 pb-5" id="formVideo" method="POST" action="/me/stored/{{course._id}}/edit/{{video._id}}/update?_method=PUT">
                    <div className="form-group">
                        <label htmlFor="name">Tên video:</label>
                        <input type="text" className="form-control" id="name" name="name" value={video.name} required onChange={handleName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mieuta">miêu tả:</label>
                        <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleDescription} value={video.description}></textarea>
                    </div>
                    {/* <div className="form-group">
                        <label htmlFor="name">Link video:</label>
                        <input type="text" className="form-control" id="link" placeholder="Sao chép liên kết youtube và dán vào đây!" value={tempVid} required onChange={handleVideoID}/>
                        <small id="alert-link" style={{display: "none"}}>Link chưa hợp lệ, Vui lòng thử lại (^.^)!</small>
                        <div className="mt-4">
                            <YouTube style={{ display: 'none' }}
                                videoId={video.videoID}                  // defaults -> null
                                id="player"                      // defaults -> null
                                className="player"               // defaults -> null
                                // containerClassName={string}       // defaults -> ''
                                // title={string}                    // defaults -> null
                                // opts={opts}                       // defaults -> {}
                                onReady={ReadyYT}                    // defaults -> noop
                                // onPlay={func}                     // defaults -> noop
                                // onPause={func}                    // defaults -> noop
                                // onEnd={func}                      // defaults -> noop
                                // onError={func}                    // defaults -> noop
                                // onStateChange={func}              // defaults -> noop
                                // onPlaybackRateChange={func}       // defaults -> noop
                                // onPlaybackQualityChange={func}    // defaults -> noop
                            />
                        </div>
                    </div> */}
                    <div>
                        <button type="submit" className="btn btn-primary float-right ml-2" onClick={submit}>Lưu lại</button>
                        <Link to={`/me/stored/${course._id}/EditCourse`} className="btn btn-danger cancel float-right" value="Quay lại">Quay lại</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateVideo

// {{!-- <div class="container">
//     <div class="mt-4">
//         <h3><b>Cập nhật video cho khóa học:</b></h3>
//         <h3 class="ml-3">{{course.name}}</h3>

//         <form class="mt-4 pl-5 pr-5 pb-5" id="formVideo" method="POST" action="/me/stored/{{course._id}}/edit/{{video._id}}/update?_method=PUT">
//             <div class="form-group">
//                 <label for="name">Tên video:</label>
//                 <input type="text" class="form-control" id="name" name="name" value="{{video.name}}" required>
//             </div>
//             <div class="form-group">
//                 <label for="mieuta">miêu tả:</label>
//                 <textarea type="text" class="form-control" id="mieuta" name="mieuta">{{video.mieuta}}</textarea>
//             </div>
//             <div class="form-group">
//                 <label for="name">Link video:</label>
//                 <input type="text" class="form-control" id="link" placeholder="Sao chép liên kết youtube và dán vào đây!" value="https://www.youtube.com/watch?v={{video.videoID}}" required>
//                 <small id="alert-link" style="display: none">Link chưa hợp lệ, Vui lòng thử lại (^.^)!</small>
//                 <input type="text" class="form-control mt-3" id="videoID" name="videoID" style="display: none;" readonly>
//             </div>
//             <div>
//                 <button type="submit" class="btn btn-primary float-right ml-2">Lưu lại</button>
//                 <input type="button" class="btn btn-danger cancel float-right" value="Quay lại">
//             </div>
//         </form>
//     </div>
// </div>

// <script>
//     document.addEventListener("DOMContentLoaded", function () {
//         var cancelForm = $(".btn.btn-danger.cancel.float-right");
//         // Cut videoID from link
//         var link = $("#link");
//         var videoID = $("#videoID");
//         var formAddVideo = $("#formVideo");
//         var alert_link = $("#alert-link");

//         // Btn cancel
//         cancelForm.click(function() {
//             window.history.back();
//         })

//         // funtion Cut videoID
//         function youtube_parser(url){
//             var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
//             var match = url.match(regExp);
//             return (match&&match[7].length==11)? match[7] : false;
//         }

//         // Lấy videoID
//         videoID.val(youtube_parser(link.val()));
//         link.keyup(function cut() {
//             videoID.val(youtube_parser(link.val()));
//             if (videoID.val() == "false") {
//                 link.attr('style', 'border: 2px solid red;');
//             }
//             else 
//                 link.attr('style', false);
//         })

//         formAddVideo.submit(function(e) {
//             console.log(videoID.val())
//             if (videoID.val() == "false") {
//                 alert_link.attr('style', 'display: inline; color: red');
//                 alert_link.fadeOut(3500);
//                 return false;
//             }
//             else
//                 alert_link.attr('style', 'display: none');
//                 return true;
//         }) 
//     })
// </script> --}}