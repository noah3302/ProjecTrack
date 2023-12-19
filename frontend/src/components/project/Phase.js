import React, { useEffect, useState } from "react";
import { apiget, apidelete, apipost, apiput } from "../../API/Api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useParams } from 'react-router-dom';
import { Box, TextField, Card, Typography, IconButton, CardActions, Button } from "@mui/material";
import Modal from "@mui/material/Modal";
import Task from "./Tasks";

const Phase = () => {
    const [project, setProject] = useState([]);
    const [newPhaseName, setNewPhaseName] = useState("");
    const [open2, setOpen2] = useState(false);
    const handleOpen2 = () => setOpen2(true);
    const handleClose2 = () => setOpen2(false);
    const [title, setTitle] = useState(null);
    const [description, setDescription] = useState(null);
    const [duedate, setDueDate] = useState(null);
    const [phasenindex, setphasenindex] = useState(null);
    let { id } = useParams();

    const phasenload = async () => {
        const response = await apiget(`phase/${id}`);
        const sortedResponse = response.sort((a, b) => a.indx - b.indx);
        setProject(sortedResponse);
    };
    

    useEffect(() => {
        phasenload()
    }, []);

    const handleDeleteButtonClick = (phaseId) => {
        console.log("Delete button clicked with ID:", phaseId);
        handleDeletePhase(phaseId);
    };

    const handleAddTask = () => {
        handleClose2();
        if (title && description && duedate !== null) {
            const highestTaskId = Math.max(
                ...project.flatMap((phase) =>
                    phase.Tasks.map((task) => parseInt(task.Taskid))
                )
            );

            const newTaskId = isNaN(highestTaskId) ? 1 : highestTaskId + 1;

            const newTask = {
                task_id: String(newTaskId),
                tasktitle: title,
                description: description,
                duedate: duedate,
                user_id: "1",
                phases_id: phasenindex,
            };

            setProject((prevProject) => {
                const updatedProject = prevProject.map((phase) => {
                    if (phase.indx === phasenindex) {
                        phase.Tasks.push(newTask);
                    }
                    return phase;
                });
                return updatedProject;
            });

            setTitle(null);
            setDescription(null);
            setDueDate(null);
        } else {
            console.log("Bitte fülle alle Felder aus.");
        }
    };

    //Phase löschen und Indexe anpassen
    const handleDeletePhase = async (phaseId) => {
        try {
            await apidelete(`phase`, phaseId);

            setProject((prevProject) => {
                const updatedProject = prevProject.filter((phase) => phase.id !== phaseId);

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
                project_id: project.project_id,
            };
            const response = await apipost('phase', newPhase);
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
                    [updatedproject[index], updatedproject[index - 1]] = [updatedproject[index - 1], updatedproject[index]];

                    updatedproject.forEach((phase, i) => {
                        phase.indx = i + 1;
                    });

                    updatePhases(updatedproject[index], updatedproject[index - 1]);

                    return updatedproject;
                });
            }
        } catch (error) {
            console.log("Fehler:", error)
        }
    };

    const updatePhases = async (phase1, phase2) => {
        const phaseId1 = phase1.id;
        const phaseId2 = phase2.id;

        const newPhase1 = { ...phase1 };
        await apiput('phases', phaseId1, newPhase1);

        const newPhase2 = { ...phase2 };
        await apiput('phases', phaseId2, newPhase2);
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
                await apiput('phases', id, newphase);
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
            <Modal open={open2} onClose={handleClose2}>
                <Box sx={style}>
                    <Typography>Neue Aufgabe erstellen</Typography>
                    <Box
                        sx={{
                            width: "250px",
                            "& .MuiTextField-root": { marginTop: "20px" },
                        }}
                    >
                        <TextField
                            required
                            id="outlined-required-title"
                            label="Titel"
                            placeholder="neuer Händler"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            required
                            id="outlined-required-description"
                            label="Beschreibung"
                            placeholder="Suche einen neuen Händler."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <TextField
                            id="outlined-date"
                            label="Due Date"
                            type="date"
                            value={duedate}
                            onChange={(e) => setDueDate(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button
                            onClick={() => handleAddTask()}
                            variant="contained"
                            color="primary"
                        >
                            Hinzufügen
                        </Button>
                    </Box>
                </Box>
            </Modal>

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
                                    onChange={(event) => changePhaseName(index, event.target.value)}
                                    variant="standard"
                                    sx={{
                                        textAlign: "center",
                                        "& input": {
                                            textAlign: "center"
                                        }
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
                            <CardActions>
                                <IconButton onClick={() => setphasenindex(phase.id)}>
                                    <AddIcon />
                                    <Typography style={{ marginLeft: "5px" }}>
                                        Task hinzufügen
                                    </Typography>
                                </IconButton>
                            </CardActions>
                            <IconButton
                                style={{
                                    position: "absolute",
                                    bottom: "5px", // Abstand unteren Rand Lösch-Icon
                                    right: "5px", // Abstand rechter Rand
                                }}
                                onClick={() => handleDeleteButtonClick(phase.id)}
                            >
                                <DeleteOutlineIcon />
                            </IconButton>
                            <Task key={phase.id} phasenid={phase.id} />
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