import {
    AppBar, Avatar,
    Box, Button, Divider, Grid,
    IconButton, Input, InputAdornment, InputLabel,
    Menu, MenuItem, TextField,
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
    const getLoggedIn = () => {
        console.log(token)
        if (token === '') {
            return (
                <Grid container justifyContent="flex-end" spacing={1}>
                    <Grid item>
                    <Input style={styles.loginInput} id="navEmail" startAdornment={<InputAdornment position="start">&nbsp;<AccountCircle/></InputAdornment>}/>
                    </Grid>
                    <Grid item>
                    <Input style={styles.loginInput} type="password" id="navEmail" startAdornment={<InputAdornment position="start">&nbsp;<PasswordIcon/></InputAdornment>}/>
                    </Grid>
                    <Grid item>
                        <Button size="small" color="inherit" variant="outlined">Sign In</Button>
                    </Grid>
                    <Grid item>
                        <Button size="small" color="inherit" variant="outlined">Register</Button>
                    </Grid>
                </Grid>
            )
        } else {
            return (
            <div>
                <IconButton id="accountButton" edge={"end"} onClick={openAccountMenu}><Avatar alt={"User Profile Photo"} src={"http://localhost:4941/api/v1/users/" + "8" + "/image"}/></IconButton>
                <Menu anchorEl={anchorElement} MenuListProps={{"aria-labelledby": "accountButton"}} open={open} onClose={closeAccountMenu}>
                    <MenuItem><Link to={"/register"}>My Profile</Link></MenuItem>
                    <MenuItem><Link to={"/register"}>My Auctions</Link></MenuItem>
                    <MenuItem><Link onClick={deleteToken} to={"/register"}>Sign Out</Link></MenuItem>
                </Menu>
            </div>
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
            <Typography variant={"h5"} sx={{mr:2}}>{props.pageName}</Typography>
            {getLoggedIn()}
        </Toolbar>
    </AppBar>

    </Box>
    )
}
export default Navbar;