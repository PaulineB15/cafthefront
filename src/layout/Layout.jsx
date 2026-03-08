// Contruire la structure de page


// --- IMPORT DES OUTILS ---

import React from 'react';
// Outil clé de React Router pour créer des mises en page imbriquées.
import {Outlet} from "react-router-dom";

// Footer et Header qui seront sur toutes les pages
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