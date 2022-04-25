import { useState, useEffect, useRef, useContext } from "react"
import { Typography, Paper, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { SocketContext } from '../components/SocketContext'

const useStyles = makeStyles((theme) => ({
    video: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100%',
        maxHeight: '100%',
        height: '100%',
        width: 'auto',
        height: 'auto',
    },
    gridContainer: {
        margin: 0,
        padding: 0,
        position: 'relative',
        height: '100%',
        justifyContent: 'center',
        minWidth:'80vw',
        maxWidth:'100vw',
        flex: '1 1 auto',

    },
    paper: {
        padding: 0,
        marrin: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
    }
})) 

const {REACT_APP_SERVER} = process.env

function VideoPlayer () {
    const {myVideo, stream, isBroadcaster, userVideo } = useContext(SocketContext)
    const classes = useStyles()

    useEffect(() => {
        // console.log(myVideo.current, isBroadcaster)
        myVideo.current.srcObject = stream
    }, [stream])

    return (
        <Grid container className={classes.gridContainer}>
                {/* <Paper className={classes.paper}> */}
                    {/* <Grid item xs={12} md={6}> */}
                        {/* <Typography variant="h5" gutterBottom>{name || 'Name'}</Typography> */}
                        {isBroadcaster ? 
                            (<video playsInline ref={myVideo} muted autoPlay className={classes.video}></video>)
                                :     
                            (<video playsInline ref={myVideo} muted autoPlay controls className={classes.video}></video>)
                        }
                    {/* </Grid> */}
                {/* </Paper> */}
        </Grid>
    )
}

export default VideoPlayer