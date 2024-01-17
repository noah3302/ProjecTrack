import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { apiget, apiput, apidelete } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';
import { Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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
  const [disable, setDisable] = useState(true);
  const [navigateConfirmationOpen, setNavigateConfirmationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExistingNicknames();
    fetchUserData();
  }, []);

  const [userGoogleData, setUserGoogleData] = useState('');

  const fetchUserData = async () => {
    apiget(`google_user/${user.userid}`).then((result) => {
      setid(result.id);
      setVorname(result.name || '');
      setNachname(result.surname || '');
      setNickname(result.nickname || '');
      setgoogleid(result.google_id);
      setIsEditMode(true);
      setUserGoogleData(result.user);
    });
  };

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
      await setUser({ ...user, ['id']: id });
    } catch (error) {
      console.error('Fehler beim Speichern des Profils:', error);
    }
  };

  const handleDeleteProfile = () => {
    setNavigateConfirmationOpen(true);
  };

  const handleConfirmDeleteProfile = async () => {
    try {
      await apidelete('users', user.id);
      setid('');
      setVorname('');
      setNachname('');
      setNickname('');

      await logOut();

      navigate('/');
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
    } finally {
      setNavigateConfirmationOpen(false);
    }
  };

  const handleCancelDeleteProfile = () => {
    setNavigateConfirmationOpen(false);
  };

  const handleVornameChange = (event) => {
    setVorname(event.target.value);
  };

  const handleNachnameChange = (event) => {
    setNachname(event.target.value);
  };

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
    const regex = /^[a-zA-Z0-9]{4,12}$/;
    if (regex.test(event.target.value)) {
      setDisable(false);
      if (existingNicknames.includes(event.target.value)) {
        setHelper('Der Nickname existiert bereits');
        setDisable(false);
      } else {
        setHelper('');
        setDisable(true);
      }
    } else {
      setHelper(
        'Der Nickname muss aus 4 bis 12 Buchstaben und/oder Zahlen bestehen.'
      );
      setDisable(false);
    }
  };

  const input = {
    marginTop: '1rem',
    backgroundColor: 'white',
    width: '100%',
  };

  return (
    <>
      <Box
        sx={{
          marginTop: '8rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Card sx={{ width: '20rem' }}>
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
          <Box mb="1rem" style={{ display: "grid", gap: "10px", justifyContent: "center" }}>
            <Grid container spacing={2}>
              <Grid item xs={1}/>
              <Grid item xs={10}>
                <Button
                  sx={{ width: "100%" }}
                  variant="contained"
                  color="success"
                  onClick={handleSaveProfile}
                  endIcon={<SendIcon />}
                  disabled={!isEditMode || !vorname || !nachname || !disable}
                >
                  Profil aktualisieren
                </Button>
              </Grid>
              <Grid item xs={1}/>
              <Grid item xs={1}/>
              <Grid item xs={10}>
                <Button
                  sx={{ color: "white", backgroundColor: "primary.contrastText", width: "100%" }}
                  onClick={handleDeleteProfile}
                  startIcon={<DeleteIcon />}
                >
                  Profil löschen
                </Button>
              </Grid>
              <Grid item xs={1}/>
            </Grid>
          </Box>
        </Card>
      </Box>

      <Dialog open={navigateConfirmationOpen} onClose={handleCancelDeleteProfile}>
        <DialogTitle>Profil löschen</DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie Ihr Profil wirklich löschen?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDeleteProfile} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleConfirmDeleteProfile} color="error">
            Ja, Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}