import {
    Accordion,
    AppBar,
    Box,
    Drawer,
    IconButton,
    InputBase, Link, Menu, MenuItem,
    SpeedDial,
    TextField,
    Toolbar,
    Typography
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu'
import {AccountCircle, Search, VerifiedUser} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import React from "react";

const Navbar = () => {
    const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorElement);
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
            <Typography variant={"h5"} sx={{mr:2}}>Page Name</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton id="accountButton" edge={"end"} onClick={openAccountMenu}><AccountCircle sx={{color:"white"}}/></IconButton>
            <Menu anchorEl={anchorElement} MenuListProps={{"aria-labelledby": "accountButton"}} open={open} onClose={closeAccountMenu}>
                <MenuItem><Link href={"/register"}>My Profile</Link></MenuItem>
                <MenuItem><Link href={"/register"}>My Auctions</Link></MenuItem>
                <MenuItem><Link href={"/register"}>Sign Out</Link></MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>

    </Box>
    )
}
export default Navbar;