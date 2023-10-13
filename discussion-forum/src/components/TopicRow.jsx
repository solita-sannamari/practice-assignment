import { useEffect, useState } from "react"

import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

import messageService from '../services/messages'

const TopicRow = (props) => {
    const [count, setCount] = useState(0)
    const topic = props.topic

    const messageCount = (topicId) => {
      
      messageService
      .getCount(topicId)
      .then(msgCount => {
        setCount(msgCount)
      })
    }
    
    useEffect(() => {
      messageCount(topic.id)

    }, [])

    return (
        <TableRow key={topic.id}>
                <TableCell key={topic.id}>
                  <Link to={`/topics/${topic.id}/messages`}>
                    {topic.name}
                  </Link>
                  </TableCell>
                <TableCell>{count}</TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <Button 
                    variant='outlined'
                    onClick={() => props.deleteTopic({ target: { id: topic.id } })}
                    id={topic.id}
                  >
                      Delete
                  </Button>
                </TableCell>
              </TableRow>
    )
}

export default TopicRow