import { useNavigate, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {getAllVideo, isValidHttpUrl, progessBar} from "../../components/Func"
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function CoursesPopular() {
    const [cPopular, setCPopular] = useState([]);
    const [choice , setChoice] = useState({});
    document.title = "Các khóa học phổ biến"
    const navigate = useNavigate()

    // function
    useEffect(() => {
        // Cac khoa hoc pho bien
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cPopular`
        })
        .then(ketqua => {
            setCPopular(ketqua.data)
        })
        return () => {};
    },[])

    const navi = (string, obj) => (e) => {
        e.preventDefault()
        setChoice(obj)
        axios({
            method: "post",
            withCredentials: true,
            data: {
                slug: string
            },
            url: `${REACT_APP_SERVER}/courses/checkThamgia`
        })
        .then(ketqua => {
            // console.log(ketqua.data);
            if (ketqua.data === 0) {
                window.$("#ques-course-model").modal("toggle");
                $("#btn-thamgia-course").on('click', function thamGia() {
                    axios({
                        method: "post",
                        withCredentials: true,
                        url: `${REACT_APP_SERVER}/courses/thamGia/${string}`
                    })
                    .then(ketqua => {
                        if(ketqua.data) {
                            console.log(ketqua.data)
                            window.$("#ques-course-model").modal("toggle");
                            navigate(`/courses/show/${string}`)
                        }
                    })
                })
            }
            else {
                navigate(`/courses/show/${string}`)
            }
        })
    }
    
    const closeModal = () => {
        window.$("#ques-course-model").modal("toggle");
    }

    return (
        <div className="container">
            <div className="mt-4">
                <div className="row">
                    <h3 className="mb-0 col-sm-4"><b>Các khóa học phổ biến:</b></h3>
                    <Link className="col-sm-8 text-right" to="/courses">Quay lại <i className="fas fa-angle-double-left"></i></Link>
                </div>
                <div className="row">
                    {cPopular.toString() ? 
                        cPopular.map((cpopular, index) => (
                                <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                    <div className="card card-course-item">
                                        <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`, cpopular)}>
                                            <img className="card-img-top" src={cpopular.image} alt={cpopular.name} />
                                        </Link>

                                        <div className="card-body">
                                            <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`,cpopular)}>
                                                <h5 className="card-title">{cpopular.name}</h5>
                                            </Link>
                                            <p className="card-text mt">{cpopular.description}</p>
                                            <p className="mb-3">{cpopular.level} | <i className="fas fa-clock"></i> {moment.utc(cpopular.time*1000).format('HH:mm:ss')}</p>
                                            <p><img src={isValidHttpUrl(cpopular.actor.image) ? cpopular.actor.image : `${REACT_APP_SERVER + cpopular.actor.image}`} className="user-avatar" /><b>{cpopular.actor.username}</b></p>
                                            {progessBar(getAllVideo(cpopular),cpopular.user)}
                                            <div className="card-footer d-flex">
                                                <small className="text-muted time p-1">{moment(cpopular.updatedAt).fromNow()}</small>                                                    
                                                <small className="text-muted ml-auto p-1"><i className="fas fa-users"> {cpopular.studentCount}</i></small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        )) : (
                        <div className="row mt-3 mb-3">
                            <h5 className="mb-0 text-center">Không có khóa học phù hợp cho chủ đề này (-.-)!</h5>
                        </div>
                        )
                    }
                </div>
            </div>

            <div id="ques-course-model" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title"><strong>Tham gia khóa học?</strong></h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body" id="body">
                        <div className="row">
                            <div className="col-6">
                                <h5><b>Nội dung khóa học:</b></h5>
                                <p className="m-0 p-0"><i><small>Tổng thời lượng: {`(${moment.utc(choice.time*1000).format('HH:mm:ss')})`} {Object.keys(choice).length ? ` - ${getAllVideo(choice).length} video`: null}</small></i></p>
                                <div className="accordion mt-3" id="accordionPanelsStayOpenExample">
                                    {Object.keys(choice).length && Object.keys(choice.sections).length ? 
                                        choice.sections.map((element, index) => (
                                            <div className="accordion-item" key={index}>
                                                <h2 className="accordion-header" id="headingOne">
                                                <button className="accordion-button collapsed " type="button" data-mdb-toggle="collapse" data-mdb-target={`#collapse${index}`} aria-expanded={`${index ? "false" : "true"}`} aria-controls="collapseOne">
                                                    <strong>{element.name}</strong>
                                                </button>
                                                </h2>
                                                <div id={`collapse${index}`} className={`accordion-collapse collapse`} aria-labelledby="headingOne" data-mdb-parent="#accordionExample">
                                                    <div className="accordion-body">
                                                        <ol className="list-group list-group-light list-group-numbered">
                                                            {element.videos.map((video,index) => (
                                                                <li className="list-group-item p-0" key={index}>{video.name} {` | (${moment.utc(video.time*1000).format('HH:mm:ss')})`}</li>
                                                            ))}
                                                        </ol>
                                                    </div>
                                                </div>
                                            </div>
                                        )) 
                                    :
                                        (<h6>Không có nội dung nào trong khóa học này (^.^)!</h6>)
                                    }
                                </div>
                            </div>
                            <div className="col-6" style={{wordWrap:" break-word"}}>
                                     <p className="mb-0"><b>Yêu cầu:</b></p>
                                    <div className="mb-3">
                                        <ul style={{listStyleType:"circle"}}>
                                            {Object.keys(choice).length ? choice.req.split('\n').map((str,index) => (
                                                <li key={index}>{str}</li>
                                            )) : null}
                                        </ul>
                                    </div>
                                    <p className="mb-0"><b>Kết quả đạt được:</b></p>
                                    <div className="mb-3">
                                        <ul style={{listStyleType:"circle"}}>
                                            {Object.keys(choice).length ? choice.result.split('\n').map((str,index) => (
                                                <li key={index}>{str}</li>
                                            )) : null}
                                        </ul>
                                    </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary close-ques" data-dismiss="modal" onClick={closeModal}>Hủy</button>
                        <button id="btn-thamgia-course" type="button" className="btn btn-danger">Tham gia</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CoursesPopular