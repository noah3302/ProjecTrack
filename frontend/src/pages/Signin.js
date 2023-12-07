import React, { useEffect } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { Box, Typography } from "@mui/material";
import { apiget } from "../API/Api";

export default function Signin() {
  const { googleSignIn, user } = UserAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.error("Fehler bei der Anmeldung:", error);
    }
  };

  useEffect(() => {
    const checkExistingUser = async () => {
      if (user && user.userid) { 
        try {
          const fetchedUser = await apiget(`existusers/${user.userid}`);
          console.log("fetchedUser", fetchedUser)
          if (fetchedUser && fetchedUser.exist) {
            navigate("/home");
          } else {
            navigate("/createprofil");
          }
        } catch (error) {
          console.error("Fehler bei der Überprüfung des Benutzers:", error);
        }
      }
    };
  
    checkExistingUser();
  }, [user, navigate]);  

  return (
    <>
      <Box sx={{ maxWidth: "40rem", marginRight: "auto", marginLeft: "auto", marginTop: "8rem" }}>
        <Typography align="center">Herzlich willkommen bei ProjecTrack</Typography>
        <Typography mt={"1rem"} align="center">Hier kannst du dich anmelden/registrieren:</Typography>
        <GoogleButton sx={{ marginTop: "3rem" }} onClick={handleGoogleSignIn} />
      </Box>
    </>
  );
}

