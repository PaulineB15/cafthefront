// IMPORT DES OUTILS REACT ET REACT ROUTER

import React from 'react';
import { Link } from "react-router-dom";

// IMPORT LOGO + CSS
import Logo from "../assets/logo/Logo1.webp"; // Vérifie le nom exact du fichier
import "../styles/Footer.css";


function Footer() {
    return (

        <footer className="footer" role="contenu du footer"> {/* Attribut d'accessibilité (ARIA).*/}
            <div className="footer-container">
                {/* LOGO*/}
                <div className="footer-colonne logo-colonne">
                    <Link to="/" aria-label="Retour à l'accueil">
                        <img src={Logo} alt="Logo CafThé" className="footer-logo" />
                    </Link>
                </div>

                {/* COLONNE CONTACT */}
                <ul className="footer-colonne">
                    <h4>CONTACT</h4>
                    <address className="footer-adresse">
                        <p>123 Rue de la Paix</p>
                        <p>75001 Paris, France</p>
                        <p>
                            <a href="mailto:contact@cafthe.fr">contact@cafthe.fr</a>
                        </p>
                        <p>
                            <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                        </p>
                    </address>
                </ul>

                {/* COLONNE INFORMATIONS */}
                <div className="footer-colonne">
                    <h4>INFORMATIONS</h4>
                    <nav aria-label="Liens légaux et aide">
                        <ul className="footer-liens">
                            <li><Link to="/MentionsLegales">Mentions légales</Link></li>
                            <li><Link to="/cgv">CGV</Link></li>
                            <li><Link to="/plan-du-site">Plan du site</Link></li>
                            <li><Link to="/confidentialite">Politique de confidentialité</Link></li>
                            <li><Link to="/faq">FAQ</Link></li>
                        </ul>
                    </nav>
                </div>

                {/* COLONNE RESEAUX SOCIAUX */}
                <div className="footer-colonne">
                    <h4>SUIVEZ-NOUS</h4>
                    <nav aria-label="Réseaux sociaux">
                        <ul className="social-liens">
                            <li>
                                {/*
                                    - target="_blank" : Ouvre le lien dans un nouvel onglet.
                                    - rel="noopener noreferrer" : Obligatoire avec target="_blank" pour éviter qu'un site malveillant ne pirate notre page d'origine via JavaScript.
                                */}
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="footer-bas">
                {/* new Date().getFullYear() récupère l'année en cours automatiquement */}
                <small>&copy; {new Date().getFullYear()} CafThé - Tous droits réservés</small>
                {/* Séparateur visuel et mention accessibilité */}
                <small style={{ margin: '0 10px' }}>|</small>
                <small>Accessibilité : démarche RGAA</small>
            </div>
        </footer>
    );
}

export default Footer;