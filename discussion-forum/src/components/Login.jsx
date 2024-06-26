import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'

import { TextField, Button, Grid, Alert } from '@mui/material'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert]  = useState(false)

  const nav = useNavigate()

  useEffect(() => {
    localStorage.setItem("Username", JSON.stringify(username))
  }, [username]);

  const handleLogin = (event) => {
    event.preventDefault()

    var formData = new FormData();
    formData.append("username", username)
    formData.append("password", password)

    axios({
      method: 'post',
      url: '/api/login',
      data: formData,
      headers: { "Content-Type": "multipart/form-data" }
    }).then(response => {
      nav('/topics')
      console.log('user found')
    })
    .catch(() => {
      setAlert(true)
      setTimeout(() => {
        setAlert(false)
      }, 3000)
    })
  }

  return (
    <div className='login'>
      <h1>Login</h1>
      <Grid container spacing={2} width='100%' alignItems='stretch'>
        <Grid item style={{height: alert ? 'auto' : '63.9583px'}} >
          {alert ? <Alert severity='error'>Username not found</Alert> : <></> }
        </Grid>
        <Grid item xs={12}>
          <TextField 
              id='username'
              label='Username'
              type='text'
              size='small'
              fullWidth
              value={username}
              onChange={(event) => setUsername(event.target.value)} 
          />
        </Grid>
        <Grid item xs={12}>
          <TextField 
              id='password'
              label='Password'
              type='password'
              size='small'
              fullWidth
              value={password}
              onChange={(event) => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button 
            className='loginBtn'
            fullWidth={true}
            variant='contained'
            onClick={handleLogin}
            >LOG IN
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
