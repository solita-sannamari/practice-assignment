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

function Forum() {
  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState('')
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('')
  const [user, setUser] = useState({})

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

  const addTopic = (event) => {
    event.preventDefault()

    if (topic != ''){
      const result = topics.find(({name}) => name === topic)
      if (result && result.name === topic) {
        setAlert(true)
        setAlertMessage('Topic is already added')
        setAlertSeverity('error')
        setTopic('')
      } else {
        const topicObject = {
          name: topic,
          user: user
        }
        topicService
          .add(topicObject)
          .then(returnedTopic => {
            setTopics(topics.concat(returnedTopic))
            setTopic('')
            setAlert(true)
            setAlertMessage(`Added a new topic "${topic}"`)
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
        setTopics((topics) => topics.filter((topic) => topic.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting topic:", error);
      });
  };

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
           value={topic}
           onChange={(event) => { setTopic(event.target.value) } } />
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

     <TopicTable topics={topics} deleteTopic={deleteTopic} />
   </div>

  )
}

export default Forum
