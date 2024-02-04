import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  SpeedDial,
  SpeedDialAction,
  Typography,
  Autocomplete,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  IconButton,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import Arbeitsstatistik from "../components/project/Arbeitsstatistik";
import Phase from "../components/project/Phase";
import { useParams } from "react-router-dom";
import { apiget, apiput, apidelete, apipost } from "../API/Api";
import { UserAuth } from "../Context/Authcontext";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import Divider from "@mui/material/Divider";
import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useMediaQuery from "@mui/material/useMediaQuery";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";

export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [project, setProject] = useState("");
  const [founderName, setFounderName] = useState("");
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
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingAdditions, setPendingAdditions] = useState([]);
  const [pendingRemovals, setPendingRemovals] = useState([]);

  const [members, setMembers] = useState([]);
  const [copyProjectusers, setCopyProjectUsers] = useState([]);
  const [copyProject, setCopyProject] = useState([]);

  const isSmallScreen = useMediaQuery("(max-width:800px)");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await apiget(`project/${id}/users`);
 
        const isUserInProject = users.some((projectUser) => projectUser.id === user.id);
       
        if(!isUserInProject){
          navigate("/home");
          return;
        };
 
        setProjectUsers(users);
        setCopyProjectUsers(users);
 
        const data = await apiget(`project/${id}`);
        setProject(data);
        setCopyProject(data);
        // Setze die Mitgliederliste in der State
        const members = await apiget("users");
        setMembers(members);
 
        const filteredMembers = members.filter(
          (user) => !users.some((projectUser) => projectUser.id === user.id)
        );
        setNotmember(filteredMembers);
      } catch (error) {
        console.error("Fehler beim Laden des Projekttitels:", error);
      }
    };
 
    if (id) {
      fetchData();
    }
    const intervalId = setInterval(fetchData, 10000);
 
    return () => clearInterval(intervalId);
  }, [id, user]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    width: "70%",
    maxWidth: 500,
    minWidth: 200,
    maxHeight: 700,
    overflow: "auto",
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
    try {
      const updatedproject = {
        id: copyProject.id,
        project_title: copyProject.project_title,
        project_description: copyProject.project_description,
        founder: copyProject.founder,
        manager: copyProject.manager,
        start_date: copyProject.start_date,
        end_date: copyProject.end_date,
      };
      await apiput(`project/${project.id}/user`, user.id, updatedproject);

      setProjectUsers(copyProjectusers);
      // API-Aufrufe für hinzugefügte und entfernte Mitglieder durchführen
      const addPromises = pendingAdditions.map((user) =>
        apipost(`project/${id}/user`, user)
      );
      const removePromises = pendingRemovals.map((user) =>
        apidelete(`project/${id}/members`, user.id)
      );

      // Warte auf das Ergebnis aller API-Aufrufe
      const results = await Promise.allSettled([
        ...addPromises,
        ...removePromises,
      ]);

      // Prüfe, ob alle API-Aufrufe erfolgreich waren
      const allRequestsSucceeded = results.every(
        (result) => result.status === "fulfilled"
      );

      if (allRequestsSucceeded) {

        // Lokale Zustände zurücksetzen
        setPendingAdditions([]);
        setPendingRemovals([]);

        // Lokale Aktualisierung der Mitgliederliste basierend auf den Änderungen
        const updatedMembers = projectUsers
          .filter(
            (user) => !pendingRemovals.some((removal) => removal.id === user.id)
          )
          .concat(pendingAdditions);

        // Aktualisiere die State-Variable nur, wenn der Speichern-Button geklickt wurde
        setProjectUsers(updatedMembers);

        // Nur wenn die API-Aufrufe erfolgreich waren, schließe die Einstellungen
        handleCloseSettings();

        // Nur wenn die API-Aufrufe erfolgreich waren, aktualisiere das Projekt
        setProject(updatedproject);
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Projekts:", error);
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  // Projekt löschen
  const handleDelete = async () => {
    try {
      await apidelete(`project/${id}/userid`, user.id);
      navigate("/home");
      setProject("");
    } catch (error) {
      console.error("Fehler beim Löschen des Projekts:", error);
    }
  };

  //Projekt verlassen
  const handleLeave = async () => {
    try {

      if (user.id === project.manager) {
        setOpendialog(true); // Öffne das Dialogfenster, wenn user.id gleich project.manager ist
      } else {
        await apidelete(`project/${id}/members`, user.id);
        navigate("/home");
      }
    } catch (error) {
      console.error("Fehler beim Verlassen des Projekts:", error);
    }
  };

  const handleClosedialog = () => {
    setOpendialog(false);
  };

  const moveNameToprojectusers = (user) => {
    setPendingAdditions([...pendingAdditions, user]);
    setNotmember(notmember.filter((value) => value.id !== user.id));
    setCopyProjectUsers((prevmember) => [...prevmember, user]);
  };

  const moveNameTonotMember = (user) => {
    setPendingRemovals([...pendingRemovals, user]);
    setNotmember((prevNotmember) => [...prevNotmember, user]);
    setCopyProjectUsers((prevUsers) =>
      prevUsers.filter((value) => value.id !== user.id)
    );
  };

  // Funktion zur Überprüfung, ob die Benutzer-ID des Managers übereinstimmt
  const isManagerUserIdValid = () => {
    // Hier deine Bedingung zur Überprüfung der Benutzer-ID des Managers
    return project.manager === user.id; // Ändere dies entsprechend deiner Anforderungen
  };

  const listStyle = {
    width: "100%",
    maxHeight: 200,
    overflow: "auto",
  };

  const handleToggleSpeedDial = () => {
    setSpeedDialOpen((prevState) => ({
      ...(prevState || false),
    }));
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
            Bitte wähle zuerst einen Nachfolger, danach kannst du das Projekt
            verlassen.
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
          <Typography variant="h6" mb={2}>
            Projekteinstellungen
          </Typography>

          <Box style={infoContainerStyle}>
            <TextField
              label="Projekttitel"
              variant="outlined"
              value={copyProject.project_title}
              onChange={(e) =>
                setCopyProject({ ...copyProject, project_title: e.target.value })
              }
              fullWidth
              margin="normal"
              style={{ marginTop: "10px" }}
              disabled={!isManagerUserIdValid()} // Dynamisch die 'disabled' Eigenschaft setzen
            />
            <TextField
              label="Beschreibung"
              variant="outlined"
              value={copyProject.project_description}
              onChange={(e) =>
                setCopyProject({ ...copyProject, project_description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
              margin="normal"
              style={{ marginTop: "10px" }}
              disabled={!isManagerUserIdValid()} // Dynamisch die 'disabled' Eigenschaft setzen
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
                  <Box>
                    <Paper>
                      <TextField
                        label="Verfügbare Mitglieder"
                        variant="outlined"
                        value={notmemberFilter}
                        onChange={(e) => setnotmemberFilter(e.target.value)}
                        fullWidth
                      />
                      <List dense component="div" role="list" sx={listStyle}>
                        {notmember
                          .filter((user) =>
                            user.nickname
                              .toLowerCase()
                              .includes(notmemberFilter.toLowerCase())
                          )
                          .map((user, index) => (
                            <>
                              <ListItem
                                key={user.user_id}
                                button
                                onClick={() => moveNameToprojectusers(user)}
                                disabled={!isManagerUserIdValid()}
                              >
                                <ListItemText primary={user.nickname} />
                                <ListItemIcon style={{ color: "green" }}>
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
                        {copyProjectusers
                          .filter((member) =>
                            member.nickname
                              .toLowerCase()
                              .includes(projectusersFilter.toLowerCase())
                          )
                          .map((member, index) => (
                            <>
                              <ListItem
                                key={member.user_id}
                                disabled={
                                  !isManagerUserIdValid() ||
                                  member.id === user.id
                                }
                                button
                                onClick={() => moveNameTonotMember(member)}
                              >
                                <ListItemText primary={member.nickname} />
                                <ListItemIcon style={{ color: "red" }}>
                                  <GroupRemoveIcon />
                                </ListItemIcon>
                              </ListItem>
                              {index !== copyProjectusers.length - 1 && (
                                <Divider />
                              )}
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
              value={copyProject.start_date}
              InputProps={{
                readOnly: true, //kann man nicht bearbeiten
                style: {
                  pointerEvents: "none", //Cursor entfernen
                  color: "rgba(0, 0, 0, 0.6)", //Textfarbe
                  backgroundColor: "#f0f0f0", //Hintergrundfarbe
                },
              }}
              style={{ marginTop: "10px" }}
            />
            <TextField
              label="Ende"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={copyProject.end_date}
              onChange={(e) =>
                setCopyProject({ ...copyProject, end_date: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
              style={{ marginTop: "10px" }}
              disabled={!isManagerUserIdValid()} // Dynamisch die 'disabled' Eigenschaft setzen
            />

            <TextField
              select
              label="Manager"
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              style={{
                marginTop: "10px",
                marginBottom: "10px",
              }}
              value={copyProject.manager || ""}
              onChange={(event) => {
                const newValue = event.target.value;
                setCopyProject({ ...copyProject, manager: newValue });
              }}
            >
              {projectUsers && projectUsers.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.nickname}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box style={{ display: "grid", gap: "10px", justifyContent: "center" }}>
            <Grid container spacing={2}>
              
                  <Grid  item xs={12} md={4}>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ width: "100%" }}
                      onClick={() => {
                        handleSave();
                      }}
                      disabled={user?.id != project?.manager}
                    >
                      Speichern
                    </Button>
                  </Grid>
                  <Grid  item xs={12} md={4}>
                    <Button
                      variant="contained"
                      sx={{ color: "white", backgroundColor: "primary.contrastText", width: "100%" }}
                      onClick={() => {
                        handleOpenDeleteDialog();
                      }}
                      disabled={user?.id != project?.manager}
                    >
                      Projekt Löschen
                    </Button>
                  </Grid>
                
             
              <Grid  item xs={12} md={4}>
                <Button
                  variant="contained"
                  sx={{ color: "white", backgroundColor: "primary.contrastText", width: "100%" }}
                  onClick={() => {
                    handleLeave();
                  }}
                >
                  Projekt verlassen
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Box style={headerStyle}>
        <Typography variant="h4" align="center">
          {project.project_title}
        </Typography>
        {!isSmallScreen ? (
          <>
            <Button
              variant="contained"
              sx={{
                marginLeft: "auto",
                color: "lightgrey",
                backgroundColor: "secondary.dark",
              }}
              onClick={handleOpen}
            >
              Report-Ansicht
            </Button>

            <Button
              variant="contained"
              sx={{
                marginLeft: "5px",
                color: "lightgrey",
                backgroundColor: "secondary.dark",
              }}
              onClick={handleOpenSettings}
            >
              Projekteinstellungen
            </Button>
          </>
        ) : (
          <>
            <Tooltip title="Report-Ansicht">
              <IconButton
                variant="contained"
                sx={{
                  marginLeft: "auto",
                  color: "lightgrey",
                  backgroundColor: "secondary.dark",
                  "&:hover": {
                    backgroundColor: "#001420",
                  },
                }}
                onClick={handleOpen}
              >
                <AssessmentIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Projekteinstellungen">
              <IconButton
                variant="contained"
                sx={{
                  marginLeft: "5px",
                  color: "lightgrey",
                  backgroundColor: "secondary.dark",
                  "&:hover": {
                    backgroundColor: "#001420",
                  },
                }}
                onClick={handleOpenSettings}
              >
                <SettingsIcon helper="Settings" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik key={id} projectusers={projectUsers} />
        </Box>
      </Modal>
      {project && projectUsers ? (
        <Phase
          key={id}
          projectusers={projectUsers}
          projektid={id}
          project={project}
        />
      ) : (
        <Typography>Loading...</Typography>
      )}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Projekt löschen</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sind Sie sicher, dass Sie das Projekt löschen möchten?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Abbrechen
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
