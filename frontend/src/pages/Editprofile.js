import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { apiget, apiput, apidelete } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';

export default function Profil() {
  const { user, setUser } = UserAuth();

  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [nickname, setNickname] = useState('');
  const [helper, setHelper] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await apiget(`users/${user.google_id}`);
      if (userData) {
        setVorname(userData.vorname || '');
        setNachname(userData.nachname || '');
        setNickname(userData.nickname || '');
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (isEditMode) {
        // Update existing profile
        await apiput(`users/${user.google_id}`, {
          vorname: vorname,
          nachname: nachname,
          nickname: nickname,
          // Add other profile data here
        });
        console.log('Profil erfolgreich aktualisiert');
      } else {
        // Create new profile
        const existingUser = await apipost('users', {
          id: 0,
          nachname: nachname,
          vorname: vorname,
          nickname: nickname,
          google_id: user?.userid,
        });

        await setUser({ ...user, ['id']: existingUser.id });

        console.log('Profil erfolgreich erstellt');
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const confirmDelete = window.confirm('Möchten Sie Ihr Profil wirklich löschen?');

      if (confirmDelete) {
        await apidelete(`users/${user.google_id}`);
        console.log('Profil erfolgreich gelöscht');
        // Optionally, you can add logic to navigate to another page or perform other actions after deletion
      } else {
        console.log('Löschen des Profils abgebrochen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
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
      if (nicknames.includes(event.target.value)) {
        setHelper('Der Nickname existiert bereits');
        setNickname('');
      } else {
        setNickname(event.target.value);
        setHelper('');
      }
    } else {
      setHelper('Der Nickname muss aus 4 bis 12 Buchstaben und/oder Zahlen bestehen.');
      setNickname('');
    }
  };

  return (
    <>
      <Box sx={{ marginTop: '8rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card sx={{ width: '30rem' }}>
          <Box sx={{ padding: '2rem' }}>
            <Typography align="center" variant="h5" mb="1rem">
              {isEditMode ? 'Profil bearbeiten' : 'Profil erstellen'}
            </Typography>
            <TextField required onChange={handleVornameChange} style={input} label="Vorname" id="textinput" value={vorname} />
            <TextField required onChange={handleNachnameChange} style={input} label="Nachname" id="textinput" value={nachname} />
            <TextField
              required
              onChange={handleNicknameChange}
              style={input}
              label="Nickname"
              id="textinput"
              helperText={helper}
              value={nickname}
            />
          </Box>
          <Box mb="1rem" sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              sx={{ outline: '1px solid green', color: 'green', marginRight: '1rem' }}
              onClick={handleSaveProfile}
              endIcon={<SendIcon />}
              disabled={!vorname || !nachname || !nickname}
            >
              {isEditMode ? 'Profil aktualisieren' : 'Profil erstellen'}
            </Button>
            {isEditMode && (
              <Button
                sx={{ outline: '1px solid red', color: 'red' }}
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
