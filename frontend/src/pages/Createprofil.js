import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Card, Typography, Button, Box } from '@mui/material';
import {Link} from "react-router-dom";

export default function Createprofil() {
    const allfilled = () => {
        if(true){
            return true
        } else{
            return false
        }
    }
    
    const input = {
        margin:"1rem",
        backgroundColor:"withe"
    }
    
  return (
    <>
        <Box>
            <Card sx={{marginTop:"8rem", marginLeft:"auto",marginRight:"auto", width:"20rem", outline:"3px solid lightgrey"}}>
                <Typography align="center">Persönliche Daten</Typography>
                <TextField style={input} label="Vorname" id="textinput" required/>
                <TextField style={input} label="Nachname" id="textinput" required/>
                <TextField style={input} label="Nickname" id="textinput" required/>
                {allfilled()? <Button sx={{marginTop:"1rem", marginLeft:"auto",marginRight:"auto", width:"20rem", backgroundColor:"lightgrey"}}
                ><Link sx={{textDecoration: "none", color: "black", alignItems: "center"}} to="/home">Registrierung abschließen</Link></Button> : <Button disabled>Registrierung abschließen</Button>}
            </Card>
        </Box>
    </>
  );
}