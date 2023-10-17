import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

import TopicTable from './TopicTable'
import Navbar from './Navbar'

import topicService from '../services/topics'
import userService from '../services/users'
import { Dialog, DialogContent, DialogTitle } from '@mui/material'

function Forum() {
  const [topics, setTopics] = useState([])
  const [topicName, setTopicName] = useState('')
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('')
  const [user, setUser] = useState({})
  const [editedTopicName, setEditedTopicName] = useState('')
  const [open, setOpen] = useState(false)
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
      userService
        .getByUsername(parsedUser)
        .then(returnedUser => {
          setUser(returnedUser)
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
        setAlertMessage('Topic is already added')
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
  }

  const deleteTopic = (event) => {
    const id = event.target.id;
    topicService
      .del(id)
      .then(() => {
        setTopics((topics) => topics.filter((t) => t.topic.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting topic:", error)
      })
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
    <Navbar />
     <p>Logged in as: {user.username}</p>
     {alert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></>}
     <Grid container spacing={1} marginBottom={3} marginTop={2}>
       <Grid item xs={4}>
         <TextField
           id="new-topic"
           label='Topic'
           variant="outlined"
           size="small"
           fullWidth
           value={topicName}
           onChange={(event) => { setTopicName(event.target.value) } } />
       </Grid>
       <Grid item alignItems='stretch' style={{ display: 'flex' }}>
         <Button
           type='submit'
           variant='contained'
           onClick={addTopic}
         >
           Add topic
         </Button>
       </Grid>
     </Grid>

     <TopicTable topics={topics} deleteTopic={deleteTopic} editTopic={handleClickOpen} user={user}/>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit topic</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus
          id='topic'
          type='text'
          value={editedTopicName}
          onChange={(e) => setEditedTopicName(e.target.value)}
        />
        <Button onClick={editTopic}>Edit</Button>
      </DialogContent>
    </Dialog>
  </div>

  )
}

export default Forum
