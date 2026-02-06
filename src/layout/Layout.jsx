// Contruire la structure de page

import React from 'react';
import {Outlet} from "react-router-dom";
import Footer from "../components/Footer.jsx";
import NavBar from "../components/NavBar.jsx";

// Structure
 //Navbar / Outlet (contenu variable) / Footer

function Layout() {
    return (
        <div>
            <NavBar />
            <Outlet />
            <Footer />
        </div>

    );
}

export default Layout;