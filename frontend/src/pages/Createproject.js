import React, { useState } from 'react';
import { TextField, Button, Box, Grid, IconButton, Typography, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { apipost } from '../API/Api';
import { UserAuth } from "../Context/Authcontext";

const Createproject = () => {
  const [name, setName] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [customPhaseValues, setCustomPhaseValues] = useState(['']);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('Z')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('Z')[0]);
  const navigate = useNavigate();
  const { user } = UserAuth();


  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const navigation = async () => {
    console.log('Projekt erstellt');

    const createdProject = await apipost('projects', {
      project_id: 0,
      project_title: name,
      project_description: beschreibung,
      founder: user.id,
      start_date: startDate,
      end_date: endDate
    })

    navigate(`/project/${createdProject.id}`);
  };

  const handleBeschreibungChange = (event) => {
    setBeschreibung(event.target.value);
  };

  const handleMembersChange = (event, values) => {
    setSelectedMembers(values);
  };

  const handlePhasenChange = (event) => {
    setSelectedPhase(event.target.value);

    if (event.target.value === 'Custom') {
      setCustomPhaseValues(['todo', 'doing', 'done']);
    }
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

  const customphasenfilled = () => {
    if (selectedPhase === 'Standard (todo-inprogress-done)') {
      const filled = true
    } else {
      const filled = !customPhaseValues.every((el, index, arr) => {
        return el !== ''
      })
    }
  };

  const isButtonDisabled = !name || !beschreibung || !selectedPhase

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
        options={nicknamen}
        renderInput={(params) => (
          <TextField {...params} label="Mitglieder" />
        )}
        value={selectedMembers}
        onChange={handleMembersChange}
        sx={{ width: '500px' }}
      />

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DateRangePicker']}>
          <DateRangePicker localeText={{ start: 'Check-in', end: 'Check-out' }} onChange={e=>{
            setStartDate(e[0].$d.toISOString().split('Z')[0])
            setEndDate(e[0].$d.toISOString().split('Z')[0])
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
          onClick={navigation}
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