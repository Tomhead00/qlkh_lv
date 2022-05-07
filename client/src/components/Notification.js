import axios from "axios"
import { useState, useEffect } from 'react'
import moment from "moment"

const {REACT_APP_SERVER} = process.env

function Notification({user}) {
    const [notification, setNotification] = useState([])



    useEffect(() => {
        const refeshNotification = () => {
            axios({
                method: "post",
                data: {
                    userID: user._id,
                },
                withCredentials: true,
                url: `${REACT_APP_SERVER}/account/showNotification`
            })
            .then(ketqua => {
                setNotification(ketqua.data)
            })
        }
        refeshNotification()
        const start = setInterval(() => {
            refeshNotification()
        }, 3000)
        return () => clearInterval(start)
    }, [user._id])

    // show list unseen
    const search = (myArray) => {
        var newArr = []
        for (var i=0; i < myArray.length; i++) {
            if (myArray[i].seen === false) {
                newArr = [...newArr, myArray[i]]
            }
        }
        return newArr
    }
    
    const seen = (id) => {
        axios({
            method: "post",
            data: {
                notificationID: id,
            },
            withCredentials: true,
            url: `${REACT_APP_SERVER}/account/seenNotification`
        })
    }

    return (
        <div>
            <a href="/#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span><i className="fas text-white fa-bell"></i></span>
                <span className="badge">
                    {search(notification).length ? (search(notification).length > 99 ? 99 : search(notification).length) : ''}
                </span>
            </a>
            <div className="dropdown-menu dropdown-menu-right" style={{width: '400px'}} aria-labelledby="navbarDropdown">
                <div className="list-group">
                    <h5 className='ml-3 mt-2 mb-2'><b>Thông báo</b></h5>
                    {notification.map((notification, index) => (
                        <a 
                            href={notification.link} 
                            className="list-group-item list-group-item-action" 
                            aria-current="true" 
                            key={index}
                            style={!notification.seen ? ({backgroundColor: "hsl(240, 0%, 90%)"}) : null}
                            onClick={() => {seen(notification._id)}}
                        >
                            <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1"><b>{`${notification.subject} trên khóa học:  ${notification.courseID.name}`}</b></h6>
                            </div>
                            <p className="mb-1">
                                "{notification.content}"
                            </p>
                            <small>{moment(notification.createdAt).fromNow()}</small>
                        </a>
                    ))}
                </div>
                {/* <Link className="dropdown-item" to="#" data-toggle="modal" data-target="#infor">Thông tin tài khoản</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/me/stored/courses">Khóa học của tôi</Link>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" data-toggle="modal" data-target="#exampleModal" href="/#">Đăng xuất</a> */}
            </div>
        </div>
    )
}

export default Notification