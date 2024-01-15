import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { Box, Typography } from "@mui/material";
import { Timeline, TimelineItem, TimelineContent, TimelineSeparator, TimelineDot, TimelineConnector } from "@mui/lab";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import AddTaskIcon from "@mui/icons-material/AddTask";
import AssessmentIcon from "@mui/icons-material/Assessment";

export default function Signin() {
  //Zustände definieren für das SignIn
  const { googleSignIn, user } = UserAuth();
  const [signInDone, setSignInDone] = useState();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => { //Anmeldung über Google
    try {
      await googleSignIn();
      setSignInDone(true);
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
    }
  };

  useEffect(() => {
    const checkExistingUser = async () => { //Überprüfen, ob der User bereits einen Account hat
      if (signInDone) {
        console.log(user);
        if (user && user.id) {
          navigate("/home");  //falls ja, wird der User zur Home-Seite navigiert
        } else {
          navigate("/createprofil");  //falls nein, wird der User zur Profil erstellen Seite navigiert
        }
      }
    };

    checkExistingUser();
  }, [user, signInDone]);

  return (
    <>
      <Box sx={{ maxWidth: "40rem", marginRight: "auto", marginLeft: "auto", marginTop: "8rem" }}>
        <Typography variant="h3" align="center" fontWeight="bold">
          Herzlich Willkommen bei ProjecTrack!
        </Typography>
        <Typography mt={"1rem"} variant="h6" align="center">
          Hier kannst du dich anmelden/registrieren:
        </Typography>
        {/* Registierung über Google Button */}
        <GoogleButton style={{ margin: "2rem auto" }} onClick={handleGoogleSignIn} />
      </Box>
      <Box sx={{ backgroundColor: "rgb(233, 233, 233)" }} style={{ width: "100%", display: "flex", justifyContent: "center", padding: "2rem 0" }}>
      {/* Timeline Elemente werden durch alternate abwechselnd auf der linken & rechten Seite platziert */}
        <Timeline position="alternate" style={{ width: "80%" }}> 
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
                Erstellen Sie Ihr eigenes Projekt!
              </Typography>
              <Typography>Mit der Leistungsfähigkeit von ProjecTrack können Sie Ihre eigenen Projekte kostenlos erstellen</Typography>
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
                Laden Sie andere Personen ein!
              </Typography>
              <Typography>Bringen Sie Ihr Team einfach und sicher in Ihr Projekt</Typography>
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
                Verteilen Sie Aufgaben!
              </Typography>
              <Typography>Weisen Sie den Mitgliedern Ihres Projekts Aufgaben zu und sehen Sie jederzeit den Fortschritt</Typography>
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
                Steuern Sie das Projekt!
              </Typography>
              <Typography>Reporting-Funktionen ermöglichen es Ihnen, den Fortschritt Ihres Projekts jederzeit einzusehen und zu analysieren</Typography>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </Box>
    </>
  );
}
