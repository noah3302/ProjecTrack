import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Autocomplete, InputAdornment } from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from 'react-router-dom';
import { apiget, apiput, apidelete} from "../API/Api";
import { UserAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
 
 
 
export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [project, setProject] = useState('');
  const [founderName, setFounderName] = useState('');
  const [nicknames, setNicknames] = useState([]);
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const { user } = UserAuth();
  const navigate = useNavigate();
  let { id } = useParams(); 
 
  //stehen geblieben bei nicknamen bei founder
 
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiget(`project/${id}`);
        setProject(data);
        // const founderData = await apiget(`nickname/${data.founder}`);
        // setFounderName(founderData.nickname);
        // const nicknamesData = await apiget("nicknames");
        // setNicknames(nicknamesData);
      } catch (error) {
        console.error("Fehler beim Laden des Projekttitels:", error);
      }
    };
 
    if (id) {
      fetchData();
    }
  }, [id]);  
 
 
  //Enddatum anpassen und formatieren
  const handleDateChange = (date) => {
    try {
      const [day, month, year] = date.split('.'); // Annahme: Datumformat ist DD.MM.YYYY
      const formattedDate = `${year}-${month}-${day}`;
      setProject({ ...project, end_date: formattedDate });
    } catch (error) {
      console.error("Fehler beim Konvertieren des Datums:", error);
    }
  };
 
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
  };
 
  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "10px",
    boxSizing: "border-box",
  };
 
  const infoContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };
 
  const labelStyle = {
    marginBottom: "5px",
  };
 
  //Aktualisieren der Daten in die Datenbank
  const handleSave = async () => {
    console.log(project)
    try {
        const update = {
          id: id,
          project_title: project.project_title,
          project_description: project.project_description,
          founder: project.founder,
          start_date: project.start_date,
          end_date: project.end_date,
      };
 
        const updatedProject = await apiput('project', id, update);
        handleCloseSettings();
        setProject(update);
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Projekts:", error);
    }
};
 
//Projekt löschen
const handleDelete = async () => {
  try {
    await apidelete(`project`, id);
    navigate("/home");
    setProject('');
  } catch (error) {
    console.error("Fehler beim Löschen des Projekts:", error);
  }
};
 
 
  return (
    <>
      <Modal open={openSettings} onClose={handleCloseSettings}>
        <Box sx={style}>
          <Typography variant="h6">Projekteinstellungen</Typography>
          <Box style={infoContainerStyle}>
            <TextField
              label="Projekttitel"
              variant="outlined"
              value={project.project_title}
              onChange={(e) => setProject({ ...project, project_title: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Beschreibung"
              variant="outlined"
              value={project.project_description}
              onChange={(e) => setProject({ ...project, project_description: e.target.value })}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
            <TextField
                label="Start"
                type="datetime-local"
                variant="outlined"
                fullWidth
                value={project.start_date}
                InputProps={{
                  readOnly: true,         //kann man nicht bearbeiten
                  style: {
                    pointerEvents: 'none',      //Cursor entfernen
                    color: 'rgba(0, 0, 0, 0.6)', //Textfarbe
                    backgroundColor: '#f0f0f0', //Hintergrundfarbe
                  },
                }}
              />
            <TextField
                label="Ende"
                type="datetime-local"
                variant="outlined"
                fullWidth
                value={project.end_date}
                onChange={(newDate) => handleDateChange(newDate)}
                style={{ marginBottom: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            {/* <DatePicker
              value={project.end_date}
              onChange={(newDate) => handleDateChange(newDate)}
              inputFormat="yyyy-MM-dd"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Enddatum"
                  type="date"
                  fullWidth
                  margin="normal"
                />
              )}
            /> */}
            <Autocomplete
              width="100%"
              options={nicknames || []} //falls nicknames undefined, wird leere Liste als Standard gesetzt
              getOptionLabel={(option) => option ? option.nickname || '' : ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Gründer"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                />
              )}
              value={founderName}
              onChange={(event, newValue) => {
                setFounderName(newValue ? newValue.nickname || '' : '');
              }}
            />
          </Box >
          <Button
            variant="contained"
            color="secondary"
            style={{ color: "black" }}
            onClick={() => { handleSave() }}
          >
            Speichern
            </Button>
          {/*  {user?.user && project && user?.user.id === project.founder && ( */}
              <Button
                variant="contained"
                color="secondary"
                style={{ color: "black" }}
                onClick={() => { handleDelete() }}
              >
                Löschen
              </Button>
           {/*  )} */}
        </Box>
      </Modal>
      <Box style={headerStyle}>
        <Typography variant="h6">Herzlich Willkommen in {project.project_title}</Typography>
        <Button variant="contained" color="secondary" style={{ marginLeft: "auto", color: "black" }} onClick={handleOpen}>
          Projektstatistik
        </Button>
        <Button variant="contained" color="secondary" style={{ marginLeft: "5px", color: "black" }} onClick={handleOpenSettings}>
          Projekteinstellungen
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      <Phase />
    </>
  );
}