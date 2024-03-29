import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiget } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';
import Createproject from '../pages/Createproject';
import FaceIcon from '@mui/icons-material/Face';
import AddIcon from '@mui/icons-material/Add';

//React-Funktionskomponente Projektkarte
const Projectcard = () => {
  const { user } = UserAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectsNames, setProjectsNames] = useState({});

  //useEffect führt beim ersten laden der Komponente eine API-Anfrage um Projekte des aktuellen Benutzers darzustellen
  useEffect(() => {
    apiget(`user/${user.id}/projects`).then((result) => {
      setProjects(result.projects);
      setProjectsNames(
        result.projects.reduce(
          (o, project) => ({
            ...o,
            [project.project_title]: project.project_id,
          }),
          {}
        )
      );
    });
  }, []);

  //Funktion überprüft ob das ausgewählt das ausgewählte Projekt vorhanden ist und führt danach zur Projektseite basierend auf die Projekt-ID
  const navigateToProject = (selectedProject) => {
    if (selectedProject) {
      navigate(`/project/${projectsNames[selectedProject]}`);
    }
  };

  //Benutzeroberfläche für die Anzeige und Verwaltung von Projekten
  return (
    <Box sx={{ minWidth: 150 }}>
      {/*Dropdown-Auswahl für Projekte */}
      <Autocomplete
        sx={{
          marginBottom: "1rem",
          backgroundColor: "white",
          width: "100%",
          color: "white",
        }}
        options={Object.keys(projectsNames)}
        onChange={(event, newValue) => {
          navigateToProject(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Projektsuche" />}
      />

      {/* Anordnung der Projekt-Karten */}
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {projects.map((project, index) => (
          <Grid item xs={6} sm={4} xl={3} key={index}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: "rgb(233, 233, 233)",
                border: "2px solid transparent",
                transition: "border-color 0.3s ease",
                "&:hover": {
                  borderColor: "#3d5c6c",
                },
              }}
              onClick={() => navigateToProject(project.project_title)}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="black"
                  sx={{ fontFamily: "Tahoma, sans-serif" }}
                >
                  {project.project_title}
                </Typography>
                <Typography variant="body1" color="black" rows={4}>
                  {project.project_description}
                </Typography>
                <Typography
                  sx={{ mt: 1 }}
                  color="text.secondary"
                  variant="body2"
                >
                  Mitglieder:
                </Typography>
                {project.members.map((member, index) => (
                  <Chip
                    key={index}
                    icon={
                      <FaceIcon sx={{ color: "black", fontSize: "small" }} />
                    }
                    label={member}
                    sx={{
                      backgroundColor: "lightgrey",
                      color: "black",
                      marginRight: "3px",
                      marginBottom: "3px",
                      fontSize: "0.75rem",
                      height: "24px",
                      "& .MuiChip-icon": {
                        fontSize: "small",
                        color: "black",
                      },
                    }}
                  />
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={6} sm={4} xl={3}>
          {/* Karte zum Erstellen eines neuen Projekts */}
          <Card
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "rgb(233, 233, 233)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid transparent",
              transition: "border-color 0.3s ease",
              "&:hover": {
                borderColor: "#3d5c6c",
              },
            }}
            onClick={handleOpen}
          >
            <Box sx={{ textAlign: "center" }}>
              <Typography color="black" variant="h6" sx={{ marginTop: "1rem" }}>
                Neues Projekt erstellen
              </Typography>
              <AddIcon
                sx={{ color: "black", fontSize: "3rem", marginTop: "0.5rem" }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
      {/*Modal zum Erstellen eines neuen Projekts*/}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ fontFamily: "Tahoma, sans-serif", fontSize: "2rem" }}
          >
            {/* Hier wird die Komponente eingefügt */}
            <Createproject></Createproject>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Projectcard;
