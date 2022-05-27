import {Link, useParams} from "react-router-dom";
import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Avatar,
    Box,
    Container,
    Divider,
    Grid,
    List,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import auctions from "./Auctions";

const Auction = () => {
    const {id} = useParams();
    const [auction, setAuction] = React.useState({title: 'Not Found', categoryId: -1, sellerId: -1, reserve: -1, endDate: '', auctionId: -1,
        sellerFirstName: '', sellerLastName: '', highestBid: -1, numBids: -1, description: ''})
    const [bids, setBids] = React.useState<Array<bid>>([{bidderId: -1,
        amount: 0,
        firstName: '',
        lastName: '',
        timestamp: ''}])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    React.useEffect(() => {
        getAuction()
        getBids()
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
        },
        reserveNotMet: {
            color: 'gray',
        },
        reserveMet: {
            color: 'orange'
        },
        center: {
            display: 'flex',
            alignItems: 'center'
        },
    }
    const getBids = () => {
        axios.get('http://localhost:4941/api/v1/auctions/' + id + '/bids')
            .then(async (response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setBids(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
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
    const auctionReserve = () => {
        if (!auction.highestBid) {
            return (
                <Grid container spacing={1} style={{justifyContent: "center"}}>
                    <Grid item sm={12} style={styles.center}>
                <h3 style={styles.reserveNotMet}>No bids</h3>
                    </Grid>
                <h3 >Reserve: ${auction.reserve}</h3>
                </Grid>
            )
        }
        if (auction.reserve > auction.highestBid) {
            return (
                <Grid container spacing={1} style={{justifyContent: "center"}}>
                    <Grid item sm={2.5} style={styles.center} sx={{justifyContent: 'center'}}>
                        <Typography variant="h6" style={styles.reserveNotMet}>Current Bid: ${auction.highestBid} </Typography>
                    </Grid>
                    <Grid item sm={0.5} style={styles.center}>
                        <Link to={"users/" + bids[0].bidderId}><Avatar sx={{height: 50, width: 50}} alt={bids[0].firstName + " " + bids[0].lastName} src={"http://localhost:4941/api/v1/users/" + bids[0].bidderId + "/image"}/></Link>
                    </Grid>
                    <Grid item sm={2.5} style={styles.center} sx={{justifyContent: 'center'}}>
                        <Typography variant="h6"><Link to={"users/" + bids[0].bidderId}>{bids[0].firstName} {bids[0].lastName}</Link></Typography>
                    </Grid>
                    <Grid item sm={12} style={{textAlign: 'center'}}>
                        <Typography variant="h6">Reserve: ${auction.reserve}</Typography>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid container spacing={1} style={{justifyContent: "center"}}>
                    <Grid item sm={2.5} style={styles.center} sx={{justifyContent: 'center'}}>
                        <Typography variant="h6" style={styles.reserveMet}>Current Bid: ${auction.highestBid} </Typography>
                    </Grid>
                    <Grid item sm={0.5} style={styles.center}>
                        <Link to={"users/" + bids[0].bidderId}><Avatar sx={{height: 50, width: 50}} alt={bids[0].firstName + " " + bids[0].lastName} src={"http://localhost:4941/api/v1/users/" + bids[0].bidderId + "/image"}/></Link>
                    </Grid>
                    <Grid item sm={2.5} style={styles.center} sx={{justifyContent: 'center'}}>
                        <Typography variant="h6"><Link to={"users/" + bids[0].bidderId}>{bids[0].firstName} {bids[0].lastName}</Link></Typography>
                    </Grid>
                    <Grid item sm={12} style={{textAlign: 'center'}}>
                        <Typography variant="h6">Reserve: ${auction.reserve}</Typography>
                    </Grid>
                </Grid>
            )
        }
    }
    interface HeadCell {
        id: string;
        label: string;
        numeric: boolean;
    }
    const bidHeaders: readonly HeadCell[] = [
        { id: 'amount', label: 'Amount', numeric: true },
        { id: 'time', label: 'Placed', numeric: false },
        { id: 'bidder', label: 'Bidder', numeric: false },
    ];
    const bidsTable = () => {
        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {bidHeaders.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={'center'}
                                    padding={'normal'}>
                                    {headCell.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bidRows()}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    const getTime = (dateString: string) => {
        const d = new Date(dateString)
        return d.toLocaleString()
    }
    const bidRows = () => {
        return bids.map((bid: bid) =>
            <TableRow hover
                      tabIndex={-1}
                      key={bid.bidderId}>
                <TableCell align={'center'}>
                    ${bid.amount}
                </TableCell>
                <TableCell align={'center'}>
                    {getTime(bid.timestamp)}
                </TableCell>
                <TableCell align={'center'}>
                    <Grid container spacing={1} style={{justifyContent: "center"}}>

                    <Grid item style={styles.center} sx={{justifyContent: 'center'}}>
                        <Link to={"users/" + bids[0].bidderId}>{bid.firstName} {bid.lastName} </Link>
                        &nbsp;&nbsp;&nbsp;
                        <Link to={"users/" + bids[0].bidderId}><Avatar sx={{height: 35, width: 35}} alt={bid.firstName + " " + bid.lastName} src={"http://localhost:4941/api/v1/users/" + bid.bidderId + "/image"}/></Link>
                    </Grid>

                </Grid>
                </TableCell>
            </TableRow>
        )
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
                            <Grid container spacing={1}>
                                <Grid item sm={7}>
                            <Typography variant={"h3"} align={'left'}>{auction.title}</Typography>
                                </Grid>
                                <Grid item sm={4}>
                            <Typography variant={"h6"} align={'right'} alignSelf={"center"}>Seller: {auction.sellerFirstName}{auction.sellerLastName}</Typography>
                                </Grid>
                                <Grid item sm={1}>
                                <Avatar sx={{height: 35, width: 35}} alt={auction.sellerFirstName + " " + auction.sellerLastName} src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"}/>
                                </Grid>
                            </Grid>
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
                                        <br></br>
                                        <br></br>
                                        Closing: {getTime(auction.endDate)}
                                    </Box>
                                </Grid>
                            </Grid>
                            <br></br>
                        </div>
                            <Divider />
                        <div>
                            <br></br>
                            {auctionReserve()}
                            <br></br>
                            <Divider />
                        </div>
                            <br></br>
                            <div>
                                <Typography variant={'h5'} align={'center'}>Bid History: {bids.length} bid(s)</Typography>
                                <br></br>
                                {bidsTable()}
                            </div>
                            <br></br>
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