import { Typography } from "@mui/material";
import React from "react";
import { Grid, Box } from "@mui/material";
import Projectcard from "../components/Projectcard";


const Vorschlage = () => {

    return(
        <>
            <Typography>Vorschläge</Typography>

            <Box m={"1rem"} >
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(Array(7)).map((_, index) => (
                    <Grid item sm={6} md={4} key={index}>
                        <Projectcard></Projectcard>
                    </Grid>
                ))}
                </Grid>
            </Box>           
        </>
    );
};
export default Vorschlage;