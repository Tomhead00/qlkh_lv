import { Link, useLocation, useNavigate, useParams} from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useEffect, useRef, useState } from "react"
import {youtube_parser} from '../../components/Func'
import YouTube from 'react-youtube';
import { FilePond, File, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import ReactPlayer from 'react-player'

const {REACT_APP_SERVER} = process.env

function AddVideo() {
    // Khai báo
    const navigate = useNavigate()
    const {state} = useLocation()
    const course = state.course
    const nameSection = state.name
    const sectionID = state.sectionID
    console.log(course, nameSection);
    const [name, setName] = useState('')
    const [time, setTime] = useState(0)
    const [description, setDescription] = useState('')
    const [videoID, setVideoID] = useState('')
    const {id} = useParams()
    const [files, setFiles] = useState([])
    // console.log(btnYT, btnUpload);

    // function
    document.title = "Thêm video cho khóa học"

    useEffect(() => {
        $("#btnYT").on("click", () => {
            $("#youtube").toggle(true)
            $("#upload").toggle(false)
            $("#btnYT").addClass("border border-warning")
            $("#btnUpload").removeClass("border border-warning")
            setTime(0)
            setVideoID('')
            if(videoID && videoID.length > 13) {
                axios({
                    method: "delete",
                    data: {},
                    withCredentials: true,
                    url: `${REACT_APP_SERVER}/me/upload/${videoID}`
                })
            }
            setFiles([])
        })
        $("#btnUpload").on("click", () => {
            $("#youtube").toggle(false)
            $("#upload").toggle(true)
            $("#btnUpload").addClass("border border-warning")
            $("#btnYT").removeClass("border border-warning")
            setTime(0)
            setVideoID('')
            $("#link").val('')
        })
    }, [videoID])

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
        if(name !== '' && description !== '' && videoID !== '' && time !== '') {

            axios({
                method: "put",
                data: {
                    name: name,
                    description: description,
                    videoID: videoID,
                    time: time,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${course._id}/${sectionID}`
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
        if(videoID.length < 13)
        setTime(e.target.getDuration())
    }

    return (
        <div className="container">
            <div className="mt-4">
                <h3><b>Thêm video cho khóa học:</b></h3>
                <h3 className="ml-3">{course.name} | {nameSection}</h3>

                <form className="mt-4 pl-5 pr-5 pb-5" id="addVideo" method="POST" action="/me/stored/{{course._id}}?_method=PUT">
                    <div className="form-group">
                        <label htmlFor="name">Tên video:</label>
                        <input type="text" className="form-control" id="name" name="name" required onChange={handleName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="mieuta">miêu tả:</label>
                        <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleDescription}></textarea>
                    </div>
                    <div className="mb-3">
                                <label htmlFor="link">Upload:</label>
                                <a
                                className="btn btn-primary btn-floating m-1 border border-warning"
                                style={{backgroundColor: "white"}}
                                role="button"
                                id='btnUpload'
                                >
                                <i className="fas fa-file-upload" style={{color: "black"}}></i>
                                </a>
                                <a
                                className="btn btn-primary btn-floating m-1"
                                style={{backgroundColor: "white"}}
                                role="button"
                                id="btnYT"
                                >
                                <i className="fab fa-2x fa-youtube" style={{color: "#ff0000"}}></i>
                                </a>
                            </div>
                    <div id="youtube" style={{display: "none"}}>
                        <div className="form-group">

                            <input type="text" className="form-control" id="link" placeholder="Sao chép liên kết youtube và dán vào đây!" required onChange={handleVideoID}/>
                            <small id="alert-link" style={{color: "#ff0000"}}></small>
                            <div className="mt-4">
                                <YouTube
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
                    </div>
                    <div id="upload">
                        <FilePond
                            files={files}
                            onupdatefiles={setFiles}
                            allowMultiple={false}
                            maxFiles={1}
                            server={
                                {url: `${REACT_APP_SERVER}/me/upload`,
                                revert: `/${videoID}`
                                }
                            }
                            onprocessfile = {(err,file) => setVideoID(JSON.parse(file.serverId).filename)}
                            name="file"
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                            required
                        />
                        <ReactPlayer 
                            url={`${REACT_APP_SERVER}/video/${videoID}`} 
                            controls
                            onDuration={(duration) => {
                                setTime(duration);
                            }}                
                        />
                    </div>    
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