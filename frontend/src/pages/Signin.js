import { Typography, Box } from "@mui/material";
import React, { useEffect } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

const Signin = () => {

    const {googleSignIn, user} = UserAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn()
            navigate("/createprofil");
        }catch(error) {
            console.log(error)
        }
    }



    useEffect(() => {
        if (user != null) {
            navigate("/home");
        }
    }, [user]);

    return(
        <>
        <Box sx={{maxWidth:"40rem", marginRight:"auto", marginLeft:"auto", marginTop:"8rem"}}>
            <Typography align="center">Herzlich willkommen bei ProjecTrack</Typography>
            <Typography mt={"1rem"} align="center">Hier kannst du dich anmelden/registrieren:</Typography>
            <GoogleButton sx={{marginTop:"3rem"}} onClick={handleGoogleSignIn}/>    
        </Box>
        </>
    );
};
export default Signin;