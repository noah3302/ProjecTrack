import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { apiget, apipost } from '../API/Api';
import { UserAuth } from "../Context/Authcontext";

export default function Createprofil() {
    const navigate = useNavigate();
    const { user } = UserAuth()

    useEffect (() => {
        apiget("users/nicknames").then((data) => {
            setNicknames(data.nicknames)
          })
    }, []);

    const [nicknames, setNicknames] = useState('');
    const [vorname, setVorname] = useState('');
    const [nachname, setNachname] = useState('');
    const [nickname, setNickname] = useState('');
    const [helper, setHelper] = useState(''); 

    const input = {
        marginTop: "1rem",
        backgroundColor: "white",
        width: '100%',
    }

    const isButtonDisabled = !vorname || !nachname || !nickname


    const navigation = async () => {
        try {
            await apipost(`users`, {
                id: 0,
                nachname: nachname,
                vorname: vorname,
                nickname: nickname,
                google_id: user?.userid, 
              });

              console.log("usess: ", id, nachname, vorname, nickname, user?.userid)
            navigate("/home");
          } catch (error) {
            console.log(error);
          }
        navigate('/home');
    };

    const handlevornameChange = (event) => {
        setVorname(event.target.value);
    };

    const handlenachnameChange = (event) => {
        setNachname(event.target.value);
    };

    

    const handlenicknameChange = (event) => {
        const regex = /^[a-zA-Z0-9]{4,12}$/;
        if (regex.test(event.target.value)) {
            if (nicknames.includes(event.target.value)) {
                setHelper("Der Nickname existiert bereits"); 
                setNickname("");
            } else {
                setNickname(event.target.value);
                setHelper(''); 
            }
        } else {
            setHelper("Der Nickname muss aus 4 bis 12 Buchstaben und/oder Zahlen bestehen."); 
            setNickname("");
        }

    };

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
                            Profil erstellen
                        </Button>
                    </Box>
                </Card>
            </Box>
        </>
    );
}