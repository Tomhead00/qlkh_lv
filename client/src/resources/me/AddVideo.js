import { Link, useLocation, useNavigate, useParams} from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState } from "react"
import {youtube_parser} from '../../components/nav/Func'
import YouTube from 'react-youtube';

const {REACT_APP_SERVER} = process.env

function AddVideo() {
    // Khai báo
    const navigate = useNavigate()
    const {state} = useLocation()
    const {course} = state
    const [name, setName] = useState('')
    const [time, setTime] = useState(0)
    const [description, setDescription] = useState('')
    const [videoID, setVideoID] = useState('')
    const {id} = useParams()


    // function
    document.title = "Thêm video cho khóa học"

    const handleName = (e) => {
        setName(e.target.value)
    }
    const handleDescription = (e) => {
        setDescription(e.target.value)
    }
    const handleVideoID = (e) => {
        if(youtube_parser(e.target.value)) {
            $("#alert-link").text('')
            $("#link").attr('style', 'false');
            setVideoID(youtube_parser(e.target.value))
        } else {
            $("#link").attr('style', 'border: 2px solid red;');
            $("#alert-link").text("Link chưa hợp lệ, Vui lòng thử lại (^.^)!")
            setVideoID('')
        }
    }
    const submit = () => {
        $("#addVideo").submit(() => {
            return false;
        })
        if(name !== '' && description !== '' && videoID !== '') {
            axios({
                method: "put",
                data: {
                    name: name,
                    description: description,
                    videoID: videoID,
                    time: time,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${id}`
            })
            .then(ketqua => {
                if(ketqua.data) {
                    alert('Lưu khóa học thành công!')
                    navigate(`/me/stored/${course._id}/EditCourse`)
                } else {
                    alert('Lỗi!')
                }
            })
        }
    }

    const ReadyYT = (e) => {
        console.log(e.target.getDuration());
        setTime(e.target.getDuration())
    }

    return (
        <div className="container">
            <div className="mt-4">
                <h3><b>Thêm video cho khóa học:</b></h3>
                <h3 className="ml-3">{course.name}</h3>

                <form className="mt-4 pl-5 pr-5 pb-5" id="addVideo" method="POST" action="/me/stored/{{course._id}}?_method=PUT">
                    <div className="form-group">
                        <label htmlFor="name">Tên video:</label>
                        <input type="text" className="form-control" id="name" name="name" required onChange={handleName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mieuta">miêu tả:</label>
                        <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleDescription}></textarea>
                    </div>
                    <div className="form-group">
                    <div className="mb-3">
                        <label htmlFor="link">Upload:</label>
                        <a
                        className="btn btn-primary btn-floating m-1"
                        href="https://studio.youtube.com/" target="_blank" rel="noreferrer"
                        style={{backgroundColor: "white"}}
                        role="button"
                        >
                        <i className="fab fa-2x fa-youtube" style={{color: "#ff0000"}}></i></a>
                    </div>
                        <input type="text" className="form-control" id="link" placeholder="Sao chép liên kết youtube và dán vào đây!" required onChange={handleVideoID}/>
                        <small id="alert-link" style={{color: "#ff0000"}}></small>
                        <div className="mt-4">
                            <YouTube style={{ display: 'none' }}
                                videoId={videoID}                  // defaults -> null
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
                    </div>
                    <div>
                        <small><i><b>Example: </b></i></small>
                    </div>
                    <small>
                        <ol style={{listStyleType: "decimal"}}>
                            <li>https://www.youtube.com/watch?v=YilPrQiKOfE</li>
                            <li>https://www.youtube.com/watch?v=z2f7RHgvddc&list=PL_-VfJajZj0VatBpaXkEHK_UPHL7dW6I3</li>
                        </ol>
                    </small>
                    <div>
                        <button type="submit" className="btn btn-primary float-right ml-2" id="btnSubmit" onClick={submit}>Lưu lại</button>
                        <Link to={`/me/stored/${id}/EditCourse`} className="btn btn-danger cancel float-right" value="Quay lại">Quay lại</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddVideo