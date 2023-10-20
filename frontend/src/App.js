import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Navbar from "./components/Navbar";
import Createprofil from "./pages/Createprofil";
import { AuthContextProvider } from "./context/Authcontext";
import Protected from "./components/Protected";


function App() {
  return (
    <>
      <AuthContextProvider>
        <Navbar/>
      <Routes>
          <Route path="/" element={<Signin/>}/>
          <Route path="/createprofil" element={<Createprofil/>}/>
          <Route path="/home" element={<Protected><Home/></Protected>}/>
      </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
