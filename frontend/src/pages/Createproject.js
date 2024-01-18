import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, IconButton, Typography, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { apiget, apipost } from '../API/Api';
import { UserAuth } from "../Context/Authcontext";

//Komponente die verschiedene Zustände für die Eingabe von Projektinformationen besitzt
const Createproject = () => {
  const [name, setName] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [customPhaseValues, setCustomPhaseValues] = useState(['todo', 'doing', 'done']);
  // new Date().toISOString().split('Z')[0])
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();
  const { user } = UserAuth();

  //Asynchrone Funktion die Daten aller Benutzer von der API abruft und im ExistingUser speichert
  async function getExistingUsers() {
    const allUsers = await apiget('/users')
    setExistingUsers(allUsers)
    setStartDate("2023-12-01")
    setStartDate("2023-12-01")
  }
  //Funktion wird aufgerufen sobald die Komponente geladen hat
  useEffect(() => {
    getExistingUsers()
  }, []);

  //Array von Benutzerobjekten wird gefiltert um alle Benutzer auszuschließen, deren ID mit der ID 
  // des aktuellen Benutzers übereinstimmt
  function getUserNames(array) {
    return array.filter((exUser) => {
      return exUser.id != user.id
    }).map((exUser) => exUser.nickname);
  }

  //Funktion wird abgerufen, wenn sich der Wert des Namen des Projektes ändert
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  //Funktion konvertiert einen gegebene Zeit 'd' in das ISO-Datum-Zeit-Format
  function localISOTime(d) {
    var tzoffset = d.getTimezoneOffset() * 60000;
    d.setTime(d.getTime() - tzoffset);
    return d.toISOString().slice(0, -1);
  }

  //Funktion überprüft ob alle benutzerdefinierten Phasen Namen haben
  const createproject = async () => {
    const customPhasesWithoutName = customPhaseValues.filter(value => !value.trim());
    if (customPhasesWithoutName.length > 0) {
      console.error("Bitte benenne alle benutzerdefinierten Phasen.");
      return;
    }

    //Erstellung eines neuen Projektes
    const newProject = await apipost('createproject', {
      id: 0,
      project_title: name,
      project_description: beschreibung,
      founder: user.id,
      manager: user.id,
      start_date: startDate,
      end_date: endDate
    })
    navigation(newProject)
  }

  //Funktion für das Senden von Daten im Zusammenhang mit den Projektphasen, an die API
  const navigation = async (newProject) => {
    const apiCalls = []

    const phaseData = customPhaseValues.map((phase, idx) => ({
      id: 0,
      phasename: phase,
      ranking: idx + 1,
      project_id: newProject.id
    }))
    apiCalls.push(apipost(`project/${newProject.id}/phases`, phaseData))

    // ausgewählte User zum Projekt hinzufügen
    selectedMembers.map((member) => {
      apiCalls.push(apipost(`project/${newProject.id}/user`, {
        ...member
      }))
    })
    //Objekt
    const eigene = {
      id: user.id,
      surname: "",
      google_id: "",
      name: "",
      nickname: "",
    };

    // sich selber auch als Member zum Projekt hinzufügen
    apiCalls.push(apipost(`project/${newProject.id}/user`, eigene))

    Promise.all([...apiCalls]).then((responses) => {
      navigate(`/project/${newProject.id}`);
    })

  };

  //Änderung der Projektbeschreibung
  const handleBeschreibungChange = (event) => {
    setBeschreibung(event.target.value);
  };

  //Änderung der Mitgleider eines Projektes
  const handleMembersChange = (event, values) => {
    const selected = existingUsers.filter(selectedUser => {
      return values.includes(selectedUser.nickname)
    })
    setSelectedMembers(selected);
  };

  //Änderung der Projektphasen
  const handlePhasenChange = (event) => {
    setSelectedPhase(event.target.value);
  };

  //Änderung der benutzerdefinierten Phasen
  const handleCustomPhaseChange = (index, value) => {
    const updatedCustomPhaseValues = [...customPhaseValues];
    updatedCustomPhaseValues[index] = value;
    setCustomPhaseValues(updatedCustomPhaseValues);
  };

  //neue benutzerdefinierte Phase hinzufügen
  const handleAddCustomPhase = () => {
    if (customPhaseValues.length < 8) {
    setCustomPhaseValues([...customPhaseValues, '']);
    }
  };

  //Funktion um benutzerdefinierte Phasen aus der Liste der benutzerdefinierten Phase zu entfernen
  const handleRemoveCustomPhase = (index) => {
    const updatedCustomPhaseValues = [...customPhaseValues];
    updatedCustomPhaseValues.splice(index, 1);
    setCustomPhaseValues(updatedCustomPhaseValues);
  };

  const input = {
    marginBottom: '1rem',
    backgroundColor: 'white',
    width: '100%',
  };

  const phaseninput = {
    marginBottom: '1rem',
    marginTop: '1rem',
    backgroundColor: 'white',
    width: '100%',
  };

  //Array mit Optionen der Projektart
  const options = ['Standard (todo-doing-done)', 'Custom'];

  //Hier wird überprüft ob der Button deaktiviert werden soll
  const isButtonDisabled = !name || !beschreibung || !selectedPhase || !startDate || !endDate || customPhaseValues.some(value => !value.trim());

  return (
    <Box sx={{ overflow: "hidden", overflowY: "scroll", marginLeft: 'auto', marginRight: 'auto', minWidth: '15rem', maxWidth: '40rem', maxHeight: "40rem", padding: '1rem' }}>
      <Typography align="center" variant="h5" mb={'1rem'}>
        Projekt erstellen
      </Typography>
      <TextField required style={input} label="Projektname" value={name} onChange={handleNameChange} error={!name} />
      <TextField
        required
        multiline
        style={input}
        label="Projektbeschreibung"
        value={beschreibung}
        onChange={handleBeschreibungChange}
        error={!beschreibung}
      />

      <Autocomplete
        multiple
        style={input}
        options={getUserNames(existingUsers)}
        renderInput={(params) => (
          <TextField {...params} label="Mitglieder" error={selectedMembers.length === 0} helperText={selectedMembers.length === 0 ? "Dieses Feld ist erforderlich." : ""} />
        )}
        value={selectedMembers.map((selectedUser) => selectedUser.nickname)}
        onChange={handleMembersChange}
        sx={{ width: '500px' }}
      />
      <TextField
        value={startDate}
        label="Startdate"
        type="date"
        InputLabelProps={{
          shrink: true,
          focused: false,
          style: { position: 'absolute' } 
        }}
        onChange={(e) => setStartDate(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        value={endDate}
        label="Enddatum"
        type="date"
        InputLabelProps={{
          shrink: true,
          focused: false,
          style: { position: 'absolute' } 
        }}
        onChange={(e) => setEndDate(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField required error={!selectedPhase} style={phaseninput} label="Phasenauswahl" select value={selectedPhase} onChange={handlePhasenChange} multiple>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      {selectedPhase === 'Custom' && (
        <>
          <Grid container spacing={1}>
            {customPhaseValues.map((value, index) => (
              <Grid container item spacing={1} alignItems="center" key={index}>
                <Grid item xs={10}>
                  <TextField
                    required
                    error={!value}
                    style={input}
                    label={`Phasenauswahl ${index + 1}`}
                    value={value}
                    onChange={(e) => handleCustomPhaseChange(index, e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveCustomPhase(index)}
                    style={{ marginLeft: '10px', marginBottom: '10px' }}
                  >
                    X
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
            {selectedPhase === 'Custom' && customPhaseValues.length < 8 && (
              <Button onClick={handleAddCustomPhase} sx={{ outline: '1px solid green', color: 'green' }}>
                Hinzufügen
              </Button>
              )}
            </Grid>
          </Grid>
        </>
      )}
      <Box mt="1rem" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          sx={{ outline: '1px solid green', color: 'green' }}
          onClick={createproject}
          endIcon={<SendIcon />}
          disabled={isButtonDisabled}
        >
          Projekt erstellen
        </Button>
      </Box>
      {/* <Typography m="1rem">Name = {name}</Typography>
        <Typography m="1rem">Beschreibung = {beschreibung}</Typography>
        <Typography m="1rem">Mitglieder = {selectedMembers.join(', ')}</Typography>
        <Typography m="1rem">Phasenauswahl = {selectedPhase}</Typography>
        <Typography m="1rem">customPhaseValues = {customPhaseValues.join(', ')}</Typography> */}
    </Box>
  );
};

export default Createproject;