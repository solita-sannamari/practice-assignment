import { AppBar, Toolbar, Typography, Box, Button, IconButton, Menu, MenuItem } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { AccountCircle } from "@mui/icons-material"
import MenuIcon from '@mui/icons-material/Menu'

import { useState } from "react";
import axios from "axios";

const Navbar = (props) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const [anchorElNav, setAnchorElNav] = useState(null)
    const nav = useNavigate()

    const logout = () => {
        axios
            .post('/api/logout')
            .then(response => {
                console.log('user logged out')
                console.log(response)
                nav('/login')
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const topics = () => {
        nav('/topics')
        setAnchorElNav(null)
    }

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget)
    }

    const handleCloseNavMenu = () => {
        setAnchorElNav(null)
    }

    return(
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position='static'>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <IconButton
                            size='large'
                            onClick={handleOpenNavMenu}
                            color='inherit'
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                        >
                            <MenuItem onClick={topics}>Topics</MenuItem>
                        </Menu>
                    </div>
                    
                    <Typography variant='h6'>
                        {props.heading}
                    </Typography>

                    <div>
                        <IconButton
                            size='large'
                            onClick={handleMenu}
                            color='inherit'
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            anchorOrigin={{
                              vertical: 'top',
                              horizontal: 'right',  
                            }}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>{props.username}</MenuItem>
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                    </div>               
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar