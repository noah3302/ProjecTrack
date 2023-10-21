import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Anfragen from "./pages/Anfragen";
import Profil from "./pages/Profil";
import Navbar from "./components/Navbar";
import Createprofil from "./pages/Createprofil";
import { AuthContextProvider } from "./context/Authcontext";
import Protected from "./components/Protected";
import About from "./pages/About";
import Projekt from "./pages/Projekt";


function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Signin/>}/>
          <Route path="/createprofil" element={<Createprofil/>}/>
          <Route path="/home" element={<Protected><Home/></Protected>}/>
          <Route path="/anfragen" element={<Protected><Anfragen/></Protected>}/>
          <Route path="/profil" element={<Protected><Profil/></Protected>}/>
          <Route path="/about" element={<Protected><About/></Protected>}/>
          <Route path="/projekt" element={<Protected><Projekt/></Protected>}/>
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
