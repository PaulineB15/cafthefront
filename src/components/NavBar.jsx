
// IMPORT DES OUTILS REACT ET REACT ROUTER

// useContext : pour lire les données globales.
// useState : pour la mémoire locale du composant (texte de recherche, ouverture du menu mobile).
import React, {useContext, useState} from 'react';
// NavLink : uniquement pour les menus de navigation - lien "intelligent" qui sait s'il est actif (sur la page actuelle)
// useNavigate : Force le navigateur à changer de page (ex: aller au paiement)
import { Link, NavLink, useNavigate } from "react-router-dom";


import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

// IMPORT LOGO + CSS
import Logo from "../assets/logo/logo1.webp";
import '../styles/NavBar.css';


function NavBar() {
    // --- RÉCUPÉRATION DES DONNÉES GLOBALES ---

    // Extrais de l'utilisateur, l'état de connexion et la fonction de déconnexion
    const { user, isAuthenticated, logout } = useContext(AuthContext);

    // Récuperer le nombre de produits depuis le panier (cartContext)
    const { totalItems } = useContext(CartContext);

    const navigate = useNavigate();

    // --- MÉMOIRE LOCALE (STATES) ---

    // Etat pour stocker le texte de la barre de recherche
    const [searchItems, setSearchItems] = useState("");

    // Etat pour gérer l'ouverture du menu Burger (sur mobile) est ouvert ou fermé
    const [isMenuOpen, setIsMenuOpen] = useState(false);


    // Fonction de recherche
    const handleSearch = (e) => {
        e.preventDefault(); // Empêche le chargement de la page
        // Redirection vers la boutique avec le paramètre de recherche
        navigate(`/boutique?search=${searchItems}`);
        setSearchItems("");// Vider la barre après recherche
        setIsMenuOpen(false); // Fermer le menu mobile
    };

    // Fonction de recherche
    const handleLogout = () => {
        logout(); // Appelle la fonction de déconnexion du contexte
        navigate("/"); // Redirige vers l'accueil pour éviter de rester sur une page privée
        setIsMenuOpen(false); // Fermer le menu mobile à la déconnexion
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


                {/* --- MENU BURGER (Uniquement sur mobile) --- */}

                <button
                    className="burger-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)} // Inverse l'état (ouvre si fermé, ferme si ouvert)
                    aria-label="Menu" //  Accessibilité => pour le bouton du menu.
                >
                    {/* SVG de l'icône Burger (3 traits) */}
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="var(--gold-detail)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>


                {/* MENU NAVBAR */}
                {/* Si isMenuOpen est VRAI => 'active' pour afficher le menu en CSS sur mobile. */}
                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Accueil</NavLink></li>
                    <li><NavLink to="/boutique" onClick={() => setIsMenuOpen(false)}>Boutique</NavLink></li>
                    <li><NavLink to="/contact" onClick={() => setIsMenuOpen(false)}>Contact</NavLink></li>
                </ul>

                {/* BARRE DE RECHERCHE */}
                <form className={`barre-recherche ${isMenuOpen ? 'active' : ''}`} onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        className="recherche-champ"
                        value={searchItems}
                        onChange={(e) => setSearchItems(e.target.value)}
                    />
                    <button type="submit" className="loupe-btn">
                        <svg
                            role="img"
                            aria-label="Icône de recherche"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {/* C'est l'équivalent du alt pour un SVG */}
                            <title>Rechercher</title>
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>
                </form>


                {/* ACTIONS NAVBAR DROITE */}
                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <div className="compte-client">
                            <span>
                                <Link to="/mon-compte" className="client-identification">Bonjour, {user?.prenom}</Link>
                            </span>
                            <button onClick={handleLogout} className="deconnexion-btn">
                                Déconnexion
                            </button>
                        </div>
                    ) : (

                        <Link to="/login" className="icon-btn" title="Se connecter">
                            {/* Icône utilisateur SVG */}
                            <svg
                                role="img"
                                aria-label="Mon compte"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <title>Mon compte</title>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </Link>
                    )}

                    {/* Icône Panier (toujours visible) */}
                    <Link to="/panier" className="icon-btn cart-btn">
                        <svg
                            role="img"
                            aria-label="Panier"
                            width="20"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <title>Panier</title>
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>

                        {/* NOTIFICATION SUR LE PANIER */}
                        {/* Elle ne s'affiche (&&) que si le nombre d'articles est strictement supérieur à 0. */}
                        {totalItems > 0 && (
                            <span className="panier-notification">{totalItems}</span>
                        )}
                    </Link>
                </div>

            </nav>
        </header>
    );
}

export default NavBar;