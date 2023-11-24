import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import {Button, Typography, Box, IconButton, Card, CardContent, CardActions, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Arbeitsstatistik from "../components/Arbeitsstatistik";
import Tasks from "../components/Tasks";
import Mitglieder from "../components/Mitglieder";

export default function Projekt() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isPopUpOpen, setPopUpOpen] = useState(false);
  const [phaseName, setPhaseName] = useState("Discussion"); //Beispielname der Phase
  const [project, setProject] = useState("");
  const [Sopra, setSopra] = useState([]);
  //const [projectName, setProjectName] = useState(""); //Zustand Projektname

  //JSON-Dummy
  const initialSopra = [
    {
      phasenid: "2",
      indx: "1",
      Phasenname: "todo",
      Tasks: [
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
      ],
    },
    {
      phasenid: "3",
      indx: "2",
      Phasenname: "doing",
      Tasks: [
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
      ],
    },
    {
      phasenid: "4",
      indx: "3",
      Phasenname: "done",
      Tasks: [
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
        { Taskid: "1" },
      ],
    },
  ];

  useEffect(() => {
    setSopra(initialSopra); 
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

  // Card anpassen (Style außen)
  const cardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    gap: "10px",
    flexWrap: "wrap",
  };

  // Layout einzelne Card
  const singleCardStyle = {
    flex: "0 0 calc(25% - 20px)",
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const cardContentStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: "10px",
    gap: "10px",
    flexWrap: "wrap", // Für die Spalten in den Zeilen
  };

  // Verschiebungspfeile
  const iconStyle = {
    marginRight: "auto",
  };

  // PopUp Fenster schließen und öffnen
  const handleOpenPopUp = () => {
    console.log("PopUp-Fenster wird geöffnet");
    setPopUpOpen(true);
  };

  const handleClosePopUp = () => {
    console.log("PopUp-Fenster wird geschlossen");
    setPopUpOpen(false);
  };

  //Phasennamen bearbeiten                                - speichern fehlt noch !
  const handleEditPhaseName = () => {
    const newPhaseName = prompt("Wie soll ihre Phase heißen?:", phaseName);
    if (newPhaseName !== null && newPhaseName !== "") {
      changePhaseName(0, newPhaseName);
    }
  };

  const changePhaseName = (index, newName) => {
    if (newName !== null && newName !== "") {
      setProject((prevState) => {
        const updatedData = [...prevState];
        updatedData[index].Phasenname = newName;
        console.log(project);
        return updatedData;
      });
    }
  };

  const lowerIndex = (index) => {
    setProject((prevState) => {
      if (index > 0) {
        const updatedData = [...prevState];
        // Tauscht Indx-Positionen
        [updatedData[index], updatedData[index - 1]] = [updatedData[index - 1], updatedData[index]];
  
        updatedData.forEach((card, i) => card.indx = i + 1);
  
        console.log('Updated Project:', updatedData);
        return updatedData;
      }
  
      return prevState;
    });
  };

//Verschiebung der Phasen nach links
  const moveLeftAndLowerIndex = (index) => {
    if (index > 0) {
      setSopra((prevSopra) => {
        const updatedSopra = [...prevSopra];
        [updatedSopra[index], updatedSopra[index - 1]] = [updatedSopra[index - 1], updatedSopra[index]];
        updatedSopra.forEach((phase, i) => {
          phase.indx = i + 1;
        });
  
        return updatedSopra;
      });
    }
  };

  //Verschiebung der Phasen nach rechts
  const handleMoveRight = (index) => {
    if (index < Sopra.length - 1) {
      setSopra((prevSopra) => {
        const updatedSopra = [...prevSopra];
        [updatedSopra[index], updatedSopra[index + 1]] = [updatedSopra[index + 1], updatedSopra[index]];

        return updatedSopra;
      });
    }
  };

  // //Projektname aus der Datenbank laden
  // const loadProjectName = () => {
  //   fetchProjectName().then((projectNameFromDB) => {
  //     setProjectName(projectNameFromDB);
  //   }).catch((error) => {
  //     console.error("Fehler beim Laden des Projektnamens: ", error);
  //   });
  // };

  // useEffect(() => {
  //   loadProjectName();
  // }, []);

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
      </div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Arbeitsstatistik />
        </Box>
      </Modal>
      <>
        <div style={cardContainerStyle}>
          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: "#f3e5f5" }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">To do</Typography>
                  <IconButton onClick={handleEditPhaseName}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton onClick={handleOpenPopUp}>
                  <AddIcon />
                  <Typography style={{ marginLeft: "5px" }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>

          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: "#f3e5f5" }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">Doing</Typography>
                  <IconButton onClick={handleEditPhaseName}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton onClick={handleOpenPopUp}>
                  <AddIcon />
                  <Typography style={{ marginLeft: "5px" }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>

          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: "#f3e5f5" }}>
              <CardContent>
                <div style={cardContentStyle}>
                  <IconButton style={iconStyle}>
                    <ArrowLeftIcon />
                  </IconButton>
                  <Typography variant="h5">Done</Typography>
                  <IconButton onClick={handleEditPhaseName}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <div style={iconStyle}>
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  </div>
                </div>
              </CardContent>
              <CardActions>
                <IconButton onClick={handleOpenPopUp}>
                  <AddIcon />
                  <Typography style={{ marginLeft: "5px" }}>
                    Task hinzufügen
                  </Typography>
                </IconButton>
              </CardActions>
            </Card>
          </div>
          <div style={singleCardStyle}>
            <Card sx={{ minWidth: 275, bgcolor: "#E0C2FF" }}>
              <CardContent>
                <Typography>
                  <IconButton>
                    <AddIcon />
                  </IconButton>
                  Phase hinzufügen
                </Typography>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
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
          <Tasks />
          <Button onClick={handleClosePopUp}>Schließen</Button>
          <Button onClick={handleClosePopUp}>Hinzufügen</Button>
        </div>

        {/* ab hier neu */}
      </Modal>
      <Box style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
  {Sopra.map((phase, index) => (
   <Card key={phase.phasenid} style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton style={iconStyle} onClick={() => {moveLeftAndLowerIndex(index)}}>
          <ArrowLeftIcon />
        </IconButton>
        <TextField
          id="phasenname"
          defaultValue={phase.Phasenname}
          onChange={(event) => changePhaseName(index, event.target.value)}
        />
        <IconButton style={iconStyle} onClick={() => {handleMoveRight(index)}}>
         <ArrowRightIcon />
        </IconButton>
      </div>
    </Card>
  ))}
</Box>
    </>
  );
}

