import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Navbar from "./components/Navbar";
import Createprofil from "./pages/Createprofil";
import { AuthContextProvider } from "./Context/Authcontext";
import Protected from "./components/Protected";
import About from "./pages/About";
import Projekt from "./pages/Projekt";
import Createproject from "./pages/Createproject";
import Signin from "./pages/Signin";


function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Signin/>}/>
          <Route path="/createprofil" element={<Createprofil/>}/>
          <Route path="/home" element={<Protected><Home/></Protected>}/>
          <Route path="/profil" element={<Protected><Profil/></Protected>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/projekt/:selectedProject" element={<Protected><Projekt/></Protected>}/>
          <Route path="/createproject" element={<Protected><Createproject/></Protected>}/>
       </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
