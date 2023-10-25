import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Card, Typography, Box } from '@mui/material';
import {Link} from "react-router-dom";

export default function Createprofil() {
    const input = {
        margin:"1rem",
        backgroundColor:"withe",
        width:"18rem"
    }
    
  return (
    <>
        <Box sx={{marginTop:"8rem"}}>
            <Card sx={{marginLeft:"auto",marginRight:"auto", width:"20rem", padding:"2rem"}}>
                <Typography align="center" variant='h5' mb={"1rem"}>Persönliche Daten</Typography>
                <TextField style={input} label="Vorname" id="textinput" />
                <TextField style={input} label="Nachname" id="textinput" />
                <TextField style={input} label="Nickname" id="textinput"/>
                <Link align="center" component="button" underline="none" color='success' to="/home">Registrierung abschließen</Link>
            </Card>
        </Box>
    </>
  );
}