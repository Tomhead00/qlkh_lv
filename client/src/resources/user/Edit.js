import { useNavigate, useLocation, Link, useParams } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
import {isValidHttpUrl} from "../../components/nav/Func"

const {REACT_APP_SERVER} = process.env

function Edit() {
    document.title = "Cập nhật thông tin tài khoản"
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    // console.log(location, REACT_APP_SERVER);
    const alert = $("#alert");
    const selectGT = $("#GT");
    const cancelhtmlForm = $(".btn.btn-danger.cancel.float-right");
    const htmlFormEdit = $(".htmlFormEdit");
    const passNew = $("#passNew");
    const passRe = $("#passRe")
    const alertPass = $("#alertPass");
    const inputFile = $("input[type=file]");
    const image = $("#image");

    const [user, setUser] = useState(
        {
            email: '',
            username: '',
            password: '',
            image: '',
            role: '',
            gender: '',
            phone: '',
            address: '',
            joined: [],
        }
    );
    const [psw, setPsw] = useState('');
    const [newpsw, setNewPsw] = useState('');
    const [renewpsw, setReNewPsw] = useState('');

    useEffect(() => {
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/getUser`
        })
        .then(ketqua => {
            // console.log(ketqua.data.user._id, params.slug, ketqua.data.user.role);
            if(!(ketqua.data.user._id === params.slug || ketqua.data.user.role === "admin")) {
                navigate("/courses")
            }
        })
    })

    // update user
    const handleEmail = (e) => {
        setUser({...user, [e.target.name]:e.target.value})
    }
    // image input
    const upLoadImage = (e) => {
        setUser({...user, image: e.target.files[0]});

        var file = inputFile.get(0).files[0]
        console.log(file);
        if(file) {
            var reader = new FileReader();
            reader.onload = function() {
              image.attr("src", reader.result);
            }
            reader.readAsDataURL(file);
        }
    }

    // submit user
    const submit = () => {
        $(".formEdit").submit(function(e){
            return false;
        });
        const form = document.getElementById("formData")
        const formData = new FormData(form);

        axios.put(`${REACT_APP_SERVER + location.pathname}`, formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(ketqua => {
            console.log(ketqua.data);
            if(ketqua.data) {
                $("#alert").text("Cập nhật thông tin thành công!")
            } else {
                $("#alert").text("Cập nhật thông tin thất bại! Vui lòng thử lại!")
            }
            document.getElementById("cancel").click()
        })
    }

    useEffect(() => {
        axios({
            method: "get",
            withCredentials: true,
            url: `${REACT_APP_SERVER + location.pathname}`
        })
        .then(ketqua => {
            // console.log(ketqua.data);
            setUser(ketqua.data)
        })
    },[])

    useEffect(() => {
        selectGT.val(user.gender).change()
    },[selectGT.val(user.gender)])

    // dat lai mat khau
    const handlePassword = (e) => {
        setPsw(e.target.value)
    }
    const handleNewPassword = (e) => {
        setNewPsw(e.target.value)
    }
    const handleReNewPassword = (e) => {
        setReNewPsw(e.target.value)
        if (newpsw !== e.target.value) {
            document.getElementById("alertPass").innerHTML = "Mật khẩu nhập lại chưa trùng!"
        } else {
            document.getElementById("alertPass").innerHTML = ""
        }
    }

    const DMK = () => {
        $("#formDMK").submit(function(e){
            return false;
        });
        if (psw !== '' && newpsw !=='' && renewpsw !== '' && newpsw === renewpsw) {
            axios({
                method: "put",
                data: {
                    passOld: psw,
                    passNew: newpsw,
    
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/edit/password/${user._id}`
            })
            .then(ketqua => {
                document.getElementById("alert").innerHTML = ketqua.data
                document.getElementById("DMK").click()
                setNewPsw('')
                setPsw('')
                setReNewPsw('')
            })
        }
    }

    return (
        <div>
            <div className="container p">
                <div className="m-5 ml-4 mr-4">
                    <h3 className="text-center"><b>Cập nhật thông tin tài khoản</b></h3>
                    <p id="alert" style={{display: "block", color: "red", textAlign: "center"}}></p>

                    <form className="mt-4 formEdit" encType="multipart/form-data" id="formData">
                        <div className="row">
                            <div className="col-4 align-self-center justify-content-center">
                                <img className="ml-3" id="image" src={isValidHttpUrl(user.image) ? user.image : `${REACT_APP_SERVER + user.image}`} alt="image" width="260" height="240" style={{border: "2px solid"}}/>
                                <input type='file' className="mt-3" name="myFile" accept="image/*" onChange={upLoadImage}/>
                            </div>
                            <div className="col-7 ml-2">
                                <div className="form-group">
                                    <label htmlFor="name">Tên tài khoản:</label>
                                    <input type="text" className="form-control" value={user.username} id="username" name="username" onChange={handleEmail}/>
                                    {/* <input type="text" className="form-control" value="" id="url" name="url" style={{display: "none"}} onChange={handleEmail}/> */}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="mieuta">Giới tính:</label>
                                    <select className="form-control" id="GT" name="gender" onChange={handleEmail}>
                                        <option value=""></option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="videoID">Email:</label>
                                    <input type="text" className="form-control" value={user.email} id="email" name="email" disabled onChange={handleEmail}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="videoID">SĐT:</label>
                                    <input type="number" className="form-control" value={user.phone || ''} id="SDT" name="phone" onChange={handleEmail}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="videoID">Địa chỉ:</label>
                                    <input type="text" className="form-control" value={user.address || ''} id="address" name="address" onChange={handleEmail}/>
                                </div>
                                <div>
                                    <button type="button" className="btn btn-success DMK" data-toggle="modal" data-target="#DMK">Đổi mật khẩu</button>
                                    <button type="submit" className="btn btn-primary float-right ml-2" onClick={submit}>Lưu lại</button>
                                    <button type="button" className="btn btn-danger cancel float-right" id="cancel" onClick={() => navigate(-1)}>Quay lại</button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>

            <div className="modal fade" id="DMK">
                <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                
                    <div className="modal-header">
                    <h4 className="modal-title">Đổi mật khẩu:</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>

                    <form method="POST" action="/account/edit/password/{{user._id}}?_method=PUT" id="formDMK">
                    <div className="modal-body">
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Nhập mật khẩu cũ (*):</td>
                                    <td>
                                        <input type="password" name="passOld" className="passOld" id="passOld" required onChange={handlePassword} value={psw}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Mật khẩu mới(*):</td>
                                    <td>
                                        <input type="password" name="passNew" className="passNew" id="passNew" required onChange={handleNewPassword} value={newpsw}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Nhập lại Mật khẩu (*):</td>
                                    <td>
                                        <input type="password" name="passRe" className="passRe" id="passRe" required onChange={handleReNewPassword} value={renewpsw}/>
                                        <small id="alertPass" className="mt-2" style={{display: "block", color: "red"}}></small>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>   
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
                        <button type="submit" className="btn btn-success" onClick={DMK}>Cập nhật</button>
                    </div>
                    </form>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Edit