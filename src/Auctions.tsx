import axios from 'axios';
import React, {Component, useEffect, useLayoutEffect} from 'react'
import Select from 'react-select'
import {
    Avatar,
    Box, Button,
    Card, Checkbox, Chip,
    Container, Divider, FormControl, Grid, InputLabel,
    List, ListItem, ListItemAvatar,
    ListItemButton, ListItemText, MenuItem, OutlinedInput, Paper, SelectChangeEvent,
    Stack, TablePagination, TextField, Typography
} from "@mui/material";
import Navbar from "./Navbar";
import {spacing} from "react-select/dist/declarations/src/theme";

const Auctions = () => {
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [selectedCategories, setSelectedCategories] = React.useState<Array<string>>([])
    const [search, setSearch] = React.useState('')
    const [status, setStatus] = React.useState('OPEN')
    const [sort, setSort] = React.useState('CLOSING_SOON')
    const [displayedAuctions, setDisplayedAuctions] = React.useState<Array<auction>>([])
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const millisInDay = 86400000;
    const [catSelect, setCatSelect] = React.useState<Array<{ value: string; label: string; }[]>>([])
    React.useEffect(() => {
        getAuctions()
        getCategories()
    }, [])
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
    useEffect(() => {
        updateSearch()
    },[selectedCategories, sort, search, status, page, categories])

    const updateQ = (event: { target?: any; }) => {
        setSearch(event.target.value)
    }
    const updateSearch = () => {
        axios.get('http://localhost:4941/api/v1/auctions', {params: {q: search, status: status, categoryIds: selectedCategories, sortBy: sort}})
            .then((response) => {
                setAuctions(response.data.auctions)
                setDisplayedAuctions(response.data.auctions.slice(page*rowsPerPage, (page+1)*rowsPerPage))
            })
    }
    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions', {params: {status:"OPEN"}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
                setDisplayedAuctions(response.data.auctions.slice(0, 10))
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const updateCats = (selectedCategories?: any) => {
        setSelectedCategories(selectedCategories.map((c: { value: any; }) => c.value))
    }
    const updateStatus = (selectedStatus?: any) => {
        setStatus(selectedStatus.value)
    }
    const updateSort = (selectedSort?: any) => {
        setSort(selectedSort.value)
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
        center: {
            display: 'flex',
            alignItems: 'center',
        },
        reserveNotMet: {
            color: 'gray'
        },
        reserveMet: {
            color: 'orange'
        },
        reserveSold: {
            color: 'green'
        }
    }
    const auctionReserve = (a: auction) => {
        if (!a.highestBid) {
            if ((new Date(a.endDate)).getTime() > Date.now()) {
                return <p style={styles.reserveNotMet}>No bids</p>
            } else {
                return <p style={styles.reserveNotMet}>Closed: Unsold</p>
            }
        } else {
            if ((new Date(a.endDate)).getTime() < Date.now()) {
                if (a.highestBid >= a.reserve) {
                    return <p style={styles.reserveSold}>Sold For: ${a.highestBid}</p>
                } else {
                    return <p style={styles.reserveNotMet}>Closed: Unsold</p>

                }
            } else {
                if (a.reserve > a.highestBid) {
                    return (
                        <p style={styles.reserveNotMet}>Current Bid: ${a.highestBid}</p>
                    )
                } else {
                    return (
                        <p style={styles.reserveMet}>Current bid: ${a.highestBid}</p>
                    )
                }
            }
        }
    }
    const timeRemaining = (a: auction) => {
        let endDate = new Date(a.endDate);
        let delta = endDate.getTime() - Date.now();
        if (delta < 0) {
            return <span style={styles.reserveNotMet}>Closed</span>
        } else if (delta < millisInDay) {
            return <span>Closing today!</span>
        } else {
            return <span>Closing in {Math.floor(delta/millisInDay)} days</span>
        }
    }
    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const categoryName = (a: auction) => {
        const foundCat = categories.find((c: category) => c.categoryId === a.categoryId)
        if (foundCat) {
            return foundCat.name
        } else {
            return ''
        }

    }
    const auctionList = () => {
        return displayedAuctions.map(a =>
                <Paper elevation={3}>
                    <ListItemButton key={a.auctionId} component="a"
                              href={'/auctions/' + a.auctionId} style={styles.auctionItem}>
                <Grid container spacing={1}>
                    <Grid item sm={2} style={styles.auctionPhoto}>
                        <img alt={a.title + ' auction image'} src={'http://localhost:4941/api/v1/auctions/' + a.auctionId + '/image'}
                             onError={({ currentTarget }) => {
                                 currentTarget.onerror = null; // prevents looping
                                 currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                             }} height={120}/>
                    </Grid>
                    <Grid item sm={5.5}>
                            <ListItemText>
                                <h3>{a.title}</h3>
                                <Typography>{timeRemaining(a)}  <span style={{color: "gray"}}>&nbsp;|&nbsp;</span>  {categoryName(a)}</Typography>
                            </ListItemText>
                    </Grid>
                    <Grid item sm={2}>
                        <Stack>
                            <ListItemText>{auctionReserve(a)}</ListItemText>
                            <ListItemText>Reserve: ${a.reserve}</ListItemText>
                        </Stack>

                    </Grid>
                    <Grid item sm={1.8} style={styles.center} sx={{justifyContent: 'center'}}>
                        {a.sellerFirstName} {a.sellerLastName}
                    </Grid>
                    <Grid item sm={0.7} style={styles.center}>
                        <Avatar sx={{height: 50, width: 50}} alt={a.sellerFirstName + " " + a.sellerLastName} src={"http://localhost:4941/api/v1/users/" + a.sellerId + "/image"}/>
                    </Grid>
                </Grid>
            </ListItemButton><Divider/>
                </Paper>
        )
    }
    const filter = () => {
        return (
        <Paper elevation={3} sx={{padding: 0.1}}>
            <FormControl>
                <h3>Filter:</h3>
                <TextField id="searchParams" label="Search" onChange={updateQ}/>
                <br></br>
                <Select
                    isMulti
                    name="categories"
                    options={categories.map(({ categoryId, name}) => ({ value: categoryId, label: name }))}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={updateCats}
                    placeholder={"Select Categories"}
                />
                <br></br>
                <Select
                    name="status"
                    options={[{value: "ANY", label: "Any"}, {value: "OPEN", label: "Open"}, {value: "CLOSED", label: "Closed"}]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={updateStatus}
                    placeholder={"Select Status"}
                />
                <br></br>
                <Select
                    name="sorting"
                    options={[{value: "ALPHABETICAL_ASC", label: "A-Z"}, {value: "ALPHABETICAL_DESC", label: "Z-A"}, {value: "BIDS_ASC", label: "Lowest Bid"}
                        , {value: "BIDS_DESC", label: "Highest Bid"}, {value: "CLOSING_SOON", label: "Closing Soon"}, {value: "CLOSING_LAST", label: "Closing Last"}
                        , {value: "RESERVE_ASC", label: "Lowest Reserve"}, {value: "RESERVE_DESC", label: "Highest Reserve"}]}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={updateSort}
                    placeholder={"Sort By"}
                />
                <br></br>
            </FormControl>
            <TablePagination
                align={'left'}
                size={"small"}
                component="span"
                count={auctions.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
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
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <div style={{display: 'flex'}}>
                    <Navbar pageName={"Auctions"} />
                    <Container sx={{ width: 1/4, position: "fixed"}}>
                        <List>
                        {filter()}
                        </List>
                        <List>
                            <Grid container spacing={1}>
                                <Grid item sm={12}><Button fullWidth variant={"contained"} href={"/create-auction"}>Post New Auction</Button></Grid>
                                <Grid item sm={12}><Button fullWidth variant={"contained"} href={"/my-auctions"}>My Auctions</Button></Grid>
                            </Grid>

                        </List>
                    </Container>
                    <Container sx={{ width: "100%"}}>
                    <List>
                        {auctionList()}
                    </List>
                    </Container>
                </div>
            </div>
        )
    }
}
export default Auctions;