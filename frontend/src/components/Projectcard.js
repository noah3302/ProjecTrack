import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddIcon from '@mui/icons-material/Add';
import { Autocomplete } from '@mui/material';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { apiget } from '../API/Api';
import { UserAuth } from '../Context/Authcontext';
import Createproject from '../pages/Createproject';

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
      setProjects(result.projects);
      setProjectsNames(result.projects.reduce((o, project) => ({ ...o, [project.project_title]: project.project_id }), {}));
    });
  }, []);

  const navigateToProject = (selectedProject) => {
    if (selectedProject) {
      navigate(`/project/${projectsNames[selectedProject]}`);
    }
  };

  

  return (
    <Box sx={{ minWidth: 150 }}>
      <Autocomplete
        style={{ marginBottom: '1rem', backgroundColor: 'white', width: '100%' }}
        options={Object.keys(projectsNames)}
        onChange={(event, newValue) => {
          navigateToProject(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Projektsuche" />}
        sx={{ width: '500px' }}
      />

      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        {projects.map((project, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to right top, #87CEEB, #FFFFFF)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
              onClick={() => navigateToProject(project.project_title)}
            >
              <CardContent>
                <Typography variant="h6" color="text.primary" sx={{ fontFamily: 'Tahoma, sans-serif' }}>
                  {project.project_title}
                </Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Beschreibung:
                </Typography>
                <Typography variant="body2">{project.project_description}</Typography>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  Mitglieder:
                </Typography>
                <Typography variant="body2">{project.members.join(', ')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={6} sm={4} md={3}>
          <Box onClick={handleOpen}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(to right top, #87CEEB, #FFFFFF)',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            >
              <Typography color="#000000" align="center">
                Neues Projekt erstellen
              </Typography>
              <Typography color="#000000" align="center" fontSize={120}>
                +
              </Typography>
            </Card>
          </Box>
        </Grid>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40rem',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            <Createproject></Createproject>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
};

export default Projectcard;
