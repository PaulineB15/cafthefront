import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Confirmation.css";

// Assets
import HeroPanier from "../assets/photo/HeroPanier.webp";
import ConfirmationIcon from "../assets/picto/comande-confirmer.svg";
import Package from "../assets/picto/package.svg";
import Mail from "../assets/picto/mail1.svg";

const Confirmation = () => {
    // 1. ON RÉCUPÈRE LES DONNÉES ENVOYÉES PAR LA PAGE DE PAIEMENT
    const location = useLocation();
    const navigate = useNavigate();
    const orderData = location.state;

    useEffect(() => {
        window.scrollTo(0, 0);

        // Sécurité : Redirection si pas de commande
        if (!orderData) {
            navigate('/boutique');
        }
    }, [orderData, navigate]);

    // ANTI-ÉCRAN NOIR : Message de chargement au lieu d'un plantage
    if (!orderData) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0F0F0F", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2>Redirection en cours...</h2>
            </div>
        );
    }

    // Sécurisation des calculs mathématiques
    const safeTotalTTC = orderData.totalTTC || 0;
    const safeFrais = orderData.fraisLivraison || 0;
    const sousTotal = safeTotalTTC - safeFrais;

    return (
        <main className="confirmation-page">
            {/* --- HERO SECTION --- */}
            <section className="hero-confirmation" style={{backgroundImage: `url(${HeroPanier})`}}>
                <div className="hero-overlay-conf">
                    <div className="hero-content">
                        <div className="conf-icon-wrapper">
                            <img src={ConfirmationIcon} alt="Icône de confirmation" />
                        </div>

                        <h1>COMMANDE CONFIRMÉE !</h1>
                        <p className="hero-subtitle">Merci {orderData.prenom || "Client"}. Votre commande a été enregistrée avec succès.</p>

                        <div className="hero-order-badge">
                            <span>NUMÉRO DE COMMANDE</span>
                            <strong>{orderData.numeroCommande || "CFT-XXXX"}</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- GRID (2 Colonnes) --- */}
            <section className="conf-container">

                {/* COLONNE GAUCHE (principal) */}
                <div className="conf-main">

                    {/* 1. CONFIRMATION EMAIL */}
                    <article className="conf-card email-box">
                        <div className="card-header">
                            {/* Ajout de la classe icon-gold-img pour les dorer */}
                            <img src={Mail} alt="Icône mail" aria-hidden="true"/>
                            <h3>CONFIRMATION PAR EMAIL</h3>
                        </div>
                        <p>Un email de confirmation a été envoyé à <span className="gold-text">{orderData.email || "votre adresse"}</span></p>
                    </article>

                    {/* 2. RÉCAPITULATIF DE LA COMMANDE */}
                    <article className="conf-card recap-box">
                        <div className="card-header">
                            <img src={Package} alt="Icône colis" aria-hidden="true" className="icon-gold-img" />
                            <h3>RÉCAPITULATIF DE LA COMMANDE</h3>
                        </div>

                        <div className="conf-items-list">
                            {/* ANTI-PLANTAGE : Vérification que items existe */}
                            {orderData.items && orderData.items.map((item, index) => {
                                const prixItem = item.prix || 0;
                                const quantite = item.quantite || 1;
                                const poidsMultiplicateur = item.isVrac ? (item.poids || 1) : 1;

                                return (
                                    <div key={index} className="conf-item">
                                        <div className="item-placeholder-img">
                                            {item.image ? <img src={`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/images/${item.image}`} alt={item.nom} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : 'IMG'}
                                        </div>
                                        <div className="conf-item-info">
                                            <span className="item-type">{item.categorie} {item.type ? `- ${item.type}` : ''}</span>
                                            <h4>{item.nom}</h4>
                                            <span className="item-detail">
                                                {item.isVrac ? `${(item.poids || 0) * 1000}g - ` : ''}Quantité : {quantite}
                                            </span>
                                        </div>
                                        <div className="conf-item-price">
                                            {(prixItem * quantite * poidsMultiplicateur).toFixed(2)} €
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="conf-totals">
                            <div className="row">
                                <span>Sous-total</span>
                                <span>{sousTotal.toFixed(2)} €</span>
                            </div>
                            <div className="row">
                                <span>Frais de livraison</span>
                                <span>{safeFrais === 0 ? "Gratuit" : `${safeFrais.toFixed(2)} €`}</span>
                            </div>
                            <div className="row total-row">
                                <span>TOTAL</span>
                                <span className="gold-text">{safeTotalTTC.toFixed(2)} € TTC</span>
                            </div>
                        </div>

                        {/* BOUTON "SUIVRE MA COMMANDE" REDIRIGEANT VERS "SUIVI" /MONCOMPTE.JSX */}
                        <div style={{marginTop: "30px"}}>
                            <Link
                                to="/mon-compte"
                                state={{ activeTab: 'suivi' }}
                                className="btn-gold-full"
                            >
                                SUIVRE MA COMMANDE
                            </Link>
                        </div>
                    </article>

                </div>

                {/* COLONNE DROITE (SIDEBAR) */}
                <aside className="conf-sidebar">

                    {/* RETOUR A LA BOUTIQUE */}
                    <article className="sidebar-card discover-card">
                        <h3>DÉCOUVREZ AUSSI</h3>
                        <p>Continuez vos achats et découvrez notre sélection de cafés et thés d'exception.</p>
                        <Link to="/boutique" className="btn btn-secondary">
                            Retour à la boutique →
                        </Link>
                    </article>

                    {/* BESOIN D'AIDE */}
                    <article className="sidebar-card help-card">
                        <h3>BESOIN D'AIDE ?</h3>
                        <p>Une question concernant votre commande ? Notre équipe est à votre écoute pour vous aider.</p>
                        <Link to="/contact" className="btn btn-primaire">Nous contacter →</Link>
                    </article>
                </aside>

            </section>
        </main>
    );
};

export default Confirmation;