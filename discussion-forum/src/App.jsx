import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [counter, setCounter] = useState(0)

  axios.get('http://localhost:8080/greeting')
    .then(response => {
      setName(response.data.content)
    console.log(response.data)
  })

  return (
    <>
    {name}
    </>
  )
}

export default App
