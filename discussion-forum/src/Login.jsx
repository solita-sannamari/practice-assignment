import { useState } from 'react'

import axios from 'axios'

function Login() {
  const [username, setUserame] = useState('')
  const [password, setPassword] = useState('')
  // const [greeting, setGreeting] = useState('')

  // axios.get('http://localhost:8080/greeting')
  //  .then(response => {
  //    setGreeting(response.data.content)
  //  console.log(response.data)
  // })

  const handleSignIn = (event) => {

  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form className="login-form" method="POST" onSubmit={handleSignIn}>
        <label htmlFor="username">Username</label>
        <input 
            type="text"
            className="input"
            id="username"
            required
            value={username}
            onChange={(event) => setUserame(event.target.value)} 
        />
        <label htmlFor="password">Password</label>
        <input 
            type="password"
            className="password"
            id="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
        />
        <button className="loginBtn">LOG IN</button>
      </form>
    </div>
  )
}

export default Login
