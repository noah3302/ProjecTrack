import * as React from "react";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Avatar,
  MenuItem,
} from "@mui/material";
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

/**Navbar im eingeloggten Zustand */

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();

  // Logout
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const unterseiten = {
    textDecoration: "none",
    color: "white",
    alignItems: "center",
  };

  const [open, setState] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#blue" }}>
        <Container maxWidth="xl" disableGutters>
          <Toolbar sx={{ height: "50px" }}>
            <IconButton
              edge="start"
              color="black"
              aria-label="open drawer"
              onClick={toggleDrawer(true)}
              sx={{
                mr: 2,
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Link to="/home" style={unterseiten}></Link>
            <Link to="/home" style={unterseiten}>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  ml: 1,
                  mr: 2,
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
                      float: "right",
                      display: { sm: "flex", xs: "none" },
                    }}
                  >
                    {user?.username}
                  </Typography>
                  <Avatar
                    sx={{ float: "right" }}
                    referrerPolicy="no-referrer"
                    alt="Remy Sharp"
                    src={user?.profilePicture}
                  />
                </IconButton>
              </Link>
            </Box>

            <Button
              onClick={handleSignOut}
              color="primary"
              startIcon={<LogoutIcon />}
              style={unterseiten}
            ></Button>

            {/* The outside of the drawer */}
            <Drawer
              anchor="left"
              open={open}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              {/* The inside of the drawer */}
              <Box
                sx={{
                  p: 2,
                  height: 1,
                  backgroundColor: "#556573",
                }}
              >
                <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
                  <CloseIcon sx={{ color: "white" }} />
                </IconButton>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ mb: 2 }}>
                  <Link to="/about" style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <InfoOutlinedIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      <ListItemText primary="About" />
                    </ListItemButton>
                  </Link>

                  <Link to="/profil" style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonOutlineIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      <ListItemText primary="Profil" />
                    </ListItemButton>
                  </Link>

                  <Link onClick={handleSignOut} style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <LogoutIcon sx={{ color: "white" }} />
                      </ListItemIcon>
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
