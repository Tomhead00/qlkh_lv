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
        position: 'fixed',
        bottom: '0',
        border: '1px solid',
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
        border: '1px solid',
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
    const { myVideo, stream, setStream } = useContext(SocketContext)
    const classes = useStyle()
    const refMenu = useRef()
    const refMember = useRef()
    const refInfo = useRef()

    return (
        <div className={"row " + classes.wrapper}>
            <VideoPlayer />
            <div className={classes.menu} ref={refMenu}>
                <div className="mb-3">
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">
                    {/* Comment here */}
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
                    <h4 style={{display: 'inline'}}><b>Tin nhắn</b></h4>
                    <button type="button" className="close" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>               
                </div>
                <div className="comments-list" id="comments-list">
                    {/* Comment here */}
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
            <div className={classes.menu} ref={refInfo}>
                Info
            </div>

            {/* <Options>
                <Notifications />
            </Options> */}
            <div className={"row " + classes.appBar}>
                <div className="col-4"></div>
                <div className="col-4 d-flex justify-content-center align-items-center">
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" role="button" onClick={() => {
                            myVideo.current.srcObject.getAudioTracks()[0].stop()
                    }}>
                        <i className="fas fa-microphone"></i> <i className="fas fa-microphone-slash"></i>
                    </Link>
                    <Link className="btn btn-light btn-lg btn-floating m-2" to="#" role="button" onClick={() => {
                    }}>
                        <i className="fas fa-video"></i> <i className="fas fa-video-slash"></i>
                    </Link>
                    <Link className="btn btn-light btn-lg btn-floating m-2" style={{backgroundColor: "#FFA900"}} to="#" role="button">
                        <i className="fas fa-chalkboard" style={{color: "white"}}></i>
                    </Link>
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