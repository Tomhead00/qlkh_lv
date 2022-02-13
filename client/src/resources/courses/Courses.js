import { useNavigate, useLocation, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl} from "../../components/nav/Func"
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function Courses() {
    document.title = "Khóa học"

    const [cJoin, setCJoin] = useState([]);
    const [cUpdate, setCUpdate] = useState([]);
    const [cPopular, setCPopular] = useState([]);
    const [cAnother, setCAnother] = useState([]);

    useEffect(() => {
        // Cac khoa hoc da tham gia
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cJoin`
        })
        .then(ketqua => {
            setCJoin(ketqua.data)
        })
        // Cac khoa hoc vua cap nhat
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cUpdate`
        })
        .then(ketqua => {
            setCUpdate(ketqua.data)
        })
        // Cac khoa hoc pho bien
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cPopular`
        })
        .then(ketqua => {
            setCPopular(ketqua.data)
        })
        // Cac khoa hoc khacs
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/courses/cAnother`
        })
        .then(ketqua => {
            setCAnother(ketqua.data)
        })
        return () => {};
    },[])


    return (
        <div>
            <div className="container">
                <div style={{position: "relative"}}>
                    <div className="row mt-4">
                        <form className="input-group d-flex justify-content-end" id="formSearch">
                            <div className="form-outline">
                                <input id="search-input form1" type="search" className="form-control" style={{width: "300px", border: "solid 1px"}}  autoComplete="off" />
                                <label className="form-label" htmlFor="form1">Search</label>
                            </div>
                            <button id="close-button" type="button" className="btn btn-danger">
                                <i className="fas fa-close"></i>
                            </button>
                        </form>
                    </div>
                    <div className="list-group" id="resultSearch"></div>
                </div>

                <div className="mt-4">
                    <div className="row">
                        <h3 className="mb-0 col-sm-4"><b>Các khóa học đã tham gia:</b></h3>
                    </div>
                    <div className="row">
                        {cJoin.toString() ? 
                            cJoin.map((cjoin, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${cjoin.slug}`}>
                                                <img className="card-img-top" src={cjoin.image} alt={cjoin.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cjoin.slug}`}>
                                                    <h5 className="card-title">{cjoin.name}</h5>
                                                </Link>
                                                <p className="card-text mt">{cjoin.description}</p>
                                                <p className="mb-3 text-right"><i className="fas fa-clock"></i> 1000 phút</p>
                                                <p><img src={isValidHttpUrl(cjoin.actor.image) ? cjoin.actor.image : `${REACT_APP_SERVER + cjoin.actor.image}`} className="user-avatar" /><b>{cjoin.actor.username}</b></p>
                                                <div className="card-footer d-flex">
                                                    <small className="text-muted time p-1">{moment(cjoin.updatedAt).fromNow()}</small>                                                    
                                                    <small className="text-muted ml-auto p-1"><i className="fas fa-users"> {cjoin.studentCount}</i></small>
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


                <div className="mt-4">
                    <div className="row">
                        <h3 className="mb-0 col-sm-4"><b>Các khóa học vừa cập nhật:</b></h3>
                        <a className="col-sm-8 text-right" href="/courses/courseNew">Xem tất cả <i className="fas fa-angle-double-right"></i></a>
                    </div>
                    <div className="row">
                        {cUpdate.toString() ? 
                            cUpdate.slice(0, 3).map((cupdate, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${cupdate.slug}`}>
                                                <img className="card-img-top" src={cupdate.image} alt={cupdate.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cupdate.slug}`}>
                                                    <h5 className="card-title">{cupdate.name}</h5>
                                                </Link>
                                                <p className="card-text mt">{cupdate.description}</p>
                                                <p className="mb-3 text-right"><i className="fas fa-clock"></i> 1000 phút</p>
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

                <div className="mt-4">
                    <div className="row">
                        <h3 className="mb-0 col-sm-4"><b>Các khóa học phổ biến:</b></h3>
                        <a className="col-sm-8 text-right" href="/courses/coursePopular">Xem tất cả <i className="fas fa-angle-double-right"></i></a>
                    </div>
                    <div className="row">
                        {cPopular.toString() ? 
                            cPopular.slice(0, 3).map((cpopular, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${cpopular.slug}`}>
                                                <img className="card-img-top" src={cpopular.image} alt={cpopular.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cpopular.slug}`}>
                                                    <h5 className="card-title">{cpopular.name}</h5>
                                                </Link>
                                                <p className="card-text mt">{cpopular.description}</p>
                                                <p className="mb-3 text-right"><i className="fas fa-clock"></i> 1000 phút</p>
                                                <p><img src={isValidHttpUrl(cpopular.actor.image) ? cpopular.actor.image : `${REACT_APP_SERVER + cpopular.actor.image}`} className="user-avatar" /><b>{cpopular.actor.username}</b></p>
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

                <div className="mt-4">
                    <div className="row">
                        <h3 className="mb-0 col-sm-4"><b>Các khóa học khác:</b></h3>
                    </div>
                    <div className="row">
                        {cAnother.toString() ? 
                            cAnother.map((canother, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${canother.slug}`}>
                                                <img className="card-img-top" src={canother.image} alt={canother.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${canother.slug}`}>
                                                    <h5 className="card-title">{canother.name}</h5>
                                                </Link>
                                                <p className="card-text mt">{canother.description}</p>
                                                <p className="mb-3 text-right"><i className="fas fa-clock"></i> 1000 phút</p>
                                                <p><img src={isValidHttpUrl(canother.actor.image) ? canother.actor.image : `${REACT_APP_SERVER + canother.actor.image}`} className="user-avatar" /><b>{canother.actor.username}</b></p>
                                                <div className="card-footer d-flex">
                                                    <small className="text-muted time p-1">{moment(canother.updatedAt).fromNow()}</small>                                                    
                                                    <small className="text-muted ml-auto p-1"><i className="fas fa-users"> {canother.studentCount}</i></small>
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
                    <div className="row" style={{height: "50px"}}></div>
                </div>
            </div>

            <div id="ques-course-model" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tham gia khóa học?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn chưa tham gia khóa học này. Bạn có muốn tham gia?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary close-ques" data-dismiss="modal">Hủy</button>
                        <button id="btn-thamgia-course" type="button" className="btn btn-danger">Tham gia</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Courses

{/*

<form method="POST" name="join-course-form"></form>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    var card = $(".card.card-course-item");
    var closeQues = $(".close-ques");
    var btnThamgia = $("#btn-thamgia-course");
    var joinCourseForm = document.forms['join-course-form'];
    
    // format time
    var time = $(".time").map(function() {
        $(this).text(moment($(this).text()).fromNow());
    }).get();

    // check tham gia khoa hoc
    card.on("click", function (e) {
        e.preventDefault();
        var link = $(this).children("a").attr('href');
        //console.log(link);
        var slugCourse = link.substring(link.lastIndexOf("/")+1, link.length);
        //console.log(slugCourse);

        $.ajax({
            url: '/courses/checkThamgia',
            type: 'POST',
            data: {
                slug: slugCourse
            }
        }).done(function(ketqua) {
            // console.log(ketqua);
            if (ketqua == 0) {
                $("#ques-course-model").modal("show");
                btnThamgia.on('click', function thamGia() {
                    joinCourseForm.action = "/courses/thamGia/" + slugCourse;
                    joinCourseForm.submit();
                })
            }
            else {
                window.location.href = link;
            }
        });
    })
    {{!-- // get number join courses
    $(function() {
        $.each(card, function(index, value) {
            // console.log(value);

            var link = $(value).children("a").attr('href');
            // console.log(link);
            var slugCourse = link.substring(link.lastIndexOf("/")+1, link.length);
            // console.log(slugCourse);

            $.ajax({
                url: '/courses/getNumUser',
                type: 'POST',
                data: {
                    slug: slugCourse
                }
            }).done(function(ketqua) {
                // console.log(ketqua);
                var numUser = $(value).find(".text-muted.ml-auto").html("<i className='fas fa-users'></i> " +  ketqua);
                // console.log(numUser.text());
            });
        })
    }) --}}

    // button tham gia
    btnThamgia.on('click', function thamGia(link) {
        window.location.href = "course/";
    })

    // close modal ques
    closeQues.on("click", function() {
        $("#ques-course-model").modal("hide");
    })
    // search
    const closeButton = $('#close-button');
    const searchInput = $('#search-input');
    const formSearch = $('#formSearch');
    const resultSearch = $('#resultSearch');

    formSearch.submit((e) => {
        e.preventDefault();
    })

    function updateTimeSearch() {
        $(".timeSearch").map(function() {
            // console.log($(this).text());
            $(this).text(moment($(this).text()).fromNow());
        }).get();
    }

    searchInput.on('keyup', () => {
        const inputValue = searchInput.val();
        // console.log(inputValue);

        if (inputValue == "") {
            resultSearch.html("");
        }
        else {
            $.ajax({
                url: '/courses/search',
                type: 'POST',
                data: {
                    name: inputValue,
                }
            })
            .done(function(ketqua) {
                // console.log(ketqua);
                let allSearch = "";
                if (ketqua.length == 0) {
                    allSearch = `<p className="text-center list-group-item list-group-item-action"><i className="fas fa-search"></i> Không có kết quả cho từ khóa <b>`+ inputValue +`</b></p>`
                }
                else {
                    ketqua.forEach(element => {
                        // console.log(element);
                        // name.replace(/\n/g, "<br/>");
                        var regex = new RegExp(inputValue, "gi");
                        // console.log(regex);
                        name = "<span className='highlight'>"+element.name+"</span>";
                        mieuta = "<span className='highlight'>"+element.mieuta+"</span>";
                        if (!/[`~.<>;':"/[\]|{}()=_+-]/.test(inputValue)) {
                            var name = element.name.replace(regex, "<span className='highlight'>"+element.name.match(regex)[0]+"</span>");
                            var mieuta = element.mieuta.replace(regex, "<span className='highlight'>"+element.name.match(regex)[0]+"</span>");
                        }

                        allSearch += (`
                            <a href="courses/show/` + element.slug + `" className="list-group-item list-group-item-action" aria-current="true">
                                <div className="row">
                                        <h5 className="mb-1 text2line col-sm-9"><b>` + name + `</b></h5>
                                        <small className="timeSearch col-sm-3 text-right">` + element.updatedAt + `</small>
                                </div>
                                <p className="mb-1 text2line">
                                    ` + mieuta + `
                                </p>
                                <p><img src="` + element.actor.image + `" alt="" className="user-avatar"><b>` + element.actor.username + `</b></p>
                            </a>
                        `)
                    });
                }
                resultSearch.html(allSearch);
                updateTimeSearch();
            });
        }
    });

    closeButton.on("click", () => {
        formSearch[0].reset();
        resultSearch.html("");
    })

  })
</script> */}