import {Routes, Route, useLocation } from 'react-router-dom'
import App from './App'
import HomePage from "./resources/home/home"
import {useEffect} from 'react'

const {REACT_APP_SERVER} = process.env

function Redirect() {
    const location = useLocation();
    useEffect(() => {
        // console.log(location.pathname);
        if (location.pathname === "/")
            document.body.style.backgroundImage = `url('${REACT_APP_SERVER}/img/bg-masthead.jpg')`
        else
            document.body.style.backgroundImage = null
    }, [location.pathname])

    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />}/>
                <Route path="/*" element={<App />} />
            </Routes>
        </div>
    )
}

export default Redirect