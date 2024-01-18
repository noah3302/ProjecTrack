import React from "react";
import { Typography, AppBar, Container, Toolbar } from "@mui/material";

//Navigationsleiste
const Outlogednavbar = () => {
  //Unterseiten gestalten
  const unterseiten = {
    textDecoration: "none",
    color: "white",
    alignItems: "center",
  };

  //React-Komponente Navigationsleiste(Navbar)
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#blue" }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ height: "50px" }}>
            <Typography
              variant="h6"
              noWrap //Text bleibt hierdurch auf einer Zeile
              sx={{
                ml: 1, //linker Außenabstand
                mr: 2, //rechten Außenabstand
                display: { xs: "flex", sm: "flex" },
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "white",
                textDecoration: "none",
                fontSize: 50,
                fontFamily: "monospace",
                "@media (max-width: 400px)": {
                  fontSize: 30,
                },
              }}
            >
              ProjecTrack
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Outlogednavbar;
