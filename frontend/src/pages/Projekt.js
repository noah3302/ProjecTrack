import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography} from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from 'react-router-dom';
import { apiget } from "../API/Api";
 
export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [projectTitle, setProjectTitle] = useState('');
  let { id } = useParams();

  // useEffect(() => {
  //     const data = apiget('project/${id}');
  //     setProjectTitle(data.title); 
  //     },[]);

      useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await apiget(`project/${1}`); // Nutzung von `async/await`
            setProjectTitle(data.project.title); 
          } catch (error) {
            console.error("Fehler beim Laden des Projekttitels:", error);
          }
        };
    
        fetchData();
      }, []);    

 
  // Arbeitsstatistik
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#D3D3D3",
    boxShadow: 24,
    p: 4,
  };
  // Headeranpassung
  const headerStyle = {
    display: "flex",
    justifyContent: "flex-start",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
  };
  // Buttons im Header
  const buttonStyle = {
    marginLeft: "5px", // Abstand zw. Buttons Arbeitsstatistik und Mitglieder
  };
 
  return (
    <>
      <div style={headerStyle}>
         <Typography variant="h6">{projectTitle}</Typography>
        <Button variant="contained" style={buttonStyle} onClick={handleOpen}>
          Arbeitsstatistik
        </Button>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      <Phase/>
    </>
  );
}