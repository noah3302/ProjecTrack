import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Autocomplete } from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from 'react-router-dom';
import { apiget, apiput, apidelete} from "../API/Api";
import { UserAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
 
 
 
export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [project, setProject] = useState('');
  const [founderName, setFounderName] = useState('');
  const [openSettings, setOpenSettings] = useState(false);
  const handleOpenSettings = () => setOpenSettings(true);
  const handleCloseSettings = () => setOpenSettings(false);
  const { user } = UserAuth();
  const navigate = useNavigate();
  const [projectUsers, setProjectUsers] = useState([]);
  let { id } = useParams();
  const [opendialog, setOpendialog] = React.useState(false);


 
  useEffect(() => {
    console.log(user);
    const fetchData = async () => {
      try {
        const data = await apiget(`project/${id}`);
        setProject(data);
        // const projectUsersData = await apiget(`project/${id}/users`);
        // setProjectUsers(projectUsersData);
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
  }, [id, user]);  
 
 
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
 
        await apiput('project', id, update);
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
 
//Projekt verlassen
const handleLeave = async () => {
  try {
    const a = Number(project.founder);
    const b = Number(user.id);
    if (a === b) {
      setOpendialog(true); // Öffne das Dialogfenster, wenn user.id gleich project.founder ist
    } else {
      await apiput(`project/members`, user.id , project);
      navigate("/home");
    }
  } catch (error) {
    console.error("Fehler beim Verlassen des Projekts:", error);
  }
};

  const handleClosedialog = () => {
    setOpendialog(false);
  };
 
  return (
    <>
    <Dialog
        open={opendialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Hast mal drüber nachgedacht was passiert, wenn der Chef das Projekt einfach verlässt?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Wäre vllt nicht die dümmste idee einen nachfolger vorher noch zu definieren, merkst selbst
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedialog} autoFocus>
            Okay, Chef
          </Button>
        </DialogActions>
      </Dialog>

      
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
              <Autocomplete
                options={projectUsers || []}
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
              <Button
            variant="contained"
            color="secondary"
            style={{ color: "black" }}
            onClick={() => { handleLeave() }}
          >
            Projekt verlassen
            </Button>
        </Box>
      </Modal>
      <Box style={headerStyle}>
        <Typography variant="h6">{project.project_title}</Typography>
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