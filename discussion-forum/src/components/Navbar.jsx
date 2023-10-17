import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material"
import PetsIcon from '@mui/icons-material/Pets';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const nav = useNavigate()

    const logout = () => {
        nav('/')
    }

    return(
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position='static'>
                <Toolbar>
                    <PetsIcon />
                    <Typography variant='h6'component='div' sx={{ flexGrow: 1 }}>
                        Topics
                    </Typography>
                    <Button color='inherit' onClick={logout}>Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar