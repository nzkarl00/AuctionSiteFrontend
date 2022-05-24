import Navbar from "./Navbar";
import {Button, Container, FormControl, Grid, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import React, {ReactNode} from "react";
import axios from "axios";
import {useUserStore} from "./store";

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
    const [passwordMatchString, setPasswordMatchString] = React.useState('')
    const [profilePhoto, setProfilePhoto] = React.useState(null)
    const emailRegex = new RegExp('^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{1,}$')
    const setToken = useUserStore(state => state.setToken)
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
        setProfilePhoto(event.target.value)
    }
    const newUser = () => {
        axios.post('http://localhost:4941/api/v1/users/register', {firstName: firstName, lastName: lastName, email: email, password: password})
            .then((response) => {
                let newId = response.data.userId
                axios.post('http://localhost:4941/api/v1/users/login', {email: email, password: password})
                    .then((response2) => {
                        setToken(response2.data.token)
                    })
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
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
                        <TextField fullWidth autoCapitalize="on" required id="firstName" label="First Name" error={firstName.length < 1} onChange={updateFirstNameState}/>
                        <TextField fullWidth autoCapitalize="on" margin={"dense"} required id="lastName" label="Last Name" error={lastName.length < 1} onChange={updateLastNameState}/>
                    </Stack>
                        <TextField required margin={"dense"} fullWidth type="email" id="email" label="Email Address" error={!emailRegex.test(email)} onChange={updateEmailState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="password" label="Password" error={password.length < 6 || passwordMatchString !== ''} onChange={updatePasswordState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="confirmPassword" error={confirmPassword.length < 6 || passwordMatchString !== ''} label="Confirm Password" onChange={updateConfirmPasswordState}/>
                        <h6>{passwordMatchString}</h6>

                    <Button fullWidth variant="contained" component="label">
                        Upload Profile Photo
                        <Input type="file" id="photoUpload" style={{display: "none"}} onChange={updateProfilePhoto}/>
                    </Button>
                    <Stack direction="row" spacing={1} justifyContent={"right"}>
                        <Button variant="outlined" color="error">Cancel</Button>
                        <Button variant="outlined" color="success" onClick={newUser} disabled={passwordMatchString !== ''}>Submit</Button>
                    </Stack>
                    </Stack>
                </FormControl>
                </Container>
            </div>
    </div>

    )
}
export default Register;