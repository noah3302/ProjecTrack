import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Grid, IconButton, Typography, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { apiget, apipost } from '../API/Api';
import { UserAuth } from "../Context/Authcontext";

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

  async function getExistingUsers() {
    const allUsers = await apiget('/users')
    setExistingUsers(allUsers)
  }

  useEffect(() => {
    getExistingUsers()
  }, []);

  function getUserNames(array) {
    return array.filter((exUser) => {
      return exUser.id != user.id
    }).map((exUser) => exUser.nickname);
  }


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  function localISOTime(d) {
    var tzoffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    d.setTime(d.getTime() - tzoffset);
    return d.toISOString().slice(0, -1);
  }

  const createproject = async () => {
    const customPhasesWithoutName = customPhaseValues.filter(value => !value.trim());
    if (customPhasesWithoutName.length > 0) {
      console.error("Bitte benenne alle benutzerdefinierten Phasen.");
      return;
    }
    const newProject = await apipost('createproject', {
      id: 0,
      project_title: name,
      project_description: beschreibung,
      founder: user.id,
      start_date: startDate,
      end_date: endDate
    })
    navigation(newProject)
  }

  const navigation = async (newProject) => {
    const apiCalls = []

    const phaseData = customPhaseValues.map((phase, idx) => ({
      id: 0,
      phasename: phase,
      indx: idx + 1,
      project_id: newProject.id
    }))
    apiCalls.push(apipost(`project/${newProject.id}/phases`, phaseData))

    // ausgewählte User zum Projekt hinzufügen
    selectedMembers.map((member) => {
      apiCalls.push(apipost(`project/${newProject.id}/user`, {
        ...member
      }))
    })

    // sich selber auch als Member zum Projekt hinzufügen
    apiCalls.push(apipost(`project/${newProject.id}/user`, {
      id: user.id,
      surname: user.surname,
      google_id: user.userid,
      name: user.name,
      nickname: user.nickname,
    }))

    Promise.all([...apiCalls]).then((responses) => {
      navigate(`/project/${newProject.id}`);
    })

  };

  const handleBeschreibungChange = (event) => {
    setBeschreibung(event.target.value);
  };

  const handleMembersChange = (event, values) => {
    const selected = existingUsers.filter(selectedUser => {
      return values.includes(selectedUser.nickname)
    })
    setSelectedMembers(selected);
  };

  const handlePhasenChange = (event) => {
    setSelectedPhase(event.target.value);
  };

  const handleCustomPhaseChange = (index, value) => {
    const updatedCustomPhaseValues = [...customPhaseValues];
    updatedCustomPhaseValues[index] = value;
    setCustomPhaseValues(updatedCustomPhaseValues);
  };

  const handleAddCustomPhase = () => {
    setCustomPhaseValues([...customPhaseValues, '']);
  };

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

  const options = ['Standard (todo-doing-done)', 'Custom'];

  const isButtonDisabled = !name || !beschreibung || !selectedPhase || !startDate || !endDate

  const phaseStyle = {
    display: 'flex',
    overflowX: 'auto',
    gap: '10px',
    marginTop: '1rem',
    marginBottom: '1rem',
  };


  return (
    <Box sx={{ overflow: "hidden", overflowY: "scroll", marginLeft: 'auto', marginRight: 'auto', minWidth: '20rem', maxWidth: '40rem', maxHeight: "40rem", padding: '2rem' }}>
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
          <TextField {...params} label="Mitglieder" />
        )}
        value={selectedMembers.map((selectedUser) => selectedUser.nickname)}
        onChange={handleMembersChange}
        sx={{ width: '500px' }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateRangePicker']}>
          <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} onChange={selectedDates => {
            // start date
            if (selectedDates[0]) setStartDate(localISOTime(selectedDates[0].$d));
            // end date
            if (selectedDates[1]) setEndDate(localISOTime(selectedDates[1].$d));
          }} />
        </DemoContainer>
      </LocalizationProvider>

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
                    style={{ marginLeft: '10px', marginTop: '10px' }}
                  >
                    X
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button onClick={handleAddCustomPhase} sx={{ outline: '1px solid green', color: 'green' }}>
                Hinzufügen
              </Button>
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