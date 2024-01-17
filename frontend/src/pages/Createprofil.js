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
  const { user, setUser, setUserdata } = UserAuth();

  useEffect(() => {
    apiget(`users`).then((data) => {
      const nicknames = data.map((user) => user.nickname);
      setExistingusers(nicknames);
    });
  }, []);

  const [existingusers, setExistingusers] = useState('');
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [nickname, setNickname] = useState('');
  const [helper, setHelper] = useState('');

  const input = {
    marginTop: "1rem",
    backgroundColor: "white",
    width: '100%',
  };

  const isButtonDisabled = !vorname || !nachname || !nickname;

  const navigation = async () => {
    try {
      const existingUser = await apipost(`users`, {
        id: 0,
        surname: nachname,
        name: vorname,
        nickname: nickname,
        google_id: user?.userid,
      });

      await setUser({ ...user, ['id']: existingUser.id });
      setUserdata(true);

      navigate("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVornameChange = (event) => {
    setVorname(event.target.value);
  };

  const handleNachnameChange = (event) => {
    setNachname(event.target.value);
  };

  const handleNicknameChange = (event) => {
    const regex = /^[a-zA-Z0-9]{4,12}$/;
    if (regex.test(event.target.value)) {
      if (existingusers.includes(event.target.value)) {
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
      <Box
        sx={{
          marginTop: "8rem",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card
          sx={{
            width: "18rem",
            padding: "2rem",
            boxShadow: 6,
            borderRadius: 2,
          }}
        >
          <Typography
            align="center"
            variant='h5'
            mb={"1rem"}
            sx={{ color: 'primary.main' }}
          >
            Profil erstellen
          </Typography>
          <TextField
            required
            onChange={handleVornameChange}
            style={input}
            label="Vorname"
            id="textinput"
          />
          <TextField
            required
            onChange={handleNachnameChange}
            style={input}
            label="Nachname"
            id="textinput"
          />
          <TextField
            required
            onChange={handleNicknameChange}
            style={input}
            label="Nickname"
            id="textinput"
            helperText={helper}
          />
          <Box
            mb="1rem"
            sx={{
              display: 'flex',
              justifyContent: 'center',
              marginTop: '1rem',
            }}
          >
            <Button
              sx={{
                width:"100%",
                outline: '1px solid green',
                color: 'green',
                '&:hover': { backgroundColor: 'lightgreen' },
              }}
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