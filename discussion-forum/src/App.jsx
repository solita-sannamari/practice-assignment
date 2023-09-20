import { useState, useEffect } from 'react'
import './App.css'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

import TopicTable from './components/TopicTable'

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

 return (
   <div>
      <h1>Discussion forum</h1>
      {alert ? <Alert severity={alertSeverity}>{alertMessage}</Alert> : <></> }
      <TextField 
        id="new-topic" 
        variant="outlined" 
        size="small" 
        value={topic}
        onChange={(event) => {setTopic(event.target.value)}} 
      />
      <Button 
        type='submit' 
        variant='contained'
        onClick={addTopic}
      >
          Add topic
      </Button>

      <TopicTable topics={topics} /> 
    </div>

  )
}

export default App
