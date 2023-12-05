import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  TextField,
  IconButton,
  Button,
  CardActions,
  Typography,
} from "@mui/material";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Task from "../components/Tasks";
import { apiget } from "../API/Api";

export default function About() {
  const [project, setProject] = useState([]);

  const iconStyle = {
    marginRight: "auto",
  };
  const taskBoxStyle = {
    backgroundColor: "orange",
    minHeight: "100px", // Setze die Mindesthöhe für die Task-Boxen
    padding: "10px",
    marginBottom: "10px", // Abstand zwischen den Task-Boxen
    width: "90%", // Breite auf 100% des übergeordneten Containers setzen
    boxSizing: "border-box", // Sicherstellen, dass Padding und Border die Gesamtgröße der Box nicht ändern
  };

  // Stil für die Phase-Karten
  const phaseCardStyle = {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    width: "calc(33.33% - 20px)", // Drei Karten pro Reihe, mit 20px Abstand
    marginRight: "20px", // Abstand zwischen den Karten
  };

  // Stil für den Container der Phasen
  const phaseContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: "10px", // Außenabstand
  };

  const [newPhaseName, setNewPhaseName] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [duedate, setDueDate] = useState(null);
  const [indexphase, setIndexphase] = useState(null);

  const projectid = 1;
  useEffect(async () => {
    try {
      const response = await apiget(`phase/${projectid}`);
      setProject(response);
    } catch (error) {
      console.error("Fehler beim Abrufen der Phasen:", error);
    }
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

  const changePhaseName = (index, newName) => {
    console.log(project);
    if (newName !== null && newName !== "") {
      setProject((prevState) => {
        const updatedData = [...prevState];
        updatedData[index].Phasenname = newName;
        return updatedData;
      });
    }
  };

  //Verschiebung nach links
  const moveLeftAndLowerIndex = (index) => {
    if (index > 0) {
      setProject((prevproject) => {
        const updatedproject = [...prevproject];
        [updatedproject[index], updatedproject[index - 1]] = [
          updatedproject[index - 1],
          updatedproject[index],
        ];

        updatedproject.forEach((phase, i) => {
          phase.indx = i + 1;
        });

        return updatedproject;
      });
    }
  };

  //Verschiebung rechts
  const handleMoveRight = (index) => {
    if (index < project.length - 1) {
      setProject((prevproject) => {
        const updatedproject = [...prevproject];
        [updatedproject[index], updatedproject[index + 1]] = [
          updatedproject[index + 1],
          updatedproject[index],
        ];

        updatedproject.forEach((phase, i) => {
          phase.indx = i + 1;
        });

        return updatedproject;
      });
    }
  };

  //Phasennamen ändern
  const handleNewPhaseNameChange = (event) => {
    setNewPhaseName(event.target.value);
  };

  //Neue Phase hinzufügen
  const addNewPhase = () => {
    if (newPhaseName.trim() !== "") {
      const newPhase = {
        phasenid: String(project.length + 1),
        indx: String(project.length + 1),
        Phasenname: newPhaseName.trim(),
        Tasks: [],
      };

      setProject((prevProject) => [...prevProject, newPhase]);
      setNewPhaseName("");
    }
  };

  //Phase löschen und Indexe anpassen
  const handleDeletePhase = (phaseId) => {
    setProject((prevProject) => {
      const updatedProject = prevProject.filter(
        (phase) => phase.phasenid !== phaseId
      );

      // Die Indexe der verbleibenden Phasen werden neu zuweisen
      updatedProject.forEach((phase, index) => {
        phase.indx = String(index + 1);
      });

      return updatedProject;
    });
  };

  const handleAddTask = () => {
    handleClose2();
    if (title && description && duedate !== null) {
      const highestTaskId = Math.max(
        ...project.flatMap((phase) =>
          phase.Tasks.map((task) => parseInt(task.Taskid))
        )
      );

      const newTaskId = isNaN(highestTaskId) ? 1 : highestTaskId + 1;

      const newTask = {
        Taskid: String(newTaskId),
        Taskname: title,
        Beschreibung: description,
        enddate: duedate,
        userid: "1",
        phasenid: indexphase,
      };

      setProject((prevProject) => {
        const updatedProject = prevProject.map((phase) => {
          if (phase.indx === indexphase) {
            phase.Tasks.push(newTask);
          }
          return phase;
        });
        return updatedProject;
      });

      setTitle(null);
      setDescription(null);
      setDueDate(null);
    } else {
      console.log("Bitte fülle alle Felder aus.");
    }
  };


  useEffect(() => {
    console.log(project);
  })

  const setphasenindex = (index) => {
    setIndexphase(index);
    handleOpen2();
  };

  const handleDeleteTask = () => {
    console.log("Task löschen");
  };

  return (
    <>
      <div style={headerStyle}>
        <Typography variant="h6">PLATZHALTER Projektname</Typography>
        <Button variant="contained" style={buttonStyle} onClick={handleOpen}>
          Arbeitsstatistik
        </Button>
        <Button variant="contained" style={buttonStyle}>
          Mitglieder
        </Button>
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          {/* Neue Phase hinzufügen */}
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              id="newPhaseName"
              label="Neue Phase"
              value={newPhaseName}
              onChange={handleNewPhaseNameChange}
            />
            <IconButton onClick={addNewPhase}>
              <Typography variant="body2">hinzufügen</Typography>
            </IconButton>
          </div>
        </Card>
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      <Modal open={open2} onClose={handleClose2}>
        <Box sx={style}>
          <Typography>Neue Aufgabe erstellen</Typography>
          <Box
            sx={{
              width: "250px",
              "& .MuiTextField-root": { marginTop: "20px" },
            }}
          >
            <TextField
              required
              id="outlined-required-title"
              label="Titel"
              placeholder="neuer Händler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              required
              id="outlined-required-description"
              label="Beschreibung"
              placeholder="Suche einen neuen Händler."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <TextField
              id="outlined-date"
              label="Due Date"
              type="date"
              value={duedate}
              onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              onClick={() => handleAddTask()}
              variant="contained"
              color="primary"
            >
              Hinzufügen
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box style={phaseContainerStyle}>
        {Array.isArray(project) &&
          project.map((phase, index) => (
            <Card key={phase.phasenid} style={phaseCardStyle}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  style={iconStyle}
                  onClick={() => {
                    moveLeftAndLowerIndex(index);
                  }}
                >
                  <ArrowLeftIcon />
                </IconButton>
                <TextField
                  id="phasenname"
                  defaultValue={phase.phasenname}
                  onChange={(event) =>
                    changePhaseName(index, event.target.value)
                  }
                />
                <IconButton
                  style={iconStyle}
                  onClick={() => {
                    handleMoveRight(index);
                  }}
                >
                  <ArrowRightIcon />
                </IconButton>
              </div>
              <CardActions>
                <IconButton onClick={() => setphasenindex(phase.phasenid)}>
                  <AddIcon />
                  <Typography style={{ marginLeft: "5px" }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "5px", // Abstand unteren Rand Lösch-Icon
                  right: "5px", // Abstand rechter Rand
                }}
                onClick={() => handleDeletePhase(phase.phasenid)}
              >
                <DeleteOutlineIcon />
              </IconButton>
              <Task key={phase.phasenid} phasenid={phase.phasenid}/>
            </Card>
          ))}
      </Box>
    </>
  );
}