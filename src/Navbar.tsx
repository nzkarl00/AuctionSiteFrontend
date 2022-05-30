import {
    Alert,
    AlertColor,
    AppBar, Avatar,
    Box, Button, Divider, Drawer, Grid,
    IconButton, Input, InputAdornment, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Menu, MenuItem, Snackbar, TextField,
    Toolbar,
    Typography
} from "@mui/material";
import {Link, useNavigate} from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu'
import {
    AccountCircle, Add,
    ArrowCircleDown,
    ArrowDownward,
    ArrowDropDownCircle,
    Search,
    VerifiedUser
} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import React, {useEffect} from "react";
import {useUserStore} from "./store";
import PasswordIcon from '@mui/icons-material/Password';
import axios from "axios";
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from "@mui/icons-material/Person";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LogoutIcon from '@mui/icons-material/Logout';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

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
    const [navOpen, setNavOpen] = React.useState<boolean>(false)
    const nav = useNavigate()
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
                setAnchorElement(null)
            }, (error) => {
                setSnackSeverity("error")
                setSnackOpen(true)
                setSnackMessage("Invalid login")
                setErrorFlag(true)
                setErrorMessage(error.toString())
    })
    }
    const toggleNav = (b: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        setNavOpen(b)
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
                <Grid container justifyContent="flex-end" style={{display: "flex", alignItems: "center"}} spacing={1}>
                    <Avatar alt={"User Profile Photo"} key={userId} src={"http://localhost:4941/api/v1/users/" + userId + "/image"}/>
                <IconButton id="accountButton" edge={"end"} onClick={openAccountMenu}><ArrowDropDownCircle fontSize={"large"}/></IconButton>
                <Menu anchorEl={anchorElement} MenuListProps={{"aria-labelledby": "accountButton"}} open={open} onClose={closeAccountMenu}>
                    <MenuItem><Link to={"/users/" + userId}>My Profile</Link></MenuItem>
                    <MenuItem><Link to={"/my-auctions"}>My Auctions</Link></MenuItem>
                    <MenuItem onClick={deleteToken}>Sign Out</MenuItem>
                </Menu>
                </Grid>
            )
        }
    }
    const navTo = (link: string) => (event: React.KeyboardEvent | React.MouseEvent) => {
        nav(link)
    }
    const userOptions = () => {
        return (
        <List>
            <ListItem key={"new-auction"} disablePadding>
                <ListItemButton onClick={navTo("/create-auction")}>
                    <ListItemIcon>
                        <AddBusinessIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Post New Auction"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"profile"} disablePadding>
                <ListItemButton onClick={navTo("/users/" + userId)}>
                    <ListItemIcon>
                        <PersonIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"My Profile"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"my-auctions"} disablePadding>
                <ListItemButton onClick={navTo("/my-auctions")}>
                    <ListItemIcon>
                        <ReceiptLongIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"My Auctions"} />
                </ListItemButton>
            </ListItem>
            <ListItem key={"logout"} disablePadding>
                <ListItemButton onClick={deleteToken}>
                    <ListItemIcon>
                        <LogoutIcon/>
                    </ListItemIcon>
                    <ListItemText primary={"Sign Out"} />
                </ListItemButton>
            </ListItem>
        </List>

        )
    }
    const navOptions = () => {
        if (token === '') {
            return (
                <Box sx={{width: 250}} role="presentation" onClick={toggleNav(false)} onKeyDown={toggleNav(false)}>
                    <List>
                        <ListItem key={"auctions"} disablePadding>
                            <ListItemButton onClick={navTo("/auctions")}>
                                <ListItemIcon>
                                    <StorefrontIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Auctions"} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem key={"register"} disablePadding>
                            <ListItemButton onClick={navTo("/register")}>
                                <ListItemIcon>
                                    <Add/>
                                </ListItemIcon>
                                <ListItemText primary={"Register"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            )
        } else {
            return (
                <Box sx={{width: 250}} role="presentation" onClick={toggleNav(false)} onKeyDown={toggleNav(false)}>
                    <List>
                        <ListItem key={"auctions"} disablePadding>
                            <ListItemButton onClick={navTo("/auctions")}>
                                <ListItemIcon>
                                    <StorefrontIcon/>
                                </ListItemIcon>
                                <ListItemText primary={"Auctions"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider/>
                    {userOptions()}
                </Box>
            )
        }
    }
    const deleteToken = () => {
        setToken('')
        setUserId(0)
        nav("/auctions")
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
            <IconButton style={{color: "white"}} onClick={toggleNav(true)}><MenuIcon/></IconButton>
            <Typography width={"50%"} align="left" variant={"h5"} sx={{mr:2}}>{props.pageName}</Typography>
            {getLoggedIn()}
        </Toolbar>
    </AppBar>
        <Drawer
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                },
            }}
            onClose={toggleNav(false)}
            anchor="left"
            open={navOpen}>
            {navOptions()}
        </Drawer>
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