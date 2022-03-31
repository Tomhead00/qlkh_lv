import { Link, useLocation } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
import { Typography, AppBar } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { SocketContext } from '../components/SocketContext'


const {REACT_APP_SERVER} = process.env

function Notifications () {
    const { answerCall, call, callAccepted } = useContext(SocketContext)

    return (
        <div>
            {call.isReceivedCall && !callAccepted && (
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <h1>{call.name} is calling: </h1>
                    <Button variant="contained" color="primary" onClick={answerCall}>
                        Answer
                    </Button>
                </div>
            )}
        </div>
    )
}

export default Notifications