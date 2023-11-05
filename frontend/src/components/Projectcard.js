import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Createproject from '../pages/Createproject';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';

const Projectcard = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const projekte = {
    "Projekte": [
      {
        "name": "Sopra",
        "beschreibung": "Hier steht eine lange und unnötige Beschreibung von einem Projekt",
        "Mitglieder": ["anna", "mike", "Horst"]
      },
      {
        "name": "UXD",
        "beschreibung": "Test2",
        "Mitglieder": ["anna2", "mike2", "Horst2"]
      },
      {
        "name": "Smart office",
        "beschreibung": "Test3",
        "Mitglieder": ["anna3", "mike3", "Horst3"]
      },
      {
        "name": "Proposal",
        "beschreibung": "Test4",
        "Mitglieder": ["anna4", "mike4", "Horst4"]
      },
      {
        "name": "Datingapp",
        "beschreibung": "Test5",
        "Mitglieder": ["anna5", "mike5", "Horst5"]
      },
      {
        "name": "Sportfreaks",
        "beschreibung": "Test6",
        "Mitglieder": ["anna6", "mike6", "Horst6"]
      },
      {
        "name": "Gamer",
        "beschreibung": "Test7",
        "Mitglieder": ["anna7", "mike7", "Horst7"]
      }
    ]
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "40rem",
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const input = {
    marginBottom: '1rem',
    backgroundColor: 'white',
    width: '100%',
  };

  const dummy = [
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

  return (
    <Box sx={{ minWidth: 150 }}>

      <Autocomplete
        style={input}
        options={dummy}  // Use the neunicknamen array as options
        renderInput={(params) => (
          <TextField {...params} label="Projektsuche" />
        )}
        sx={{ width: '500px' }}
      />

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {projekte.Projekte.map(meineprojekte => (
          <Grid item sm={6} md={3} key={meineprojekte.name}>
            <Card variant="outlined">
              <CardContent>
                <Typography typography="h6" color="text.primary">
                  {meineprojekte.name}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Beschreibung:
                </Typography>
                <Typography variant="body2">
                  {meineprojekte.beschreibung}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Mitglieder:
                </Typography>
                <Typography variant="body2">
                  {meineprojekte.Mitglieder.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item sm={6} md={3}>
          <Box onClick={handleOpen}>
            <Card variant="outlined" mr={"auto"} ml={"auto"}>
              <Typography color="text.secondary">Neues Projekt anlegen</Typography>
              <AddIcon sx={{ fontSize: 180, color: "black" }} />
            </Card>
          </Box>
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            <Createproject></Createproject>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};
export default Projectcard;