import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Card, Typography, Button, Box } from '@mui/material';

export default function Profil() {

    const input = {
        margin:"1rem",
        backgroundColor:"withe"
    }
    
  return (
    <>
        <Box sx={{marginTop:"8rem"}}>
            <Card sx={{marginLeft:"auto",marginRight:"auto", width:"20rem", backgroundColor:"lightgrey"}}>
                <Typography align="center">Persönliche Daten</Typography>
                <TextField style={input} label="Vorname" id="textinput" defaultValue="Vorname" />
                <TextField style={input} label="Nachname" id="textinput" defaultValue="Nachname" />
                <TextField style={input} label="Nickname" id="textinput" defaultValue="Nickname" />
                <Button sx={{marginLeft:"1rem",marginBottom:"1rem", backgroundColor:"blue", color:"white"}}>speichern</Button>
                <Button sx={{float:"right", backgroundColor:"red", color:"white", marginRight:"1rem",marginBottom:"1rem"}}>Profil löschen</Button>
            </Card>
        </Box>
    </>
  );
}