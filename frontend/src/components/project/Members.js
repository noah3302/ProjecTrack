import { Typography, Button, Modal, Box, Grid, List, ListItem, ListItemIcon, ListItemText, TextField, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import Divider from '@mui/material/Divider';
import { apiget, apipost, apidelete } from "../../API/Api";


const Members = ({ projectusers: initialProjectUsers, projektid }) => {
    const [projectusers, setProjectusers] = useState(initialProjectUsers);
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const [projectusersFilter, setProjectusersFilter] = useState("");
    const [notmemberFilter, setnotmemberFilter] = useState("");
    const handleClose = () => {
        setOpen(false);
        setProjectusersFilter("");
        setnotmemberFilter("");
    };
    const [notmember, setNotmember] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const members = await apiget('users');
            const filteredMembers = members.filter((user) => !projectusers.includes(user.id));
            setNotmember(filteredMembers);
          } catch (error) {
            console.error("Fehler beim Laden der Mitglieder:", error);
          }
        };
        fetchData();
      }, [projectusers]);      

    const moveNameTonotMember = (user) => {
        try {
            console.log(user)
            const userid = parseInt(user.id);
            apidelete(`project/${projektid}/user`, user.id);
            setProjectusers(prevUsers => prevUsers.filter((value) => value.user_id !== userid));
            setNotmember(prevNotmember => [...prevNotmember, user]);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Projekts:", error);
        }
    };

    const moveNameToprojectusers = (user) => {
        try {
            apipost(`project/${projektid}/user`, user)
            setNotmember(notmember.filter((value) => value.user_id !== user.user_id));
            setProjectusers([...projectusers, user]);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Projekts:", error);
        }
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
                                        label="Kick user"
                                        variant="outlined"
                                        value={notmemberFilter}
                                        onChange={(e) => setnotmemberFilter(e.target.value)}
                                        fullWidth
                                    />
                                    <List dense component="div" role="list" sx={listStyle}>
                                        {notmember
                                            .filter((user) =>
                                                user.nickname.toLowerCase().includes(notmemberFilter.toLowerCase())
                                            )
                                            .map((user, index) => (
                                                <>
                                                    <ListItem key={user.user_id} button onClick={() => moveNameToprojectusers(user)}>
                                                        <ListItemText primary={user.nickname} />
                                                        <ListItemIcon style={{ color: 'green' }}>
                                                            <GroupAddIcon />
                                                        </ListItemIcon>
                                                    </ListItem>
                                                    {index !== notmember.length - 1 && <Divider />}
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
                                                    <ListItem key={user.user_id} button onClick={() => moveNameTonotMember(user)}>
                                                        <ListItemText primary={user.nickname} />
                                                        <ListItemIcon style={{ color: 'red' }}>
                                                            <GroupRemoveIcon />
                                                        </ListItemIcon>
                                                    </ListItem>
                                                    {index !== projectusers.length - 1 && <Divider />}
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