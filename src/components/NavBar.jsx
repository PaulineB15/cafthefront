import React, { useContext } from 'react';
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Ajout de useNavigate pour plus de contrôle
import Logo from "../assets/logo/logo1.webp";
import './NavBar.css';

function NavBar() {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Appelle la fonction de déconnexion du contexte
        navigate("/"); // Redirige vers l'accueil pour éviter de rester sur une page privée
    }

    return (
        <header className="main-header">
            <nav className="navbar-container">

                {/* LOGO */}
                <div className="navbar-logo">
                    <Link to="/">
                        <img src={Logo} alt="Logo CafThé" />
                    </Link>
                </div>

                {/* LIENS CENTRAUX */}
                <ul className="navbar-menu">
                    <li><NavLink to="/" end>Accueil</NavLink></li>
                    <li><NavLink to="./boutique">Boutique</NavLink></li>
                    <li><NavLink to="/contact">Contact</NavLink></li>
                </ul>

                {/* ACTIONS DROITE */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="user-logged">
                            <span>Bonjour, {user.prenom}</span>
                            <button onClick={handleLogout} className="logout-btn">
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="icon-btn" title="Se connecter">
                            {/* Icône utilisateur SVG */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </Link>
                    )}

                    {/* Icône Panier (toujours visible) */}
                    <Link to="/panier" className="icon-btn cart-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                    </Link>
                </div>

            </nav>
        </header>
    );
}

export default NavBar;