import logo from './logo.svg';
import './App.scss';
import {Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Nav from './components/nav/Nav'
import Account from './resources/user/Account';
import ResetPass from './resources/user/ResetPass';
import Edit from './resources/user/Edit';
import Courses from './resources/courses/Courses';
import { useEffect, useRef, useState } from 'react';
import axios from "axios"

const {REACT_APP_SERVER} = process.env

console.log("app");

function App() {
  // const location = useLocation()
  // console.log(location.pathname);

  const [check, setCheck] = useState(true);

  useEffect( () => {
    axios({
      method: "get",
      withCredentials: true,
      url: `${REACT_APP_SERVER}/account/getUser`
    })
    .then(ketqua => {
      if(ketqua.data.user) setCheck(true)
      else setCheck(false)
    })
  }, [])

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Nav />
      </nav>

      <Routes>
        {/* Tài khoản */}
        {/* Quên mật khẩu */}
        <Route path="/account/password-reset/*" element={<ResetPass />} />
        {/* Cập nhật thông tin tài khoản */}
        <Route path="/account/edit/:slug" element={check ? <Edit/>:<Navigate to="/account"/>} />
        {/* Trường hợp còn lại */}
        <Route path="/account/*" element={<Account />} />

        {/* Khóa học */}
        <Route path="/courses/*" element={check ? <Courses />:<Navigate to="/account"/>} />
      </Routes>
    </div>
  );
}

export default App;
