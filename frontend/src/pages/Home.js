import React from "react";
import { Typography, Box } from "@mui/material";
import { UserAuth } from "../Context/Authcontext";
import Projectcard from "../components/Projectcard";

const Home = () => {
  const { user } = UserAuth(); //Benutzerinfos aus Authentifizierungskontext abrufen

  return (
    <>
      <Box
        sx={{
          mt: "6rem",
          display: 'flex',
          justifyContent: 'center',
          p: 1, //Innenabstand
          borderRadius: 1, //Ecken abgerundet
        }}
      >
        {/* Username der eingeloggten Person wird angezeigt */}
        <Typography typography={"h4"}>
          Herzlich Willkommen! {user?.displayName}  
        </Typography>
      </Box>
      {/* Projectcard-Komponente einfügen */}
      <Box m={"3rem"}>
        <Projectcard></Projectcard> 
      </Box>
    </>
  );
};

export default Home;
