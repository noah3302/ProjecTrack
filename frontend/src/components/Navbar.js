import * as React from "react";
import { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Avatar, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

//Navbar im eingeloggten Zustand
export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();

  //Logout
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  //Unterseiten stylen
  const unterseiten = {
    textDecoration: "none", //Entfernt Standard-Textdeko für Link
    color: "white",
    alignItems: "center",
  };

  //Verwalten des Öffnungszustands 
  const [open, setState] = useState(false); 
  const toggleDrawer = (open) => (event) => { //Ermöglicht umschalten
    if ( //Überprüfen ob tab oder shift während Tastendruck gedrückt sind
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState(open); //Zustand aktualisieren 
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "primary.main" }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ height: "50px" }}>
            <IconButton //Button zum Öffnen des Drawers
              edge="start" //Icon am Anfang positioniert
              color="black"
              aria-label="open drawer" //Barrierefreier Text für Icon
              onClick={toggleDrawer(true)} //Drawer öffnen
              sx={{
                mr: 2,
                display: {
                  xs: "flex",
                  md: "none", //Icon auf mittelgroßen Bildschirmen nicht sichtbar
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Link to="/home" style={unterseiten}></Link>
            <Link to="/home" style={unterseiten}>
              <Typography
                variant="h6"
                noWrap //Verhindert Umbrüche
                sx={{
                  ml: 1,
                  mr: 2,
                  display: { xs: "flex", sm: "flex" },
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                  textDecoration: "none", //damit keine Unterstreichung beim Link ist
                  fontSize: 50,
                  fontFamily: "monospace",
                  "@media (max-width: 400px)": {
                    fontSize: 30,
                  },
                }}
              >
                ProjecTrack
              </Typography>
            </Link>
            <Box
              sx={{
                flexGrow: 1,
                justifyContent: "right",
                width: "75%",
                margin: 1,
                display: { md: "flex", textAlign: "center", xs: "none" },
              }}
            >
              <Link to="/about" style={unterseiten}>
                <MenuItem>
                  <Typography
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 200,
                      fontSize: 18,
                    }}
                  >
                    About
                  </Typography>
                </MenuItem>
              </Link>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ marginLeft: 1 }}>
              <Link to={`/profil`} style={unterseiten}>
                <IconButton>
                  <Typography
                    sx={{
                      marginRight: "12px",
                      color: "white",
                      float: "right", //Ausrichtung vom Text nach rechts
                      display: { sm: "flex", xs: "none" },
                    }}
                  >
                    {/* Falls Name verfügbar wird er angezeigt */}
                    {user?.username} 
                  </Typography>
                  <Avatar
                    sx={{ float: "right" }}
                    referrerPolicy="no-referrer"
                    alt="Remy Sharp" //Alternativer Text für Bild
                    src={user?.profilePicture} //Quelle vom Profilbild
                  />
                </IconButton>
              </Link>
            </Box>
            <Button
              onClick={handleSignOut} //Ausloggen
              color="primary"
              startIcon={<LogoutIcon />}
              style={unterseiten}
            ></Button>
            <Drawer //seitliches Menü erstellen
              anchor="left"
              open={open}
              onClose={toggleDrawer(false)} //um Drawer zu schließen
              onOpen={toggleDrawer(true)} //um Drawer zu öffnen
            >
              <Box
                sx={{
                  p: 2,
                  height: 1,
                  backgroundColor: "#556573",
                }}
              >
                {/* Button zum Schließen */}
                <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}> 
                  <CloseIcon sx={{ color: "white" }} />
                </IconButton>
                {/* Trennlinie */}
                <Divider sx={{ mb: 2 }} /> 
                <Box sx={{ mb: 2 }}>
                  <Link to="/about" style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <InfoOutlinedIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      {/* Text für Link */}
                      <ListItemText primary="About" /> 
                    </ListItemButton>
                  </Link>
                  <Link to="/profil" style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonOutlineIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                       {/* Text für Link */}
                      <ListItemText primary="Profil" />
                    </ListItemButton>
                  </Link>
                  {/* Link zum Ausloggen */}
                  <Link onClick={handleSignOut} style={unterseiten}> 
                    <ListItemButton>
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      {/* Text für Link */}
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </Link>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    bottom: "0",
                    left: "50%",
                    transform: "translate(-50%, 0)",
                  }}
                ></Box>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ marginTop: "69px" }}></Box>
    </>
  );
}
