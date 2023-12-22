import { Typography, Box } from "@mui/material";
import React from "react";
import { UserAuth } from "../Context/Authcontext";
import Projectcard from "../components/Projectcard";




const Home = () => {
    const { user } = UserAuth()

    return (
        <>
            <Box
                sx={{
                    mt:"6rem",
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                    borderRadius: 1,
                }} >
                <Typography typography={"h4"}>Herzlich Willkommen {user?.displayName}</Typography>
            </Box>
            <Box m={"3rem"} >
                <Projectcard></Projectcard>
            </Box>
        </>
    );
};
export default Home;