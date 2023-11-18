import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import {
  Button,
  Typography,
  Box,
  IconButton,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Tasks from "../components/Tasks";
import Mitglieder from "../components/Mitglieder";

export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Arbeitsstatistik
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  // Headeranpassung
  const headerStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
  };

  // Buttons im Header
  const buttonStyle = {
    marginLeft: '5px', // Abstand zw. Buttons Arbeitsstatistik und Mitglieder
  };

  // Card anpassen (Style außen)
  const cardContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10px',
    gap: '10px',
    flexWrap: 'wrap',
  };

  // Layout einzelne Card
  const singleCardStyle = {
    flex: '0 0 calc(25% - 20px)',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const cardContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: '10px',
    gap: '10px',
    flexWrap: 'wrap', // Für die Spalten in den Zeilen
  };

  // Verschiebungspfeile
  const iconStyle = {
    marginRight: 'auto',
  };

  return (
    <>
      <div style={headerStyle}>
        <Typography variant="h6">PLATZHALTER Projektname</Typography>
        <Button variant="contained" style={buttonStyle} onClick={handleOpen}>Arbeitsstatistik</Button>
        <Button variant="contained" style={buttonStyle} >Mitglieder</Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      <>
        <div style={cardContainerStyle}>
          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: '#f3e5f5' }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">
                    To do
                  </Typography>
                  <IconButton>
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => {                                      //fehlt noch
                    console.log('Task hinzufügen');
                  }}
                >
                  <AddIcon />
                  <Typography style={{ marginLeft: '5px' }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>

          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: '#f3e5f5' }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">
                    Doing
                  </Typography>
                  <IconButton>
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => {                              //fehlt noch
                    console.log('Task hinzufügen');
                  }}
                >
                  <AddIcon />
                  <Typography style={{ marginLeft: '5px' }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>

          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: '#f3e5f5' }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">
                    Done
                  </Typography>
                  <IconButton>
                    <EditIcon fontSize='small' />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton
                  onClick={() => {                                  //fehlt noch
                    console.log('Task hinzufügen');
                  }}
                >
                  <AddIcon />
                  <Typography style={{ marginLeft: '5px' }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>
          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: '#E0C2FF' }}>
              <CardContent>
                  <Typography>
                  <IconButton>
                      <AddIcon />
                    </IconButton>
                    Phase hinzufügen
                  </Typography>
              </CardContent>
            </Card>
          </div>

        </div>
      </>
    </>
  );
}
