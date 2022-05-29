import Navbar from "./Navbar";
import {
    Alert, AlertColor,
    Button,
    Container,
    FormControl,
    Grid,
    Input,
    InputLabel,
    OutlinedInput, Snackbar,
    Stack,
    TextField
} from "@mui/material";
import React, {ReactNode} from "react";
import axios from "axios";
import {useUserStore} from "./store";
import {blob} from "stream/consumers";
import {Navigate, useNavigate} from "react-router-dom";

function Item(props: { children: ReactNode }) {
    return null;
}

const Register = () => {
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [confirmPassword, setConfirmPassword] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [photo, setPhoto] = React.useState('')
    const [errorFlag, setErrorFlag] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")
    const [fnError, setFNError] = React.useState(false)
    const [lnError, setLNError] = React.useState(false)
    const [emError, setEMError] = React.useState(false)
    const [passwordMatchString, setPasswordMatchString] = React.useState('')
    const [profilePhoto, setProfilePhoto] = React.useState<File>()
    const [profilePhotoPreview, setProfilePhotoPreview] = React.useState<string>("https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png")
    const [snackOpen, setSnackOpen] = React.useState(false)
    const [snackMessage, setSnackMessage] = React.useState("")
    const [snackSeverity, setSnackSeverity] = React.useState<AlertColor>("success")
    const emailRegex = new RegExp('^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$')
    const setToken = useUserStore(state => state.setToken)
    const userId = useUserStore(state => state.userId)
    const setUserId = useUserStore(state => state.setUserId)
    const nav = useNavigate();
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
    const updateFirstNameState  = (event: { target?: any; }) => {
        setFirstName(event.target.value);
        setFNError(false)
    }
    const updateLastNameState = (event: { target?: any; }) => {
        setLastName(event.target.value)
        setLNError(false)
    }
    const updateEmailState = (event: { target?: any; }) => {
        setEmail(event.target.value)
        setEMError(false)
    }
    const updatePasswordState = (event: { target?: any; }) => {
        setPassword(event.target.value)
        if (confirmPassword !== event.target.value) {
            setPasswordMatchString("Passwords do not match")
        } else {
            setPasswordMatchString('')
        }
    }
    const updateConfirmPasswordState = (event: { target?: any; }) => {
        setConfirmPassword(event.target.value)
        if (password !== event.target.value) {
            setPasswordMatchString("Passwords do not match")
        } else {
            setPasswordMatchString('')
        }
    }
    const updateProfilePhoto = (event: {target?: any;}) => {
        setProfilePhoto(event.target.files[0])
        setProfilePhotoPreview(URL.createObjectURL(event.target.files[0]))
    }
    const validateFields = () => {
        if (firstName.length < 1) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Please enter a first name")
            setFNError(true)
            return false;
        }
        setFNError(false)
        if (lastName.length < 1) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Please enter a last name")
            setLNError(true)
            return false;
        }
        setLNError(false)
        if (!emailRegex.test(email)) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Invalid email, must contain an @ and top level domain")
            setEMError(true)
            return false;
        }
        setEMError(false)
        if (password !== confirmPassword) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Passwords do not match")
            return false;
        }
        if (password.length < 6) {
            setSnackSeverity("error")
            setSnackOpen(true)
            setSnackMessage("Password must be at least 6 characters in length")
            return false;
        }
        return true;
    }
    const handleSnackClose = (event?: React.SyntheticEvent | Event,
                              reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackOpen(false);
    };
    const newUser = () => {
        if (validateFields()) {
            axios.post('http://localhost:4941/api/v1/users/register', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
                .then((response) => {
                    setSnackSeverity("success")
                    setSnackOpen(true)
                    setSnackMessage("Account successfully created")
                    let i = response.data.userId
                    setUserId(response.data.userId)
                    axios.post('http://localhost:4941/api/v1/users/login', {email: email, password: password})
                        .then(async (response2) => {
                            setToken(response2.data.token)
                            nav("/users/" + i)
                            if (profilePhoto !== undefined) {
                                await axios.put('http://localhost:4941/api/v1/users/' + i + '/image', profilePhoto, {
                                    headers: {
                                        "X-Authorization": response2.data.token,
                                        "content-type": profilePhoto?.type ?? 'image/jpeg'
                                    }
                                })
                            }
                        })
                }, (error) => {
                    setErrorFlag(true)
                    setErrorMessage(error.toString())
                })
        }
    }
    return (
        <div>
        <h1>Register</h1>
    <Navbar pageName={"Register"}/>
            <div>
                <Container maxWidth="sm">
                    <h1>Register</h1>
                <FormControl>
                    <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <TextField fullWidth autoCapitalize="on" required id="firstName" label="First Name" error={fnError} onChange={updateFirstNameState}/>
                        <TextField fullWidth autoCapitalize="on" margin={"dense"} required id="lastName" label="Last Name" error={lnError} onChange={updateLastNameState}/>
                    </Stack>
                        <TextField required margin={"dense"} fullWidth type="email" id="email" label="Email Address" error={emError} onChange={updateEmailState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="password" label="Password (min 6 chars)" error={password.length < 6 && password.length > 0} onChange={updatePasswordState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="confirmPassword" label="Confirm Password" error={confirmPassword.length > 0 && passwordMatchString !== ''} onChange={updateConfirmPasswordState}/>
                        <h6 style={{color: 'red'}}>{passwordMatchString}</h6>
                        <Grid container justifyContent="center">
                            <Grid item style={styles.photoPreview}>
                                <img alt={'Your profile photo'} src={profilePhotoPreview}
                                     onError={({ currentTarget }) => {
                                         currentTarget.onerror = null; // prevents looping
                                         currentTarget.src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Missing-image-232x150.png";
                                     }} height={400} />
                            </Grid>
                        </Grid>
                    <Button fullWidth variant="contained" component="label">
                        Upload Profile Photo
                        <Input type="file" id="photoUpload" inputProps={{ accept: 'image' }} style={{display: "none"}} onChange={updateProfilePhoto}/>
                    </Button>

                    <Stack direction="row" spacing={1} justifyContent={"right"}>
                        <Button variant="outlined" color="error">Cancel</Button>
                        <Button variant="outlined" color="success" onClick={newUser} disabled={passwordMatchString !== '' || password.length < 6}>Submit</Button>
                    </Stack>
                    </Stack>
                </FormControl>
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
export default Register;