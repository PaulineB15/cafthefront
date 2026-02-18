import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import "./Confirmation.css";

// Assets
import HeroPanier from "../assets/photo/HeroPanier.webp";
// Assure-toi que ce SVG est l'icône "Check" (coche) ou "Confirmation"
import ConfirmationIcon from "../assets/picto/comande-confirmer.svg";
//import Package from "../assets/picto/package.svg"; // Icône colis/produit (facultatif)
import Location from "../assets/picto/location.svg";
import CreditCard from "../assets/picto/creditcard.svg";
//import Mail from "../assets/picto/mail1 .svg"; // Il te faudra une icône enveloppe idéalement

const Confirmation = () => {
    const orderNumber = "CFT-49LJWB8B"; // Numéro fixe pour l'exemple
    const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

    // Scroll top
    useEffect(() => { window.scrollTo(0, 0); }, []);

    // Données fictives pour coller à la maquette
    const mockItems = [
        { id: 1, name: "ESPRESSO INTENSO", type: "CAFÉ EN GRAINS", detail: "250g - Quantité : 2", price: 45.80 },
        { id: 2, name: "THÉ VERT SENCHA", type: "THÉ EN VRAC", detail: "100g - Quantité : 1", price: 18.50 }
    ];

    return (
        <main className="confirmation-page">
            {/* --- HERO SECTION --- */}
            <section className="hero-confirmation" style={{backgroundImage: `url(${HeroPanier})`}}>
                <div className="hero-overlay-conf">
                    <div className="hero-content">
                        {/* Icône au dessus du titre, sans filtre, taille contrôlée en CSS */}
                        <div className="conf-icon-wrapper">
                            <img src={ConfirmationIcon} alt="Succès" />
                        </div>

                        <h1>COMMANDE CONFIRMÉE !</h1>
                        <p className="hero-subtitle">Merci pour votre confiance. Votre commande a été enregistrée avec succès.</p>

                        <div className="hero-order-badge">
                            <span>NUMÉRO DE COMMANDE</span>
                            <strong>{orderNumber}</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GRID LAYOUT --- */}
            <div className="conf-container">

                {/* COLONNE GAUCHE (MAIN) */}
                <div className="conf-main">

                    {/* 1. Confirmation Email */}
                    <div className="conf-card email-box">
                        <div className="card-header">
                            {/* Tu peux remplacer par <img src={Mail} /> si tu as l'asset */}
                            <span className="icon-gold">✉</span>
                            <h3>CONFIRMATION PAR EMAIL</h3>
                        </div>
                        <p>Un email de confirmation a été envoyé à <span className="gold-text">jean.dupont@email.com</span></p>
                        <p className="small-text">Pensez à vérifier vos courriers indésirables si vous ne le recevez pas dans les prochaines minutes.</p>
                    </div>

                    {/* 2. Récapitulatif Produits */}
                    <div className="conf-card recap-box">
                        <div className="card-header">
                            <span className="icon-gold">📦</span>
                            <h3>RÉCAPITULATIF DE LA COMMANDE</h3>
                        </div>

                        <div className="conf-items-list">
                            {mockItems.map(item => (
                                <div key={item.id} className="conf-item">
                                    <div className="item-placeholder-img">IMG</div>
                                    <div className="conf-item-info">
                                        <span className="item-type">{item.type}</span>
                                        <h4>{item.name}</h4>
                                        <span className="item-detail">{item.detail}</span>
                                    </div>
                                    <div className="conf-item-price">{item.price.toFixed(2)} €</div>
                                </div>
                            ))}
                        </div>

                        <div className="conf-totals">
                            <div className="row">
                                <span>Sous-total</span>
                                <span>64.30 €</span>
                            </div>
                            <div className="row">
                                <span>Réduction (BIENVENUE10)</span>
                                <span>- 8.92 €</span>
                            </div>
                            <div className="row">
                                <span>Frais de livraison</span>
                                <span>4.90 €</span>
                            </div>
                            <div className="row total-row">
                                <span>TOTAL</span>
                                <span className="gold-text">60.28 € TTC</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Adresse de Livraison */}
                    <div className="conf-card address-box">
                        <div className="card-header">
                            <img src={Location} alt="" className="icon-gold-img"/>
                            <h3>ADRESSE DE LIVRAISON</h3>
                        </div>
                        <div className="address-content">
                            <strong>Jean Dupont</strong>
                            <p>123 Rue de la Paix<br/>Appartement 4B<br/>75001 Paris<br/>France</p>
                        </div>
                        <div className="delivery-date">
                            📅 Livraison estimée : <span className="gold-text">25 janvier 2026</span>
                            <p className="tiny-text">Vous recevrez un email avec le suivi de votre colis dès son expédition.</p>
                        </div>
                    </div>

                    {/* 4. Méthode de paiement */}
                    <div className="conf-card payment-box">
                        <div className="card-header">
                            <img src={CreditCard} alt="" className="icon-gold-img"/>
                            <h3>MÉTHODE DE PAIEMENT</h3>
                        </div>
                        <div className="payment-details">
                            <div className="card-icon-placeholder">💳</div>
                            <div className="card-text">
                                <span>Carte bancaire</span>
                                <span className="card-hidden">•••• •••• •••• 4242</span>
                            </div>
                            <span className="payment-badge">✓ Paiement validé</span>
                        </div>
                    </div>

                </div>

                {/* COLONNE DROITE (SIDEBAR) */}
                <aside className="conf-sidebar">

                    {/* Carte Détails */}
                    <div className="sidebar-card details-card">
                        <h3>DÉTAILS</h3>
                        <div className="detail-row">
                            <label>Date de commande</label>
                            <span>{today}</span>
                        </div>
                        <div className="detail-row">
                            <label>Numéro de commande</label>
                            <span className="gold-text">{orderNumber}</span>
                        </div>
                        <div className="detail-row">
                            <label>Montant total</label>
                            <strong>60.28 € TTC</strong>
                        </div>
                        <div className="detail-row">
                            <label>Statut</label>
                            <span className="status-dot">● En préparation</span>
                        </div>
                    </div>

                    {/* Carte Actions */}
                    <div className="sidebar-card actions-card">
                        <h3>ACTIONS</h3>
                        <button className="btn-gold-full">📦 SUIVRE MA COMMANDE</button>
                    </div>

                    {/* Carte Découvrez aussi */}
                    <div className="sidebar-card discover-card">
                        <h3>DÉCOUVREZ AUSSI</h3>
                        <p>Continuez vos achats et découvrez notre sélection de cafés et thés d'exception.</p>
                        <Link to="/boutique" className="link-gold">Retour à la boutique →</Link>
                    </div>

                    {/* Carte Besoin d'aide */}
                    <div className="sidebar-card help-card">
                        <h3>BESOIN D'AIDE ?</h3>
                        <p>Notre équipe est à votre écoute du lundi au samedi, de 9h à 19h.</p>
                        <a href="mailto:contact@cafthe.fr" className="gold-text">contact@cafthe.fr</a>
                        <br/>
                        <a href="tel:+33123456789" className="gold-text">+33 1 23 45 67 89</a>
                    </div>

                </aside>
            </div>

            <div className="footer-thanks">
                <h3>MERCI POUR VOTRE CONFIANCE</h3>
                <p>Chez CafThé, nous nous engageons à vous offrir une expérience exceptionnelle.<br/>Votre satisfaction est notre priorité.</p>
            </div>
        </main>
    );
};

export default Confirmation;