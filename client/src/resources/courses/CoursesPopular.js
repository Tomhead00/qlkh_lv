import { useNavigate, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl, progessBar} from "../../components/Func"
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function CoursesPopular() {
    const [cPopular, setCPopular] = useState([]);
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
                    <h3 className="mb-0 col-sm-4"><b>Các khóa học phổ biến:</b></h3>
                    <Link className="col-sm-8 text-right" to="/courses">Quay lại <i className="fas fa-angle-double-left"></i></Link>
                </div>
                <div className="row">
                    {cPopular.toString() ? 
                        cPopular.map((cpopular, index) => (
                                <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                    <div className="card card-course-item">
                                        <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`)}>
                                            <img className="card-img-top" src={cpopular.image} alt={cpopular.name} />
                                        </Link>

                                        <div className="card-body">
                                            <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`)}>
                                                <h5 className="card-title">{cpopular.name}</h5>
                                            </Link>
                                            <p className="card-text mt">{cpopular.description}</p>
                                            <p className="mb-3">{cpopular.level} | <i className="fas fa-clock"></i> {moment.utc(cpopular.time*1000).format('HH:mm:ss')}</p>
                                            <p><img src={isValidHttpUrl(cpopular.actor.image) ? cpopular.actor.image : `${REACT_APP_SERVER + cpopular.actor.image}`} className="user-avatar" /><b>{cpopular.actor.username}</b></p>
                                            {progessBar(cpopular.video,cpopular.user)}
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

export default CoursesPopular

// {{!-- <div class="container">
//     <!-- Sidenav-->


//     <div class="mt-4">
//         <div class="row">
//             <h3 class="mb-0 col-sm-4"><b>Các khóa học vừa cập nhật:</b></h3>
//             <a class="col-sm-8 text-right" href="/courses">Quay lại <i class="fas fa-angle-double-left"></i></a>
//         </div>
//         <div class="row">
//             {{#each CoursesPopularCoursesPopular}}
//             <div class="col-sm-3 col-lg-3 card-deck mt-4">
//                 <div class="card card-course-item">
//                     <a href="/courses/show/{{this.slug}}">
//                         <img class="card-img-top" src="{{this.image}}" alt="{{this.image}}">
//                     </a>

//                     <div class="card-body">
//                             <a href="/courses/show/{{this.slug}}">
//                                 <h5 class="card-title">{{this.name}}</h5>
//                             </a>
//                         <p class="card-text mt">{{this.mieuta}}</p>
//                         <p><img src={{this.actor.image}} alt="" class="user-avatar"><b>{{this.actor.username}}</b></p>
//                         <div class="card-footer d-flex">
//                             <small class="text-muted time">{{this.updatedAt}}</small>
//                             <small class="text-muted ml-auto"><i class="fas fa-users"></i> {{this.studentCount}}</small>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             {{else}}
//             <div class="row mt-3 mb-5">
//                 <h5 class="mb-0 text-center">Không có khóa học phù hợp cho chủ đề này (-.-)!</h5>
//             </div>
//             {{/each}}
//         </div>
//     </div>
// </div>

// <div class="row" style="height: 50px;"></div>

// <script>
//     document.addEventListener("DOMContentLoaded", function() {
//         var card = $(".card.card-course-item");
        

//         // format time
//         var time = $(".time").map(function() {
//             $(this).text(moment($(this).text()).fromNow());
//         }).get()

//     })
// </script> --}}