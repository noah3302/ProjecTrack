import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Createproject from '../pages/Createproject';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiget } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';

const Projectcard = () => {
  const { user } = UserAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectsNames, setProjectsNames] = useState({});

  useEffect(() => {
    apiget(`user/${user.id}/projects`).then((result) => {
      // apiget(`user/${7}/projects`).then((result) => {
      setProjects(result.projects)
      console.log(result.projects)
      setProjectsNames(result.projects.reduce((o, project) => ({ ...o, [project.project_title]: project.project_id }), {}))
    });
  }, []);

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

  //Navigieren zur ausgewählten Projektseite
  const navigateToProject = (selectedProject) => {
    if (selectedProject) {
      navigate(`/projekt/${projectsNames[selectedProject]}`);
    }
  };

  return (
    <Box sx={{ minWidth: 150 }}>

      <Autocomplete
        style={input}
        options={Object.keys(projectsNames)}
        onChange={(event, newValue) => {
          navigateToProject(newValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Projektsuche" />
        )}
        sx={{ width: '500px' }}
      />

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {projects.map(project => (
          <Grid item xs={6} sm={4} md={3} key={project.project_id}>
            <Card
              sx={{ height: '100%' }}
              onClick={() => navigateToProject(project.project_title)}     //Navigieren zur ausgewählten Projektseite
              style={{ cursor: 'pointer' }}
            >
              <CardContent>
                <Typography typography="h6" color="text.primary">
                  {project.project_title}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Beschreibung:
                </Typography>
                <Typography variant="body2">
                  {project.project_description}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Mitglieder:
                </Typography>
                <Typography variant="body2">
                  {project.members.join(', ')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        <Grid item xs={6} sm={4} md={3} >
          <Box onClick={handleOpen}>
            <Card sx={{ height: '100%' }}>
              <Typography color="#bdbdbd" align={"center"} >
                Neues Projekt erstellen
              </Typography>
              <Typography color="#bdbdbd" align={"center"} fontSize={120}>
                +
              </Typography>
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
