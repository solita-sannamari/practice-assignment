import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { ThemeProvider, createTheme } from "@mui/material/styles"
import { grey, lime, purple, red } from '@mui/material/colors'

import Login from "./components/Login"
import Forum from "./components/Forum"
import MessageBoard from "./components/MessageBoard"
import NoMatch from "./components/NoMatch"

const theme = createTheme({
  palette: {
    primary: {
      main: grey[600],
    },
    secondary: {
      main: grey[900],
    },
  },
})

function App () {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='*' element={<NoMatch />} />
          <Route path='/login' element={<Login />} />
          <Route path='/topics/:id/messages' element={<MessageBoard />} />
          <Route path='/topics' element={<Forum />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}
export default App