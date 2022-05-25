import axios from 'axios';
import React, {Component, useEffect, useLayoutEffect} from 'react'
import Select from 'react-select'
import {
    Box,
    Card, Checkbox, Chip,
    Container, Divider, FormControl, Grid, InputLabel,
    List,
    ListItemButton, ListItemText, MenuItem, OutlinedInput, Paper, SelectChangeEvent,
    Stack, TextField
} from "@mui/material";
import Navbar from "./Navbar";

const Auctions = () => {
    const [auctions, setAuctions] = React.useState<Array<auction>>([])
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [selectedCategories, setSelectedCategories] = React.useState<Array<string>>([])
    const [search, setSearch] = React.useState('')
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
    })
    const updateQ = async (event: { target?: any; }) => {
        setSearch(event.target.value)
    }
    const updateSearch = () => {
        axios.get('http://localhost:4941/api/v1/auctions', {params: {q: search, status: "OPEN", categoryIds: selectedCategories}})
            .then((response) => {
                setAuctions(response.data.auctions)
            })
    }
    const getAuctions = () => {
        axios.get('http://localhost:4941/api/v1/auctions', {params: {status:"OPEN"}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setAuctions(response.data.auctions)
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const updateCats = async (selectedCategories?: any) => {
        setSelectedCategories(selectedCategories.map((c: { value: any; }) => c.value))
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
            color: 'gray'
        },
        reserveMet: {
            color: 'orange'
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
                <p style={styles.reserveNotMet}>Current Bid: ${a.highestBid}</p>
            )
        } else {
            return (
                <p style={styles.reserveMet}>Current bid: ${a.highestBid}</p>
            )
        }
    }
    const timeRemaining = (a: auction) => {
        let endDate = new Date(a.endDate);
        let delta = endDate.getTime() - Date.now();
        if (delta < 0) {
            return <p style={styles.reserveNotMet}>Closed</p>
        } else if (delta < millisInDay) {
            return <p>Closing today!</p>
        } else {
            return <p>Closing in {Math.floor(delta/millisInDay)} days</p>
        }
    }
    const auctionList = () => {
        return auctions.map(a =>
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
                    <Grid item sm={8}>
                            <ListItemText>
                                <h3>{a.title}</h3>
                                <h4>{timeRemaining(a)}</h4>
                            </ListItemText>
                    </Grid>
                    <Grid item sm={2}>
                        <Stack>
                            <ListItemText>{auctionReserve(a)}</ListItemText>
                            <ListItemText>Reserve: ${a.reserve}</ListItemText>
                        </Stack>

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
            </FormControl>
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
                <h1>Auctions</h1>
                <div style={{display: 'flex'}}>
                    <Navbar pageName={"Auctions"} />
                    <Container sx={{ width: 1/5}}>
                        {filter()}
                    </Container>
                    <Container>
                    <List>
                        {auctionList()}
                    </List>
                    </Container>
                    <Container sx={{ width: 1/5}}>
                        <h2>dsadafds</h2>
                    </Container>
                </div>
            </div>
        )
    }
}
export default Auctions;