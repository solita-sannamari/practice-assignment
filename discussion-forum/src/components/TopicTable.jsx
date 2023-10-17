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

import TopicRow from './TopicRow'

const TopicTable = (props) => {
    const topics = props.topics

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{fontWeight: 'bold'}}>Topic</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Messages</TableCell>
              <TableCell sx={{fontWeight: 'bold'}}>Time of last message</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topics.map((t) => (
              <TopicRow key={t.topic.id} topic={t.topic} count={t.msgCount} latestMsgTime={t.latestMsgTime} deleteTopic={props.deleteTopic} editTopic={props.editTopic} user={props.user}></TopicRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

export default TopicTable