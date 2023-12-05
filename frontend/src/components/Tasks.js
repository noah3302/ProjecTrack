import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { apiget } from "../API/Api";

const Task = ({ phasenid }) => {
  const [taskData, setTaskData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(phasenid);
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
    backgroundColor: "orange",
    minHeight: "100px",
    padding: "10px",
    marginBottom: "10px",
    width: "90%",
    boxSizing: "border-box",
  };

  return (
    <Box style={taskBoxStyle}>
      <Typography>{taskData.Taskname}</Typography>
      <Typography>{taskData.Beschreibung}</Typography>
      <IconButton
        style={{
          position: "absolute",
          bottom: "5px",
          right: "5px",
        }}
      >
        <DeleteOutlineIcon />
      </IconButton>
    </Box>
  );
};

export default Task;