import { Typography } from "@mui/material";
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
            navigate("/home");
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
            <Typography>Sigin Page</Typography>
            <GoogleButton onClick={handleGoogleSignIn}/>
        </>
    );
};
export default Signin;