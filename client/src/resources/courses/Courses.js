import { useNavigate, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl, progessBar} from "../../components/Func"
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
    const [choice, setChoice] = useState({});

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
                            // console.log(ketqua.data)
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

    console.log(choice);

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
                                                <Link to={`/courses/show/${cjoin.slug}`} onClick={navi(`${cjoin.slug}`)}>
                                                    <h5 className="card-title">{cjoin.name}</h5>
                                                </Link>
                                                <div className="card-text mt mb-3">{
                                                    cjoin.description.split('\n').map(
                                                        (str,index) => <div key={index}>{str}</div>)
                                                }</div>
                                                <p className="mb-3">{cjoin.level} | <i className="fas fa-clock"></i> {moment.utc(cjoin.time*1000).format('HH:mm:ss')}</p>
                                                <p><img src={isValidHttpUrl(cjoin.actor.image) ? cjoin.actor.image : `${REACT_APP_SERVER + cjoin.actor.image}`} className="user-avatar"  alt={cjoin.actor.image} /><b>{cjoin.actor.username}</b></p>
                                                {/* {progessBar(cjoin.video,cjoin.user)} */}
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
                                                {/* {progessBar(cupdate.video,cupdate.user)} */}
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
                                                {/* {progessBar(cpopular.video,cpopular.user)} */}
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
                                                {/* {progessBar(canother.video,canother.user)} */}
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
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Tham gia khóa học?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            <div className="col-6">
                                <h5>Nội dung khóa học:</h5>
                                <div className="accordion" id="accordionPanelsStayOpenExample">
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingOne">
                                        <button className="accordion-button" type="button" data-mdb-toggle="collapse" data-mdb-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                                            Accordion Item #1
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                                            <div className="accordion-body">
                                                <strong>This is the first item's accordion body.</strong> It is shown by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingTwo">
                                        <button className="accordion-button collapsed" type="button" data-mdb-toggle="collapse" data-mdb-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                                            Accordion Item #2
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo">
                                            <div className="accordion-body">
                                                <strong>This is the second item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accordion-item">
                                        <h2 className="accordion-header" id="headingThree">
                                        <button className="accordion-button collapsed" type="button" data-mdb-toggle="collapse" data-mdb-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                                            Accordion Item #3
                                        </button>
                                        </h2>
                                        <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree">
                                            <div className="accordion-body">
                                                <strong>This is the third item's accordion body.</strong> It is hidden by default,
                                                until the collapse plugin adds the appropriate classes that we use to style each
                                                element. These classes control the overall appearance, as well as the showing and
                                                hiding via CSS transitions. You can modify any of this with custom CSS or overriding
                                                our default variables. It's also worth noting that just about any HTML can go within
                                                the <code>.accordion-body</code>, though the transition does limit overflow.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6" style={{wordWrap:" break-word"}}>
                                     <p className="mb-0"><b>Yêu cầu:</b></p>
                                    <div className="mb-3">
                                        <div key='1'>qweqweqwdqwdqdwqdqwdqwdqwdqwdqwdqwdaasdqw sdfl alsd wd alkwj á</div>
                                        <div key='2'>qweqweqwdqwdqdwqdqwdqwdqwdqwdqwdqwdaasdqw sdfl alsd wd alkwj á</div>
                                    </div>
                                    <p className="mb-0"><b>Kết quả đạt được:</b></p>
                                    <div className="mb-3">
                                        <div key='1'>qweqweqwdqwdqdwqdqwdqwdqwdqwdqwdqwdaasdqw sdfl alsd wd alkwj á</div>
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