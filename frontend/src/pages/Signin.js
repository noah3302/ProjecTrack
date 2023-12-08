import React, { useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { Box, Typography } from "@mui/material";
import { apiget } from "../API/Api";

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
    </>
  );
}

