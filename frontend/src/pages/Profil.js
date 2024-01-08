import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { apiget, apiput, apidelete, apipost } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';

export default function Profil() {
  const { user, setUser, logOut } = UserAuth();
  const [id, setid] = useState(null);
  const [google_id, setgoogleid] = useState(null);
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [nickname, setNickname] = useState('');
  const [helper, setHelper] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingNicknames, setExistingNicknames] = useState([]);
  const [changeNickname, setChangeNickname] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    fetchExistingNicknames();
    fetchUserData();
  }, []);


  const [userGoogleData, setUserGoogleData] = useState("")
  const fetchUserData = async () => {
    apiget(`google_user/${user.userid}`).then((result) => {
      setid(result.id);
      setVorname(result.name || '');
      setNachname(result.surname || '');
      setNickname(result.nickname || '');
      setgoogleid(result.google_id);
      setIsEditMode(true);
      setUserGoogleData(result.user)
    });
  }

  const fetchExistingNicknames = async (nickname) => {
    try {
      const data = await apiget('users/nicknames');

      if (!data || !Array.isArray(data.nicknames)) {
        console.error('Ungültige Datenstruktur für Nicknames erhalten.');
        return;
      }

      const sanitizedNickname = (nickname || '').trim().toLowerCase();

      const nicknamesData = data.nicknames.filter((nick) => {
        if (typeof nick === 'string') {
          const sanitizedNick = nick.trim().toLowerCase();
          return sanitizedNick !== sanitizedNickname;
        }
        return false;
      });

      if (nicknamesData.length > 0) {
        setExistingNicknames(nicknamesData);
      } else {
        setExistingNicknames([]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nicknames:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {

      const profileData = {
        id: id,
        surname: nachname,
        name: vorname,
        nickname: nickname,
        google_id: google_id,
      };

      await apiput('users', user.id, profileData);
      await setUser({ ...user, ['id']: id, });
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
    }
  };


  const handleDeleteProfile = async () => {
    try {
      const confirmDelete = window.confirm('Möchten Sie Ihr Profil wirklich löschen?');
      if (confirmDelete) {
        await apidelete('users', user.id);

        setid("");
        setVorname('');
        setNachname('');
        setNickname('');


        await logOut();

        navigate("/");
      } else {
        console.log('Löschen des Profils abgebrochen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
    }
  };


  const handleEditProfile = () => {
    setIsEditMode(true);
  };

  const handleVornameChange = (event) => {
    setVorname(event.target.value);
  };

  const handleNachnameChange = (event) => {
    setNachname(event.target.value);
  };

  const handleNicknameChange = (event) => {
    const newNickname = event.target.value;
    setNickname(newNickname);

    // Überprüfe, ob der Nickname bereits existiert
    if (existingNicknames.includes(newNickname)) {
      setHelper('Nickname bereits vergeben');
    } else {
      setHelper('');
    }
  };

  return (
    <>
      <Box sx={{ marginTop: '8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ width: '30rem' }}>
          <Box sx={{ padding: '2rem' }}>
            <Typography align="center" variant="h5" mb="1rem">
              {isEditMode ? 'Profil bearbeiten' : 'Profil anzeigen'}
            </Typography>
            <TextField
              required
              style={input}
              label="Vorname"
              id="vorname"
              value={vorname}
              onChange={handleVornameChange}
              disabled={!isEditMode}
            />
            <TextField
              required
              style={input}
              label="Nachname"
              id="nachname"
              value={nachname}
              onChange={handleNachnameChange}
              disabled={!isEditMode}
            />
            <TextField
              required
              style={input}
              label="Nickname"
              id="nickname"
              helperText={helper}
              value={nickname}
              onChange={handleNicknameChange}
              disabled={!isEditMode}
            />
          </Box>
          <Box mb="1rem" sx={{display: 'flex', gap: '10px', justifyContent: 'center'}}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveProfile}
              endIcon={<SendIcon />}
              disabled={!isEditMode || !vorname || !nachname || !nickname || helper}
            >
              Profil aktualisieren
            </Button>
            {isEditMode && (
              <Button
                sx={{ backgroundColor: "primary.contrastText" }}
                style={{ color: "white" }}
                onClick={handleDeleteProfile}
                startIcon={<DeleteIcon />}
              >
                Profil löschen
              </Button>
            )}
          </Box>
        </Card>
      </Box>
    </>
  );
}

const input = {
  marginTop: '1rem',
  backgroundColor: 'white',
  width: '100%',
};
