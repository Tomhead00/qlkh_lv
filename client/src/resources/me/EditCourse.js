import { Link, useLocation, useNavigate } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import moment from "moment"
import {isValidHttpUrl, progessBar} from '../../components/nav/Func'

const {REACT_APP_SERVER} = process.env

function EditCourse() {
    // khai bao
    const navigate = useNavigate()
    const [course, setCourse] = useState([]);
    const [video, setVideo] = useState([]);
    const [member, setMember] = useState([]);
    const [countDel, setCountDel] = useState(0);
    const location = useLocation()
    
    // function
    document.title = "Tùy chỉnh khóa học"
    const refreshVideo = (e) => {
        axios({
            method: "get",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER + location.pathname}`
        })
        .then(ketqua => {
            if(ketqua.data) {
            setCourse(ketqua.data)
            setVideo(ketqua.data.video)
            } else navigate("/me/stored/courses")
        })
    }

    const refreshDeleteVideo = (e) => {
        axios({
            method: "get",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER + location.pathname}/countDeleteVideo`
        })
        .then(ketqua => {
            if(typeof(ketqua.data) === "number") {
                setCountDel(ketqua.data)
            } else navigate("/me/stored/courses")
        })
    }
    
    useEffect(() => {
        refreshVideo()
        refreshDeleteVideo()
        return () => {};
    }, [])

    useEffect(() => {
        if (course._id) {
            axios({
                method: "get",
                data: {},
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${course._id}/getMember`
            })
            .then(ketqua => {
                // console.log(ketqua.data);
                setMember(ketqua.data)
            })
        }
    }, [course._id])

    const handleNameCourse = (e) => {
        setCourse({
            ...course,
            name: e.target.value
        })
    }
    const handleDescription = (e) => {
        setCourse({
            ...course,
            description: e.target.value
        })
    }
    const handleLevel = (e) => {
        setCourse({
            ...course,
            level: e.target.value
        })
    }
    const handleReq = (e) => {
        setCourse({
            ...course,
            req: e.target.value
        })
    }
    const handleResult = (e) => {
        setCourse({
            ...course,
            result: e.target.value
        })
    }
    // submit update
    const submitUpdate = () => {
        $("#submitUpdate").submit(() => {
            return false;
        })
        axios({
            method: "put",
            data: {course},
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/${course._id}`
        })
        .then(ketqua => {
        if(ketqua.data) {
            $("#alert").text("Cập nhật thành công!")
        } else {
            $("#alert").text("Cập nhật thất bại. Vui lòng thử lại!")
        }
        })
    }

    const Directional = (_id, action) => (e) => {
        axios({
            method: "post",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER}/me/stored/${course._id}/edit/${_id}/${action}`
        })
        .then(ketqua => {
            if(ketqua.data) {
                refreshVideo()
                refreshDeleteVideo()
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    return (
        <div className="container">
            <div className="row mt-4">
                <h3 className="mb-0 col-sm-4"><b>Video khóa học:</b></h3>
                <div className="col-sm-8 d-flex justify-content-end">
                    <Link to={`/courses/show/${course.slug}`} className="btn btn-primary btn-sm text-end ml-1" title="Thùng rác"><i className="fas fa-play"></i> Xem khóa học</Link>
                    <Link to={`/me/trash/${course._id}`} className="btn btn-primary btn-sm ml-1" title="Thùng rác"><i className="fas fa-trash-alt"></i> {countDel}</Link>
                    <button className="btn btn-danger btn-sm ml-1" title="Quay lại" onClick={() => window.history.back()}><i className="fas fa-chevron-left"></i> Quay lại</button>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-3 col-lg-3 card-deck mt-4">
                    <div className="card card-course-item">
                        <div className="card-body w-100 d-flex justify-content-center align-items-center addVideo" style={{height: "429.59px",  backgroundColor: "rgba(0,0,255,.1)"}}>
                            <Link to={`/me/stored/${course._id}/EditCourse/AddVideo`} state={{course: course}}><i className="fas fa-plus-circle fa-5x"></i></Link>
                        </div>
                    </div>
                </div>
                {video.map((video, index) => (
                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                        <div className="card card-course-item fadeIn">
                            <Link to="#">
                                <img className="card-img-top" height={'219px'} src={(isValidHttpUrl(video.image)) ?
                                    video.image : 
                                    `${REACT_APP_SERVER}/${video.image}`
                                }
                                alt={video.image} />
                            </Link>

                            <div className="card-body">
                                    <Link to="#">
                                        <h5 className="card-title">{video.name}</h5>
                                    </Link>
                                    <div className="card-text mt mb-4">{
                                        video.description.split('\n').map(
                                            (str,index) => <div key={index}>{str}</div>)
                                    }</div>
                                <div className="mb-3 ml-2 action">
                                    <button className="btn btn-light mr-1" onClick={Directional(video._id, "preview")}><i className="fas fa-angle-left"></i></button>
                                    <Link to={`/me/stored/${course._id}/EditCourse/${video._id}/update`} state={{course: course, video: video}} className="btn btn-light mr-1"><i className="fas fa-cog"></i></Link>
                                    <button className="btn btn-light mr-1" onClick={Directional(video._id, "delete")}><i className="fas fa-trash-alt"></i></button>
                                    <button className="btn btn-light mr-1" onClick={Directional(video._id, "next")}><i className="fas fa-angle-right"></i></button>
                                </div>
                                <div className="card-footer d-flex">
                                    <small className="text-muted time">{moment(video.updatedAt).fromNow()}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

                <ul className="nav nav-pills mt-5" id="ex1" role="tablist">
                    <li className="nav-item" role="presentation">
                        <a
                        className="nav-link active"
                        id="ex1-tab-1"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-1"
                        role="tab"
                        aria-controls="ex1-pills-1"
                        aria-selected="true"
                        >
                            <b>Cập nhật khóa học</b>
                        </a>
                    </li>
                    <li className="nav-item" role="presentation">
                        <a
                        className="nav-link"
                        id="ex1-tab-2"
                        data-mdb-toggle="pill"
                        href="#ex1-pills-2"
                        role="tab"
                        aria-controls="ex1-pills-2"
                        aria-selected="false"
                        >
                            <b>Thành viên</b>
                        </a>
                    </li>
                </ul>
                <div className="tab-content" id="ex1-content">
                    <div
                        className="tab-pane fade show active"
                        id="ex1-pills-1"
                        role="tabpanel"
                        aria-labelledby="ex1-tab-1"
                    >
                        <div className=" row d-flex justify-content-center">
                            <form className="mt-4" id="submitUpdate" method="POST" action="/courses/{{course._id}}?_method=PUT" style={{width: "800px"}}>
                                <div className="form-group">
                                    <label htmlFor="name">Tên khóa học:</label>
                                    <input type="text" className="form-control" value={course.name || ''} id="name" name="name" required onChange={handleNameCourse}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mieuta">Miêu tả khóa học</label>
                                    <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleDescription} value={course.description || ''}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mieuta">Mức độ:</label>
                                    <select className="form-control" id="GT" name="gender" onChange={handleLevel} value={course.level || ''}>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Skilled">Skilled</option>
                                        <option value="Expert">Expert</option>
                                    </select>                      
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mieuta">Yêu cầu</label>
                                    <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleReq} value={course.req || ''}></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mieuta">Kết quả</label>
                                    <textarea type="text" className="form-control" id="mieuta" name="mieuta" onChange={handleResult} value={course.result || ''}></textarea>
                                </div>
                                <div>
                                    <small className="text-center" id="alert" style={{display: "block", color: "red"}}></small>
                                    <button type="submit" className="btn btn-success float-right ml-2" onClick={submitUpdate}>Lưu lại</button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="tab-pane fade" id="ex1-pills-2" role="tabpanel" aria-labelledby="ex1-tab-2">
                        <div className=" row d-flex justify-content-center m-5">
                            <table className="table align-middle">
                                <thead>
                                    <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Tài khoản</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Trạng thái</th>
                                    <th scope="col">Tiến độ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {member.map((member, index) => {
                                        return (
                                            <tr key={index}>
                                                <th scope="row">{index+1}</th>
                                                <td><img
                                                        className="rounded-circle shadow-1-strong me-3"
                                                        src={isValidHttpUrl(member.image) ? member.image : `${REACT_APP_SERVER + member.image}`}
                                                        alt="avatar"
                                                        width="40"
                                                        height="40"
                                                    />{member.username} {JSON.stringify(member) === JSON.stringify(course.actor) ? (<i className="fas fa-crown" style={{color: "#d6e600", fontSize: "15px"}}></i>) : null}</td>
                                                <td>{member.email}</td>
                                                <td>
                                                    {(!member.deleted) ? (<span className="badge badge-success rounded-pill">Active</span>) : (<span className="badge badge-danger rounded-pill">Block</span>)}
                                                </td>
                                                <td style={{width: '20%'}}>
                                                    {progessBar(course.video,member._id)}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                
            </div>
            <div style={{height: "500px"}}></div>
        </div>
    )
}



export default EditCourse