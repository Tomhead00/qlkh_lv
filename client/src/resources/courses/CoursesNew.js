import { useNavigate, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl} from "../../components/nav/Func"
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function CoursesNew() {
    const [cUpdate, setCUpdate] = useState([]);
    document.title = "Các khóa học vừa cập nhật"
    const navigate = useNavigate()

    // function
    useEffect(() => {
        // Cac khoa hoc vua cap nhat
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cUpdate`
        })
        .then(ketqua => {
            setCUpdate(ketqua.data)
        })
        return () => {};
    },[])

    const navi = (string) => (e) => {
        e.preventDefault()
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
                    <h3 className="mb-0 col-sm-4"><b>Các khóa học vừa cập nhật:</b></h3>
                    <Link className="col-sm-8 text-right" to="/courses">Quay lại <i className="fas fa-angle-double-left"></i></Link>
                </div>
                <div className="row">
                    {cUpdate.toString() ? 
                        cUpdate.map((cupdate, index) => (
                                <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                    <div className="card card-course-item">
                                        <Link to={`/courses/show/${cupdate.slug}`} onClick={navi(`${cupdate.slug}`)}>
                                            <img className="card-img-top" src={cupdate.image} alt={cupdate.name} />
                                        </Link>

                                        <div className="card-body">
                                            <Link to={`/courses/show/${cupdate.slug}`} onClick={navi(`${cupdate.slug}`)}>
                                                <h5 className="card-title">{cupdate.name}</h5>
                                            </Link>
                                            <p className="card-text mt">{cupdate.description}</p>
                                            <p className="mb-3"><i className="fas fa-clock"></i> 1000 phút</p>
                                            <p><img src={isValidHttpUrl(cupdate.actor.image) ? cupdate.actor.image : `${REACT_APP_SERVER + cupdate.actor.image}`} className="user-avatar" /><b>{cupdate.actor.username}</b></p>
                                            <div className="card-footer d-flex">
                                                <small className="text-muted time p-1">{moment(cupdate.updatedAt).fromNow()}</small>                                                    
                                                <small className="text-muted ml-auto p-1"><i className="fas fa-users"> {cupdate.studentCount}</i></small>
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
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tham gia khóa học?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn chưa tham gia khóa học này. Bạn có muốn tham gia?</p>
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

export default CoursesNew