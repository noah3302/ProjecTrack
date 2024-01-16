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
