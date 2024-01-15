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

export default function Profil() {
  const { user, setUser, logOut } = UserAuth(); //Auf Authentifizierungsinfos und Methoden zugreifen
  //Zustände definieren für Daten vom Benutzer und Profilbearbeitung
  const [id, setid] = useState(null);
  const [google_id, setgoogleid] = useState(null);
  const [vorname, setVorname] = useState('');
  const [nachname, setNachname] = useState('');
  const [nickname, setNickname] = useState('');
  const [helper, setHelper] = useState(''); //Hilfetext für Nickname
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingNicknames, setExistingNicknames] = useState([]);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();

  //Vorhandene Daten und Nicknamen laden
  useEffect(() => {
    fetchExistingNicknames();
    fetchUserData();
  }, []);

  const [userGoogleData, setUserGoogleData] = useState(''); //Google Benutzerdaten 
  const fetchUserData = async () => { //Benutzerdaten abrufen von API
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

  //Abrufen von vorhandenen Nicknamen von API
  const fetchExistingNicknames = async (nickname) => {
    try {
      const data = await apiget('users/nicknames');

      if (!data || !Array.isArray(data.nicknames)) { //Überprüft ob data nicht vorhanden ist oder data.nicknames nicht als Array vorliegt
        console.error('Ungültige Datenstruktur für Nicknames erhalten.');
        return;
      }

      const sanitizedNickname = (nickname || '').trim().toLowerCase(); //nickname wird auf leeren String gesetzt, wenn undefined oder null, dann getrimmt und in Kleinbuchstaben umgewandelt      

      const nicknamesData = data.nicknames.filter((nick) => { //vorhandenen nicknames filtern 
        if (typeof nick === 'string') { //string Überprüfung
          const sanitizedNick = nick.trim().toLowerCase();
          return sanitizedNick !== sanitizedNickname; //Vergleichen, falls nicknamen nicht übereinstimmen kommt true
        }
        return false;
      });

      if (nicknamesData.length > 0) { //Überprüft ob nicknamesData Elemente enthält
        setExistingNicknames(nicknamesData); //wenn ja, setze existingNicknames auf das gefilterte Array nicknamesData
      } else {
        setExistingNicknames([]); //wenn nein, setze auf ein leeres Array
      }
    } catch (error) {
      console.error('Fehler beim Laden der Nicknames:', error);
    }
  };

  //Profil speichern
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

  //Profil löschen
  const handleDeleteProfile = async () => {
    try {
      const confirmDelete = window.confirm( //Bestätigungsbox
        'Möchten Sie Ihr Profil wirklich löschen?'
      );
      if (confirmDelete) {
        await apidelete('users', user.id);
        setid('');
        setVorname('');
        setNachname('');
        setNickname('');

        await logOut();

        navigate('/');
      } else {
        console.log('Löschen des Profils abgebrochen');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Profils:', error);
    }
  };

  //Vorname ändern
  const handleVornameChange = (event) => {
    setVorname(event.target.value);
  };

  //Nachname ändern
  const handleNachnameChange = (event) => {
    setNachname(event.target.value);
  };

  //Nicknamen ändern
  const handleNicknameChange = (event) => {
    setNickname(event.target.value); //Setze Nicknamen im State auf den aktuellen Wert
    const regex = /^[a-zA-Z0-9]{4,12}$/; //Regular Expression für Nickname
    if (regex.test(event.target.value)) { //Überprüfung
      setDisable(false); //deaktiviert die Schaltfläche, falls es erfüllt ist
      if (existingNicknames.includes(event.target.value)) { //Schaut, ob der Nickname bereits vorhanden ist
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

  //Textfelder
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
        <Card sx={{ width: '30rem' }}>
          <Box sx={{ padding: '2rem' }}>
            <Typography align="center" variant="h5" mb="1rem">
              {isEditMode ? 'Profil bearbeiten' : 'Profil anzeigen'}
            </Typography>
            {/* Textfeld für Vorname, Nachname und Nickname */}
            <TextField
              required //Pflichtfeld
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
          <Box
            mb="1rem"
            sx={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveProfile} //Profil aktualisieren
              endIcon={<SendIcon />}
              disabled={!isEditMode || !vorname || !nachname || !disable} //Button wird deaktiviert, wenn mind. eine der Bedingungen erfüllt ist
            >
              Profil aktualisieren
            </Button>
            {isEditMode && (
              <Button
                sx={{ backgroundColor: 'primary.contrastText' }}
                style={{ color: 'white' }}
                onClick={handleDeleteProfile} //Profil löschen
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