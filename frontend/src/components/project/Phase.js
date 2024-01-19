import React, { useEffect, useState } from "react";
import { apiget, apidelete, apipost, apiput } from "../../API/Api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from "react-router-dom";
import { Box, TextField, Card, Typography, IconButton, Grid, Divider, Button } from "@mui/material";
import Task from "./Tasks";
import { UserAuth } from "../../Context/Authcontext";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const Phase = ({ projectusers, projektid, project }) => {
  const [open, setOpen] = useState(false);
  const [phasen, setPhasen] = useState([]);
  const [newPhaseName, setNewPhaseName] = useState("");
  const [deletePhaseId, setDeletePhaseId] = useState(null);
  let { id } = useParams();
  const [reloadKey, setReloadKey] = useState(0);
  const [newPhasenid, setNewPhasenid] = useState(null);
  const { user } = UserAuth();

  const handleClose = () => {
    setOpen(false);
  };

  const phasenload = async () => {
    const response = await apiget(`project/phase/${projektid}`);
    const sortedResponse = response.sort((a, b) => a.ranking - b.ranking);
    setPhasen(sortedResponse);
  };

  const updateParentComponent = async (newPhasenid) => {
    try {
      setNewPhasenid(newPhasenid);
      setReloadKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Phase:", error);
    }
  };

  useEffect(() => {
    phasenload();
  }, []);

  const handleDeleteButtonClick = (phaseId) => {
    setDeletePhaseId(phaseId);
    setOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await handleDeletePhase(deletePhaseId);
      setOpen(false);
    } catch (error) {
      console.error("Fehler beim Löschen der Phase:", error);
    }
  };

  const handleDeleteCanceled = () => {
    setDeletePhaseId(null);
    setOpen(false);
  };

  const handleDeletePhase = async (phaseId) => {
    try {
      await apidelete(`phase/${phaseId}/project/${id}/user/`, user.id);

      setPhasen((prevPhase) => {
        const updatedPhase = prevPhase.filter(
          (phase) => phase.id !== phaseId
        );

        updatedPhase.forEach((phase, index) => {
          phase.ranking = index + 1;
        });

        return updatedPhase;
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
        ranking: phasen.length + 1,
        project_id: id,
      };
      const response = await apipost("phase", newPhase);
      setPhasen((prevPhase) => [...prevPhase, response]);
      setNewPhaseName("");
    }
  };

  //Verschiebung nach links
  const moveLeftAndLowerIndex = (index) => {
    try {
      if (index > 0) {
        setPhasen((prevPhase) => {
          const updatedPhase = [...prevPhase];
          [updatedPhase[index], updatedPhase[index - 1]] = [
            updatedPhase[index - 1],
            updatedPhase[index],
          ];

          updatedPhase.forEach((phase, i) => {
            phase.ranking = i + 1;
          });

          updatePhases(updatedPhase[index], updatedPhase[index - 1]);

          return updatedPhase;
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
    if (index < phasen.length - 1) {
      const updatedPhase = [...phasen];
      [updatedPhase[index], updatedPhase[index + 1]] = [
        updatedPhase[index + 1],
        updatedPhase[index],
      ];

      updatedPhase.forEach((phase, i) => {
        phase.ranking = i + 1;
      });

      await updatePhases(updatedPhase[index], updatedPhase[index + 1]);

      setPhasen(updatedPhase);
    }
  };

  const changePhaseName = async (id, index, newName) => {
    if (newName !== null && newName !== "") {
      try {
        const updatedData = [...phasen];
        const newphase = phasen[index];
        updatedData[index].phasename = newName;
        await apiput("phases", id, newphase);
        setPhasen(updatedData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const phaseCardStyle = {
    backgroundColor: "rgb(233, 233, 233)",
    width: "auto",
    marginRight: "8px",
    marginLeft: "8px",
    display: "flex",
    flexDirection: "column",
    marginBottom: "10px",
    height: "fit-content"
  }

  const phaseContainerStyle = {
    padding: "1px",
    width: "100%",
  };

  const iconStyle = {
    marginRight: "auto",
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#D3D3D3",
    boxShadow: 24,
    p: 4,
  };

  const deleteButtonStyle = {
    marginTop: "auto",
    alignSelf: "flex-end",
    padding: "3px",
    display: "flex",
  };

  return (
    <>
      <Grid container spacing={2} style={phaseContainerStyle}>
        {Array.isArray(phasen) &&
          phasen.map((phase, index) => (
            <>
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={phase.id}>

                <Card key={phase.id} sx={phaseCardStyle}>
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
                        changePhaseName(phase.id, index, event.target.value)
                      }
                      variant="standard"
                      sx={{
                        textAlign: "center",
                        "& input": {
                          textAlign: "center",
                          fontSize: "1.5rem"
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
                  {phase && (
                    <Task
                      key={newPhasenid === phase.id ? `${phase.id}-${reloadKey}` : phase.id}
                      phasenid={phase.id}
                      updateParent={updateParentComponent}
                      newPhasenid={newPhasenid}
                      phasen={phasen}
                      projectusers={projectusers}
                    />
                  )}
                  {user.id === project.manager && (
                    <IconButton
                      style={deleteButtonStyle}
                      onClick={() => handleDeleteButtonClick(phase.id)}
                    >
                      <Typography>
                        Phase löschen
                      </Typography>
                      <DeleteOutlineIcon />
                    </IconButton>
                  )}
                </Card>
                <Divider orientation="vertical" flexItem></Divider>
              </Grid>
            </>
          ))}
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
          <Card
            style={{
              flex: "0 0 auto",
              width: "auto",
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
              height: "fit-content",
            }}
          >
            {/* Neue Phase hinzufügen */}
            <Box style={{ display: "flex", alignItems: "center" }}>
              <TextField
                id="newPhaseName"
                label="Neue Phase"
                value={newPhaseName}
                onChange={handleNewPhaseNameChange}
              />
              <IconButton onClick={addNewPhase}>
                <Typography variant="body2">hinzufügen</Typography>
              </IconButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Löschen bestätigen"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Sind Sie sicher, dass Sie diese Phase löschen möchten?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCanceled}>Abbrechen</Button>
          <Button onClick={handleDeleteConfirmed} color="error">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Phase;
