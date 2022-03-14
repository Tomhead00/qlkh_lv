import {Link} from 'react-router-dom'
import axios from "axios"
import { useState, useLayoutEffect } from 'react'
import {isValidHttpUrl} from './Func'

const {REACT_APP_SERVER} = process.env

function Itemnav({user}) {
    // const [user, setUser] = useState([]);

    // useLayoutEffect(() => {
    //     axios({
    //         method: "get",
    //         withCredentials: true,
    //         url: `${REACT_APP_SERVER}/account/getUser`
    //     })
    //     .then(ketqua => {
    //         // console.log(ketqua.data.user, user);
    //         if (JSON.stringify(ketqua.data.user) !== JSON.stringify(user))
    //             setUser(ketqua.data.user)
    //     })
    // })

    const handlemodal = () => {
        document.getElementById("infor").click();
    }

    const logOut = () => {
        axios({
            method: "post",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/logout`
        })
        .then(ketqua => {
            // setUser(ketqua.data)
            // console.log(ketqua.data);
        })
        document.getElementById("exampleModal").click();
        window.location.reload();
    }

    if (!user) {
        return (
            <Link className="nav-link ml-4" to="/account"><b>Đăng nhập</b></Link>
        )
    } else return (
        <div>
            <a className="nav-link dropdown-toggle" href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <img src={isValidHttpUrl(user.image) ? user.image : `${REACT_APP_SERVER + user.image}`} alt="" className="user-avatar" />
                <b>{user.username}</b>
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                {user.role === 'admin' &&
                    <div>
                        <Link className="dropdown-item text-danger" to="/manager/account">Quản lý tài khoản</Link>
                        <div className="dropdown-divider"></div>
                        <Link className="dropdown-item text-danger" to="/manager/courses">Quản lý khóa học</Link>
                        <div className="dropdown-divider"></div>
                    </div>
                }
                <Link className="dropdown-item" to="#" data-toggle="modal" data-target="#infor">Thông tin tài khoản</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/me/stored/courses">Khóa học của tôi</Link>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" data-toggle="modal" data-target="#exampleModal" href="/#">Đăng xuất</a>
            </div>
            
            <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Đăng xuất</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            Bạn có chắc muốn đăng xuất?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-danger" id="btn-logout" onClick={logOut}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <form method="POST" id="form-submit" action="/account/logout"></form> */}

            <div className="modal fade bd-example-modal-lg" id="infor">
                <div className="modal-dialog modal-lg inforuser modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title"><b>Thông tin tài khoản</b></h4>
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-4 d-flex justify-content-center p-4">
                                    <img src={isValidHttpUrl(user.image) ? user.image : `${REACT_APP_SERVER + user.image}`} alt="image" width="236" height="236" />
                                </div>
                                <div className="col-md-8 ml-auto pt-5">
                                    <h5>Tên tài khoản: <span className="userName">{user.username}</span></h5>
                                    <h5>Email: <span className="email">{user.email}</span></h5>
                                    <h5>Giới tính: <span className="gioiTinh">{user.gender}</span></h5>
                                    <h5>SĐT: <span className="sdt">{user.phone}</span></h5>
                                    <h5>Địa chỉ: <span className="diaChi">{user.address}</span></h5>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <Link className="btn btn-warning" title="Cập nhật thông tin" style={{textDecoration: "none", color: "white"}} to={"account/edit/" + user._id} onClick={handlemodal}>Cập nhật thông tin</Link>
                            <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Itemnav