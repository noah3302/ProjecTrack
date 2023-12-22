import React, { useEffect, useState } from "react";
import { apiget, apidelete, apipost, apiput } from "../../API/Api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from "react-router-dom";
import { Box, TextField, Card, Typography, IconButton,} from "@mui/material";
import Task from "./Tasks";

const Phase = () => {
  const [project, setProject] = useState([]);
  const [newPhaseName, setNewPhaseName] = useState("");
  let { id } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const [newPhasenid, setNewPhasenid] = useState(null); 

  const phasenload = async () => {
    const response = await apiget(`phase/${id}`);
    const sortedResponse = response.sort((a, b) => a.indx - b.indx);
    setProject(sortedResponse);
  };

  const updateParentComponent = async (newPhasenid) => {
    setNewPhasenid(newPhasenid);
    await phasenload(newPhasenid); 
    setReloadKey(prevKey => prevKey + 1); 
};

  useEffect(() => {
    phasenload();
  }, []);

  const handleDeleteButtonClick = (phaseId) => {
    console.log("Delete button clicked with ID:", phaseId);
    console.log(project.project_id);
    handleDeletePhase(phaseId);
  };

  //Phase löschen und Indexe anpassen
  const handleDeletePhase = async (phaseId) => {
    try {
      await apidelete(`phase`, phaseId);

      setProject((prevProject) => {
        const updatedProject = prevProject.filter(
          (phase) => phase.id !== phaseId
        );

        // Die Indexe der verbleibenden Phasen werden neu zugewiesen
        updatedProject.forEach((phase, index) => {
          phase.indx = String(index + 1);
        });

        console.log(updatedProject); // Nutze updatedProject statt project

        return updatedProject;
      });
    } catch (error) {
      console.error("Fehler beim Löschen der Phase:", error);
    }
  };

  //Phasennamen ändern
  const handleNewPhaseNameChange = (event) => {
    setNewPhaseName(event.target.value);
  };

  //Neue Phase hinzufügen
  const addNewPhase = async () => {
    if (newPhaseName.trim() !== "") {
      const newPhase = {
        id: 0,
        phasename: newPhaseName.trim(),
        indx: String(project.length + 1),
        project_id: id,
      };
      const response = await apipost("phase", newPhase);
      console.log(response);
      setProject((prevProject) => [...prevProject, response]);
      setNewPhaseName("");
    }
  };

  //Verschiebung nach links
  const moveLeftAndLowerIndex = (index) => {
    try {
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

          updatePhases(updatedproject[index], updatedproject[index - 1]);

          return updatedproject;
        });
      }
    } catch (error) {
      console.log("Fehler:", error);
    }
  };

  const updatePhases = async (phase1, phase2) => {
    const phaseId1 = phase1.id;
    const phaseId2 = phase2.id;

    const newPhase1 = { ...phase1 };
    await apiput("phases", phaseId1, newPhase1);

    const newPhase2 = { ...phase2 };
    await apiput("phases", phaseId2, newPhase2);
  };

  //Verschiebung rechts
  const handleMoveRight = async (index) => {
    if (index < project.length - 1) {
      const updatedProject = [...project];
      [updatedProject[index], updatedProject[index + 1]] = [
        updatedProject[index + 1],
        updatedProject[index],
      ];

      updatedProject.forEach((phase, i) => {
        phase.indx = i + 1;
      });

      await updatePhases(updatedProject[index], updatedProject[index + 1]);

      setProject(updatedProject);
    }
  };

  const changePhaseName = async (index, newName) => {
    console.log(project);
    if (newName !== null && newName !== "") {
      try {
        const updatedData = [...project];
        const newphase = project[index];
        updatedData[index].phasename = newName;
        await apiput("phases", id, newphase);
        setProject(updatedData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Stil für die Phase-Karten
  const phaseCardStyle = {
    marginBottom: "40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    width: "calc(33.33% - 10px)", // Drei Karten pro Reihe, mit 20px Abstand
    marginRight: "10px", // Abstand zwischen den Karten
  };

  // Stil für den Container der Phasen
  const phaseContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: "1px", // Außenabstand
  };

  const iconStyle = {
    marginRight: "auto",
  };

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

  return (
    <>
      <Box style={phaseContainerStyle}>
        {Array.isArray(project) &&
          project.map((phase, index) => (
            <Card key={phase.id} style={phaseCardStyle}>
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
                  defaultValue={phase.phasename}
                  onChange={(event) =>
                    changePhaseName(index, event.target.value)
                  }
                  variant="standard"
                  sx={{
                    textAlign: "center",
                    "& input": {
                      textAlign: "center",
                    },
                  }}
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
              
              <IconButton
                style={{
                  position: "absolute",
                  bottom: "5px", 
                  right: "5px", 
                }}
                onClick={() => handleDeleteButtonClick(phase.id)}
              >
                <DeleteOutlineIcon />
              </IconButton>
              <Task key={`${phase.id}-${reloadKey}`} phasenid={phase.id} updateParent={updateParentComponent} newPhasenid={newPhasenid} />
            </Card>
          ))}
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
      </Box>
    </>
  );
};

export default Phase;
