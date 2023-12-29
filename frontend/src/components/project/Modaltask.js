import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Slider } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { UserAuth } from "../../Context/Authcontext";
import { apipost } from "../../API/Api";
import Modal from "@mui/material/Modal";

const Modaltask = ({ phasesid, updatetasks }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [newTask, setNewTask] = useState({
    task_id: 0,
    tasktitle: "",
    description: "",
    duedate: "",
    user_id: null,
    phases_id: phasesid,
  });

  const { user } = UserAuth();

  useEffect(() => {
    setNewTask((prevnewTask) => ({
      ...prevnewTask,
      user_id: user ? user.id : null,
    }));
  }, [user]);

  const handleCreateTask = async () => {
    try {
      console.log("Before API call - newTask:", newTask);

      const response = await apipost("task", {
        id: newTask.task_id,
        tasktitle: newTask.tasktitle,
        description: newTask.description,
        duedate: newTask.duedate,
        user_id: newTask.user_id,
        phases_id: newTask.phases_id,
      });
      updatetasks((prev) => [...prev, response]);
      handleClose();
      setNewTask({
        task_id: 0,
        tasktitle: "",
        description: "",
        duedate: "",
        user_id: null,
        phases_id: phasesid,
      })

      console.log(response);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box onClick={handleOpen}>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginLeft: "auto", color: "black" }}
          >
            <Typography color="#000000" align="center">
              Aufgabe erstellen
            </Typography>
          </Button>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
      >
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
              <TextField
                label="Beschreibung"
                variant="outlined"
                fullWidth
                multiline
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                style={{ marginBottom: "10px" }}
              />
              <Typography>Wie schwer ist die Task?</Typography>
              <Slider
                disabled={false}
                marks
                max={5}
                min={1}
                size="medium"
                valueLabelDisplay="auto"
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
                style={{ marginBottom: "10px" }}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateTask}
                endIcon={<SendIcon />}
              >
                Create Task
              </Button>
            </Box>
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Modaltask;
