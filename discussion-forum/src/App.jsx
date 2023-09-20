import { useState, useEffect } from 'react'
import './App.css'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import TopicTable from './components/TopicTable'

import topicService from './services/topics'

function App() {
  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState('')

  useEffect(() => {
    topicService
      .getAll()
      .then(initialTopics => {
        setTopics(initialTopics)
      })
  }, [])

  const addTopic = (event) => {
    event.preventDefault()
    const topicObject = {
      topic_name: topic
    }
    topicService
      .add(topicObject)
      .then(returnedTopic => {
        setTopics(topics.concat(returnedTopic))
        setTopic('')
      })
  }

 return (
   <div>
      <h1>Discussion forum</h1>
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
