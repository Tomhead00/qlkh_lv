import { useNavigate, useLocation, Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect } from "react"
const {REACT_APP_SERVER} = process.env


function ResetPass() {
    document.title = 'Khôi phục mật khẩu'
    const location = useLocation();


    const repassword = $("#user-repeatpass");
    const alert_password = $("#alert-password");

    const [passwordReset, setpasswordReset] = useState('')
    const [repasswordReset, setrepasswordReset] = useState('')

    const handlePasswordReset = (e) => {
        setpasswordReset(e.target.value)
    }
    const handleRePasswordReset = (e) => {
        setrepasswordReset(e.target.value)
    }

    useEffect(() => {
        if(passwordReset != repasswordReset && repasswordReset != '') {
            repassword.attr('style', 'border-color: red');
            alert_password.text("Mật khẩu nhập lại chưa trùng khớp!")
        } else {
            repassword.attr('style', false);
            alert_password.text("")

        }
    }, [passwordReset, repasswordReset])

    const submit = () => {
        $('#submit').submit(function(e){
            return false;
        });

        if (passwordReset != '' && repasswordReset != '' && repasswordReset === passwordReset) {
            axios({
                method: "post",
                data: {
                    password: passwordReset
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER + location.pathname}`
            })
            .then(ketqua => {
                console.log(ketqua.data);
                alert_password.text(ketqua.data)
            })
        }
    }

    return (
        <div id="logreg-forms">
            <form method="POST" action="/#" id="submit">
                <h3 style={{textAlign: "center"}}>Khôi phục mật khẩu</h3>
                <br />
                <input type="password" name="password" id="user-pass" className="form-control" placeholder="New password" required onChange={handlePasswordReset} value={passwordReset}/>
                <input type="password" id="user-repeatpass" className="form-control" placeholder="Confirm Password" required onChange={handleRePasswordReset} value={repasswordReset} />
                <p id="alert-password" className='text-center mt-3' style={{display: "block", color: "red"}}></p>
                <div className="input-group">
                    <button className="btn btn-md btn-block submit" type="submit" onClick={submit}><i className="fas fa-user-plus"></i>Xác nhận</button>
                    <Link className="btn btn-md btn-block text-danger" type="submit" to="/account"><i className="fas fa-user-plus"></i>Đăng nhập</Link>
                </div>
            </form>
            <br />
        </div>
    )
}

export default ResetPass