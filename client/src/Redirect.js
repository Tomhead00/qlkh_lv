import {Routes, Route, useLocation} from 'react-router-dom'
import App from './App'
import HomePage from "./resources/home/home"
import LiveStream from "./resources/livestream/LiveStream"
import {useEffect} from 'react'
import { ContextProvider } from './components/SocketContext'

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
                <Route path="/livestream/:id" element={
                    <ContextProvider>
                        <LiveStream />
                    </ContextProvider>
                }/>
                <Route path="/*" element={<App />} />

                <Route path="/livestream/:id/:host" element={
                    <ContextProvider>
                        <LiveStream />
                    </ContextProvider>
                }/>
                <Route path="/*" element={<App />} />
            </Routes>
        </div>
    )
}

export default Redirect