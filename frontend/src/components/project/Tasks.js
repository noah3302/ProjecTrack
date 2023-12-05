import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import { apiget } from "../../API/Api";

const Task = ({ phasenid }) => {
  const [taskData, setTaskData] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

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
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    position: "relative",
  };

  const menuButtonStyle = {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#808080",
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // Logik für das Löschen des Tasks hier einfügen
    console.log("Task gelöscht!");
    handleClose();
  };

  const handleEdit = () => {
    // Logik für das Bearbeiten des Tasks hier einfügen
    console.log("Task bearbeiten!");
    handleClose();
  };

  

  return (
    <>
      {taskData.map((task, index) => (
        <Box key={index} style={taskBoxStyle}>
          <IconButton style={menuButtonStyle} onClick={handleMenuClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon style={{ marginRight: "10px" }} />
              Bearbeiten
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteOutlineIcon style={{ marginRight: "10px" }} />
              Löschen
            </MenuItem>
          </Menu>
          <Typography variant="subtitle1">Taskname:</Typography>
          <Typography variant="body1">{task.tasktitle}</Typography>
          <Typography variant="subtitle1">Beschreibung:</Typography>
          <Typography variant="body1">{task.description}</Typography>
          <Typography variant="subtitle1">Due-date:</Typography>
          <Typography variant="body1">{task.duedate}</Typography>
        </Box>
      ))}
    </>
  );
};

export default Task;