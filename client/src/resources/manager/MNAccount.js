import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {isValidHttpUrl} from "../../components/Func"

const {REACT_APP_SERVER} = process.env

function MNAccount () {
    // Khai báo
    const location = useLocation()
    const [ID, setID] = useState('')
    const [admin, setAdmin] = useState()
    const [member, setMember] = useState()
    const navigate = useNavigate()
    const icons = useRef({
        default: 'oi oi-elevator',
        asc: 'oi oi-sort-ascending',
        desc: 'oi oi-sort-descending',
    });
    const types = useRef({
        asc: 'desc',
        desc: 'asc',
    })
    const [column, setColumn] = useState([
        {icon: icons.current.default, type: "desc"},
        {icon: icons.current.default, type: "desc"},
        {icon: icons.current.default, type: "desc"},
        {icon: icons.current.default, type: "desc"},
        {icon: icons.current.default, type: "desc"},
    ]);

    // function
    useEffect(() => {
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/getUser`
        })
        .then(ketqua => {
            if(ketqua.data.user.role !== "admin") navigate("/courses")
        })
    }, [])

    // console.log(user);

    const sort = (num) => (e) => {
        let columnNew = column
        for(let index = 0; index < 5; index++) {
          if (index === num) continue
          else
            columnNew[index].icon = icons.current.default
            columnNew[index].type = "desc"
        }
        columnNew[num].type = types.current[columnNew[num].type]
        columnNew[num].icon = icons.current[columnNew[num].type]
        setColumn(columnNew)
    }

    const refreshAdmin = (e) => {
        axios({
          method: "get",
          withCredentials: true,
          data: {},
          url: `${REACT_APP_SERVER}/manager/admin`
        })
        .then(ketqua => {
            let result = ketqua.data
            setAdmin(result)
        })
    }
    const refreshMember = (e) => {
        axios({
          method: "get",
          withCredentials: true,
          data: {},
          url: `${REACT_APP_SERVER}/manager/member${location.search}`
        })
        .then(ketqua => {
            let result = ketqua.data[0]
            setMember(result)
        })
    }
    
    useEffect(() => {
        refreshAdmin()
        refreshMember()
    }, [location.search])

    const rmAdmin = (ID) => (e) => {
        setID(ID)
        axios({
            method: "post",
            withCredentials: true,
            data: {},
            url: `${REACT_APP_SERVER}/manager/${ID}/down`
        })
        .then(ketqua => {
            console.log(ketqua.data);
            if(ketqua.data) {
                window.location.reload();
            }
            else {
                alert("Không thể hủy quyền quản trị ở thời điểm hiện tại!")
            }
        })
    }

    const addADmin = () => {
        axios({
            method: "post",
            withCredentials: true,
            data: {},
            url: `${REACT_APP_SERVER}/manager/${ID}/up`
        })
        .then(ketqua => {
            console.log(ketqua.data);
            if(ketqua.data) {
                window.location.reload();
            }
            else {
                alert("Không thể cấp quyền quản trị ở thời điểm hiện tại do đã đủ số lượng admin!")
                document.getElementById("block-user-admin").click()

            }
        })
    }

    const blockUser = () => {
        axios({
            method: "delete",
            withCredentials: true,
            data: {},
            url: `${REACT_APP_SERVER}/manager/${ID}`
        })
        .then(ketqua => {
            console.log(ketqua.data);
            if(ketqua.data) {
                window.location.reload();
            }
            else {
                alert("Khóa người dùng thất bại. Vui lòng thử lại!")
                document.getElementById("block-user-modal").click()
            }
        })
    }

    document.title = "Quản lý tài khoản"
    return (
        <div>
            <div className="container">
                <div className="container-xl">
                    <div className="row mt-3">
                        <h3 className="mb-0 col-sm-8"><b>Quản lý thành viên</b></h3>
                        <div className="col-sm-4 text-right">
                            <Link to="/courses" className="btn btn-success btn-sm ml-auto mr-2" title="Quay lại khóa học"><i className="fas fa-play"></i> khóa học</Link>
                            <Link to="/manager/account/blocked" className="btn btn-danger btn-sm" title="Thành viên bị khóa"><i className="fas fa-lock"></i></Link>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <h2><b>Administrator</b></h2>
                                    <p className="mb-0 mt-2"><b>Total:</b> <span className="totalAd">{(admin) ? (admin.length):("N/A")}</span>/5</p>
                                </div>
                            </div>
                            <table className="table table-striped table-hover table-bordered">
                                <thead>
                                    <tr className="text-center">
                                        <th scope="col">STT</th>
                                        <th scope="col">Tên tài khoản</th>
                                        <th scope="col">Email</th>
                                        <th scope="col" width="200px">Giới tính</th>
                                        <th scope="col">SĐT</th>
                                        <th scope="col">Địa chỉ</th>
                                        <th scope="col" width="150px">Công cụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(admin) ?
                                    (
                                        admin.map((admin, index) => (
                                            <tr key={admin._id}>
                                                <td>{index+1}</td>
                                                <td className="accountAd">
                                                    <img src={(isValidHttpUrl(admin.image) ? admin.image : `${REACT_APP_SERVER + admin.image}`)} alt="" className="user-avatar" />
                                                    <b>{admin.username}</b>
                                                </td>
                                                <td>{admin.email}</td>
                                                <td>{admin.gender}</td>
                                                <td>{admin.phone}</td>
                                                <td>{admin.address}</td>
                                                <td>
                                                    <Link to="#" className="view down" title="Hủy quyền admin"><i className="fas fa-arrow-down" onClick={rmAdmin(admin._id)}></i></Link>
                                                    <Link to={`/account/edit/${admin._id}`} className="edit" title="Sửa" data-toggle="tooltip"><i className="fas fa-user-edit"></i></Link>
                                                    <Link to="#" className="delete" title="Khóa" data-toggle="modal" data-target="#block-user-model" onClick={() => {setID(admin._id)}}><i className="fas fa-ban"></i></Link>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                    :
                                    (
                                        <tr>
                                            <td colSpan="7" className="text-center"> 
                                                Hệ thống chưa ghi nhận người dùng admin nào ^.^!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>  
                </div> 

                <div className="container-xl">
                    <div className="table-responsive">
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <h2><b>Members</b></h2>
                                    <p className="mb-0 mt-2"><b>Total:</b> <span className="totalUser">{(member) ? (member.length):("N/A")}</span></p>
                                </div>
                            </div>
                            <table className="table table-striped table-hover table-bordered">
                                <thead>
                                <tr className="text-center">
                                        <th scope="col">STT</th>
                                        <th scope="col">Tên tài khoản <Link to={`?_sort&column=username&type=${column[0].type}`} onClick={sort(0)}> <span className={column[0].icon}></span></Link></th>
                                        <th scope="col">Email <Link to={`?_sort&column=email&type=${column[1].type}`} onClick={sort(1)}> <span className={column[1].icon}></span></Link></th>
                                        <th scope="col" width="200px">Giới tính<Link to={`?_sort&column=gender&type=${column[2].type}`} onClick={sort(2)}> <span className={column[2].icon}></span></Link></th>
                                        <th scope="col">SĐT<Link to={`?_sort&column=phone&type=${column[3].type}`} onClick={sort(3)}> <span className={column[3].icon}></span></Link></th>
                                        <th scope="col">Địa chỉ<Link to={`?_sort&column=address&type=${column[4].type}`} onClick={sort(4)}> <span className={column[4].icon}></span></Link></th>
                                        <th scope="col" width="150px">Công cụ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(member) ?
                                    (
                                        member.map((member, index) => (
                                            <tr key={member._id}>
                                                <td>{index+1}</td>
                                                <td className="accountAd">
                                                    <img src={(isValidHttpUrl(member.image) ? member.image : `${REACT_APP_SERVER + member.image}`)} alt="" className="user-avatar" />
                                                    <b>{member.username}</b>
                                                </td>
                                                <td>{member.email}</td>
                                                <td>{member.gender}</td>
                                                <td>{member.phone}</td>
                                                <td>{member.address}</td>
                                                <td>
                                                    <Link to="#" className="view down" title="Cấp quyền admin" data-toggle="modal" data-target="#block-user-admin" onClick={() => {setID(member._id)}}><i className="fas fa-arrow-up"></i></Link>
                                                    <Link to={`/account/edit/${member._id}`} className="edit" title="Sửa" data-toggle="tooltip"><i className="fas fa-user-edit"></i></Link>
                                                    <Link to="#" className="delete" title="Khóa" data-toggle="modal" data-target="#block-user-model" onClick={() => {setID(member._id)}}><i className="fas fa-ban"></i></Link>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                    :
                                    (
                                        <tr>
                                            <td colSpan="7" className="text-center"> 
                                                Hệ thống chưa ghi nhận người dùng member nào ^.^!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>  
                </div> 
            </div>

            <div id="block-user-model" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Khóa tài khoản này?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn có chắc muốn khóa tài khoản này?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary close-ques" data-dismiss="modal">Hủy</button>
                        <button id="btn-block-user" type="button" className="btn btn-danger" onClick={blockUser}>Xác nhận</button>
                    </div>
                    </div>
                </div>
            </div>

            <div id="block-user-admin" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Cấp quyền quản trị cho tài khoản này?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Hành động này sẽ cấp quyền quản trị cho tài khoản này, bạn vẫn muốn tiếp tục?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary close-ques" data-dismiss="modal">Hủy</button>
                        <button id="btn-block-user" type="button" className="btn btn-danger" onClick={addADmin}>Xác nhận</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MNAccount