import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../Context/Authcontext";

export default function Protected({ children }) {
  const { user } = UserAuth();
  if (user && user.id) {
    return children;
  } else if(user){
    return <Navigate to="/createprofil" />;
  } else {
    return <Navigate to="/" />;
  }
}