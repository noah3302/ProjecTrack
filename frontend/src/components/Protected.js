import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";
import { auth } from "../pages/firebase";
import CircularProgress from '@mui/material/CircularProgress';

//Funktion die dazu dient, Kinder-Elemente schützt indem sie den Authentifizierungsstatus des Benutzers überprüft
export default function Protected({ children }) {
  const { user, userdata } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [logedin, setLogedin] = useState(false);

  //Prüfung der Benutzerdaten und setzt den Anmeldezustand fort
  useEffect(() => {
    if (userdata != null) {
      if (userdata) {
        setLogedin(true);
      }else{
        setLogedin(false);
      }
      setLoading(false);
    }

  }, [userdata]);

  // Hier wird überprüft ob die Anwendung noch lädt, der Benutzer eingeloggt ist und ob der Benutzer eine ID besitzt
  if (loading) {
    return <div style={{height:"100vh", width:"100vw", display:"flex", placeItems:"center", justifyContent:"center"}}><CircularProgress /></div>;
  }

  if (logedin) {
    if (user.id) {
      return children;
    } else {
      return <Navigate to="/createprofil" />;
    }
  } else {
    return <Navigate to="/" />;
  }
}