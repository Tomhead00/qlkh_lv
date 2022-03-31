import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState, useEffect, useRef } from "react"
import {isValidHttpUrl} from "../../components/Func"
const {REACT_APP_SERVER} = process.env

function BlockAccount () {
    // Khai bao
    const location = useLocation()
    const [ID, setID] = useState('')
    const [blocked, setBlocked] = useState([])
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
    const refreshAccount = (e) => {
        axios({
          method: "get",
          withCredentials: true,
          data: {},
          url: `${REACT_APP_SERVER}/manager/blocked${location.search}`
        })
        .then(ketqua => {
            let result = ketqua.data[0]
            setBlocked(result)
        })
    }
    
    useEffect(() => {
        refreshAccount()
    }, [location.search])

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

    const restoreOne = (ID) => (e) => {
        axios({
            method: "patch",
            withCredentials: true,
            data: {},
            url: `${REACT_APP_SERVER}/manager/${ID}`
        })
        .then(ketqua => {
            if(ketqua.data) {
                refreshAccount()
            } else {
                alert("Thất bại. Vui lòng thử lại sau!")
            }
        })
    }

    const deleteAccount = () => {
        axios({
            method: "delete",
            withCredentials: true,
            data: {},
            url: `${REACT_APP_SERVER}/manager/${ID}/force`
        })
        .then(ketqua => {
            if(ketqua.data) {
                refreshAccount()
                document.getElementById("delete-user-model").click()
            } else {
                alert("Thất bại. Vui lòng thử lại sau!")
            }
        })
    }

    return (
        <div>
            <div className="container">
                <div className="container-xl">
                    <div className="row mt-3">
                        <h3 className="mb-0 col-sm-8"><b>Danh sách thành viên bị khóa</b></h3>
                        <div className="col-sm-4 text-right">
                            <Link to="/courses" className="btn btn-success btn-sm ml-auto mr-2" title="Quay lại khóa học"><i className="fas fa-play"></i> Khóa học</Link>
                            <Link to="/manager/account" className="btn btn-primary btn-sm ml-auto" title="Quay lại khóa học"><i className="fas fa-undo"></i> Quản lý thành viên</Link>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <div className="table-wrapper">
                            <div className="table-title">
                                <div className="row">
                                    <h2><b>Administrator</b></h2>
                                    <p className="mb-0 mt-2"><b>Total:</b> <span className="total">N/A</span></p>
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
                                    {(blocked.toString()) ?
                                        (
                                            blocked.map((blocked, index) => (
                                                <tr key={blocked._id}>
                                                    <td>{index+1}</td>
                                                    <td className="accountAd">
                                                        <img src={(isValidHttpUrl(blocked.image) ? blocked.image : `${REACT_APP_SERVER + blocked.image}`)} alt="" className="user-avatar" />
                                                        <b>{blocked.username}</b>
                                                    </td>
                                                    <td>{blocked.email}</td>
                                                    <td>{blocked.gender}</td>
                                                    <td>{blocked.phone}</td>
                                                    <td>{blocked.address}</td>
                                                    <td>
                                                        <Link to="#" className="view btn-restore" title="Khôi phục tài khoản" onClick={restoreOne(blocked._id)}><i className="fas fa-trash-restore"></i></Link>
                                                        <Link to="#" className="delete" title="Xóa tài khoản" data-toggle="modal" data-target="#delete-user-model" onClick={() => {setID(blocked._id)}}><i className="fas fa-trash-alt"></i></Link>                                                  
                                                    </td>
                                                </tr>
                                            ))
                                        )
                                        :
                                        (
                                            <tr>
                                                <td colSpan="7" className="text-center"> 
                                                    Hệ thống chưa ghi nhận người dùng nào trong mục này ^.^!
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>  
                </div>  
            </div>

            <div id="delete-user-model" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Xóa tài khoản này?</h5>
                        <button type="button" className="close close-ques" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>Bạn có chắc muốn xóa tài khoản này?</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary close-ques" data-dismiss="modal">Hủy</button>
                        <button id="btn-delete-user" type="button" className="btn btn-danger" onClick={deleteAccount}>Xác nhận</button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlockAccount