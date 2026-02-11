import React, {useContext, useState} from 'react';
import { AuthContext } from "../context/AuthContext.jsx";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Ajout de useNavigate pour plus de contrôle
import Logo from "../assets/logo/logo1.webp";

import './NavBar.css';

function NavBar() {
    const { user, isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Etat pour stocker le texte de la barre de recherche
    const [searchItems, setSearchItems] = useState("");

    const handleLogout = () => {
        logout(); // Appelle la fonction de déconnexion du contexte
        navigate("/"); // Redirige vers l'accueil pour éviter de rester sur une page privée
    }

    // Fonction de recherche
    const handleSearch = (e) => {
        e.preventDefault(); // Empeche le chargement de la page
        // Redirection vers la boutique avec le paramètre de recherche
        navigate(`/boutique?search=${searchItems}`);
        setSearchItems("");// Vider la barre après recherche
    };

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
                    <li><NavLink to="./contact">Contact</NavLink></li>
                </ul>

                {/* BARRE DE RECHERCHE */}
                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="search-input"
                        value={searchItems}
                        onChange={(e) => setSearchItems(e.target.value)}
                    />
                    <button type="submit" className="search-icon-btn">
                        {/* Picto de la loupe svg */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>


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
                        <svg width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </Link>
                </div>

            </nav>
        </header>
    );
}

export default NavBar;