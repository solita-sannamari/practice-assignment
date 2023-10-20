import { Button, 
        TextField, 
        Grid, 
        Dialog, 
        DialogTitle, 
        DialogContent, 
        DialogActions,
        Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import messageService from '../services/messages'
import topicsService from '../services/topics'
import userService from '../services/users'
import Navbar from './Navbar'

import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const MessageBoard = () => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const [topic, setTopic] = useState({})
    const [user, setUser] = useState({})
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [open, setOpen] = useState(false)
    const [editMsgObj, setEditMsgObj] = useState({})
    const [editedMessage, setEditedMessage] = useState('')

    const { id } = useParams()

    useEffect(() => {
        messageService
            .getAll(id)
            .then(initialMessages => {
                setMessages(initialMessages)
            })
        topicsService
            .getById(id)
            .then(topic => {
                setTopic(topic)
            })
            
        const savedUser = localStorage.getItem("Username")
        const parsedUser = JSON.parse(savedUser)
        userService
            .getByUsername(parsedUser)
            .then(returnedUser => {
                setUser(returnedUser)
              })
    }, [])

    useEffect(() => {
        setEditedMessage(editMsgObj.message)
    }, [editMsgObj])

    const addMessage = (event) => {
        event.preventDefault()

        if (message != '') {
            const dateString = new Date().toISOString()
    
            const newMessage = {
                message: message,
                user: user,
                timestamp: dateString,
                topic: topic
            }
            messageService
                .add(newMessage, id)
                .then(returnedMessages => {
                    setMessages(messages.concat(returnedMessages))
                    setMessage('')
                })
        } else {
            setAlert(true)
            setAlertMessage('Message is empty.')

            setTimeout(() => {
                setAlertMessage('')
                setAlert(false)
              }, 3000)
        }
    }

    const editMessage = (event) => {
        event.preventDefault()
        
        const editedMsgObj = {...editMsgObj, message: editedMessage}
        const topic_id = editedMsgObj.topic.id
        const msg_id = editedMsgObj.id
        messageService
            .edit(editedMsgObj, topic_id, msg_id)
            .then(returnedMessage => {
                setMessages(messages.map(message => message.id != msg_id ? message : returnedMessage))
            })
        
        setOpen(false)
       
    }

    const handleClickOpen = (event) => {
        setEditMsgObj(messages.find((message) => message.id == event.target.id))
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        
    }

    return(
        <div>
            <Navbar heading={topic.name} />
            <p>Logged in as: {user.username}</p>
            <Grid container marginBottom={2} direction='column' alignItems='flex-start'>
                {messages.length === 0 ? (
                    <Grid item>No messages.</Grid>
                ) : ( 
                    messages.map((message, index) => (
                        <div key={message.id}>
                            <Grid item marginBottom={2}>Posted by: {message.user.username}, {message.timestamp[2]}.{message.timestamp[1]}.{message.timestamp[0]} at {message.timestamp[3]}:{message.timestamp[4] < 10 ? `0${message.timestamp[4]}` : message.timestamp[4]} </Grid>
                            <Grid item marginBottom={2}>{message.message}</Grid>
                            <Grid item marginBottom={2}>
                            {message.user.username === user.username ? (
                                <Button id={message.id} variant='outlined' onClick={handleClickOpen}>Edit</Button>
                                ) : <Button variant='contained'><ArrowDropUpIcon /></Button>}
                            </Grid>
                            {index !== messages.length - 1 && (
                                <div style= {{borderBottom: '1px solid #e0e0e0'}}></div>
                            )}
                        </div>
                    ))
                )}
            </Grid>

            <Grid container alignItems='center' spacing={1}>
                <Grid item xs={10}>
                    <TextField
                        id='new-message'
                        variant='outlined'
                        multiline
                        rows={5}
                        fullWidth
                        value={message}
                        onChange={(event) => {setMessage(event.target.value)}}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        type='submit'
                        variant='contained'
                        onClick={addMessage}>
                            Send message
                    </Button>
                </Grid>
            </Grid>
            {alert ? <Alert severity='error'>{alertMessage}</Alert> : <></>}

            <Dialog open={open} onClose={handleClose} disableRestoreFocus>
                <DialogTitle>Edit message</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        id='message'
                        type='text'
                        value={editedMessage}
                        onChange={(e) => setEditedMessage(e.target.value)}
                        style={{width: 500}}
                        multiline
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant='contained' onClick={editMessage}>Send</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default MessageBoard