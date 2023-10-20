import { Typography } from "@mui/material";
import React from "react";
import { UserAuth } from "../context/Authcontext";

const Home = () => {
    const {user} = UserAuth()
    console.log("aktueller User", user)

    return(
        <>
            <Typography>Home</Typography>
            <Typography>aktueller user: {user?.displayName}</Typography>
        </>
    );
};
export default Home;