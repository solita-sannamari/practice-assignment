import { useState, useEffect } from 'react'
import './App.css'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Grid from '@mui/material/Grid'

import TopicTable from './components/TopicTable'
import MessageBoard from './components/MessageBoard'

import topicService from './services/topics'

function App() {
  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState('')
  const [alert, setAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [alertSeverity, setAlertSeverity] = useState('')

  useEffect(() => {
    topicService
      .getAll()
      .then(initialTopics => {
        setTopics(initialTopics)
      })
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
          name: topic
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
      <h1>Discussion forum</h1>
      {alert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></> }
      <Grid container spacing={1} marginBottom={3} marginTop={2}>
        <Grid item xs={4} >
          <TextField 
            id="new-topic"
            label='Topic'
            variant="outlined" 
            size="small"
            fullWidth
            value={topic}
            onChange={(event) => {setTopic(event.target.value)}} 
          />
        </Grid>
        <Grid item alignItems='stretch' style={{display: 'flex'}}>
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

      <MessageBoard />
    </div>

  )
}

export default App
