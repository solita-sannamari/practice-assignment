import { useState } from 'react'

import axios from 'axios'

import { TextField, Button, Grid, Alert } from '@mui/material'

function Login() {
  const [username, setUserame] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert]  = useState(false)

  const handleLogin = (event) => {
    event.preventDefault()

    axios
      .post('http://localhost:8080/login2?username=' + username)
      .then(response => {
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
      <Grid container direction='column' spacing={2}>
        <Grid item style={{height: alert ? 'auto' : '63.9583px'}} >
          {alert ? <Alert severity='error'>Username not found</Alert> : <></> }
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
              id='username'
              label='Username'
              type='text'
              size='small'
              value={username}
              onChange={(event) => setUserame(event.target.value)} 
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
              id='password'
              label='Password'
              type='password'
              size='small'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Button 
            className='loginBtn'
            variant='contained'
            fullWidth
            onClick={handleLogin}
            >LOG IN
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default Login
