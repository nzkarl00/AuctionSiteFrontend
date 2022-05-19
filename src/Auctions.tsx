import axios from 'axios';
import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import {
    Avatar,
    Button,
    Container, Divider, Grid,
    List,
    ListItem, ListItemAvatar,
    ListItemButton, ListItemIcon,
    ListItemText,
    Stack,
    TableCell,
    TableRow
} from "@mui/material";
import Navbar from "./Navbar";
import {Image} from "@mui/icons-material";

const Auctions = () => {
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        getAuctions()
    }, [])
    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions')
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const styles = {
        auctionPhoto: {
            height: 120,
            width: 240,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        auctionItem: {
            borderColor: 'black'
        },
        reserveNotMet: {
            color: 'lightgray'
        },
        reserveMet: {
            color: 'black'
        }
    }
    const auctionReserve = (a: auction) => {
        if (!a.highestBid) {
            return (
                <p style={styles.reserveNotMet}>No bids</p>
            )
        }
        if (a.reserve > a.highestBid) {
            return (
                <p style={styles.reserveNotMet}>{a.highestBid}</p>
            )
        } else {
            return (
                <p style={styles.reserveMet}>{a.highestBid}</p>
            )
        }
    }
    const auctionList = () => {
        console.log(auctions)
        return auctions.map(a =>
            <><ListItemButton key={a.auctionId} component="a"
                              href={'http://localhost:4941/api/v1/auctions/' + a.auctionId} style={styles.auctionItem}>
                <Grid container spacing={1}>
                    <Grid item sm={2} style={styles.auctionPhoto}>
                        <img src={'http://localhost:4941/api/v1/auctions/' + a.auctionId + '/image'} height={120}/>
                    </Grid>
                    <Grid item sm={8}>
                            <ListItemText><h3>{a.title}</h3></ListItemText>
                    </Grid>
                    <Grid item sm={2}>
                        <Stack>
                            <ListItemText>{auctionReserve(a)}</ListItemText>
                            <ListItemText>{a.reserve}</ListItemText>
                        </Stack>

                    </Grid>
                </Grid>
            </ListItemButton><Divider/></>
        )
    }
    if(errorFlag) {
        return (
            <div>
            <Container maxWidth={"sm"}>
                <h1>Auctions</h1>
                <div style={{color:"red"}}>
                    {errorMessage}
                </div>
            </Container>
            </div>
        )
    } else {
        return (
            <div>
                <h1>Auctions</h1>
                <Navbar />
                <Container>
                <h1>Auctions</h1>
                <List>
                    {auctionList()}
                </List>
                </Container>
            </div>
        )
    }
}
export default Auctions;