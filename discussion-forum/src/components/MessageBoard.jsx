import { Button, TextField, Grid } from '@mui/material'
import { useState } from 'react'

const MessageBoard = () => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 1,
            content: "Hey fellow cat lovers! 😻 Let's share some heartwarming stories about our feline friends. I'll start: my cat recently brought me a gift in the form of a half-eaten toy mouse. It was hilarious and adorable at the same time. What's the most endearing or funny thing your cat has done lately? Share your stories and bring some smiles to our day!",
            user: 'user1'
        },
        {
            id: 2,
            content: "Hi there, cat enthusiasts! 🐱 I couldn't resist sharing this charming moment from last night. My cat, Mittens, decided to curl up right on top of my laptop keyboard as I was working. She made herself comfortable and even pressed the Enter key a few times, sending some interesting messages to my colleagues! 😹 What mischievous or cute antics have your cats pulled recently? Let's swap these heartwarming tales!",
            user: 'user2'
        },
        {
            id: 3,
            content: "Hello, fellow cat aficionados! 🐾 I had quite the laugh yesterday when my cat, Whiskers, tried to pounce on a feather from a bird video on TV. It was like she thought it was a real bird! Her determination was so adorable. Do you have any similar stories of your cats getting captivated by the TV or reacting to something unexpected? Share your delightful anecdotes here! 😸",
            user: 'user3'
        },
        {
            id: 4,
            content: "Hey cat enthusiasts! 🐾 I just witnessed a heartwarming moment that melted my heart. My senior cat, Mr. Whiskers, has taken it upon himself to be the protector of our new kitten, Luna. He watches over her while she eats, plays, and even grooms her when she allows it. It's the sweetest display of feline companionship I've ever seen. Have your cats formed unexpected bonds or acted as protectors to their fellow feline or non-feline friends? Share your touching stories, and let's celebrate the love and camaraderie our cats bring into our lives! 😺❤️",
            user: 'user4'
        },
    ])

    const addMessage = (event) => {
        event.preventDefault()
        const id = messages.length + 1
        const user = `user${id}`

        const newMessage = {
            id: id,
            content: message,
            user: user
        }
        setMessages(messages.concat(newMessage))
        setMessage('')
    }

    return(
        <div>
            <h1>Adorable cat stories 🐱</h1>
            <Grid container spacing={2} marginBottom={2}>
            {messages.map(message => (
                <Grid item key={message.id}>{message.content}
                </Grid>
                ))}
            </Grid>

            <Grid container alignItems='center' spacing={1}>
                <Grid item xs={10}>
                    <TextField
                        id='new-message'
                        variant='outlined'
                        multiline
                        rows={5}
                        fullWidth
                        value={message}
                        onChange={(event) => {setMessage(event.target.value)}}
                    />
                </Grid>
                <Grid item xs={2}>
                    <Button
                        type='submit'
                        variant='contained'
                        onClick={addMessage}>
                            Send message
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}

export default MessageBoard