import logo from './logo.svg';
import './App.scss';
import {Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react';
import axios from "axios"

import Nav from './components/nav/Nav'
import Account from './resources/user/Account';
import ResetPass from './resources/user/ResetPass';
import Edit from './resources/user/Edit';
import Courses from './resources/courses/Courses';
import CoursesNew from './resources/courses/CoursesNew';
import CoursesPopular from './resources/courses/CoursesPopular';
import Show from './resources/courses/Show';
import StoredCourses from './resources/me/StoredCourses';
import TrashCourses from './resources/me/TrashCourses';
import EditCourse from './resources/me/EditCourse';
import AddVideo from './resources/me/AddVideo';
import UpdateVideo from './resources/me/UpdateVideo';
import TrashVideo from './resources/me/TrashVideo';
import TrashMnCourses from './resources/manager/TrashMnCourses';
import MNAccount from './resources/manager/MNAccount';
import BlockAccount from './resources/manager/BlockAccount';
import MNCourses from './resources/manager/MNCourses';

const {REACT_APP_SERVER} = process.env

function App() {
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
        <Route path="/courses/show/:slug" element={check ? <Show />:<Navigate to="/account"/>} />
        <Route path="/courses/CoursesNew" element={check ? <CoursesNew />:<Navigate to="/account"/>} />
        <Route path="/courses/CoursesPopular" element={check ? <CoursesPopular />:<Navigate to="/account"/>} />
        <Route path="/courses/*" element={check ? <Courses />:<Navigate to="/account"/>} />

        {/* me */}
        {/* store course */}
        <Route path="/me/stored/courses" element={check ? <StoredCourses />:<Navigate to="/account"/>} />
        {/* trash course */}
        <Route path="/me/trash/courses" element={check ? <TrashCourses />:<Navigate to="/account"/>} />
        {/* Edit Course */}
        <Route path="/me/stored/:id/EditCourse" element={check ? <EditCourse />:<Navigate to="/account"/>} />
        {/* Add Video */}
        <Route path="/me/stored/:id/EditCourse/AddVideo" element={check ? <AddVideo />:<Navigate to="/account"/>}/>
        {/* Update Video */}
        <Route path="/me/stored/:id/EditCourse/:_id/update" element={check ? <UpdateVideo />:<Navigate to="/account"/>}/>
        {/* Trash video */}
        <Route path="/me/trash/:id" element={check ? <TrashVideo />:<Navigate to="/account"/>}/>

        {/* Manager */}
        {/* Quản lý khóa học */}
        <Route path="/manager/courses" element={check ? <MNCourses />:<Navigate to="/account"/>}/>
        <Route path="/manager/TrashMnCourses" element={check ? <TrashMnCourses />:<Navigate to="/account"/>}/>
        {/* Quản lý tài khoản */}
        <Route path="/manager/account" element={check ? <MNAccount />:<Navigate to="/account"/>}/>
        <Route path="/manager/account/blocked" element={check ? <BlockAccount />:<Navigate to="/account"/>}/>

      </Routes>
    </div>
  );
}

export default App;
