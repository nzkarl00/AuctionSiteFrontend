import {useParams} from "react-router-dom";
import {useUserStore} from "./store";
import React from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
    Alert,
    AlertColor,
    Button,
    Container, Divider,
    FormControl,
    Grid,
    IconButton,
    Input,
    Paper, Snackbar,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const MyProfile = () => {
    const token = useUserStore(state => state.userToken)
    const userId = useUserStore(state => state.userId)
    const [user, setUser] = React.useState<userReturnWithEmail>({firstName: '', lastName: '', email: ''})
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [currentPassword, setCurrentPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [profilePhoto, setProfilePhoto] = React.useState<File>()
    const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string>('http://localhost:4941/api/v1/users/' + userId + '/image')
    const [editActive, setEditActive] = React.useState<boolean>(false)
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [editingPassword, setEditingPassword] = React.useState<boolean>(false)
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [k, setK] = React.useState<string>('0')
    const [snackMessage, setSnackMessage] = React.useState("")
    const [snackSeverity, setSnackSeverity] = React.useState<AlertColor>("success")
    const emailRegex = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
    React.useEffect(() => {
        getUser()
    }, [userId])
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const getUser = () => {
            axios.get('http://localhost:4941/api/v1/users/' + userId, {headers: {"X-Authorization": token}})
                .then((response) => {
                    setUser(response.data)
                    setK(`${Math.floor((Math.random() * 1000))}-min`)
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
    }
    const putPhoto = () => {
        axios.put('http://localhost:4941/api/v1/users/' + userId + '/image', profilePhoto, {headers: {"X-Authorization": token, "content-type": profilePhoto?.type ?? 'image/jpeg'}})
            .then((response) => {
            }, (error) => {
                setErrorFlag(true)
                setErrorMessage(error.toString())
            })
    }
    const editUser = async () => {
        setErrorFlag(false)
        let data: userPatch = {}
        if (profilePhoto) {
            await putPhoto()
        }
        if (firstName !== '') {
            data.firstName = firstName
        }
        if (lastName !== '') {
            data.lastName = lastName
        }
        if (email !== '') {
            if (emailRegex.test(email)) {
                data.email = email
            } else {
                setSnackSeverity("error")
                setSnackOpen(true)
                setSnackMessage("Email must contain an @ and top level domain")
                setErrorFlag(true)
            }
        }
        if (editingPassword) {
            if (password.length < 6) {
                setSnackSeverity("error")
                setSnackOpen(true)
                setErrorFlag(true)
                setSnackMessage("Password must be 6 characters in length")
            } else {
                data.password = password
                data.currentPassword = currentPassword
            }
        }
        console.log(data)
        if (!errorFlag) {
            axios.patch('http://localhost:4941/api/v1/users/' + userId, data,
                {headers: {"X-Authorization": token}})
                .then((response) => {
                    console.log(response)
                    setSnackSeverity("success")
                    setSnackOpen(true)
                    setSnackMessage("Profile updated successfully")
                }, (error) => {
                    setErrorFlag(true)
                    console.log('meme' + error)
                    setErrorMessage(error.toString())
                    setSnackSeverity("error")
                    setSnackOpen(true)
                    setSnackMessage("Something went wrong")
                })
        } else {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Something went wrong")
        }
    }
    const updateFirstNameState  = (event: { target?: any; }) => {
        setFirstName(event.target.value);
    }
    const updateLastNameState = (event: { target?: any; }) => {
        setLastName(event.target.value)
    }
    const updateEmailState = (event: { target?: any; }) => {
        setEmail(event.target.value)
    }
    const updatePasswordState = (event: { target?: any; }) => {
        setPassword(event.target.value)
        if (event.target.value === '') {
            setEditingPassword(false)
        } else {
            setEditingPassword(true)
        }
    }
    const updateCurrentPasswordState = (event: { target?: any; }) => {
        setCurrentPassword(event.target.value)
    }
    const updateProfilePhoto = (event: {target?: any;}) => {
        setProfilePhoto(event.target.files[0])
        setProfilePhotoPreview(URL.createObjectURL(event.target.files[0]))
    }
    const updateEditActive = () => {
        setEditActive(!editActive)
        setK(`${Math.floor((Math.random() * 1000))}-min`)
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
            <Navbar pageName={"My Details"}/>
            <div>
                <Container maxWidth="sm">
                    <Paper elevation={4}>
                        <Grid container>
                            <Grid item sm={1}></Grid>
                            <Grid item sm={10}><Typography align={"center"} variant={"h4"}>My Details</Typography></Grid>
                            <Grid item sm={1}><IconButton onClick={updateEditActive}><EditIcon/></IconButton></Grid>
                        </Grid>
                        <br></br>
                        <Divider />
                        <br></br>
                        <FormControl>
                            <Stack direction="column" spacing={2}>
                                <Stack direction="row" spacing={1}>
                                    <TextField fullWidth autoCapitalize="on" key={k+'1'} disabled={!editActive} defaultValue={user.firstName} id="firstName" label={"First Name"} onChange={updateFirstNameState}/>
                                    <TextField fullWidth autoCapitalize="on" key={k+'2'} disabled={!editActive} margin={"dense"} defaultValue={user.lastName} id="lastName" label={"Last Name"} onChange={updateLastNameState}/>
                                </Stack>
                                <TextField margin={"dense"} disabled={!editActive} key={k+'3'} fullWidth type="email" id="emailInput" error={editActive && !emailRegex.test(email) && email !== ''} defaultValue={user.email} label={"Email"} onChange={updateEmailState}/>
                                <TextField margin={"dense"} disabled={!editActive} sx={{display: editActive ? '' : 'none'}} type="password" error={editingPassword && password.length < 6} fullWidth id="password" label="New Password (min 6 chars)" onChange={updatePasswordState}/>
                                <TextField required={editingPassword} margin={"dense"} sx={{display: editingPassword ? '' : 'none'}} disabled={!editActive} type="password" fullWidth id="currentPassword" label="Current Password" onChange={updateCurrentPasswordState}/>
                                <Grid container justifyContent="center">
                                    <Grid item style={styles.photoPreview}>
                                        <img alt={'Your profile photo'} src={profilePhotoPreview}
                                             onError={({ currentTarget }) => {
                                                 currentTarget.onerror = null; // prevents looping
                                                 currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                                             }} height={400} />
                                    </Grid>
                                </Grid>
                                <Button fullWidth variant="contained" component="label" sx={{display: editActive ? '' : 'none'}}>
                                    Upload Profile Photo
                                    <Input type="file" id="photoUpload" inputProps={{ accept: 'image' }} style={{display: "none"}} onChange={updateProfilePhoto}/>
                                </Button>

                                <Stack direction="row" spacing={1} justifyContent={"right"}>
                                    <Button variant="outlined" color="error" onClick={updateEditActive} sx={{display: editActive ? '' : 'none'}}>Cancel</Button>
                                    <Button variant="outlined" color="success" onClick={editUser} disabled={editingPassword && password.length < 6} sx={{display: editActive ? '' : 'none'}}>Submit</Button>
                                </Stack>
                            </Stack>
                            <br></br>
                        </FormControl>
                    </Paper>
                </Container>
            </div>
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
export default MyProfile;