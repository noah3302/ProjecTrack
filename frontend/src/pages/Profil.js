import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Card, Typography, Button, Box } from '@mui/material';

export default function Profil() {

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
                <TextField style={input} label="Vorname" id="textinput" defaultValue="Vorname" />
                <TextField style={input} label="Nachname" id="textinput" defaultValue="Nachname" />
                <TextField style={input} label="Nickname" id="textinput" defaultValue="Nickname" />
                <Button color="success" sx={{marginLeft:"1rem"}}>Speichern</Button>
                <Button color='error' sx={{float:"right", marginRight:"1rem"}}>Profil löschen</Button>
            </Card>
        </Box>
    </>
  );
}