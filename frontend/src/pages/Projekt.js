import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Autocomplete, Grid, List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/project/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from 'react-router-dom';
import { apiget, apiput, apidelete, apipost } from "../API/Api";
import { UserAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Divider from '@mui/material/Divider';

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
  const [projectUsers, setProjectUsers] = useState();
  let { id } = useParams();
  const [opendialog, setOpendialog] = React.useState(false);
  const [projectusersFilter, setProjectusersFilter] = useState("");
  const [notmemberFilter, setnotmemberFilter] = useState("");
  const [notmember, setNotmember] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiget(`project/${id}`);
        setProject(data);
        const users = await apiget(`project/${id}/users`);
        setProjectUsers(users);
        const members = await apiget('users');
        const filteredMembers = members.filter((user) => !users.some((projectUser) => projectUser.id === user.id));
        setNotmember(filteredMembers);
      } catch (error) {
        console.error("Fehler beim Laden des Projekttitels:", error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, user]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    width: '70%',
    maxWidth: 500,
    minWidth: 200,
    maxHeight: 700,
    overflow: 'auto',
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
    marginTop: "10px",
    width: "100%",
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
        await apiput(`project/members`, user.id, project);
        navigate("/home");
      }
    } catch (error) {
      console.error("Fehler beim Verlassen des Projekts:", error);
    }
  };

  const handleClosedialog = () => {
    setOpendialog(false);
  };

  const moveNameTonotMember = (user) => {
    try {
      apidelete(`project/${id}/user`, user.id);
      setProjectUsers(prevUsers => prevUsers.filter((value) => value.id !== user.id)); // Überprüfe, ob der Name der ID-Eigenschaft unterschiedlich ist
      setNotmember(prevNotmember => [...prevNotmember, user]);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Projekts:", error);
    }
  };

  const moveNameToprojectusers = (user) => {
    try {
      apipost(`project/${id}/user`, user)
      setNotmember(notmember.filter((value) => value.id !== user.id));
      setProjectUsers(prevmember => [...prevmember, user]);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Projekts:", error);
    }
  };

  const listStyle = {
    width: '100%',
    maxHeight: 200,
    overflow: 'auto',
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
          {"Du kannst als Gründer nicht einfach das Projekt verlassen."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bitte wähle zuerst einen Nachfolger, danach kannst du das Projekt verlassen.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosedialog} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      <Modal open={openSettings} onClose={handleCloseSettings}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>Projekteinstellungen</Typography>
          <Box style={infoContainerStyle}>
            <TextField
              label="Projekttitel"
              variant="outlined"
              value={project.project_title}
              onChange={(e) => setProject({ ...project, project_title: e.target.value })}
              fullWidth
              margin="normal"
              style={{ marginTop: '10px' }}
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
              style={{ marginTop: '10px' }}
            />
            {project && projectUsers ? (      
              <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                spacing={2}
              >
                <Grid item xs={12}>
                  <Typography variant="h7" align="center" gutterBottom>
                    Mitglieder verwalten
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box >
                    <Paper>
                      <TextField
                        label="Filter user"
                        variant="outlined"
                        value={notmemberFilter}
                        onChange={(e) => setnotmemberFilter(e.target.value)}
                        fullWidth
                      />
                      <List dense component="div" role="list" sx={listStyle}>
                        {notmember
                          .filter((user) =>
                            user.nickname.toLowerCase().includes(notmemberFilter.toLowerCase())
                          )
                          .map((user, index) => (
                            <>
                              <ListItem key={user.user_id} button onClick={() => moveNameToprojectusers(user)}>
                                <ListItemText primary={user.nickname} />
                                <ListItemIcon style={{ color: 'green' }}>
                                  <GroupAddIcon />
                                </ListItemIcon>
                              </ListItem>
                              {index !== notmember.length - 1 && <Divider />}
                            </>
                          ))}
                      </List>
                    </Paper>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box>
                    <Paper>
                      <TextField
                        label="Filter projectmember"
                        variant="outlined"
                        value={projectusersFilter}
                        onChange={(e) => setProjectusersFilter(e.target.value)}
                        fullWidth
                      />
                      <List dense component="div" role="list" sx={listStyle}>
                        {projectUsers.filter((member) =>
                          member.nickname.toLowerCase().includes(projectusersFilter.toLowerCase())
                        )
                          .map((member, index) => (
                            <>
                              <ListItem key={member.user_id} disabled={member.id.toString() === project.founder || member.id === user.id } button onClick={() => moveNameTonotMember(member)}>
                                <ListItemText primary={member.nickname} />
                                <ListItemIcon style={{ color: 'red' }}>
                                  <GroupRemoveIcon />
                                </ListItemIcon>
                              </ListItem>
                              {index !== projectUsers.length - 1 && <Divider />}
                            </>
                          ))}
                      </List>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            ) : (
              <Typography>Loading...</Typography>
            )}
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
              style={{ marginTop: '10px' }}
            />
            <TextField
              label="Ende"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={project.end_date}
              onChange={(e) => setProject({ ...project, end_date: e.target.value })}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginTop: '10px' }}
            />
            <Autocomplete
              options={projectUsers ? projectUsers : []}
              getOptionLabel={(option) => option.nickname || ''}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Gründer"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginTop: '10px',minWidth:200, maxWidth: 480, width:"40rem", marginBottom: '10px' }}
                />
              )}
              value={projectUsers && projectUsers.find((user) => user.id.toString() === project.founder) || null}
              onChange={(event, newValue) => {
                if (newValue) {
                  setProject({ ...project, founder: newValue.id.toString() }); // Sicherstellen, dass die ID in String-Form übergeben wird
                } else {
                  setProject({ ...project, founder: '' }); // Setzen des Gründers auf leer, wenn kein Wert ausgewählt ist
                }
              }}
            />
          </Box >
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => { handleSave() }}
            >
              Speichern
            </Button>
            {user?.id.toString() === project?.founder && ( 
            <Button
              variant="contained"
              sx={{ backgroundColor: "primary.contrastText" }}
              style={{ color: "white" }}
              onClick={() => { handleDelete() }}
            >
              Projekt Löschen
            </Button>)}
            <Button
              variant="contained"
              sx={{ backgroundColor: "primary.contrastText" }}
              style={{ color: "white" }}
              onClick={() => { handleLeave() }}
            >
              Projekt verlassen
            </Button>
          </div>
        </Box>
      </Modal>
      <Box style={headerStyle}>
        <Typography variant="h4" align="center" >{project.project_title}</Typography>
        <Button variant="contained" sx={{ marginLeft: "auto", color: "lightgrey", backgroundColor:"secondary.dark" }} onClick={handleOpen}>
          Report-Ansicht
        </Button>
        <Button variant="contained" sx={{ marginLeft: "5px", color: "lightgrey", backgroundColor: "secondary.dark" }} onClick={handleOpenSettings}>
          Projekteinstellungen
        </Button>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      {project && projectUsers ? (
        <Phase key={id} projectusers={projectUsers} projektid={id}/>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </>
  );
}