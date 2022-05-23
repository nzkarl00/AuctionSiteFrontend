import Navbar from "./Navbar";
import {Button, Container, FormControl, Grid, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import React, {ReactNode} from "react";
import axios from "axios";

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
    }
    const newUser = () => {
        axios.post('http://localhost:4941/api/v1/users/register', {firstName: firstName, lastName: lastName, password: password, email: email})
            .then((response) => {
            if (photo != null) {
                return
            }
        }, (error) => {
            setErrorFlag(true)
            setErrorMessage(error.toString())
        })
    }
    return (
        <div>
        <h1>Register</h1>
    <Navbar />
            <div>
                <Container maxWidth="sm">
                    <h1>Register</h1>
                <FormControl>
                    <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <TextField fullWidth autoCapitalize="on" required id="firstName" label="First Name" onChange={updateFirstNameState}/>
                        <TextField fullWidth autoCapitalize="on" margin={"dense"} required id="lastName" label="Last Name" onChange={updateLastNameState}/>
                    </Stack>
                        <TextField required margin={"dense"} fullWidth type="email" id="email" label="Email Address" onChange={updateEmailState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="password" label="Password" error={password.length < 6} onChange={updatePasswordState}/>
                    <TextField required margin={"dense"} type="password" fullWidth id="confirmPassword" error={confirmPassword.length < 6} label="Confirm Password" onChange={updateConfirmPasswordState}/>
                    <label>
                    <Input type="file" id="photoUpload" style={{display: "none"}}/>
                    <Button fullWidth variant="contained" component="span">
                        Upload Profile Photo
                    </Button>
                    </label>
                    <Stack direction="row" spacing={1} justifyContent={"right"}>
                        <Button variant="outlined" color="error">Cancel</Button>
                        <Button variant="outlined" color="success" onClick={newUser} disabled={confirmPassword !== password}>Submit</Button>
                    </Stack>
                    </Stack>

                </FormControl>
                </Container>
            </div>
    </div>

    )
}
export default Register;