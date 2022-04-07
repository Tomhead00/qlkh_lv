import { Link, useLocation } from "react-router-dom"
import $ from 'jquery'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react"
import moment from "moment"
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons'
import { SocketContext } from '../components/SocketContext'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
    },
    gridContainer: {
        width: '100%',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
        },
    },
    paper: {
        padding: '10px 20px',
        border: '2px solid black',
    },
    padding: {
        padding: 20,
    },
    margin: {
        marginTop: 20,
    },
    container: {
        width: '600px',
        margin: '35px 0',
        padding: 0,
        [theme.breakpoints.down('xs')]: {
            width: '80%',
        },
    }
}))


const {REACT_APP_SERVER} = process.env

function Options ({ children }) {
    const { name, callAccepted, me, setName, callEnded, leaveCall, callUser } = useContext(SocketContext)
    const [idToCall, setIdToCall] = useState('')
    const classes = useStyles()
    
    return (
        <Container className={classes.container}>
            <Paper elevation={10} className={classes.paper}>
                <form className={classes.root} noValidate autoComplete="off">
                    <Grid container className={classes.gridContainer}>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">Account Info</Typography>
                            <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth/>
                            <CopyToClipboard text={me} className={classes.margin}>
                                <Button variant="contained" color="primary" fullWidth startIcon={<Assignment fontSize="large"/>}>
                                    Copy Your ID
                                </Button>
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} md={6} className={classes.padding}>
                            <Typography gutterBottom variant="h6">Make a call</Typography>
                            <TextField label="ID to Call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth/>
                            {callAccepted && !callEnded ? (
                                <Button variant="contained" color="secondary" startIcon={<PhoneDisabled fontSize="large"/>} fullWidth onClick={leaveCall} className={classes.margin}>
                                    Hang Up
                                </Button>
                            ) : (
                                <Button variant="contained" color="primary" startIcon={<Phone fontSize="large"/>} fullWidth onClick={() => callUser(idToCall)} className={classes.margin}>
                                    Call
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </form>
                {children}
            </Paper>
        </Container>
    )
}

export default Options