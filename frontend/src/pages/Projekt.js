import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import { Button, Typography, Box} from '@mui/material';
import Arbeitsstatistik from "../components/Arbeitsstatistik";

export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
  
  return (
    <>
      <Typography sx={{align:"center", marginTop:"5rem"}}>Projektseite</Typography>
      <Button onClick={handleOpen}>Arbeitsstatistik</Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik/>
        </Box>
      </Modal>
    </>
  );
}