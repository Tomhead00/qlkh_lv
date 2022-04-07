import { Link } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
import { Typography, AppBar } from '@material-ui/core'
import Notifications from '../../components/Notifications'
import Options from '../../components/Options'
import VideoPlayer from '../../components/VideoPlayer'
import { SocketContext } from '../../components/SocketContext'
import {makeStyles} from '@material-ui/core/styles'


const {REACT_APP_SERVER} = process.env
const useStyle = makeStyles((theme) => ({
    appBar: {
        backgroundColor: '#BDBDBD',
        position: 'fixed',
        bottom: '0',
        // border: '1px solid',
        width: '100%',
        height: '10vh',
        padding: 0,
        margin: 0,
    },
    wrapper: {
        top: 0,
        left: 0,
        position: 'relative',
        margin: '0px',
        padding: '0px',
        height: '90vh',
        // display: 'flex',
        // flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        flexFlow: 'row nowrap',
    },
    menu: {
        margin: 0,
        padding: '15px',
        position: 'relative',
        height: '100%',
        width: '23vw',
        justifyContent: 'center',
        right: 0,
        // border: '1px solid',
        flex: '1 1 auto',
        display: 'none',

        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',

        overflowY: 'scroll',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
    },
})) 

function LiveStream () {
    const { myVideo, stream, setStream , switchCameraToScreen, setSwitchCameraToScreen, CamAndScreen, changeStream, connectionRef, mic, video, streamPeer } = useContext(SocketContext)
    const classes = useStyle()
    const refMenu = useRef()
    const refMember = useRef()
    const refInfo = useRef()

    const closeMenu = (e) => {
        $(refMenu.current).hide("slow")
        $(refMember.current).hide("slow")
        $(refInfo.current).hide("slow")

    }

    return (
        <div className={"row " + classes.wrapper}>
            <VideoPlayer />
            <div className={classes.menu} ref={refMenu}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">

                    <div>
                        {/* {comment.map((element, index) => ( */}
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000 giờ trước</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                                <div className="media">
                                    <div className='media-body'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                        <div className='mt-0 mb-0'>Tui <small className="timeComments">1000</small></div>
                                        <div className='mb-0'>
                                            {/* <div>{
                                                element.content.split('\n').map(
                                                    (str,index) => <div key={index}>{str}</div>)
                                            }</div> */}
                                            askfjashkdfaglwiugfbslasdasasdasdaasdasdasdadasdad asd s
                                        </div>
                                    </div>
                                </div>
                        {/* ))} */}
                    </div>
                </div>
            </div>
            <div className={classes.menu} ref={refMember}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Mọi người</b> <span><small>(5000)</small></span> </h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">
                    <div>
                        {/* {comment.map((element, index) => ( */}
                                <div className="media pt-2 pb-2">
                                    <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={'http://localhost:3001/img/user/1644482160278default.jpg'} alt='' width="40" height="40" />
                                    <div className='media-body align-self-center'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                            <div className='mt-0 mb-0'>Trần Quốc Bảo</div>
                                    </div>
                                </div>
                                <div className="media pt-2 pb-2">
                                    <img className='align-self-center mr-3 rounded-circle shadow-1-strong me-3' src={'http://localhost:3001/img/user/1644482160278default.jpg'} alt='' width="40" height="40" />
                                    <div className='media-body align-self-center'>
                                        {/* <h5 className='mt-0 mb-0'><b>{element.actor.username}</b> <small className="timeComments">{moment(element.createdAt).fromNow()}</small></h5> */}
                                            <div className='mt-0 mb-0'>Trần Quốc Bảo</div>
                                    </div>
                                </div>
                        {/* ))} */}
                    </div>
                </div>
            </div>
            <div className={classes.menu} ref={refInfo}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Thông tin</b></h4>
                    <button type="button" className="close" aria-label="Close" onClick={closeMenu}>
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>

            </div>

            <Options>
                <Notifications />
            </Options>
            <div className={"row " + classes.appBar}>
                <div className="col-4"></div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                    {/* mic */}
                    <Link className={`btn btn-lg btn-floating m-2 ${mic.current ? "btn-light" : "btn-danger"}`} to="#" role="button" onClick={() => {
                        if (switchCameraToScreen.current) {
                            if(mic.current) mic.current = false
                            else mic.current = true
                        } else if(mic.current) {
                            stream.getAudioTracks()[0].enabled = false
                            const test = () => {
                                stream.getAudioTracks()[0].stop()
                            }
                            setTimeout(test, 1000);
                            mic.current = false
                        }
                        else {
                            mic.current = true
                            CamAndScreen()
                        }
                    }}>
                        {mic.current ? (<i className="fas fa-microphone"></i>) : (<i className="fas fa-microphone-slash"></i>)}
                    </Link>
                    {/* camera */}
                    <Link className={`btn btn-lg btn-floating m-2 ${video.current ? "btn-light" : "btn-danger"}`} to="#" role="button" onClick={() => {
                        // console.log( stream , audioTrack , videoTrack)
                        if (switchCameraToScreen.current) {
                            if(video.current) video.current = false
                            else video.current = true
                        } else if(video.current) {
                            stream.getVideoTracks()[0].enabled = false
                            const test = () => {
                                stream.getVideoTracks()[0].stop()
                            }
                            setTimeout(test, 1000);
                            video.current = false
                        }
                        else {
                            video.current = true
                            CamAndScreen()
                        }
                    }}>
                        {video.current ? (<i className="fas fa-video"></i>) : (<i className="fas fa-video-slash"></i>)}
                    </Link>
                    {/* share man hinh */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#FFA900"}} to="#" role="button" onClick={ () => {
                        changeStream()
                    }}>
                        <i className="fas fa-chalkboard" style={{color: "white"}}></i>
                    </Link>
                    {/* tin nhan */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" style={{backgroundColor: "#39C0ED"}} role="button" onClick={() => {
                        if ($(refMember.current).css("display") === "block" || $(refInfo.current).css("display") === "block") {
                            $(refMenu.current).toggle()
                        } else 
                            $(refMenu.current).toggle('slow')
                        $(refMember.current).hide()
                        $(refInfo.current).hide()
                    }}>
                        <i className="fas fa-comment-alt" style={{color: "white"}}></i>
                    </Link>
                    {/* Thanh vien */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" style={{backgroundColor: "#39C0ED"}} role="button" onClick={() => {
                        if ($(refMenu.current).css("display") === "block" || $(refInfo.current).css("display") === "block") {
                            $(refMember.current).toggle()
                        } else 
                            $(refMember.current).toggle('slow')
                        $(refMenu.current).hide()
                        $(refInfo.current).hide()
                    }}>
                        <i className="far fa-list-alt" style={{color: "white"}}></i>
                    </Link>
                    {/* Thong bao */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" role="button" onClick={() => {
                        if ($(refMenu.current).css("display") === "block" || $(refMember.current).css("display") === "block") {
                            $(refInfo.current).toggle()
                        } else 
                            $(refInfo.current).toggle('slow')
                        $(refMenu.current).hide()
                        $(refMember.current).hide()
                    }}>
                        <i className="fas fa-ellipsis-v"></i>                    
                    </Link>
                    {/* Thoat */}
                    <Link className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#c61118"}} to="#" role="button">
                        <i className="fas fa-phone-slash" style={{color: "white"}}></i>
                    </Link>
                </div>
                <div className="col-4"></div>
            </div>
        </div>
    )
}

export default LiveStream