import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextField, Button, InputAdornment, Autocomplete } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiget, apidelete, apiput } from "../../API/Api";
import Modaltask from "./Modaltask";
import Comment from "./Comment";
import { UserAuth } from "../../Context/Authcontext";

const Task = ({ phasenid, updateParent, newid, project }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [taskData, setTaskData] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedUserId, setEditedUserId] = useState("");
  const [editedPhasesId, setEditedPhasesId] = useState("");
  const [existingUsers, setExistingUsers] = useState([]);
  const { user } = UserAuth();

  function getUserNames(array) {
    return array.map((exUser) => exUser.nickname);
  }

  function getPhaseNames(array) {
    return array.map((exPhase) => exPhase.phasename);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiget(`phase/task/${phasenid}`);
        setTaskData(response);
        const allUsers = await apiget('/users')
        setExistingUsers(allUsers)
      } catch (error) {
        console.error("Fehler beim Abrufen der Phasen:", error);
      }
    };

    fetchData();
  }, [phasenid, reloadKey, newid]);


  if (!taskData) {
    return <div>Laden...</div>;
  }



  const handleEdit = (taskId) => {
    const taskToEdit = taskData.find((task) => task.id === taskId);
    setEditedTask(taskToEdit);
    setEditedTitle(taskToEdit.tasktitle);
    setEditedDescription(taskToEdit.description);
    setEditedDueDate(taskToEdit.duedate);
    setEditedUserId(taskToEdit.user_id);
    setEditedPhasesId(taskToEdit.phases_id);
  };

  const handleSave = async () => {
    try {
      const updatedTaskIndex = taskData.findIndex(task => task.id === editedTask.id);
      const updatedTask = {
        id: editedTask.id,
        tasktitle: editedTitle,
        description: editedDescription,
        duedate: editedDueDate,
        user_id: editedUserId,
        phases_id: editedPhasesId,
      };

      await apiput(`task/`, editedTask.id, updatedTask);

      const phasenIdAsString = phasenid.toString();
      const updatedPhasesIdAsString = updatedTask.phases_id.toString();

      if (updatedPhasesIdAsString !== phasenIdAsString) {
        const updatedTasksCurrentPhase = taskData.filter(task => task.id !== editedTask.id);
        setTaskData(updatedTasksCurrentPhase);
        if (updateParent && typeof updateParent === 'function') {
          await updateParent(updatedPhasesIdAsString);
        }
      } else {
        const updatedTasks = [...taskData];
        updatedTasks[updatedTaskIndex] = updatedTask;
        setTaskData(updatedTasks);
      }

      setEditedTask(null);
    } catch (error) {
      console.error("Fehler beim Speichern der Änderungen:", error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await apidelete(`tasks`, taskId);
      const updatedTasks = taskData.filter((task) => task.id !== taskId);
      setTaskData(updatedTasks);
      console.log("Task gelöscht!");
    } catch (error) {
      console.error("Fehler beim Löschen des Tasks:", error);
    }
  };

  const taskBoxStyle = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: "10px",
  };

  const BoxStyle = {
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    marginBottom: "20px",
    borderRadius: "8px",
    position: "relative",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const editDeleteButtonStyle = {
    position: "absolute",
    top: "10px",
    right: "10px",
  };

  const editDeleteButtonContainerStyle = {
    alignSelf: "flex-end",
  };

  const textFieldStyle = {
    marginBottom: "8px",
    width: "100%",
  };

  const saveButtonStyle = {
    marginBottom: "8px",
    width: "100%",

  };

  return (
    <>
      <Modaltask phasesid={phasenid} updatetasks={setTaskData} />
      {taskData.map((task, index) => (
        <Box key={index} style={BoxStyle}>
          <Box style={taskBoxStyle}>
            {editedTask && editedTask.id === task.id ? (
              <TextField
                label="Tasktitle"
                variant="outlined"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                style={textFieldStyle}
              />
            ) : (
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{task.tasktitle}</Typography>
            )}
            <Box style={editDeleteButtonContainerStyle}>
              {editedTask && editedTask.id === task.id ? (<></>
              ) : (
                <IconButton onClick={() => handleEdit(task.id)}>
                  <EditIcon />
                </IconButton>
              )}
              <IconButton onClick={() => handleDelete(task.id)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              label="Beschreibung"
              variant="outlined"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              style={textFieldStyle}
            />
          ) : (
            <Typography variant="body1">{task.description}</Typography>
          )}
          {editedTask && editedTask.id === task.id ? (
            <TextField
              label="Enddatum"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
              style={{ marginBottom: "10px" }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          ) : (
            <Typography variant="body1">DueDate: {task.duedate}</Typography>
          )}
          {editedTask && editedTask.id === task.id ? (
            <Autocomplete
              options={getUserNames(existingUsers)}
              renderInput={(params) => (
                <TextField {...params} label="Verantwortlicher" style={{ marginBottom: "10px" }} />
              )}
              value={editedUserId !== null ? existingUsers.find((user) => user.id.toString() === editedUserId)?.nickname : ''}
              onChange={(event, newValue) => {
                const selectedUser = existingUsers.find((user) => user.nickname === newValue);
                if (selectedUser) {
                  setEditedUserId(selectedUser.id.toString());
                }
              }}
              error={editedUserId === null ? 'Verantwortlicher ist erforderlich' : undefined}
            />
          ) : (
            <Typography variant="body1">Verantwortlicher:
              {existingUsers.find(user => user.id.toString() === task.user_id)?.nickname || 'Nicht gefunden'}
            </Typography>
          )}
          {editedTask && editedTask.id === task.id ? (
            <Autocomplete
            options={getPhaseNames(project)}
            renderInput={(params) => (
              <TextField {...params} label="Phase" style={{ marginBottom: "10px" }} />
            )}
            value={editedPhasesId !== null ? project.find((phase) => phase.id.toString() === editedPhasesId)?.phasename : ''}
            onChange={(event, newValue) => {
              const selectedPhase = project.find((phase) => phase.phasename === newValue);
              if (selectedPhase) {
                setEditedPhasesId(selectedPhase.id.toString());
              }
            }}
            error={editedPhasesId === null ? 'Phase ist erforderlich' : undefined}
          />
          ) : (
            <Typography variant="body1"></Typography>
          )}
          {editedTask && editedTask.id === task.id && (
            <Button variant="contained" onClick={handleSave} style={saveButtonStyle}>
              Speichern
            </Button>
          )}
          <Comment key={task.id} taskid={task.id} />
        </Box>
      ))}
    </>
  );
};

export default Task;