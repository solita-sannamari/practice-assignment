import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

import Image from 'mui-image'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

import TopicTable from './TopicTable'
import Navbar from './Navbar'

import topicService from '../services/topics'
import userService from '../services/users'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

function Forum() {
  const [topics, setTopics] = useState([])
  const [topicName, setTopicName] = useState('')
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('')
  const [user, setUser] = useState({})
  const [editedTopicName, setEditedTopicName] = useState('')
  const [open, setOpen] = useState(false)
  const [openAdd, setOpenAdd] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [idToDelete, setIdToDelete] = useState(null)
  const [editTopicObj, setEditTopicObj] = useState({}) 

  const nav = useNavigate()

  useEffect(() => {
    
    const savedUser = localStorage.getItem("Username")
    const parsedUser = JSON.parse(savedUser)
    if (parsedUser == '') {
      nav('/login')
    } else {
      topicService
      .getAll()
      .then(initialTopics => {
        setTopics(initialTopics)
      })
      .catch((error) => {
        console.log(error.message)
        nav('/login')
      })
      userService
        .getByUsername(parsedUser)
        .then(returnedUser => {
          setUser(returnedUser)
        })
        .catch((error) => {
          console.log(error.message)
          nav('/login')
        })
    }
  }, [])

  useEffect(() => {
    if (editTopicObj.topic != undefined) {
      setEditedTopicName(editTopicObj.topic.name)
    }
  }, [editTopicObj])

  const addTopic = (event) => {
    event.preventDefault()

    if (topicName != ''){
      const result = topics.find((t) => t.topic.name === topicName)
      if (result && result.topic.name === topicName) {
        setAlert(true)
        setAlertMessage(`Topic name "${topicName}" is already added`)
        setAlertSeverity('error')
        setTopicName('')
      } else {
        const topicObject = {
            name: topicName,
            user: user
        }
        topicService
          .add(topicObject)
          .then(returnedTopic => {
            const newTopicStatisticsObject = {
              latestMsgTime: null,
              msgCount: 0,
              topic: returnedTopic
            }
            setTopics([newTopicStatisticsObject].concat(topics))
            setTopicName('')
            setAlert(true)
            setAlertMessage(`Added a new topic "${topicName}"`)
            setAlertSeverity('success')
          }) 
        } 
    } else {
        setAlert(true)
        setAlertMessage('Add a topic')
        setAlertSeverity('error')
        
      }
      setTimeout(() => {
        setAlertMessage('')
        setAlertSeverity('')
        setAlert(false)
      }, 3000)
      setOpenAdd(false)

  }

  const deleteTopic = (id) => {
    setOpenDelete(false)
    topicService
      .del(id)
      .then(() => {
        setTopics((topics) => topics.filter((t) => t.topic.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting topic:", error)
      })
  }

  const openDeleteDialog = (event) => {
    setIdToDelete(event.target.id)
    setOpenDelete(true)
  }

  const editTopic = (event) => {
    event.preventDefault()

    const editedTopicObj = {...editTopicObj.topic, name: editedTopicName}
    const id = editedTopicObj.id
    console.log(editedTopicObj)

    console.log('edit topic clicked')

    topicService
      .edit(editedTopicObj, id)
      .then(returnedTopic => {
        console.log(returnedTopic)
        const returnedTopicStatistic = {
          latestMsgTime: null,
          msgCount: 0,
          topic: returnedTopic
        }
        setTopics(topics.map((t) => t.topic.id != id ? t : returnedTopicStatistic))
      })
    setOpen(false)
  }
  
  const handleClickOpen = (event) => {
    setOpen(true)
    setEditTopicObj(topics.find((t) => t.topic.id == event.target.id))
  }

  const handleClose = () => {
    setOpen(false)
  }

 return (
  <div>
    <Navbar heading={'Topics'} username={user.username} />
    {alert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></>}
    <Image src="/cat.jpg" />
    <Grid container spacing={1} marginBottom={3} marginTop={2}>
       <Grid item alignItems='stretch' style={{ display: 'flex' }}>
         <Button
           type='submit'
           variant='contained'
           onClick={() => setOpenAdd(true)}
         >
           Add topic
         </Button>
       </Grid>
    </Grid>

    <TopicTable topics={topics} deleteTopic={openDeleteDialog} editTopic={handleClickOpen} user={user}/>

    <Dialog open={openAdd} onClose={() => setOpenAdd(false)} disableRestoreFocus>
      <DialogTitle>Add topic</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus
          id="new-topic"
           variant="outlined"
           size="small"
           fullWidth
           value={topicName}
           onChange={(event) => { setTopicName(event.target.value) } }
        />
      </DialogContent>
      <DialogActions>
      <Button
           type='submit'
           variant='contained'
           onClick={addTopic}
         >
           Add topic
         </Button>
      </DialogActions>
    </Dialog>

    <Dialog open={open} onClose={handleClose} disableRestoreFocus>
      <DialogTitle>Edit topic</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus
          id='topic'
          type='text'
          value={editedTopicName}
          onChange={(e) => setEditedTopicName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant='contained' onClick={editTopic}>Edit</Button>
        <Button variant='outlined' onClick={() => setOpen(false)}>Cancel</Button>
      </DialogActions>
    </Dialog>

    <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
      <DialogTitle>Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this topic?</DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={() => setOpenDelete(false)}>Cancel</Button>
        <Button variant='contained' onClick={() => deleteTopic(idToDelete)}>Delete</Button>
      </DialogActions>
    </Dialog>
  </div>

  )
}

export default Forum
