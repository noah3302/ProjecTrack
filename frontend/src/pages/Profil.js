import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { apiget, apiput, apidelete, apipost } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';

export default function Profil() {
  const { user, setUser } = UserAuth();



  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [nickname, setNickname] = useState('');
  const [helper, setHelper] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingNicknames, setExistingNicknames] = useState([]);

  useEffect(() => {
    fetchUserData();
    fetchExistingNicknames();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await apiget(`users`);
      if (userData && userData.length > 0) {
        // Find the user with the specific google_id
        const userWithGoogleId = userData.find(userArray => userArray.google_id === user.userid);
  
        if (userWithGoogleId) {
          setVorname(userWithGoogleId.surname || '');
          setNachname(userWithGoogleId.name || '');
          setNickname(userWithGoogleId.nickname || '');
          setIsEditMode(true);
          console.log("userData", userWithGoogleId);
        } else {
          console.log("User with the specified google_id not found");
        }
      }
    } catch (error) {
      console.error('Fehler beim Laden des Profils:', error);
    }
  };

  const fetchExistingNicknames = async () => {
    try {
      const nicknamesData = await apiget('users/nicknames');
      if (nicknamesData) {
        setExistingNicknames(nicknamesData.nicknames || []);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nicknames:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (isEditMode) {
        // Update existing profile
        await apiput('users', user.google_id, {
          vorname: vorname,
          nachname: nachname,
          nickname: nickname,
          // Add other profile data here
        });
        console.log('Profil erfolgreich aktualisiert');
        // Re-fetch user data after updating
        fetchUserData();
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
        // Re-fetch user data after creating
        fetchUserData();
      }
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
    }
  };

  const handleDeleteProfile = async () => {
    try {
      const confirmDelete = window.confirm('Möchten Sie Ihr Profil wirklich löschen?');

      if (confirmDelete) {
        await apidelete('users', user.google_id);
        console.log('Profil erfolgreich gelöscht');
        // Optionally, you can add logic to navigate to another page or perform other actions after deletion
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
              id="textinput"
              value={vorname}
              disabled={!isEditMode}
            />
            <TextField
              required
              style={input}
              label="Nachname"
              id="textinput"
              value={nachname}
              disabled={!isEditMode}
            />
            <TextField
              required
              style={input}
              label="Nickname"
              id="textinput"
              helperText={helper}
              value={nickname}
              disabled={!isEditMode}
            />
          </Box>
          <Box mb="1rem" sx={{ display: 'flex', justifyContent: 'center' }}>
            {!isEditMode && (
              <Button
                sx={{ outline: '1px solid blue', color: 'blue', marginRight: '1rem' }}
                onClick={handleEditProfile}
              >
                Profil speichern
              </Button>
            )}
            <Button
              sx={{ outline: '1px solid green', color: 'green', marginRight: '1rem' }}
              onClick={handleSaveProfile}
              endIcon={<SendIcon />}
              disabled={!isEditMode || !vorname || !nachname || !nickname}
            >
              Profil {isEditMode ? 'aktualisieren' : 'erstellen'}
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
