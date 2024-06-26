import { Button, 
        TextField, 
        Grid, 
        Dialog, 
        DialogTitle, 
        DialogContent, 
        DialogActions,
        Alert } from '@mui/material'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

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
    const nav = useNavigate()

    useEffect(() => {
        messageService
            .getAll(id)
            .then(initialMessages => {
                setMessages(initialMessages)
            })
            .catch((error) => {
                if (error.response.status == 404) {
                    nav('*')
                    console.log('page not found')
                } else {
                    nav('/login')
                }
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
                .then(returnedMessage => {
                    const newMessageStatistic = {
                        upvoteCount: 0,
                        message: returnedMessage
                    }
                    setMessages(messages.concat(newMessageStatistic))
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
        const topicId = editedMsgObj.topic.id
        const msgId = editedMsgObj.id
        messageService
            .edit(editedMsgObj, topicId, msgId)
            .then(returnedMessage => {
                console.log(returnedMessage)
                let returnedMessageStatistic = messages.find((m) => m.message.id == msgId)
                returnedMessageStatistic.message = returnedMessage

                setMessages(messages.map((m) => m.message.id != msgId ? m : returnedMessageStatistic))
            })
        
        setOpen(false)
       
    }

    const handleClickOpen = (event) => {
        setEditMsgObj(messages.find((m) => m.message.id == event.currentTarget.dataset.msgid).message)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)   
    }

    const upvote = (event) => {
        const msgId = event.currentTarget.dataset.msgid
        const message = messages.find(m => m.message.id == msgId).message

        const upvoteObj = {
            message: message,
            user: user
        }

        messageService
            .newUpvote(upvoteObj, id)
            .then(() => {
                const updatedMessageStatistic = messages.find((m) => m.message.id == msgId)
                updatedMessageStatistic.upvoteCount+=1
                updatedMessageStatistic.isLiked = true
                setMessages(messages.map((m) => m.message.id != msgId ? m : updatedMessageStatistic))
            })
    }

    return(
        <div>
            <Navbar heading={topic.name} username={user.username} />
            <p></p>
            <Grid container marginBottom={2} direction='column' alignItems='flex-start'>
                {messages.length === 0 ? (
                    <Grid item>No messages.</Grid>
                ) : ( 
                    messages.map((m, index) => (
                        <div key={m.message.id}>
                            <Grid item marginBottom={2}>
                                Posted by: {m.message.user.username}, 
                                {' ' + m.message.timestamp.split('T')[0].split('-')[2]}.{m.message.timestamp.split('T')[0].split('-')[1]}.{m.message.timestamp.split('T')[0].split('-')[0] + ' '} 
                                at {m.message.timestamp.split('T')[1].substring(0,5)} </Grid>
                            <Grid item marginBottom={2}>{m.message.message}</Grid>
                            <Grid item marginBottom={2}>
                            {(m.message.user.username === user.username) ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Button 
                                        data-msgid={m.message.id} 
                                        variant='outlined'
                                        color='secondary'
                                        onClick={handleClickOpen}
                                    >
                                        Edit
                                    </Button>
                                    <Button 
                                        data-msgid={m.message.id} 
                                        variant='contained' 
                                        disabled
                                        className='custom-disabled'
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center',
                                            color:'secondary',
                                        }}
                                    >
                                        <ArrowDropUpIcon />
                                        <span>{m.upvoteCount}</span>
                                    </Button>
                                </div>
                                ) : <Button 
                                        data-msgid={m.message.id}
                                        className={m.isLiked ? 'custom-disabled' : null } 
                                        variant='contained' 
                                        onClick={upvote}
                                        disabled={m.isLiked}
                                        style={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            color: 'secondary',
                                            }}
                                    >
                                        <ArrowDropUpIcon />
                                        <span>{m.upvoteCount}</span>
                                    </Button>
                            }
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