import './home.scss'
// import clsx from 'clsx'
import {Link} from 'react-router-dom'
import Nav from '../../components/nav/Nav'
import { useEffect, useState } from 'react';
import axios from "axios"

const {REACT_APP_SERVER} = process.env


function Home() {
  const [user, setUser] = useState();

  useEffect(() => {
    document.title = "Trang chủ"
    axios({
      method: "get",
      withCredentials: true,
      url: `${REACT_APP_SERVER}/account/getUser`
    })
    .then(ketqua => {
      if(ketqua.data.user) {
        setUser(ketqua.data.user)
      }
    })
  }, [])

  return (
    <div className="Home">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <Nav user={user}/>
      </nav>

      <div className="content">
        <h1>Xin chào mọi người!</h1>
        <Link to="./courses" className="btn btn-success btn-lg" style={{fontWeight: "bold", textDecoration: "none", color: "white",}}>Bắt đầu!</Link>
      </div>
    </div>
  )
}

export default Home