import { Typography, Box, Grid, Card, Button} from "@mui/material";
import React from "react";
import { UserAuth } from "../Context/Authcontext";
import Projectcard from "../components/Projectcard";
import AddIcon from '@mui/icons-material/Add';
import {Link} from "react-router-dom";



const Home = () => {
    const {user} = UserAuth()
    console.log("aktueller User", user)

    return(
        <>
            <Typography>Home</Typography>
            <Typography>aktueller user: {user?.displayName}</Typography>

            <Box m={"1rem"} >
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Array.from(Array(4)).map((_, index) => (
                    <Grid item sm={6} md={4} key={index}>
                        <Projectcard></Projectcard>
                    </Grid>
                ))}
                    <Grid item sm={6} md={4}>
                        <Card variant="outlined" mr={"auto"} >
                            <Link to="/createproject">
                                <Box>
                                    <Typography sx={{ alignItems: 'center', color:"black"}}>Neues Projekt anlegen</Typography>
                                    <AddIcon sx={{ alignItems: 'center',fontSize: 180, color:"black" }}/>
                                </Box>    
                            </Link>    
                        </Card>
                    </Grid>
                </Grid>
            </Box>  

        </>
    );
};
export default Home;