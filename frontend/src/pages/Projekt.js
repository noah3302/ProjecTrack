import React, { useEffect, useState } from "react";
import { Card, Box, TextField, IconButton } from '@mui/material';
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

export default function Projekt() {

  const [project, setProject] = useState([]);

  const iconStyle = {
    marginRight: "auto",
  };

  const [newPhaseName, setNewPhaseName] = useState("");

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
    setProject(initialSopra);
  }, []);

  const changePhaseName = (index, newName) => {
    console.log(project);
    if (newName !== null && newName !== "") {
      setProject((prevState) => {
        const updatedData = [...prevState];
        updatedData[index].Phasenname = newName;
        return updatedData;
      });
    }
  };

  const moveLeftAndLowerIndex = (index) => {
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

        return updatedproject;
      });
    }
  };

  const handleMoveRight = (index) => {
    if (index < project.length - 1) {
      setProject((prevproject) => {
        const updatedproject = [...prevproject];
        [updatedproject[index], updatedproject[index + 1]] = [
          updatedproject[index + 1],
          updatedproject[index],
        ];

        updatedproject.forEach((phase, i) => {
          phase.indx = i + 1;
        });

        return updatedproject;
      });
    }
  };

  const handleNewPhaseNameChange = (event) => {
    setNewPhaseName(event.target.value);
  };

  const addNewPhase = () => {
    if (newPhaseName.trim() !== "") {
      const newPhase = {
        phasenid: String(project.length + 2),
        indx: String(project.length + 1),
        Phasenname: newPhaseName.trim(),
        Tasks: [],
      };

      setProject((prevProject) => [...prevProject, newPhase]);
      setNewPhaseName("");
    }
  };

  return (
    <>
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {Array.isArray(project) && project.map((phase, index) => (
          <Card
            key={phase.phasenid}
            style={{
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
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
                defaultValue={phase.Phasenname}
                onChange={(event) => changePhaseName(index, event.target.value)}
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
          </Card>
        ))}
      </Box>
      <Card
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <TextField
            id="newPhaseName"
            label="Neue Phase"
            value={newPhaseName}
            onChange={handleNewPhaseNameChange}
            variant="outlined"
          />
          <IconButton onClick={addNewPhase}>
            Hinzufügen
          </IconButton>
        </div>
      </Card>
    </>
  );  
}
