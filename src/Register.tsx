import Navbar from "./Navbar";
import {Button, Container, Grid, Input, InputLabel, OutlinedInput, Stack, TextField} from "@mui/material";
import {ReactNode} from "react";

function Item(props: { children: ReactNode }) {
    return null;
}

const Register = () => {
    return (
        <div>
        <h1>Register</h1>
    <Navbar />
            <div>
                <Container maxWidth="sm">
                    <h1>Register</h1>
                <form>
                    <Stack direction="column" spacing={2}>
                    <Stack direction="row" spacing={1}>
                        <TextField fullWidth autoCapitalize="on" required id="firstName" label="First Name"/>
                        <TextField fullWidth autoCapitalize="on" margin={"dense"} required id="lastName" label="Last Name"/>
                    </Stack>
                        <TextField required margin={"dense"} fullWidth type="email" id="email" label="Email Address"/>
                    <TextField required margin={"dense"} type="password" fullWidth id="password" label="Password"/>
                    <TextField required margin={"dense"} type="password" fullWidth id="confirmPassword" label="Confirm Password"/>
                    <label>
                    <Input type="file" id="photoUpload" style={{display: "none"}}/>
                    <Button fullWidth variant="contained" component="span">
                        Upload Profile Photo
                    </Button>
                    </label>
                    <Stack direction="row" spacing={1} justifyContent={"right"}>
                        <Button variant="outlined" color="error">Cancel</Button>
                        <Button variant="outlined" color="success">Submit</Button>
                    </Stack>
                    </Stack>

                </form>
                </Container>
            </div>
    </div>

    )
}
export default Register;