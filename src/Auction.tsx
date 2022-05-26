import {useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {Box, Container, Divider, Grid, List, Paper} from "@mui/material";
import auctions from "./Auctions";

const Auction = () => {
    const {id} = useParams();
    const [auction, setAuction] = React.useState({title: 'Not Found', categoryId: -1, sellerId: -1, reserve: -1, endDate: '', auctionId: -1,
        sellerFirstName: '', sellerLastName: '', highestBid: -1, numBids: -1, description: ''})
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        getAuction()
    }, [id])
    const styles = {
        auctionPhoto: {
            height: 400,
            width: 600,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid black',
            backgroundColor: 'lightgray'
        }
    }
    const getAuction = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + id)
            .then(async (response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuction(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    return (
        <div>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div style={{display: 'flex'}}>
                <Navbar pageName={auction.title} />
                <Container sx={{ width: 1/5}}>
                    <List>
                    </List>
                </Container>
                <Container>
                    <List sx={{textAlign: "left"}}>
                        <Paper sx={{paddingX: 2, paddingY: 0.1}}>
                        <h1>{auction.title}</h1>
                            <Divider />
                            <br></br>

                        <div>
                            <Grid container spacing={1}>
                                <Grid item sm={7} style={styles.auctionPhoto}>
                        <img alt={auction.title + ' auction image'} src={'http://localhost:4941/api/v1/auctions/' + auction.auctionId + '/image'}
                             onError={({ currentTarget }) => {
                                 currentTarget.onerror = null; // prevents looping
                                 currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                             }} height={400} />
                                </Grid>
                                <Grid item sm={5}>
                                    <Box sx={{overflow: 'auto'}}>
                                    {auction.description}
                                    </Box>
                                </Grid>
                            </Grid>
                        </div>

                        </Paper>
                    </List>

                </Container>
                <Container sx={{ width: 1/5}}>
                    <List>
                    </List>
                </Container>
            </div>
        </div>
    )
}
export default Auction;