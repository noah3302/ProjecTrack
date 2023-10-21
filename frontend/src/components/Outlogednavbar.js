import { Typography, AppBar, Container, Toolbar } from "@mui/material";
import React from "react";

const Outlogednavbar = () => {
    const unterseiten = {
        textDecoration: "none",
        color: "white",
        alignItems: "center",
      }

    return(
        <>
            <AppBar position="fixed" sx={{ backgroundColor: '#blue' }}>
                <Container maxWidth="xl" disableGutters>
                <Toolbar sx={{ height: "50px" }}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  mr: 2,
                  display: { xs: 'flex', sm: 'flex' },
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: 50,
                  fontFamily: 'monospace',
                  '@media (max-width: 400px)': {
                    fontSize: 30,
                  },
                }}
              >ProjecTrack</Typography>
            </Toolbar>
            </Container>
            </AppBar>
        </>
    );
};
export default Outlogednavbar;