import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { Box, Typography } from "@mui/material";
// import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector, TimelineOppositeContent } from "@mui/lab";
// import EngineeringIcon from '@mui/icons-material/Engineering';
// import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
// import AddTaskIcon from '@mui/icons-material/AddTask';
// import AssessmentIcon from '@mui/icons-material/Assessment';
// import { apiget } from "../API/Api";
import theme from "../Theme";


export default function Signin() {
  const { googleSignIn, user } = UserAuth();
  const [signInDone, setSignInDone] = useState();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      setSignInDone(true);
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
    }
  };

  useEffect(() => {
    const checkExistingUser = async () => {
      if (signInDone) {
        if (user && user.id) {
          navigate("/home");
        } else {
          navigate("/createprofil");
        }
      }
    };

    checkExistingUser();
  }, [user, signInDone]);

  return (
    <>
      <Box sx={{ maxWidth: "40rem", marginRight: "auto", marginLeft: "auto", marginTop: "8rem" }}>
        <Typography align="center">Herzlich willkommen bei ProjecTrack</Typography>
        <Typography mt={"1rem"} align="center">Hier kannst du dich anmelden/registrieren:</Typography>
        <GoogleButton style={{ margin: "2rem auto" }} onClick={handleGoogleSignIn} />
      </Box>
      <Box style={{ align: "center" }}>
        {/* <Timeline position="alternate" style={{ backgroundColor: "white", width: "50%" }}>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <EngineeringIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '15px', px: 2 }}>
              <Typography variant="h6" component="span">
                Create your own project
              </Typography>
              <Typography>With the power of ProjecTrack you can create your own projects for free</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <PersonAddAltIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Typography variant="h6" component="span">
                Invite other prople
              </Typography>
              <Typography>Get your team in your project simple and save</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <AddTaskIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '15px', px: 2 }}>
              <Typography variant="h6" component="span">
                Distribute tasks
              </Typography>
              <Typography>Assign tasks to members of your project and see the progress at any time</Typography>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem>
            <TimelineSeparator>
              <TimelineConnector />
              <TimelineDot>
                <AssessmentIcon />
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ py: '15px', px: 2 }}>
              <Typography variant="h6" component="span">
                Steer the project
              </Typography>
              <Typography>Reporting functions allow you to view and analyze the progress of your project at any time</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline> */}
      </Box>
      <Box>
        <Typography>Theme Farben</Typography>
        <Typography>Primary</Typography>
        <Box sx={{ backgroundColor: theme.palette.primary.light }}><Typography>light</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.primary.main }}><Typography>main</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.primary.dark }}><Typography>dark</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.primary.contrastText }}><Typography>contrastText</Typography></Box>
        <Typography>secondary</Typography>
        <Box sx={{ backgroundColor: theme.palette.secondary.light }}><Typography>light</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.secondary.main }}><Typography>main</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.secondary.dark }}><Typography>dark</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.secondary.contrastText }}><Typography>contrastText</Typography></Box>
        <Typography>action</Typography>
        <Box sx={{ backgroundColor: theme.palette.action.light }}><Typography>light</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.action.main }}><Typography>main</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.action.dark }}><Typography>dark</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.action.contrastText }}><Typography>contrastText</Typography></Box>
        <Typography>error</Typography>
        <Box sx={{ backgroundColor: theme.palette.error.light }}><Typography>light</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.error.main }}><Typography>main</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.error.dark }}><Typography>dark</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.error.contrastText }}><Typography>contrastText</Typography></Box>
        <Typography>accent</Typography>
        <Box sx={{ backgroundColor: theme.palette.accent.light }}><Typography>light</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.accent.main }}><Typography>main</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.accent.dark }}><Typography>dark</Typography></Box>
        <Box sx={{ backgroundColor: theme.palette.accent.contrastText }}><Typography>contrastText</Typography></Box>
      </Box>
    </>
  );
}