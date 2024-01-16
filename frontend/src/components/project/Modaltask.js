import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  Autocomplete,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { UserAuth } from "../../Context/Authcontext";
import { apipost } from "../../API/Api";
import Modal from "@mui/material/Modal";

const Modaltask = ({
  phasesid,
  updatetasks,
  updateResponsible,
  projectusers,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrorMessages({});
  };
  const [errorMessages, setErrorMessages] = useState({});
  const [responsibleUserId, setResponsibleUserId] = useState("");

  const [newTask, setNewTask] = useState({
    task_id: 0,
    tasktitle: "",
    description: "",
    score: "",
    duedate: "",
    user_id: null,
    phases_id: phasesid,
    creator_id: null,
  });

  const { user } = UserAuth();

  useEffect(() => {
    setNewTask((prevnewTask) => ({
      ...prevnewTask,
      user_id: user ? user.id : null,
      creator_id: user ? user.id : null,
    }));
  }, [user]);

  function getUserNames(array) {
    return array.map((exUser) => exUser.nickname);
  }

  const handleCreateTask = async () => {
    try {
      const newErrorMessages = {};

      if (!newTask.tasktitle) {
        newErrorMessages.tasktitle = "Bitte füllen Sie das Feld aus.";
      }

      if (!newTask.description) {
        newErrorMessages.description = "Bitte füllen Sie das Feld aus.";
      }

      if (!newTask.duedate) {
        newErrorMessages.duedate = "Bitte füllen Sie das Feld aus.";
      }

      if (!responsibleUserId) {
        newErrorMessages.responsibleUserId = "Bitte füllen Sie das Feld aus.";
      }

      setErrorMessages(newErrorMessages);

      // Überprüft auf Validierungsfehler (z.b. leere Felder, oder nicht erwartete Datentypen)
      if (Object.values(newErrorMessages).some((msg) => msg)) {
        return;
      }

      console.log("Before API call - newTask:", newTask);

      const response = await apipost("task", {
        id: newTask.task_id,
        tasktitle: newTask.tasktitle,
        description: newTask.description,
        score: newTask.score,
        duedate: newTask.duedate,
        user_id: responsibleUserId,
        phases_id: newTask.phases_id,
        creator_id: user ? user.id : null,
      });

      updatetasks((prev) => [...prev, response]);
      handleClose();
      setNewTask({
        task_id: 0,
        tasktitle: "",
        description: "",
        score: "",
        duedate: "",
        user_id: null,
        phases_id: phasesid,
        creator_id: user ? user.id : null,
      });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box onClick={handleOpen}>
          <Button
            variant="contained"
            sx={{ marginLeft: "auto", backgroundColor: "secondary.dark" }}
          >
            <Typography color="lightgrey" align="center">
              Aufgabe erstellen
            </Typography>
          </Button>
        </Box>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "400px",
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            <Box>
              <Typography align="center" variant="h5" marginBottom={"2px"}>
                Task erstellen
              </Typography>

              <TextField
                label="Tasknamen"
                variant="outlined"
                fullWidth
                value={newTask.tasktitle}
                onChange={(e) =>
                  setNewTask({ ...newTask, tasktitle: e.target.value })
                }
                style={{ marginBottom: "10px" }}
              />

              {/* Wird nur angezeigt, wenn das Feld nicht ausgefüllt ist. */}
              {errorMessages.tasktitle && (
                <Typography color="error" variant="body2">
                  {errorMessages.tasktitle}
                </Typography>
              )}

              <TextField
                label="Beschreibung"
                variant="outlined"
                fullWidth
                multiline
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                style={{ marginTop: "20px" }}
              />

              {/* Wird nur angezeigt, wenn das Feld nicht ausgefüllt ist. */}
              {errorMessages.description && (
                <Typography color="error" variant="body2">
                  {errorMessages.description}
                </Typography>
              )}

              <Typography style={{ marginTop: "20px" }}>
                Wie schwer ist die Task?
              </Typography>
              <Slider
                marks
                max={5}
                min={1}
                size="medium"
                valueLabelDisplay="auto"
                onChange={(e) =>
                  setNewTask({ ...newTask, score: e.target.value })
                }
              />
              <TextField
                label="Due Date"
                type="datetime-local"
                variant="outlined"
                fullWidth
                value={newTask.duedate}
                onChange={(e) =>
                  setNewTask({ ...newTask, duedate: e.target.value })
                }
                style={{ marginBottom: "10px", marginTop: "20px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              {/* Wird nur angezeigt, wen das Feld nicht ausgefüllt ist. */}
              {errorMessages.duedate && (
                <Typography color="error" variant="body2">
                  {errorMessages.duedate}
                </Typography>
              )}

              <Autocomplete
                options={getUserNames(projectusers)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Verantwortlicher"
                    style={{ marginBottom: "10px" }}
                  />
                )}
                value={
                  responsibleUserId !== null
                    ? projectusers.find(
                        (user) => user.id.toString() === responsibleUserId
                      )?.nickname
                    : ""
                }
                onChange={(event, newValue) => {
                  const selectedUser = projectusers.find(
                    (user) => user.nickname === newValue
                  );
                  if (selectedUser) {
                    setResponsibleUserId(selectedUser.id.toString());
                  }
                }}
                error={
                  responsibleUserId === null
                    ? "Verantwortlicher ist erforderlich"
                    : undefined
                }
              />

              {/* Wird nur angezeigt, wen das Feld nicht ausgefüllt ist. */}
              {errorMessages.responsibleUserId && (
                <Typography color="error" variant="body2">
                  {errorMessages.responsibleUserId}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              sx={{
                marginLeft: "auto",
                backgroundColor: "secondary.dark",
              }}
              color="secondary"
              onClick={handleCreateTask}
              endIcon={<SendIcon sx={{ color: "lightgrey" }} />}
              style={{ marginTop: "20px" }}
              disabled={
                !responsibleUserId ||
                !newTask.duedate ||
                !newTask.tasktitle ||
                !newTask.description
              }
            >
              <Typography color="lightgrey" align="center">
                Task erstellen
              </Typography>
            </Button>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Modaltask;
