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
 
export default function Projekt() {
  const [project, setProject] = useState([]);
 
  const iconStyle = {
    marginRight: "auto",
  };
 
  const [newPhaseName, setNewPhaseName] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(null);
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [duedate, setDueDate] = useState(null);
 
  //JSON-Dummy
  const initialSopra = [
    {
      phasenid: "1",
      indx: "1",
      Phasenname: "todo",
      Tasks: [
        {
          Taskid: "1",
          Taskname: "Eins",
          Beschreibung: "dumm dumm",
          enddate: "2024-06-10",
          userid: "1",
          phasenid: "1",
        },
      ],
    },
    {
      phasenid: "2",
      indx: "2",
      Phasenname: "doing",
      Tasks: [
        {
          Taskid: "1",
          Taskname: "Zwei",
          Beschreibung: "Computer liest meine Nachrichten",
          enddate: "2024-06-10",
          userid: "1",
          phasenid: "1",
        },
      ],
    },
    {
      phasenid: "3",
      indx: "3",
      Phasenname: "done",
      Tasks: [
        {
          Taskid: "1",
          Taskname: "Drei",
          Beschreibung: "Hund Katze Maus",
          enddate: "2024-06-10",
          userid: "1",
          phasenid: "1",
        },
      ],
    },
  ];
 
  useEffect(() => {
    setProject(initialSopra);
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
        phasenid: String(project.length + 2),
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
 
  // PopUp Fenster schließen und öffnen
  const handleOpenPopUp = (index) => {
    console.log("PopUp-Fenster wird geöffnet");
    setPopUpOpen(true);
    setCurrentPhaseIndex(index); // Setze den Index in einem State, z.B. setCurrentPhaseIndex
  };
 
 
  const handleClosePopUp = () => {
    console.log("PopUp-Fenster wird geschlossen");
    setPopUpOpen(false);
  };
 
  //Task hinzufügen zur Phase
const addTaskToPhase = (newTask, currentPhaseIndex) => {
  setProject((prevProject) => {
    const updatedProject = [...prevProject];
    updatedProject[currentPhaseIndex].Tasks.push(newTask);
    return updatedProject;
  });
};
 
const handleAddTask = (phasenid) => {
  const newTask = {
    Taskid: "1",
    Taskname: title,
    Beschreibung: description,
    enddate: duedate,
    userid: "1",
    phasenid: phasenid,
  };
 
  addTaskToPhase(newTask, currentPhaseIndex);
  handleClosePopUp(); // Close the popup after adding the task
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
      <Modal
      open={isPopUpOpen}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ backgroundColor: "#D3D3D3", padding: "20px" }}>
        <h3>Neue Aufgabe erstellen</h3>
 
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
            onClick={handleAddTask()}
            variant="contained"
            color="primary"
          >
            Hinzufügen
          </Button>
        </Box>
 
        <Button onClick={handleClosePopUp}>Schließen</Button>
        <Button onClick={handleClosePopUp}>Hinzufügen</Button>
      </div>
    </Modal>
     
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {Array.isArray(project) &&
          project.map((phase, index) => (
            <Card
              key={phase.phasenid}
              style={{
                marginBottom: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
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
                  defaultValue={phase.Phasenname}
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
                <IconButton onClick={() => handleOpenPopUp(index)}>
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
 
              {Array.isArray(phase.Tasks) &&
                phase.Tasks.map((task) => (
                  <Box
                    style={{
                      backgroundColor: "orange",
                    }}
                    key={task.Taskid}
                  >
                    <Typography>{task.Taskname}</Typography>
                    <Typography>{task.Beschreibung}</Typography>
                    <Typography>{task.enddate}</Typography>
                    <Typography>{task.userid}</Typography>
                    <Typography>{task.phasenid}</Typography>
                  </Box>
                ))}
             
            </Card>
          ))}
      </Box>
    </>
  );
}