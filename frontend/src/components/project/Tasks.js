import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiget, apidelete, apiput } from "../../API/Api";
import Comment from "../project/Comment";

const Task = ({ phasenid }) => {
  const [taskData, setTaskData] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedUserId, setEditedUserId] = useState("");
  const [editedPhasesId, setEditedPhasesId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiget(`phase/task/${phasenid}`);
        setTaskData(response);
      } catch (error) {
        console.error("Fehler beim Abrufen der Phasen:", error);
      }
    };

    fetchData();
  }, [phasenid]);

  if (!taskData) {
    return <div>Laden...</div>;
  }

  const taskBoxStyle = {
    backgroundColor: "#f5f5f5",
    padding: "1rem",
    marginBottom: "20px",
    borderRadius: "8px",
    position: "relative",
  };

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

      const updatedTasks = [...taskData];
      updatedTasks[updatedTaskIndex] = updatedTask;
      setTaskData(updatedTasks);
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

  return (
    <>
      {taskData.map((task, index) => (
        <Box key={index} style={taskBoxStyle}>
          <IconButton onClick={() => handleEdit(task.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(task.id)}>
            <DeleteIcon />
          </IconButton>
          <Typography variant="subtitle1">Taskname:</Typography>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              variant="outlined"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{task.tasktitle}</Typography>
          )}
          <Typography variant="subtitle1">Beschreibung:</Typography>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              variant="outlined"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{task.description}</Typography>
          )}
          <Typography variant="subtitle1">Due-date:</Typography>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              variant="outlined"
              value={editedDueDate}
              onChange={(e) => setEditedDueDate(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{task.duedate}</Typography>
          )}
          <Typography variant="subtitle1">User ID:</Typography>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              variant="outlined"
              value={editedUserId}
              onChange={(e) => setEditedUserId(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{task.user_id}</Typography>
          )}
          <Typography variant="subtitle1">Phases ID:</Typography>
          {editedTask && editedTask.id === task.id ? (
            <TextField
              variant="outlined"
              value={editedPhasesId}
              onChange={(e) => setEditedPhasesId(e.target.value)}
            />
          ) : (
            <Typography variant="body1">{task.phases_id}</Typography>
          )}
          {editedTask && editedTask.id === task.id && (
            <Button variant="contained" onClick={handleSave}>
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