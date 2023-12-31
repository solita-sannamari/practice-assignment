import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./components/Login"
import Forum from "./components/Forum"
import MessageBoard from "./components/MessageBoard"
import NoMatch from "./components/NoMatch"

function App () {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='*' element={<NoMatch />} />
        <Route path='/login' element={<Login />} />
        <Route path='/topics/:id/messages' element={<MessageBoard />} />
        <Route path='/topics' element={<Forum />} />
      </Routes>
    </Router>
  )
}
export default App