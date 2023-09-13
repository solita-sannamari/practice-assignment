import { useState, useEffect } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

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

  const TopicTable = (props) => {
    const topics = props.topics
    const topicRows = topics.map((topic) => 
      <TableRow key={topic.id}>
        <TableCell>{topic.topic_name}</TableCell>
      </TableRow>
    )
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Topic</TableCell>
              <TableCell>Messages</TableCell>
              <TableCell>Time of last message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{topicRows}</TableBody>
        </Table>
    </TableContainer>
    )
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
