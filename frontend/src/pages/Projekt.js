import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Autocomplete, InputAdornment } from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from 'react-router-dom';
import { apiget, apiput} from "../API/Api";
import DatePicker from "@mui/lab/DatePicker";


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
  //const user userauth holen
  let { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiget(`project/${id}`);
        setProject(data);
        // const founderData = await apiget(`nickname/${project.founder}`);
        // setFounderName(founderData.nickname);
        // const nicknamesData = await apiget("nicknames"); // Replace with your API endpoint
        // setNicknames(nicknamesData); // Assuming nicknamesData is an array of nicknames
      } catch (error) {
        console.error("Fehler beim Laden des Projekttitels:", error);
      }
    };
    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setProject({ ...project, end_date: date });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("de-DE", options);
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
              label="Startdatum"
              variant="outlined"
              value={formatDate(project.start_date)}
              fullWidth
              margin="normal"
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
              label="Enddatum"
              type="date"
              value={formatDate(project.end_date)}
              onChange={(e) => handleDateChange(e.target.value)}
              fullWidth
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DatePicker
                      value={project.end_date}
                      onChange={(newDate) => handleDateChange(newDate)}
                      format="yyyy-MM-dd"
                      variant="inline"
                      inputFormat="yyyy-MM-dd"
                    />
                  </InputAdornment>
                ),
              }}
            />
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
          </Box>
          <Button
            variant="contained"
            color="secondary"
            style={{ color: "black" }}
            onClick={() => { handleSave() }}
          >
            Speichern
          </Button>
          {/* {user?.user.id === project.founder(          
          <Button
            variant="contained"
            color="secondary"
            style={{ color: "black" }}
            //onClick={() => { handleDelete() }}
          >
            Löschen
          </Button>):(<></>)};
           */}
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