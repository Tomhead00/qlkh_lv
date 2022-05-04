import { Link, useLocation, useNavigate } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import moment from "moment"
import {isValidHttpUrl, progessBar} from '../../components/Func'
import { FilePond} from 'react-filepond'

const {REACT_APP_SERVER} = process.env

function EditCourse() {
    // khai bao
    const navigate = useNavigate()
    const [course, setCourse] = useState([]);
    const [video, setVideo] = useState([]);
    const [livestream, setLivestream] = useState([]);
    const [section, setSection] = useState([]);
    const [typeSection, setTypeSection] = useState('');
    const [member, setMember] = useState([]);
    const [countDel, setCountDel] = useState(0);
    const [updateNameSection, seUpdateNameSection] = useState('');
    const location = useLocation()
    
    // function
    document.title = "Tùy chỉnh khóa học"
    const refreshCourse = (e) => {
        axios({
            method: "get",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER + location.pathname}`
        })
        .then(ketqua => {
            if(ketqua.data) {
            console.log(ketqua.data);
            setCourse(ketqua.data)
            setSection(ketqua.data.sections)
            setLivestream(ketqua.data.livestreams)
            ketqua.data.sections.map((Video) => {
                setVideo([...video, Video])
            })
            } else navigate("/me/stored/courses")
        })
    }

    // const refreshDeleteVideo = (e) => {
    //     axios({
    //         method: "get",
    //         data: {},
    //         withCredentials: true,
    //         url: `${REACT_APP_SERVER + location.pathname}/countDeleteVideo`
    //     })
    //     .then(ketqua => {
    //         if(typeof(ketqua.data) === "number") {
    //             setCountDel(ketqua.data)
    //         } else navigate("/me/stored/courses")
    //     })
    // }
    
    useEffect(() => {
        refreshCourse()
        // refreshDeleteVideo()
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

    const Directional = (sectionID ,_id, action) => (e) => {
        console.log(sectionID ,_id, action);
        axios({
            method: "post",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER}/me/stored/${course._id}/edit/${sectionID}/${_id}/${action}`
        })
        .then(ketqua => {
            if(ketqua.data) {
                refreshCourse()
                // refreshDeleteVideo()
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    const addSection = (nameSection) => {
        if (nameSection !== '') {
            axios({
                method: "post",
                data: {
                    name: nameSection,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${course._id}/addSection`
            })
            .then(ketqua => {
                if (ketqua.data) {
                    refreshCourse()
                    setTypeSection("")
                } else {
                    alert("Lỗi hệ thống. Vui lòng thử lại!")
                }
            })
        }
    }
    
    const handleUpdateNameSection = (name) => {
        seUpdateNameSection(name)
    }

    const updateNameSectionServer = (id, newName) => {
        if (newName !== '') {
            axios({
                method: "post",
                data: {
                    name: newName,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/me/stored/${id}/updateSection`
            })
            .then(ketqua => {
                if (ketqua.data) {
                    refreshCourse()
                } else {
                    alert("Lỗi hệ thống. Vui lòng thử lại!")
                }
            })
        }
    }

    const moveSection = (courseID, sectionID, action) => {
        axios({
            method: "post",
            data: {
                courseID: courseID,
                sectionID: sectionID,
                action: action,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/me/stored/moveSection`
        })
        .then(ketqua => {
            if (ketqua.data) {
                refreshCourse()
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    const deleteSection = (courseID, sectionID) => {
        axios({
            method: "post",
            data: {
                courseID: courseID,
                sectionID: sectionID,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/me/stored/deleteSection`
        })
        .then(ketqua => {
            if (ketqua.data) {
                refreshCourse()
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    const deleteLive = (courseID, liveID) => {
        console.log(courseID, liveID);
        axios({
            method: "post",
            data: {},
            withCredentials: true,
            url: `${REACT_APP_SERVER}/livestream/${courseID}/${liveID}/deleteLive`
        })
        .then(ketqua => {
            if (ketqua.data) {
                refreshCourse()
            } else {
                alert("Lỗi hệ thống. Vui lòng thử lại!")
            }
        })
    }

    return (
        <div className="container">
            <div className="row mt-4">
                <h3 className="mb-0 col-sm-4"><b>Tùy chỉnh khóa học:</b></h3>
                <div className="col-sm-8 d-flex justify-content-end">
                    <Link to={`/livestream/${course._id}`} className="btn btn-warning btn-sm text-end ml-1" title="Livestream"><i className="fas fa-video"></i> Livestream</Link>
                    <Link to={`/courses/show/${course.slug}`} className="btn btn-primary btn-sm text-end ml-1" title="Xem Khóa học"><i className="fas fa-play"></i> Xem khóa học</Link>
                    {/* <Link to={`/me/trash/${course._id}`} className="btn btn-primary btn-sm ml-1" title="Thùng rác"><i className="fas fa-trash-alt"></i> {countDel}</Link> */}
                    <button className="btn btn-danger btn-sm ml-1" title="Quay lại" onClick={() => window.history.back()}><i className="fas fa-chevron-left"></i> Quay lại</button>
                </div>
            </div>
            <div className="row">
                {section.map((element, index) => (
                    <div className="accordion mt-4" id="accordionExample" key={index}>
                        <div className="row">
                            <div className="col-10">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button collapsed" type="button" data-mdb-toggle="collapse" data-mdb-target={`#collapse${index}`} aria-expanded={`${index ? "false" : "true"}`} aria-controls="collapseOne">
                                        <strong>{element.name}</strong>
                                    </button>
                                    </h2>
                                    <div id={`collapse${index}`} className={`accordion-collapse collapse`} aria-labelledby="headingOne" data-mdb-parent="#accordionExample">
                                        <div className="accordion-body">
                                            <h5><strong>Videos: </strong></h5>
                                            <div className="row">
                                                <div className="col-sm-3 col-lg-3 card-deck mt-3">
                                                    <div className="card card-course-item">
                                                        <div className="card-body w-100 d-flex justify-content-center align-items-center addVideo" style={{height: "480px",  backgroundColor: "rgba(0,0,255,.1)"}}>
                                                            <Link to={`/me/stored/${course._id}/EditCourse/AddVideo`} state={{course: course, name: element.name, sectionID: element._id}}><i className="fas fa-plus-circle fa-5x"></i></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {element.videos.map((video, index) => (
                                                    <div className="col-sm-3 col-lg-3 card-deck mt-3" key={index}>
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
                                                                        video.description
                                                                    }</div>
                                                                <div className="mb-3 ml-2 action text-center">
                                                                    <button className="btn btn-light mr-1" onClick={Directional(element._id, video._id, "preview")}><i className="fas fa-angle-left"></i></button>
                                                                    <Link to={`/me/stored/${course._id}/EditCourse/${video._id}/update`} state={{course: course, section: element, video: video}} className="btn btn-light mr-1"><i className="fas fa-cog"></i></Link>
                                                                    <button className="btn btn-light mr-1" onClick={Directional(element._id, video._id, "delete")}><i className="fas fa-trash-alt"></i></button>
                                                                    <button className="btn btn-light mr-1" onClick={Directional(element._id, video._id, "next")}><i className="fas fa-angle-right"></i></button>
                                                                </div>
                                                                <div className="card-footer d-flex">
                                                                    <small className="text-muted time">{moment(video.updatedAt).fromNow()}</small>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <h5 className="mt-4"><strong>
                                                Tài liệu:
                                            </strong></h5>
                                                <FilePond
                                                    // files={files}
                                                    // onupdatefiles={setFiles}
                                                    // allowMultiple={true}
                                                    // maxFiles={1}
                                                    // server={
                                                    //     {url: `${REACT_APP_SERVER}/me/upload/${element._id}`,
                                                    //     revert: `/${videoID}`
                                                    //     }
                                                    // }
                                                    // onprocessfile = {(err,file) => setVideoID(JSON.parse(file.serverId).filename)}
                                                    name="file"
                                                    labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
                                                />
                                            <table className="table align-middle mt-4">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">Tên file</th>
                                                        <th scope="col">Xóa</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td>Sit</td>
                                                        <td>
                                                            <button type="button" className="btn btn-link btn-sm px-3" data-ripple-color="dark">
                                                            <i className="fas fa-times" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">2</th>
                                                        <td>Adipisicing</td>
                                                        <td>
                                                            <button type="button" className="btn btn-link btn-sm px-3" data-ripple-color="dark">
                                                            <i className="fas fa-times" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">3</th>
                                                        <td>Hic</td>
                                                        <td>
                                                            <button type="button" className="btn btn-link btn-sm px-3" data-ripple-color="dark">
                                                            <i className="fas fa-times" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 text-center mt-1">
                                <button type="button" className="btn btn-success btn-rounded btn-sm ml-1" title="Lên" onClick={() => {moveSection(course._id, element._id, "up")}}>
                                    <i className="fas fa-long-arrow-alt-up"></i>
                                </button>
                                <button type="button" className="btn btn-success btn-rounded btn-sm ml-1" title="Xuống" onClick={() => {moveSection(course._id, element._id, "down")}}>
                                    <i className="fas fa-long-arrow-alt-down"></i>
                                </button>
                                <button 
                                    type="button"
                                    className="btn btn-primary btn-rounded btn-sm ml-1 dropdown-toggle" 
                                    title="Sửa"
                                    id={`dropdownMenuButton${index}`}
                                    data-mdb-toggle="dropdown"
                                    aria-expanded="false"
                                    onClick={() => handleUpdateNameSection(element.name)}
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${index}`}>
                                    <input 
                                        type="text" 
                                        style={{width: "250px"}} 
                                        value={updateNameSection} 
                                        onChange={(e) => seUpdateNameSection(e.target.value)} 
                                        onKeyPress={(e) => {
                                            if(e.key === 'Enter') {
                                                updateNameSectionServer(element._id, updateNameSection)
                                            }
                                        }}
                                    />
                                </ul>
                                <button type="button" 
                                    className="btn btn-danger btn-rounded btn-sm ml-1" 
                                    title="Xóa"
                                    onClick={() => deleteSection(course._id, element._id)}
                                >
                                    <i className="far fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        
                    </div>
                ))}
                
                <div className="input-group mt-3">
                    <input type="text" className="form-control" placeholder="Thêm chương mới" aria-label="Thêm chương mới" aria-describedby="basic-addon2" onChange={(e) => setTypeSection(e.target.value)} value={typeSection}/>
                    <div className="input-group-append">
                        <button className="btn btn-secondary" type="button" onClick={() => addSection(typeSection)}><i className="fas fa-plus"></i></button>
                        <button className="btn btn-danger" type="button" onClick={() => setTypeSection("")}><i className="fas fa-times"></i></button>
                    </div>
                </div>
            </div>
            <div className="row">
            <h3 className="mb-0 mt-3"><b>Video Livestream:</b></h3>

                {/* <div className="col-sm-3 col-lg-3 card-deck mt-4">
                    <div className="card card-course-item">
                        <div className="card-body w-100 d-flex justify-content-center align-items-center addVideo" style={{height: "429.59px",  backgroundColor: "rgba(0,0,255,.1)"}}>
                            <Link to={`/me/stored/${course._id}/EditCourse/AddVideo`} state={{course: course}}><i className="fas fa-plus-circle fa-5x"></i></Link>
                        </div>
                    </div>
                </div> */}
                {livestream.map((video, index) => (
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
                                        video.description
                                    }</div>
                                <div className="mb-3 ml-2 action text-center">
                                    <Link to={`/me/stored/${course._id}/EditCourse/${video._id}/update`} state={{course: course, section: {}, video: video}} className="btn btn-light mr-1"><i className="fas fa-cog"></i></Link>
                                    <button className="btn btn-light mr-1" onClick={() => deleteLive(course._id, video._id)}><i className="fas fa-trash-alt"></i></button>
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
                                                    {/* {progessBar(course.video,member._id)} */}
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