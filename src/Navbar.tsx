import {
    Alert,
    AlertColor,
    AppBar, Avatar,
    Box, Button, Divider, Grid,
    IconButton, Input, InputAdornment, InputLabel,
    Menu, MenuItem, Snackbar, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'
import {AccountCircle, Search, VerifiedUser} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import React from "react";
import {useUserStore} from "./store";
import PasswordIcon from '@mui/icons-material/Password';
import axios from "axios";

const Navbar = (props: { pageName: any; loggedIn?: boolean}) => {
    const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
    const token = useUserStore(state => state.userToken)
    const setToken = useUserStore(state => state.setToken)
    const userId = useUserStore(state => state.userId)
    const setUserId = useUserStore(state => state.setUserId)
    const open = Boolean(anchorElement);
    const emailRegex = new RegExp('^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{1,}$')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [snackSeverity, setSnackSeverity] = React.useState<AlertColor>("success")
    const updateEmailState = (event: { target?: any; }) => {
        setEmail(event.target.value)
    }
    const updatePasswordState = (event: { target?: any; }) => {
        setPassword(event.target.value)
    }
    const styles = {
        loginInput: {
            backgroundColor: "white"
        }
    }
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const signIn = () => {
        axios.post('http://localhost:4941/api/v1/users/login', {email: email, password: password})
            .then(async (response) => {
                setToken(response.data.token)
                setUserId(response.data.userId)
                setSnackSeverity("success")
                setSnackOpen(true)
                setSnackMessage("Logged in successfully")
            }, (error) => {
                setSnackSeverity("error")
                setSnackOpen(true)
                setSnackMessage("Invalid login")
                setErrorFlag(true)
                setErrorMessage(error.toString())
    })
    }
    const getLoggedIn = () => {
        if (token === '') {
            return (
                <Grid container justifyContent="flex-end" spacing={1}>
                    <Grid item>
                    <Input style={styles.loginInput} id="navEmail" onChange={updateEmailState} startAdornment={<InputAdornment position="start">&nbsp;<AccountCircle/></InputAdornment>}/>
                    </Grid>
                    <Grid item>
                    <Input style={styles.loginInput} type="password" id="navEmail" onChange={updatePasswordState} startAdornment={<InputAdornment position="start">&nbsp;<PasswordIcon/></InputAdornment>}/>
                    </Grid>
                    <Grid item>
                        <Button size="small" color="inherit" onClick={signIn} variant="outlined">Sign In</Button>
                    </Grid>
                    <Grid item>
                        <Button size="small" color="inherit" href={'/register'} variant="outlined">Register</Button>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid container justifyContent="flex-end" spacing={1}>
                <IconButton id="accountButton" edge={"end"} onClick={openAccountMenu}><Avatar alt={"User Profile Photo"} src={"http://localhost:4941/api/v1/users/" + userId + "/image"}/></IconButton>
                <Menu anchorEl={anchorElement} MenuListProps={{"aria-labelledby": "accountButton"}} open={open} onClose={closeAccountMenu}>
                    <MenuItem><Link to={"/users/" + userId}>My Profile</Link></MenuItem>
                    <MenuItem><Link to={"/my-auctions"}>My Auctions</Link></MenuItem>
                    <MenuItem onClick={deleteToken}>Sign Out</MenuItem>
                </Menu>
                </Grid>
            )
        }
    }
    const deleteToken = () => {
        setToken('')
    }
    const openAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(event.currentTarget);
    }
    const closeAccountMenu = () => {
        setAnchorElement(null);
    }
    return (
    <Box sx={{ flexGrow: 1}}>
    <AppBar>
        <Toolbar>
            <MenuIcon sx={{mr:2}} />
            <Typography width={"50%"} align="left" variant={"h5"} sx={{mr:2}}>{props.pageName}</Typography>
            {getLoggedIn()}
        </Toolbar>
    </AppBar>
        <Snackbar
            autoHideDuration={6000}
            open={snackOpen}
            onClose={handleSnackClose}
            key={snackMessage}>
            <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{
                width: '100%' }}>
                {snackMessage}
            </Alert>
        </Snackbar>

    </Box>
    )
}
export default Navbar;