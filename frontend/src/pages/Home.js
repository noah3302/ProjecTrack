import { Typography, Box } from "@mui/material";
import React from "react";
import { UserAuth } from "../Context/Authcontext";
import Projectcard from "../components/Projectcard";




const Home = () => {
    const { user } = UserAuth()
    console.log("aktueller User", user)

    return (
        <>
            <Typography>Home</Typography>
            <Typography>aktueller user: {user?.displayName}</Typography>
            <Box m={"1rem"} >
                <Projectcard></Projectcard>
            </Box>
        </>
    );
};
export default Home;