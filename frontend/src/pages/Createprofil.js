import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';

export default function Createprofil() {
    const navigate = useNavigate();
    const [vorname, setVorname] = useState('');
    const [nachname, setNachname] = useState('');
    const [nickname, setNickname] = useState('');
    const [helper, setHelper] = useState(''); // Zustand für den Helper-Text

    const input = {
        marginTop: "1rem",
        backgroundColor: "white",
        width: '100%',
    }

    const isButtonDisabled = !vorname || !nachname || !nickname

    const navigation = () => {
        console.log('Profil erstellt');
        navigate('/home');
    };

    const handlevornameChange = (event) => {
        setVorname(event.target.value);
    };

    const handlenachnameChange = (event) => {
        setNachname(event.target.value);
    };

    const handlenicknameChange = (event) => {
        const regex = /^[a-zA-Z0-9]{6,12}$/;
        if (regex.test(event.target.value)) {
            if (nicknamen.includes(event.target.value)) {
                setHelper("Der Nickname existiert bereits"); 
                setNickname("");
            } else {
                setNickname(event.target.value);
                setHelper(''); 
            }
        } else {
            setHelper("Der Nickname muss aus 6 bis 12 Buchstaben und/oder Zahlen bestehen."); 
            setNickname("");
        }

    };

    const nicknamen = [
        'Alex88',
        'Bob7a8',
        'Grace12',
        'Charlie9b',
        'Eva2c4',
        'Liam123',
        'Sophia69',
        'Samuel99',
        'Hannah3y',
        'Ruby234',
        'David9a7',
        'Frank15',
        'Quinn77',
        'Jack0p2',
        'Ivy34',
        'Katie6z',
        'Olivia12',
        'Paul1a4',
        'Mia9b',
        'Noah8x7'
    ];

    return (
        <>
            <Box sx={{ marginTop: "8rem", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ width: "30rem" }}>
                    <Box sx={{ padding: "2rem" }}>
                        <Typography align="center" variant='h5' mb={"1rem"}>Profil erstellen</Typography>
                        <TextField required onChange={handlevornameChange} style={input} label="Vorname" id="textinput" />
                        <TextField required onChange={handlenachnameChange} style={input} label="Nachname" id="textinput" />
                        <TextField required onChange={handlenicknameChange} style={input} label="Nickname" id="textinput" helperText={helper} />
                    </Box>
                    <Box mb="1rem" sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            sx={{ outline: '1px solid green', color: 'green' }}
                            onClick={navigation}
                            endIcon={<SendIcon />}
                            disabled={isButtonDisabled}
                        >
                            Projekt erstellen
                        </Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}