import {Link} from 'react-router-dom'
import axios from "axios"
import { useState, useLayoutEffect } from 'react'
import {isValidHttpUrl} from './Func'

const {REACT_APP_SERVER} = process.env

function Notification({user}) {
    // console.log(user);
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

    return (
        <div>
            {/* <Link to="#">
                <span><i className="fas text-white fa-bell"></i></span>
                <span className="badge">3</span>
            </Link> */}
            <a href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span><i className="fas text-white fa-bell"></i></span>
                <span className="badge">3</span>
            </a>
            <div className="dropdown-menu dropdown-menu-right" style={{width: '450px'}} aria-labelledby="navbarDropdown">
                <div className="list-group">
                    <h5 className='ml-3 mt-2 mb-2'><b>Thông báo</b></h5>
                    <a href="#" className="list-group-item list-group-item-action" aria-current="true">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small>3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small>Donec id elit non mi porta.</small>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small className="text-muted">Donec id elit non mi porta.</small>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small className="text-muted">Donec id elit non mi porta.</small>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small className="text-muted">Donec id elit non mi porta.</small>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small className="text-muted">Donec id elit non mi porta.</small>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action">
                        <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">List group item heading</h5>
                        <small className="text-muted">3 days ago</small>
                        </div>
                        <p className="mb-1">
                        Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus
                        varius blandit.
                        </p>
                        <small className="text-muted">Donec id elit non mi porta.</small>
                    </a>
                </div>
                {/* <Link className="dropdown-item" to="#" data-toggle="modal" data-target="#infor">Thông tin tài khoản</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/me/stored/courses">Khóa học của tôi</Link>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" data-toggle="modal" data-target="#exampleModal" href="/#">Đăng xuất</a> */}
            </div>
        </div>
    )
}

export default Notification