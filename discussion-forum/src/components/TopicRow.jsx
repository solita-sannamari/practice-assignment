import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'

const TopicRow = (props) => {
    const topic = props.topic
    const count = props.count
    const timestamp = props.latestMsgTime
    const username = props.user.username
    const role = props.user.role

    return (
        <TableRow key={topic.id}>
          <TableCell key={topic.id}>
            <Link to={`/topics/${topic.id}/messages`}>
              {topic.name}
            </Link>
          </TableCell>

          <TableCell>
            {count}
          </TableCell>

          <TableCell>
            {Array.isArray(timestamp) 
            ? `${timestamp[2]}.${timestamp[1]}.${timestamp[0]} at ${timestamp[3]}:${timestamp[4] < 10 ? `0${timestamp[4]}` : timestamp[4]}` 
            : "No messages"}
          </TableCell>
          <TableCell>
            {username === topic.user.username || role === 'admin' ?
              <Button 
                variant='outlined'
                onClick={() => props.deleteTopic({ target: { id: topic.id } })}
                id={topic.id}
              >
                Delete
              </Button> 
              : <></>
            }
          </TableCell>
          <TableCell>
            {username === topic.user.username && count == 0 || role === 'admin' ? 
              <Button 
                variant="outlined" 
                onClick={() => props.editTopic({ target: { id: topic.id } })} 
                id={topic.id}
              >
                Edit
              </Button> 
              : <></> 
            }
          </TableCell>
        </TableRow>
    )
}

export default TopicRow