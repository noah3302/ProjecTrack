import * as React from "react";
import { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChatIcon from '@mui/icons-material/Chat';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HandshakeIcon from '@mui/icons-material/Handshake';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from "../context/Authcontext";


/**Navbar im eingeloggten Zustand */




export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = UserAuth();


  // Logout
  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };


  const [anchorElUser, setAnchorElUser] = React.useState(null);


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };


  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const dropdown = {
    textDecoration: "none",
    color: "black",
  }


  const unterseiten = {
    textDecoration: "none",
    color: "white",
    alignItems: "center",
  }


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
      <AppBar position="fixed" sx={{ backgroundColor: '#blue' }}>
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
                  md: "none"
                }
              }}
            >
              <MenuIcon />
            </IconButton>


            <Link to="/home" style={unterseiten}>
            </Link>
            <Link to="/home" style={unterseiten}>
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
            </Link>
            {/* <Box
              component="img"
              sx={{
                height: 40,
                display: {
                  xs: 'none',
                  sp: 'none',
                  sm: 'block'
                }
              }}
              alt="Flirtify Logo"
              src={Logo}>
            </Box> */}
            <Box sx={{ flexGrow: 1, justifyContent: "right", width: "75%", margin: 1, display: { md: 'flex', textAlign: "center", xs: "none" } }}>

              <Link to="/anfragen" style={unterseiten}>
                <MenuItem>
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 200, fontSize: 20, }}>ANRFAGEN</Typography>
                </MenuItem>
              </Link>

              <Link to="/vorschlage" style={unterseiten}>
                <MenuItem>
                  <Typography sx={{ fontFamily: 'monospace', fontWeight: 200, fontSize: 20, }}>Vorschläge</Typography>
                </MenuItem>
              </Link>

            </Box>


            <Box sx={{ flexGrow: 1 }} />


            <Box sx={{ marginLeft: 1 }} >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Typography sx={{ marginRight: "12px", color: "white", float: "right", display: { sm: 'flex', xs: 'none' } }} >
                  {user?.username}
                </Typography>
                <Avatar sx={{ float: "right" }} referrerPolicy="no-referrer" alt="Remy Sharp" src={user?.profilePicture} />
              </IconButton>


              <Menu
                sx={{ mt: '64px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Link to={`/profil`} style={dropdown}>
                  <MenuItem onClick={handleCloseUserMenu} sx={{ backgroundColor: "white" }}>
                    <Typography>Profil</Typography>
                  </MenuItem>
                </Link>

                <Link to="/about" style={dropdown}>
                  <MenuItem onClick={handleCloseUserMenu} sx={{ backgroundColor: "white" }}>
                    <Typography>About</Typography>
                  </MenuItem>
                </Link>


                <Divider sx={{ my: 1 }} />


                <MenuItem onClick={handleSignOut} sx={{ backgroundColor: "white" }}>
                  <Typography style={dropdown}>Logout</Typography>
                </MenuItem>


              </Menu>
            </Box>




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
                  backgroundColor: "#556573"
                }}
              >
                <IconButton onClick={toggleDrawer(false)} sx={{ mb: 2 }}>
                  <CloseIcon sx={{ color: 'white' }} />
                </IconButton>


                <Divider sx={{ mb: 2 }} />


                <Box sx={{ mb: 2 }}>

                  <Link to="/anfragen" style={unterseiten}>
                    <ListItemButton>
                      <ListItemIcon>
                        <PersonOutlineIcon sx={{ color: "white" }} />
                      </ListItemIcon>
                      <ListItemText primary="Anfragen" />
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
                    transform: "translate(-50%, 0)"
                  }}
                >
                </Box>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ marginTop: "69px" }}></Box>
    </>
  );
}
