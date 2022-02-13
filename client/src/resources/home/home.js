import './home.scss'
// import clsx from 'clsx'
import {Link} from 'react-router-dom'
import Nav from '../../components/nav/Nav'
import { useEffect } from 'react';

function Home() {

  useEffect(() => {
    document.title = "Trang chủ"
  }, [])

  return (
    <div className="Home">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <Nav />
      </nav>

      <div className="content">
        <h1>Xin chào mọi người!</h1>
        <Link to="./courses" className="btn btn-success btn-lg" style={{fontWeight: "bold", textDecoration: "none", color: "white",}}>Bắt đầu!</Link>
      </div>
    </div>
  )
}

export default Home