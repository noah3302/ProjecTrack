import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Slider,
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { apiget, apidelete, apiput } from "../../API/Api";
import Modaltask from "./Modaltask";
import Comment from "./Comment";
import { UserAuth } from "../../Context/Authcontext";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CommentIcon from "@mui/icons-material/Comment";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const Task = ({ phasenid, updateParent, newid, project, projectusers }) => {
  const [reloadKey, setReloadKey] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [taskData, setTaskData] = useState(null);
  const [editedTask, setEditedTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedScore, setEditedScore] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [editedUserId, setEditedUserId] = useState("");
  const [editedPhasesId, setEditedPhasesId] = useState("");
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [editedCreatorId, setEditedCreatorId] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

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
    setEditedScore(taskToEdit.score);
    setEditedDueDate(taskToEdit.duedate);
    setEditedUserId(taskToEdit.user_id);
    setEditedPhasesId(taskToEdit.phases_id);
    setEditedCreatorId(taskToEdit.creator_id);
  };

  const handleSave = async () => {
    try {
      const updatedTaskIndex = taskData.findIndex(
        (task) => task.id === editedTask.id
      );
      const updatedTask = {
        id: editedTask.id,
        tasktitle: editedTitle,
        description: editedDescription,
        score: editedScore,
        duedate: editedDueDate,
        user_id: editedUserId,
        phases_id: editedPhasesId,
        creator_id: editedCreatorId,
      };

      await apiput(`task/`, editedTask.id, updatedTask);

      const phasenIdAsString = phasenid;
      const updatedPhasesIdAsString = updatedTask.phases_id;

      if (updatedPhasesIdAsString !== phasenIdAsString) {
        const updatedTasksCurrentPhase = taskData.filter(
          (task) => task.id !== editedTask.id
        );
        setTaskData(updatedTasksCurrentPhase);
        if (updateParent && typeof updateParent === "function") {
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

  const handleDelete = (taskId) => {
    setDeleteTaskId(taskId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await apidelete(`tasks`, deleteTaskId);
      const updatedTasks = taskData.filter((task) => task.id !== deleteTaskId);
      setTaskData(updatedTasks);
      console.log("Task gelöscht!");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Fehler beim Löschen des Tasks:", error);
    }
  };

  const handleDeleteCanceled = () => {
    setDeleteTaskId(null);
    setDeleteDialogOpen(false);
  };

  const handleToggleSpeedDial = (taskId) => {
    setSpeedDialOpen((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId] || false,
    }));
  };

  const taskBoxStyle = {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    columnGap: "10px",
  };

  const BoxStyle = {
    width: "80%",
    padding: "1rem",
    marginTop: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    position: "relative",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    marginLeft: "auto",
    marginRight: "auto",
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
    <Box sx={{ marginTop: "0.5rem", maxHeight: "600px", overflowY: "auto" }}>
      <Modaltask
        phasesid={phasenid}
        updatetasks={setTaskData}
        projectusers={projectusers}
      />
      {taskData.map((task, index) => (
        <Box key={index} style={BoxStyle} sx={{ backgroundColor: "white" }}>
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
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {task && task.tasktitle}
              </Typography>
            )}
            <Box style={editDeleteButtonContainerStyle}>
              {!editedTask || editedTask.id !== task.id ? (
                <SpeedDial
                  direction="left"
                  ariaLabel="Task Options"
                  sx={{
                    marginLeft: "3px",
                    marginRight: "3px",
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    "& .MuiSpeedDial-fab": {
                      padding: "20px",
                      width: "25px",
                      height: "25px",
                      backgroundColor: "grey",
                      color: "lightgrey",
                    },
                  }}
                  icon={<MoreVertIcon />}
                  onClick={() => handleToggleSpeedDial(task.id)}
                  open={speedDialOpen[task.id] || false}
                >
                  <SpeedDialAction
                    sx={{ marginLeft: "3px", marginRight: "3px" }}
                    key="comment"
                    icon={<CommentIcon />}
                    tooltipTitle={
                      showComment[task.id] ? "Close comment" : "Load comment"
                    }
                    onClick={() =>
                      setShowComment((prevState) => ({
                        ...prevState,
                        [task.id]: !prevState[task.id],
                      }))
                    }
                  />
                  <SpeedDialAction
                    sx={{ marginLeft: "3px", marginRight: "3px" }}
                    key="edit"
                    icon={<EditIcon />}
                    tooltipTitle="Edit"
                    onClick={() => handleEdit(task.id)}
                  />

                  <SpeedDialAction
                    sx={{ marginLeft: "3px", marginRight: "3px" }}
                    key="delete"
                    icon={<DeleteIcon />}
                    tooltipTitle="Delete"
                    onClick={() => handleDelete(task.id)}
                  />
                </SpeedDial>
              ) : (
                <></>
              )}
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
            <Slider
              value={editedScore}
              marks
              max={5}
              min={1}
              size="medium"
              valueLabelDisplay="auto"
              onChange={(e) => setEditedScore(e.target.value)}
            />
          ) : (
            <Slider
              disabled={true}
              value={task.score}
              marks
              max={5}
              min={1}
              size="medium"
              valueLabelDisplay="auto"
            />
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
            <Typography variant="body1">
              {" "}
              <strong>DueDate:</strong> {task.duedate}
            </Typography>
          )}
          {editedTask && editedTask.id === task.id ? (
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
                editedUserId !== null
                  ? projectusers.find(
                      (user) => user.id === editedUserId
                    )?.nickname
                  : ""
              }
              onChange={(event, newValue) => {
                const selectedUser = projectusers.find(
                  (user) => user.nickname === newValue
                );
                if (selectedUser) {
                  setEditedUserId(selectedUser.id);
                }
              }}
              error={
                editedUserId === null
                  ? "Verantwortlicher ist erforderlich"
                  : undefined
              }
            />
          ) : (
            <Typography variant="body1">
              {" "}
              <strong>Verantwortlicher: </strong>
              {projectusers.find((user) => user.id === task.user_id)
                ?.nickname || "User left project"}
            </Typography>
          )}
          {editedTask && editedTask.id === task.id ? (
            <Autocomplete
              options={getPhaseNames(project)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Phase"
                  style={{ marginBottom: "10px" }}
                />
              )}
              value={
                editedPhasesId !== null
                  ? project.find(
                      (phase) => phase.id === editedPhasesId
                    )?.phasename
                  : ""
              }
              onChange={(event, newValue) => {
                const selectedPhase = project.find(
                  (phase) => phase.phasename === newValue
                );
                if (selectedPhase) {
                  setEditedPhasesId(selectedPhase.id);
                }
              }}
              error={
                editedPhasesId === null ? "Phase ist erforderlich" : undefined
              }
            />
          ) : (
            <Typography variant="body1"></Typography>
          )}
          {editedTask && editedTask.id === task.id && (
            <Button
              variant="contained"
              onClick={handleSave}
              style={saveButtonStyle}
              sx={{
                marginLeft: "auto",
                backgroundColor: "secondary.dark",
                color: "lightgrey",
              }}
            >
              Speichern
            </Button>
          )}
          {showComment[task.id] && (
            <Comment
              key={task.id}
              taskid={task.id}
              projectusers={projectusers}
            />
          )}
        </Box>
      ))}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCanceled}>
        <DialogTitle>Löschen bestätigen</DialogTitle>
        <DialogContent>
          <Typography>Sind Sie sicher, dass Sie diesen Task löschen möchten?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCanceled}>Abbrechen</Button>
          <Button onClick={handleDeleteConfirmed} color="error">Löschen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Task;