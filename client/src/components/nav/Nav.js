import { useRef } from 'react'
import {Link} from 'react-router-dom'
import Itemnav from './Itemnav'
import Notification from './Notification'

function Nav() {
    const test = useRef([{
        'id': 12,
        'name': "daxua",
    }])


    return (
        <div className="container">
            <Link className="navbar-brand" to="/"><b>QLKH</b></Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                    <Link className="nav-link ml-4" to="/"><b>Trang chủ</b></Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link ml-4" to="/courses"><b>Khóa học</b></Link>
                    </li>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-link notification mr-3 dropdown">
                        <Notification test={test}/>
                    </li>
                    <li className="nav-item dropdown">
                        <Itemnav />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Nav