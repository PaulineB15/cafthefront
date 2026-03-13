
// IMPORT DES OUTILS REACT

import React, { useEffect } from 'react';
// useLocation : l'outil magique pour lire les données invisibles (le "post-it") passées par la page précédente
// useNavigate : l'outil pour forcer le client à changer de page (redirection de sécurité)
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Confirmation.css";

// IMPORT PHOTOS + PICTO
import HeroPanier from "../assets/photo/HeroPanier.webp";
import ConfirmationIcon from "../assets/picto/comande-confirmer.svg";
import Package from "../assets/picto/package.svg";
import Mail from "../assets/picto/mail1.svg";


const Confirmation = () => {
    // RÉCUPÈRER LES DONNÉES ENVOYÉES PAR LA PAGE DE PAIEMENT --
    const location = useLocation();
    const navigate = useNavigate();
    // orderData contient TOUTES les infos envoyées par LivraisonPaiement (Nom, Email, Total, Produits...)
    const orderData = location.state;

    // GESTION DE LA SÉCURITÉ ET DE L'AFFICHAGE --
    useEffect(() => {
        // Force la page à s'afficher tout en haut (parfois React garde le scroll en bas)
        window.scrollTo(0, 0);

        // Sécurité : Redirection si pas de commande
        if (!orderData) {
            navigate('/boutique');
        }
    }, [orderData, navigate]);

    // Si pas de données, on affiche ce message le temps d'être redirigé par le useEffect
    if (!orderData) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0F0F0F", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <h2>Redirection en cours...</h2>
            </div>
        );
    }

    //  CALCULS DES PRIX

    // Extrait les valeurs avec une sécurité (|| 0) au cas où il y aurait un bug
    const safeTotalTTC = orderData.totalTTC || 0;
    const safeFrais = orderData.fraisLivraison || 0;
    const remiseMontant = orderData.remiseMontant || 0; // Récupération de la promo

    // Sous-total = Total Final - frais de port + remise (20%)
    const sousTotal = safeTotalTTC - safeFrais + remiseMontant;




    return (

        <main className="confirmation-page">

            {/* HERO SECTION  */}

            <section className="hero-conf">
                {/* Image de fond (Couche 1) */}
                <img
                    src={HeroPanier}
                    alt="Photo d'ambiance du panier"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"
                />

                {/* Filtre sombre (Couche 2) */}
                <div className="hero-conf-filtre">
                    {/* Contenu textuel et Icone (Couche 3) */}
                    <div className="hero-conf-entete">
                        <img src={ConfirmationIcon} alt="Icône de confirmation" className="conf-icone" />
                        <h1>COMMANDE CONFIRMÉE !</h1>
                        <p className="conf-texte">Merci {orderData.prenom || "Client"}. Votre commande a été enregistrée avec succès.</p>

                        <div className="conf-badge">
                            <span>NUMÉRO DE COMMANDE</span>
                            <strong>{orderData.numeroCommande || "CFT-XXXX"}</strong>
                        </div>
                    </div>
                </div>
            </section>


            {/* GRID (2 Colonnes) */}
            <section className="confirmation-container">

                {/* COLONNE GAUCHE (principal) */}
                <div className="conf-main">
                    {/* 1. CONFIRMATION EMAIL */}
                    <article className="conf-card email-box">
                        <div className="card-header">
                            <img src={Mail} alt="Icône mail" aria-hidden="true"/>
                            <h2>CONFIRMATION PAR EMAIL</h2>
                        </div>
                        <p>Un email de confirmation a été envoyé à <span className="gold-text">{orderData.email || "votre adresse"}</span></p>
                    </article>

                    {/* 2. RÉCAPITULATIF DE LA COMMANDE */}
                    <article className="conf-card recap-box">
                        <div className="card-header">
                            <img src={Package} alt="Icône colis" aria-hidden="true" className="icon-gold-img" />
                            <h2>RÉCAPITULATIF DE LA COMMANDE</h2>
                        </div>

                        <div className="conf-items-list">
                            {/* Boucle sur les produits achetés pour les afficher */}
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
                                            {/* Prix de la ligne */}
                                            {(prixItem * quantite * poidsMultiplicateur).toFixed(2)} €
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* 3. TOTAUX + PROMO */}
                        <div className="conf-totals">
                            <div className="row">
                                <span>Sous-total</span>
                                <span>{sousTotal.toFixed(2)} €</span>
                            </div>
                            {/* AFFICHAGE DE LA PROMO : Ne s'affiche que si la remise est supérieure à 0 */}
                            {remiseMontant > 0 && (
                                <div className="row" style={{ color: '#27ae60' }}>
                                    <span>Remise Code Promo</span>
                                    <span>-{remiseMontant.toFixed(2)} €</span>
                                </div>
                            )}
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
                                className="btn-gold-full">
                                SUIVRE MA COMMANDE
                            </Link>
                        </div>
                    </article>

                </div>

                {/* COLONNE DROITE */}
                <aside className="conf-sidebar">

                    {/* RETOUR A LA BOUTIQUE */}
                    <article className="sidebar-card discover-card">
                        <h3>DÉCOUVREZ AUSSI</h3>
                        <p>Continuez vos achats et découvrez notre sélection de cafés et thés d'exception.</p>
                        <Link to="/boutique" className="btn btn-secondaire">
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