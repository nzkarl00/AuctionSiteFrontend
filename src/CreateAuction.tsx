import Navbar from "./Navbar";
import {
    Alert, AlertColor, Box,
    Button,
    Container,
    Divider,
    FormControl,
    Grid,
    IconButton, Input, InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent, Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import React, {useEffect} from "react";
import axios from "axios";
import {useUserStore} from "./store";
import {useNavigate} from "react-router-dom";

const CreateAuction = () => {
    const token = useUserStore(state => state.userToken)
    const userId = useUserStore(state => state.userId)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [categories, setCategories] = React.useState<Array<category>>([])
    const [auctionPhoto, setAuctionPhoto] = React.useState<File>()
    const [auctionPhotoPreview, setAuctionPhotoPreview] = React.useState<string>("https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [snackSeverity, setSnackSeverity] = React.useState<AlertColor>("success")
    const [title, setTitle] = React.useState<string>('')
    const [category, setCategory] = React.useState<number>(0)
    const [description, setDescription] = React.useState<string>('')
    const [reserve, setReserve] = React.useState<number>(0)
    const [end, setEnd] = React.useState('')
    const nav = useNavigate()
    React.useEffect(() => {
        getCategories()
        if (token === '' || userId === 0) {
            nav('/access-denied')
        }
    }, [])
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const updateAuctionPhoto = (event: {target?: any;}) => {
        setAuctionPhoto(event.target.files[0])
        setAuctionPhotoPreview(URL.createObjectURL(event.target.files[0]))
    }
    const updateTitle = (event: { target?: any; }) => {
        setTitle(event.target.value)
    }
    const updateCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCategory(parseInt(event.target.value,10));
    }
    const updateDescription = (event: { target?: any; }) => {
        setDescription(event.target.value)
    }
    const updateReserve = (event: { target?: any; }) => {
        setReserve(event.target.value)
    }
    const updateEnd = (event: { target?: any; }) => {
        setEnd(event.target.value)
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
    const createAuction = () => {
        if (end === '') {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Auction end date is required")
            return
        }
        if (description === '') {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Auction description is required")
            return
        }
        if (title === '') {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Auction title is required")
            return
        }
        if (new Date(end).getTime() <= Date.now()) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("End date must be in the future")
            return
        }
        axios.post('http://localhost:4941/api/v1/auctions', {"title": title, "description": description, "categoryId": category, "endDate": end, "reserve": Math.min(1, reserve)}, {headers: {"X-Authorization": token}})
            .then((response) => {
                setErrorFlag(false)
                setErrorMessage("")
                setSnackSeverity("success")
                setSnackOpen(true)
                setSnackMessage("Auction created successfully")
                axios.put('http://localhost:4941/api/v1/auctions/' + response.data.auctionId + '/image', auctionPhoto, {headers: {"X-Authorization": token, "content-type": auctionPhoto?.type ?? 'image/jpeg'}})
                    .then((response) => {
                    }, (error) => {
                        setErrorFlag(true)
                        setErrorMessage(error.toString())
                    })
                nav('/auctions/' + response.data.auctionId)
            }, (error) => {
                setSnackSeverity("error")
                setSnackOpen(true)
                setSnackMessage(error.response.statusText)
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const styles = {
        photoPreview: {
            height: 400,
            width: 400,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid black',
            backgroundColor: 'lightgray'
        }
    }
    return (
        <div>
            <h1>My Details</h1>
            <Navbar pageName={"Create Auction"}/>
                <Container maxWidth="md">
                    <Paper elevation={4}>
                        <Typography align={"center"} variant={"h4"}>Create Auction</Typography>
                        <br></br>
                        <Divider />
                        <br></br>
                        <FormControl size={'medium'}>
                            <Stack direction="column" spacing={2}>
                                <TextField required fullWidth id="inputTitle" label={"Title"} onChange={updateTitle}/>
                                <TextField select label={"Item Category"} value={category} required onChange={updateCategory}>
                                    {categories.map(({ categoryId, name}) => (
                                        <MenuItem key={categoryId} style={{height: 25}} value={categoryId}>
                                            {name}
                                        </MenuItem>
                                        ))}
                                </TextField>
                                <TextField required multiline fullWidth id="inputDesc" label={"Description"} onChange={updateDescription}/>
                                <Stack direction="row" spacing={1} justifyContent={"right"}>
                                    <TextField type={"number"} InputProps={{ inputProps: { min: 1} }} label={"Reserve"} onChange={updateReserve}/>
                                    <TextField required fullWidth type={"date"} label={"End Date"} onChange={updateEnd} InputLabelProps={{shrink: true}}/>
                                </Stack>
                                <Grid container justifyContent="center">
                                    <Grid item style={styles.photoPreview}>
                                        <img alt={'Auction photo'} src={auctionPhotoPreview}
                                             onError={({ currentTarget }) => {
                                                 currentTarget.onerror = null; // prevents looping
                                                 currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                                             }} height={400} />
                                    </Grid>
                                </Grid>
                                <Button fullWidth variant="contained" component="label">
                                    Upload Auction Photo
                                    <Input type="file" id="photoUpload" inputProps={{ accept: 'image' }} style={{display: "none"}} onChange={updateAuctionPhoto}/>
                                </Button>

                                <Stack direction="row" spacing={1} justifyContent={"right"}>
                                    <Button variant="outlined" color="error" href={'/auctions'}>Cancel</Button>
                                    <Button variant="outlined" color="success" onClick={createAuction}>Submit</Button>
                                </Stack>
                            </Stack>
                            <br></br>
                        </FormControl>
                    </Paper>
                </Container>
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
        </div>
    )
}
export default CreateAuction