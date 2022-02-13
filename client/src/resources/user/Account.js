import { useNavigate, useLocation } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useLayoutEffect, useRef } from "react"

const {REACT_APP_SERVER} = process.env

function Account() {
    useLayoutEffect(() => {
        document.title = "Tài khoản"
      }, [])

    const repassword = $("#user-repeatpass");
    const alert_password = $("#alert-password");
    const alert_email = $("#alert-email");
    const email = $("#user-email");
    //register
    const formRegister = $(".form-signup")
    // login
    const emailInput = $("#inputEmail");
    const passwordInput = $("#inputPassword");
    const alertLogin = $("#alert-login");
    // Quen mat khau
    const formForgetPass = $("#forgetPass")


    const navigate = useNavigate();
    const location = useLocation();
    const alert = useRef()
    if(location.hash) {
       alert.current = `Đăng nhập thất bại! Vui lòng thử lại hoặc chọn phương thức đăng nhập khác!`
    }

    useEffect(() => {
        function toggleResetPswd(e){
            e.preventDefault();
            $('#logreg-forms .form-signin').toggle() // display:block or none
            $('#logreg-forms .form-reset').toggle() // display:block or none
        }
        function toggleSignUp(e){
            e.preventDefault();
            $('#logreg-forms .form-signin').toggle(); // display:block or none
            $('#logreg-forms .form-signup').toggle(); // display:block or none
        }
        $(()=>{
            // Login Register Form
            $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
            $('#logreg-forms #cancel_reset').click(toggleResetPswd);
            $('#logreg-forms #btn-signup').click(toggleSignUp);
            $('#logreg-forms #cancel_signup').click(toggleSignUp);
        })
        //login with facebook
        $('.btn.facebook-btn.social-btn').click(function(e) {
            window.location=`${REACT_APP_SERVER}/auth/facebook`
        })
        //login with gg
        $('.btn.google-btn.social-btn').click(function(e) {
            window.location=`${REACT_APP_SERVER}/auth/google`
        })
    }, [])

    const [emailLogin, setemailLogin] = useState('')
    const [passwordLogin, setpasswordLogin] = useState('')

    const [usernameRegister, setusernameRegister] = useState('')
    const [emailRegister, setemailRegister] = useState('')
    const [passwordRegister, setpasswordRegister] = useState('')
    const [repasswordRegister, setrepasswordRegister] = useState('')

    // Quen mat khau
    const [forgetPass, setforgetPass] = useState('')
    const handleForgetPass = (e) => {
        setforgetPass(e.target.value) 
    }
    const submitForgetPass = (e) => {
        formForgetPass.submit(function(e){
            return false;
        });

        if (forgetPass != '') {
            axios({
                method: "post",
                data: {
                    email: forgetPass
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/passwordReset`
            })
            .then(ketqua => {
                // console.log(ketqua.data);
                if(ketqua.data != null) {
                    document.getElementById("alert-forgetPass").innerHTML = ketqua.data
                }
            })
        }
    }

    // Dang nhap
    const handleEmailLogin = (e) => {
        // console.log(e.target.value);
        setemailLogin(e.target.value)
        
    }
    const handlePasswordLogin = (e) => {
        // console.log(e.target.value);
        setpasswordLogin(e.target.value)
    }
    const submitLogin = (e) => {
        $(".form-signin").submit(function(e){
            return false;
        });

        if (passwordInput.val() != '' && emailInput.val() != '') {
            axios({
                method: "post",
                data: {
                    email: emailLogin,
                    password: passwordLogin,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/login`
            })
            .then(ketqua => {
                passwordInput.attr('style','border-color: red');
                if (ketqua.data === "Sai mật khẩu!") {
                    passwordInput.val("");
                    passwordInput.focus();
                }
                else if (ketqua.data != null && ketqua.data != "/courses"){
                    emailInput.attr('style','border-color: red');
                    passwordInput.val("");
                    emailInput.val("");
                    emailInput.focus();
                }else if (ketqua.data === "Tài khoản đã bị khóa!"){
                    emailInput.attr('style','border-color: red');
                    emailInput.focus();
                }else {
                    window.location.replace(ketqua.data);
                }
                if (ketqua.data === '/courses') ketqua.data = "Đăng nhập thành công!"
                alertLogin.text(ketqua.data);
            })
        }
    }

    const handleEmailRegister = (e) => {
        // console.log(e.target.value);
        setemailRegister(e.target.value)
        axios({
            method: "post",
            data: {
                email: e.target.value,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/check_email`
        })
        .then(ketqua => {
            if (ketqua.data === 1) {
                alert_email.attr('style', 'display: inline; color: red');
                email.attr('style', 'border-color: red');

            } else {
                alert_email.attr('style', 'display: none');
                email.attr('style', false);
            }
        })
    }
    const handlePasswordRegister = (e) => {
        // console.log(e.target.value);
        setpasswordRegister(e.target.value)
    }
    const handleUsernameRegister = (e) => {
        // console.log(e.target.value);
        setusernameRegister(e.target.value)
    }
    const handleRePasswordRegister = (e) => {
        // console.log(e.target.value);
        setrepasswordRegister(e.target.value)
    }
    

    useEffect(() => {
        if(passwordRegister != repasswordRegister && repasswordRegister != '') {
            alert_password.attr('style', 'display: inline; color: red');
            repassword.attr('style', 'border-color: red');
        } else {
            alert_password.attr('style', 'display: none');
            repassword.attr('style', false);
        }
    }, [passwordRegister, repasswordRegister])

    const submitRegister = (e) => {
        formRegister.submit(function(e){
            return false;
        });

        if (usernameRegister != '' && emailRegister != '' && passwordRegister != '') {
            axios({
                method: "post",
                data: {
                    username: usernameRegister,
                    email: emailRegister,
                    password: passwordRegister,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/create`
            })
            .then(ketqua => {
                // console.log(ketqua.data);
                if(ketqua.data === "/account") {
                    document.getElementById("cancel_signup").click()
                    document.getElementById("alert-login").innerHTML = "Đăng ký thành công!"
                    setusernameRegister("")
                    setemailRegister("")
                    setpasswordRegister("")
                    setrepasswordRegister("")
                }
            })
        }
    }

    return (
    <div id="logreg-forms" >
        <form className="form-signin" method="POST" action="#">
            <h1 className="h3 mb-3 font-weight-normal" style={{textAlign: "center"}}> Đăng nhập</h1>
            <div className="social-login">
                <button className="btn facebook-btn social-btn logincss" type="button"><span><i className="fab fa-facebook-f"></i> Đăng nhập với Facebook</span> </button>
                <button className="btn google-btn social-btn logincss" type="button"><span><i className="fab fa-google-plus-g"></i> Đăng nhập với Google+</span> </button>
            </div>
            <p id="alertfb" style={{display: "block", color: "red", textAlign: "center"}}>{alert.current || ""}</p>
            <p style={{textAlign:"center"}}> Hoặc  </p>
            <div className="input-group">
                <input type="email" id="inputEmail" className="form-control" name="email" placeholder="Email address"autoFocus="" value={emailLogin} onChange={handleEmailLogin}  required/>
            </div>

            <div className="input-group">
                <input type="password" id="inputPassword" className="form-control" name="password" placeholder="Password" value={passwordLogin} onChange={handlePasswordLogin}  required/>
            </div>
            <p id="alert-login" className='mt-3' style={{display: "block", color: "red", textAlign: "center"}}></p>

            <div className="input-group">
                <button className="btn btn-md btn-rounded btn-block form-control submit" type="submit" onClick={submitLogin}><i className="fas fa-sign-in-alt"></i> Đăng nhập</button>
            </div>

            <a href="/#" id="forgot_pswd">Quên mật khẩu</a>
            <hr />
            <button className="btn btn-primary btn-block" type="button" id="btn-signup"><i className="fas fa-user-plus"></i> Tạo tài khoản mới</button>
        </form>

        <form action="/#" id="forgetPass" className="form-reset" method="POST">
            <input type="email" id="resetEmail" name="email" className="form-control" placeholder="Email address" required="" autoFocus="" onChange={handleForgetPass} value={forgetPass}/>
            <button className="btn btn-primary btn-block" type="submit" onClick={submitForgetPass}>Khôi phục mật khẩu</button>
            <p id="alert-forgetPass" className='mt-3' style={{display: "block", color: "red", textAlign: "center"}}></p>
            <a href="/#" id="cancel_reset"><i className="fas fa-angle-left"></i> Quay lại</a>
        </form>

        <form method="POST" action="#" className="form-signup">
            <div className="social-login">
                <button className="btn facebook-btn social-btn" type="button"><span><i className="fab fa-facebook-f"></i> Đăng nhập với Facebook</span> </button>
                <button className="btn google-btn social-btn" type="button"><span><i className="fab fa-google-plus-g"></i> Đăng nhập với Google+</span> </button>
            </div>

            <p style={{textAlign:'center'}}>Hoặc</p>

            <input type="text" name="username" id="user-name" className="form-control" placeholder="Full name" required="" autoFocus="" onChange={handleUsernameRegister} value={usernameRegister}  />
            <input type="email" name="email" id="user-email" className="form-control mb-2" placeholder="Email address" required autoFocus="" onChange={handleEmailRegister} value={emailRegister} />
            <p id="alert-email" style={{display: "none"}}>Email đã được đăng ký! Vui lòng thử lại!</p>
            <input type="password" name="password" id="user-pass" className="form-control mt-2" placeholder="Password" required autoFocus="" onChange={handlePasswordRegister} value={passwordRegister} />
            <input type="password" id="user-repeatpass" className="form-control mb-2" placeholder="Confirm Password" required autoFocus="" onChange={handleRePasswordRegister} value={repasswordRegister} />
            <p id="alert-password" style={{display: "none"}}>Chưa trùng, vui lòng thử lại!</p>
            <div className="input-group">
                <button className="btn btn-md btn-block submit register" type="submit" onClick={submitRegister}><i className="fas fa-user-plus"></i> Đăng ký</button>
            </div>

            <a href="/#" id="cancel_signup"><i className="fa fa-angle-left"></i> Quay lại</a>
        </form>
        <br />
    </div>
    )
}

export default Account