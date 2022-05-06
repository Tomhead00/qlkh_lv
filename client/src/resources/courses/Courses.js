import { useNavigate, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl, progessBar, getAllVideo} from "../../components/Func"
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function Courses() {
    document.title = "Khóa học"
    const navigate = useNavigate()

    const [cJoin, setCJoin] = useState([]);
    const [cUpdate, setCUpdate] = useState([]);
    const [cPopular, setCPopular] = useState([]);
    const [cAnother, setCAnother] = useState([]);
    const [search, setSearch] = useState('');
    const [choice , setChoice] = useState({});

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

    const searchCourses = (e) => {
        setSearch(e.target.value)
        axios({
            method: "post",
            withCredentials: true,
            data: {
                name: e.target.value
            },
            url: `${REACT_APP_SERVER}/courses/search`
        })
        .then(ketqua => {
            // console.log(ketqua.data, e.target.value, ketqua.data.length);
            let allSearch = "";
            if (ketqua.data.length === 0 && e.target.value !== '') {
                allSearch = `<p class="text-center list-group-item list-group-item-action"><i class="fas fa-search"></i> Không có kết quả cho từ khóa <b>`+ e.target.value +`</b></p>`
            }
            else {
                ketqua.data.map(element => {
                    // name.replace(/\n/g, "<br/>");
                    var regex = new RegExp(e.target.value, "gi");
                    if (!/[`~.<>;':"/[\]|{}()=_+-]/.test(e.target.value)) {
                        var name = element.name.replace(regex, "<span class='highlight'>"+regex.exec(element.description)+"</span>");
                        var mieuta = element.description.replace(regex, "<span class='highlight'>"+regex.exec(element.description)+"</span>");
                    }
                    allSearch += (`
                        <a href="courses/show/` + element.slug + `" class="list-group-item list-group-item-action" aria-current="true">
                            <div class="row">
                                    <h5 class="mb-1 text2line col-sm-9"><b>` + name + `</b></h5>
                                    <small class="timeSearch col-sm-3 text-right">` + moment(element.updatedAt).fromNow() + `</small>
                            </div>
                            <p class="mb-1 text2line">
                                ` + mieuta + `
                            </p>
                            <p><img src="` + (isValidHttpUrl(element.actor.image) ? element.actor.image : `${REACT_APP_SERVER + element.actor.image}`) + `" alt="" class="user-avatar"><b>` + element.actor.username + `</b></p>
                        </a>
                    `)
                });
            }
            $("#resultSearch").html(allSearch);
        })
    }
    
    const closeSearch = () => {
        setSearch('');
        $("#resultSearch").html('');
    }

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
            if (ketqua.data === 'banned') {
                alert("Bạn đã bị chặn và không thể tham gia khóa học này!")
            } else if (ketqua.data) {
                window.$("#ques-course-model").modal("toggle");
                $("#btn-thamgia-course").on('click', function thamGia() {
                    axios({
                        method: "post",
                        withCredentials: true,
                        url: `${REACT_APP_SERVER}/courses/thamGia/${string}`
                    })
                    .then(ketqua => {
                        if(ketqua.data) {
                            // console.log(ketqua.data)
                            window.$("#ques-course-model").modal("toggle");
                            navigate(`/courses/show/${string}`)
                        } else {
                            alert("Bạn đã bị chặn và không thể tham gia khóa học này!")
                        }
                    })
                })
            } else {
                navigate(`/courses/show/${string}`)
            }
        })
    }

    const closeModal = () => {
        window.$("#ques-course-model").modal("toggle");
    }


    return (
        <div>
            <div className="container">
                <div style={{position: "relative"}}>
                    <div className="row mt-4">
                        <form className="input-group d-flex justify-content-end" id="formSearch">
                            <div className="form-outline">
                                <input id="search-input form1" type="search" autoComplete="off" placeholder="Search..." style={{height: "35.44px"}} onChange={searchCourses} value={search}/>
                            </div>
                            <button id="close-button" type="button" className="btn btn-danger" onClick={closeSearch}>
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
                                            <Link to={`/courses/show/${cjoin.slug}`} onClick={navi(`${cjoin.slug}`, cjoin)}>
                                                <img className="card-img-top" src={cjoin.image} alt={cjoin.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cjoin.slug}`} onClick={navi(`${cjoin.slug}`, cjoin)}>
                                                    <h5 className="card-title">{cjoin.name}</h5>
                                                </Link>
                                                <div className="card-text mt mb-3">{
                                                    cjoin.description.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
                                                <p className="mb-3">{cjoin.level} | <i className="fas fa-clock"></i> {moment.utc(cjoin.time*1000).format('HH:mm:ss')}</p>
                                                <p><img src={isValidHttpUrl(cjoin.actor.image) ? cjoin.actor.image : `${REACT_APP_SERVER + cjoin.actor.image}`} className="user-avatar"  alt={cjoin.actor.image} /><b>{cjoin.actor.username}</b></p>
                                                {progessBar(getAllVideo(cjoin),cjoin.user)}
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
                        <Link className="col-sm-8 text-right" to="/courses/CoursesNew">Xem tất cả <i className="fas fa-angle-double-right"></i></Link>
                    </div>
                    <div className="row">
                        {cUpdate.toString() ? 
                            cUpdate.slice(0, 4).map((cupdate, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${cupdate.slug}`} onClick={navi(`${cupdate.slug}`, cupdate)}>
                                                <img className="card-img-top" src={cupdate.image} alt={cupdate.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cupdate.slug}`} onClick={navi(`${cupdate.slug}`, cupdate)}>
                                                    <h5 className="card-title">{cupdate.name}</h5>
                                                </Link>
                                                <div className="card-text mt mb-3">{
                                                    cupdate.description.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
                                                <p className="mb-3">{cupdate.level} | <i className="fas fa-clock"></i> {moment.utc(cupdate.time*1000).format('HH:mm:ss')}</p>
                                                <p><img src={isValidHttpUrl(cupdate.actor.image) ? cupdate.actor.image : `${REACT_APP_SERVER + cupdate.actor.image}`} className="user-avatar" /><b>{cupdate.actor.username}</b></p>
                                                {progessBar(getAllVideo(cupdate),cupdate.user)}
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
                        <Link className="col-sm-8 text-right" to="/courses/CoursesPopular">Xem tất cả <i className="fas fa-angle-double-right"></i></Link>
                    </div>
                    <div className="row">
                        {cPopular.toString() ? 
                            cPopular.slice(0, 4).map((cpopular, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`, cpopular)}>
                                                <img className="card-img-top" src={cpopular.image} alt={cpopular.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${cpopular.slug}`} onClick={navi(`${cpopular.slug}`, cpopular)}>
                                                    <h5 className="card-title">{cpopular.name}</h5>
                                                </Link>
                                                <div className="card-text mt mb-3">{
                                                    cpopular.description.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
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

                <div className="mt-4">
                    <div className="row">
                        <h3 className="mb-0 col-sm-4"><b>Các khóa học khác:</b></h3>
                    </div>
                    <div className="row">
                        {cAnother.toString() ? 
                            cAnother.map((canother, index) => (
                                    <div className="col-sm-3 col-lg-3 card-deck mt-4" key={index}>
                                        <div className="card card-course-item">
                                            <Link to={`/courses/show/${canother.slug}`} onClick={navi(`${canother.slug}`, canother)}>
                                                <img className="card-img-top" src={canother.image} alt={canother.name} />
                                            </Link>

                                            <div className="card-body">
                                                <Link to={`/courses/show/${canother.slug}`} onClick={navi(`${canother.slug}`, canother)}>
                                                    <h5 className="card-title">{canother.name}</h5>
                                                </Link>
                                                <div className="card-text mt mb-3">{
                                                    canother.description.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
                                                <p className="mb-3">{canother.level} | <i className="fas fa-clock"></i> {moment.utc(canother.time*1000).format('HH:mm:ss')}</p>
                                                <p><img src={isValidHttpUrl(canother.actor.image) ? canother.actor.image : `${REACT_APP_SERVER + canother.actor.image}`} className="user-avatar" /><b>{canother.actor.username}</b></p>
                                                {progessBar(getAllVideo(canother),canother.user)}
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

            {/* Modal */}
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
                                {Object.keys(choice).length && <p className="m-0 p-0"><i><small>Tổng thời lượng: {`(${moment.utc(choice.time*1000).format('HH:mm:ss')})`} {` - ${getAllVideo(choice).length} bài học`}</small></i></p>}
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

export default Courses