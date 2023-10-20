import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
    const {user, logOut} = UserAuth()
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try{
            await logOut()
            navigate("/");
        }   catch (error) {
            console.log(error)
        }
    }

    return(
        <>
        <h1>Navbar</h1>
            <button onClick={handleSignOut}>Logout</button>
        </>
    ) 
}

export default Navbar