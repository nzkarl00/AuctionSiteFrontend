import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect} from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Alert, AlertColor,
    Avatar,
    Box, Button,
    Container,
    Divider,
    Grid, ImageList, ImageListItem, ImageListItemBar, Input,
    List, MenuItem, Modal,
    Paper, Snackbar, Stack,
    Table, TableBody,
    TableCell,
    TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@mui/material";
import auctions from "./Auctions";
import {useUserStore} from "./store";

const Auction = () => {
    const {id} = useParams<string>();
    const [auction, setAuction] = React.useState({title: 'Not Found', categoryId: -1, sellerId: -1, reserve: -1, endDate: '', auctionId: -1,
        sellerFirstName: '', sellerLastName: '', highestBid: -1, numBids: -1, description: ''})
    const [bids, setBids] = React.useState<Array<bid>>([{bidderId: 0, amount: 0, firstName: '', lastName: '', timestamp: ''}])
    const [bidAmount, setBidAmount] = React.useState(0);
    const token = useUserStore(state => state.userToken)
    const userId = useUserStore(state => state.userId)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [snackSeverity, setSnackSeverity] = React.useState<AlertColor>("success")
    const [relatedAuctions, setRelatedAuctions] = React.useState<Array<auction>>([])
    const [open, setOpen] = React.useState(false)
    const [editActive, setEditActive] = React.useState(false)
    const [newTitle, setNewTitle] = React.useState<string>(auction.title)
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [newCategory, setNewCategory] = React.useState<number>(auction.categoryId)
    const [newDescription, setNewDescription] = React.useState<string>(auction.description)
    const [newReserve, setNewReserve] = React.useState<number>(auction.reserve)
    const [newEnd, setNewEnd] = React.useState('')
    const [defaultDate, setDefaultDate] = React.useState<string>('')
    const nav = useNavigate()
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    React.useEffect(() => {
        setBids([])
        getAuction()
        getCategories()
    }, [id])
    const updateBidAmount = (event: { target?: any; }) => {
        setBidAmount(event.target.value);
    }
    const getRelatedAuctions = (catId: number, sellerId: number) => {
        let items = new Array<auction>()
        axios.get('http://localhost:4941/api/v1/auctions', {params: {categoryIds: catId}})
            .then((response) => {
                axios.get('http://localhost:4941/api/v1/auctions', {params: {sellerId: sellerId}})
                    .then((response2) => {
                        if (typeof id === "string") {
                            setRelatedAuctions(Array.from(new Set(response.data.auctions.concat(response2.data.auctions).filter((auc: { auctionId: number; }) => auc.auctionId !== parseInt(id, 10)))))
                        }
                    })
            })
    }
    const getCategories = () => {
        axios.get('http://localhost:4941/api/v1/auctions/categories')
            .then(async (response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setCategories(response.data)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const placeBid = () => {
        if (token === '') {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("You must log in to place a bid")
        }
        axios.post('http://localhost:4941/api/v1/auctions/' + id + '/bids', {"amount": parseInt(String(bidAmount), 10)}, {headers: {"X-Authorization": token}})
            .then((response) => {
                getBids()
                setSnackSeverity("success")
                setSnackMessage("Bid Placed successfully")
                setSnackOpen(true)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const deleteAuction = () => {
        if (token === '' || userId !== auction.sellerId) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Authentication Error")
        } else if (bids.length > 0) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Cannot delete an auction with bids")
        } else {
            axios.delete('http://localhost:4941/api/v1/auctions/' + id, {headers: {"X-Authorization": token}})
                .then((response) => {
                    getBids()
                    setSnackSeverity("success")
                    setSnackMessage("Auction deleted successfully")
                    setSnackOpen(true)
                    nav('/auctions')
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
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
        reserveSold: {
            color: 'green'
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
                getRelatedAuctions(response.data.categoryId, response.data.sellerId)
                getBids()
                setNewCategory(response.data.categoryId)
                setNewTitle(response.data.title)
                setNewDescription(response.data.description)
                setNewReserve(response.data.reserve)
                let d = new Date(response.data.endDate)
                setNewEnd(d.getFullYear() + '-0' + (d.getMonth() + 1) + '-' + d.getDate())
                d = new Date()
                setDefaultDate(d.getFullYear() + '-0' + (d.getMonth() + 1) + '-' + d.getDate())
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const patchAuction = () => {
        axios.patch('http://localhost:4941/api/v1/auctions/' + id,
            {"title": newTitle, "description": newDescription, "categoryId": newCategory, "endDate": newEnd, "reserve": newReserve},
            {headers: {"X-Authorization": token}})
            .then(async (response) => {
                setErrorFlag(false)
                setEditActive(false)
                getAuction()
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const bidPlacer = () => {
        if ((new Date(auction.endDate)).getTime() < Date.now()) {
            return auctionReserve()
        } else {
            return (
                <Grid container spacing={1} style={{justifyContent: "center"}}>
                    <Grid item sm={6}>
                        {auctionReserve()}
                    </Grid>
                    <Grid item sm={4} style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                        $&nbsp;<Input type="number" disabled={userId === auction.sellerId} onChange={updateBidAmount} inputProps={{ min: auction.highestBid+1, inputMode: 'numeric', pattern: '[0-9]*' }} />
                    </Grid>
                    <Grid item sm={2} style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
                        <Button variant="contained" disabled={userId === auction.sellerId} onClick={placeBid}>Place Bid</Button>
                    </Grid>
                </Grid>
            )
        }
    }
    const auctionReserve = () => {
        let text = <Typography variant="h6" style={styles.reserveNotMet}>Closed: Unsold</Typography>
        if (editActive && ((new Date(auction.endDate)).getTime() > Date.now())) {
            return (
                    <TextField type={"number"} defaultValue={auction.reserve} label={"Reserve"} onChange={updateNewReserve}/>
            )
        }
        if (bids.length === 0) {
            if ((new Date(auction.endDate)).getTime() > Date.now()) {
                text = <Typography align="center" variant="h6" style={styles.reserveNotMet}>No Bids</Typography>
            }
            return (
                <Grid container spacing={1} style={{justifyContent: "center"}}>
                    <Grid item sm={12} style={{textAlign: "center"}}>
                        {text}
                    </Grid>
                    <h3 >Reserve: ${auction.reserve}</h3>
                </Grid>
            )
        } else {
        if ((new Date(auction.endDate)).getTime() < Date.now()) {
            if (auction.highestBid >= auction.reserve) {
                text = <Typography variant="h6" style={styles.reserveSold}>Sold For: ${auction.highestBid} </Typography>
            }
        } else {
            if (auction.highestBid < auction.reserve) {
                text = <Typography variant="h6" style={styles.reserveNotMet}>Current Bid: ${auction.highestBid} </Typography>
            } else {
                text = <Typography variant="h6" style={styles.reserveMet}>Current Bid: ${auction.highestBid} </Typography>
            }
        }
            return (
                <Grid container spacing={0} style={{justifyContent: "center"}}>
                    <Grid item sm={5.5} style={styles.center} sx={{justifyContent: 'center'}}>
                        {text}
                    </Grid>
                    <Grid item sm={1} style={styles.center} sx={{justifyContent: 'center'}}>
                        <Link to={"users/" + bids[0].bidderId}><Avatar sx={{height: 50, width: 50}} alt={bids[0].firstName + " " + bids[0].lastName} src={"http://localhost:4941/api/v1/users/" + bids[0].bidderId + "/image"}/></Link>
                    </Grid>
                    <Grid item sm={5.5} style={styles.center} sx={{justifyContent: 'center'}}>
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
                        <Link to={"users/" + bid.bidderId}>{bid.firstName} {bid.lastName} </Link>
                        &nbsp;&nbsp;&nbsp;
                        <Link to={"users/" + bid.bidderId}><Avatar sx={{height: 35, width: 35}} alt={bid.firstName + " " + bid.lastName} src={"http://localhost:4941/api/v1/users/" + bid.bidderId + "/image"}/></Link>
                    </Grid>

                </Grid>
                </TableCell>
            </TableRow>
        )
    }
    const displayRelatedAuctions = () => {
        return (
            <Paper style={{justifyContent: "center", paddingTop: 15}}>
            <Typography variant="h5" align={'center'} style={{marginBottom: 10}}>Related Auctions</Typography>
                <Divider />
                <br></br>
            <ImageList cols={1} sx={{width: "100%", height: "100%" }}>
                <Grid container style={{justifyContent: "center"}}>
                {relatedAuctions.map((related) => (
                    <Link to={'/auctions/' + related.auctionId}>
                    <ImageListItem key={related.auctionId} sx={{}}>
                        <img
                            src={'http://localhost:4941/api/v1/auctions/' + related.auctionId + '/image'}
                            onError={({ currentTarget }) => {
                                currentTarget.onerror = null; // prevents looping
                                currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                            }}
                            alt={related.title}/>
                        <ImageListItemBar
                            title={related.title}
                            subtitle={<span>Seller: {related.sellerFirstName} {related.sellerLastName}</span>}
                            position="below"
                        />
                        <Divider/>
                    </ImageListItem>
                    </Link>
                ))}
                </Grid>
            </ImageList>
            </Paper>
        );
    }
    const modalStyling = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 250,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: "center",
    };
    const openDeleteModal = () => setOpen(true);
    const closeDeleteModal = () => setOpen(false);
    const startEditing = () => setEditActive(true);
    const stopEditing = () => setEditActive(false);
    const editButton = () => {
        if (editActive) {
            return (
                <Grid item sm={5} style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                <Button variant={'contained'} color='success' onClick={patchAuction}>Save Changes</Button>
                &nbsp;
                <Button variant={'contained'} onClick={stopEditing}>Cancel</Button>
                </Grid>
            )
        } else {
            return (
                <Grid item sm={5} style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                    <Button variant={'contained'} disabled={bids.length > 0} onClick={startEditing}>Edit Auction</Button>
                    &nbsp;
                    <Button variant={'contained'} onClick={openDeleteModal} color={'error'}>Delete Auction</Button>
                </Grid>

            )
        }
    }
    const updateNewTitle = (event: { target?: any; }) => {
        setNewTitle(event.target.value)
    }
    const updateNewCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(parseInt(event.target.value,10));
    }
    const updateNewDescription = (event: { target?: any; }) => {
        setNewDescription(event.target.value)
    }
    const updateNewReserve = (event: { target?: any; }) => {
        setNewReserve(event.target.value)
    }
    const updateNewEnd = (event: { target?: any; }) => {
        console.log(event.target.value)
        setNewEnd(event.target.value)
    }
    const editableTitle = () => {
        if (editActive) {
            return (
                <TextField defaultValue={newTitle} onChange={updateNewTitle}/>
            )
        } else {
            return (
                <Typography variant={"h3"} align={'left'}>{auction.title}</Typography>
            )
        }
    }
    const isOwner = () => {
        if (userId !== auction.sellerId) {
            return (
                <Grid container spacing={1}>
                    <Grid item sm={7}>
                        {editableTitle()}
                    </Grid>
                    <Grid item sm={4} style={{display: "flex", alignItems: "center", justifyContent: "right"}}>
                        <Typography variant={"h6"} align={'right'} alignSelf={"center"}>Seller: {auction.sellerFirstName} {auction.sellerLastName}</Typography>
                    </Grid>
                    <Grid item sm={1} style={{display: "flex", alignItems: "center", justifyContent: "left"}}>
                        <Avatar sx={{height: 35, width: 35}} alt={auction.sellerFirstName + " " + auction.sellerLastName} src={"http://localhost:4941/api/v1/users/" + auction.sellerId + "/image"}/>
                    </Grid>
                </Grid>
            )
        } else {
            return (
                <Grid container spacing={1}>
                    <Grid item sm={7}>
                        {editableTitle()}
                    </Grid>
                    {editButton()}
                        <Modal open={open} onClose={closeDeleteModal} aria-labelledby="modal--title" aria-describedby="modal-description">
                            <Box sx={modalStyling}>
                                <Typography id="modal-title"  variant="h6">Delete Auction?</Typography>
                                <br></br>
                                    <Box style={{display: "flex", justifyContent: "center"}}>
                                <Button variant={'contained'} onClick={closeDeleteModal}>Cancel</Button>
                                &nbsp;
                                <Button variant={'contained'} color={'error'} onClick={deleteAuction}>Delete</Button>
                                    </Box>
                            </Box>
                        </Modal>

                </Grid>
            )
        }
    }
    const closingTime = () => {
        if (editActive) {
            return (
                <Box>
                Closing: {getTime(auction.endDate)}
                <br></br><br></br>
                    <Divider/>
                    <br></br>
                <input type={"date"} onChange={updateNewEnd} min={defaultDate}/>
                    <br></br>
                    <br></br>
                    <TextField fullWidth select label={"Item Category"} value={newCategory} required onChange={updateNewCategory}>
                        {categories.map(({ categoryId, name}) => (
                            <MenuItem key={categoryId} style={{height: 25}} value={categoryId}>
                                {name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            )
        } else {
            return (
                <Box>
                    Closing: {getTime(auction.endDate)}
                </Box>
            )
        }
    }
    const editableDesc = () => {
        if (editActive) {
            return (
                <Box>
                    <br></br>
                <TextField required multiline fullWidth id="inputDesc" label={"Description"} defaultValue={newDescription} onChange={updateNewDescription}/>
                </Box>
            )
        } else {
            return (
                <Box>
                {auction.description}
                </Box>
            )
        }
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
                                {isOwner()}
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
                                                {editableDesc()}
                                            <br></br>
                                            {closingTime()}
                                        </Box>
                                    </Grid>
                                </Grid>
                                <br></br>
                            </div>
                                <Divider />
                            <div>
                                <br></br>
                                {bidPlacer()}
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
                            {displayRelatedAuctions()}
                        </List>
                </Container>
            </div>
            <Snackbar
                autoHideDuration={6000}
                open={snackOpen}
                onClose={handleSnackClose}
                key={snackMessage}
            >
                <Alert onClose={handleSnackClose} severity={snackSeverity} sx={{
                    width: '100%' }}>
                    {snackMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
export default Auction;