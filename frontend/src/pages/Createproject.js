import React, { useState } from 'react';
import { TextField, Button, Box, Grid, IconButton, Typography, MenuItem } from '@mui/material';
import { Card } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';

const Createproject = () => {
  const [name, setName] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [customPhaseValues, setCustomPhaseValues] = useState(['']);
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const navigation = () => {
    console.log('Projekt erstellt');
    navigate('/home');
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
      setCustomPhaseValues(['todo', 'inprogress', 'done']);
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


  const options = ['Standard (todo-inprogress-done)', 'Custom'];
  const nicknamen = [
    'Anna',
    'Ben',
    'Charlie',
    'David',
    'Emma',
    'Fiona',
    'George',
    'Hannah',
    'Isabella',
    'Jack',
    'Katherine',
    'Liam',
    'Mia',
    'Noah',
    'Olivia',
    'Paul',
    'Quinn',
    'Ruby',
    'Samuel',
  ];

  const isButtonDisabled = !name || !beschreibung || !selectedPhase || customPhaseValues.some((el, index, arr) => {
    return el === ''
  })
  
  return (
    <Box sx={{ marginTop: '8rem' }}>
      <Card sx={{ marginLeft: 'auto', marginRight: 'auto', minWidth: '20rem', maxWidth: '40rem', padding: '2rem' }}>
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
        options={nicknamen}  // Use the neunicknamen array as options
        renderInput={(params) => (
            <TextField {...params} label="Mitglieder" />
        )}
        value={selectedMembers}  // Set the selected members
        onChange={handleMembersChange}  // Handle member selection
        sx={{ width: '500px' }}
        />


        <TextField required error={!selectedPhase} style={input} label="Phasenauswahl" select value={selectedPhase} onChange={handlePhasenChange} multiple>
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
                <Button onClick={handleAddCustomPhase} sx={{ outline: '1px solid green', color: 'green'}}>
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
        <Typography m="1rem">Name = {name}</Typography>
        <Typography m="1rem">Beschreibung = {beschreibung}</Typography>
        <Typography m="1rem">Mitglieder = {selectedMembers.join(', ')}</Typography>
        <Typography m="1rem">Phasenauswahl = {selectedPhase}</Typography>
        <Typography m="1rem">customPhaseValues = {customPhaseValues.join(', ')}</Typography>
      </Card>
    </Box>
  );
};

export default Createproject;