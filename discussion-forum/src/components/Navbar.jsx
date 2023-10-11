import { AppBar, Toolbar, Typography, Box } from "@mui/material"
import PetsIcon from '@mui/icons-material/Pets';
import { Link } from "react-router-dom";

const Navbar = () => {

    return(
        <Box sx={{ flexGrow: 1 }} >
            <AppBar position='static'>
                <Toolbar>
                    <PetsIcon />
                    <Typography variant='h6'>Discussions about cats 🐱 </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar