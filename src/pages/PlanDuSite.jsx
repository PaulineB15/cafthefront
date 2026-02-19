import React from 'react';
import { Link } from 'react-router-dom';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import './PageLegales.css';

const PlanSite = () => {
    return (
        <main className="legal-page">
            <section className="legal-hero" style={{ backgroundImage: `url(${HeroInformations})` }}>
                <div className="hero-legal-overlay">
                    <div className="hero-legal-content">
                        <h1>Plan du site</h1>
                        <p>Retrouvez facilement toutes les rubriques de notre boutique.</p>
                    </div>
                </div>
            </section>

            <div className="legal-container">
                {/* Section Navigation Principale */}
                <section className="legal-section">
                    <h2>Navigation Principale</h2>
                    <ul className="legal-list">
                        <li><Link to="/" className="legal-link">Accueil</Link></li>
                        <li><Link to="/boutique" className="legal-link">Boutique (Cafés & Thés)</Link></li>
                        <li><Link to="/contact" className="legal-link">Contact</Link></li>
                        <li><Link to="/faq" className="legal-link">Foire Aux Questions (FAQ)</Link></li>
                    </ul>
                </section>

                {/* Section Espace Client */}
                <section className="legal-section">
                    <h2>Votre Espace</h2>
                    <ul className="legal-list">
                        <li><Link to="/login" className="legal-link">Connexion / Inscription</Link></li>
                        <li><Link to="/panier" className="legal-link">Mon Panier</Link></li>
                    </ul>
                </section>

                {/* Section Informations Légales */}
                <section className="legal-section">
                    <h2>Informations Légales</h2>
                    <ul className="legal-list">
                        <li><Link to="/mentions-legales" className="legal-link">Mentions Légales</Link></li>
                        <li><Link to="/cgv" className="legal-link">Conditions Générales de Vente (CGV)</Link></li>
                        <li><Link to="/confidentialite" className="legal-link">Politique de Confidentialité</Link></li>
                        <li><Link to="/accessibilite" className="legal-link">Accessibilité</Link></li>
                    </ul>
                </section>

                <div className="legal-footer">
                    <p>© {new Date().getFullYear()} CafThé - Tous droits réservés</p>
                </div>
            </div>
        </main>
    );
};

export default PlanSite;