import { Typography, Button, Modal, Box, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Paper } from "@mui/material";
import React, { useState } from "react";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Divider from '@mui/material/Divider';


const Members = ({ projectusers, projektid }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [projectusersFilter, setProjectusersFilter] = useState("");
    const [rightFilter, setRightFilter] = useState("");
    const handleClose = () => {
        setOpen(false);
        setProjectusersFilter("");
        setRightFilter("");
    };

    const [right, setRight] = useState([
        { user_id: 11, name: "Hans", surname: "Hans", nickname: "Peter123", google_id: "Peter" },
        { user_id: 12, name: "Peter", surname: "meyer", nickname: "Meyer345", google_id: "Peter" },
    ]);

    const moveNameToprojectusers = (user) => {
        setRight(right.filter((value) => value.user_id !== user.user_id));
        projectusers = [...projectusers, user];
    };

    const moveNameToRight = (user) => {
        projectusers.filter((value) => value.user_id !== user.user_id);
        setRight([...right, user]);
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        minWidth: 250,
        maxHeight: 400,
        overflow: 'auto',
    };

    const listStyle = {
        width: '100%',
        maxHeight: 200,
        overflow: 'auto',
    };

    return (
        <>
            <Button onClick={handleOpen}>Mitglieder</Button>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="flex-start"
                        spacing={2}
                    >
                        <Grid item xs={12}>
                            <Typography variant="h5" align="center" gutterBottom>
                                Mitglieder verwalten
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box >
                                <Paper>
                                    <TextField
                                        label="Add user"
                                        variant="outlined"
                                        value={projectusersFilter}
                                        onChange={(e) => setProjectusersFilter(e.target.value)}
                                        fullWidth
                                    />
                                    <List dense component="div" role="list" sx={listStyle}>
                                        {projectusers.filter((user) =>
                                                user.nickname.toLowerCase().includes(projectusersFilter.toLowerCase())
                                            )
                                            .map((user, index) => (
                                                <>
                                                    <ListItem key={user.user_id} button onClick={() => moveNameToRight(user)}>
                                                        <ListItemText primary={user.nickname} />
                                                        <ListItemIcon style={{ color: 'green' }}>
                                                            <GroupAddIcon />
                                                        </ListItemIcon>
                                                    </ListItem>
                                                    {index !== projectusers.length - 1 && <Divider />}
                                                </>
                                            ))}
                                    </List>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box>
                                <Paper>
                                    <TextField
                                        label="Kick user"
                                        variant="outlined"
                                        value={rightFilter}
                                        onChange={(e) => setRightFilter(e.target.value)}
                                        fullWidth
                                    />
                                    <List dense component="div" role="list" sx={listStyle}>
                                        {right
                                            .filter((user) =>
                                                user.name.toLowerCase().includes(rightFilter.toLowerCase())
                                            )
                                            .map((user, index) => (
                                                <>
                                                    <ListItem key={user.user_id} button onClick={() => moveNameToprojectusers(user)}>
                                                        <ListItemText primary={user.name} />
                                                        <ListItemIcon style={{ color: 'red' }}>
                                                            <GroupRemoveIcon />
                                                        </ListItemIcon>
                                                    </ListItem>
                                                    {index !== right.length - 1 && <Divider />}
                                                </>
                                            ))}
                                    </List>
                                </Paper>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
};

export default Members;