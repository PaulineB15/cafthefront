
// IMPORT DES OUTILS REACT

import React, { useContext, useState } from 'react';
// useNavigate : Force le navigateur à changer de page (ex: aller au paiement)
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx"; // Panier pour les produits
import { AuthContext } from "../context/AuthContext.jsx"; // Pour vérifier si le client est connecté

// IMPORT PHOTOS + PICTO
import HeroPanier from "../assets/photo/HeroPanier.webp";
import Corbeille from "../assets/picto/Corbeille.svg";
import Lock from "../assets/picto/lock.svg";
import "../styles/Panier.css";


const Panier = () => {
    // -- CARTCONTEXT + AUTHCONTEXT --

    // 1. Récupèrer les données du Panier (la liste, les fonctions pour modifier/supprimer, et le total)
    const { cart, updateQuantite, removeFromCart, cartTotal } = useContext(CartContext);
    // 2. Récupèrer le statut de connexion (Vrai/Faux) de l'utilisateur
    const { isAuthenticated } = useContext(AuthContext);

    const navigate = useNavigate();

    // --- CRÉATION DE LA MÉMOIRE (STATES) POUR LE CODE PROMO---
    // Ces données ne concernent QUE cette page -> utilise useState locaux.
    const [promoCode, setPromoCode] = useState(""); // Ce que le client tape dans le champ
    const [isPromoValid, setIsPromoValid] = useState(false); // // Est-ce que le code est bon ?
    const [messagePromo, setMessagePromo] = useState(""); //Le texte vert ou rouge à afficher


    // --- CALCULS POUR LA REMISE PROMO ---

    // 1. Calcul de la remise (Si code valide -> 20% du total, sinon (:) 0€)
    const montantRemise = isPromoValid ? (cartTotal * 0.20) : 0;
    // 2. Frais de port (Gratuit si > 50€ APRES remise ou AVANT remise ? Souvent avant)
    // Ici : Gratuit si le sous-total dépasse 50€
    const fraisLivraison = cartTotal > 50 ? 0 : 4.90;
    // 3. Total final : total brut + livraison - la réduction
    const totalFinal = cartTotal + fraisLivraison - montantRemise;



    // Fonction pour vérifier si le code est correct
    const handleApplyPromo = () => {
        // .trim() enlève les espaces inutiles tapés par erreur.
        // .toUpperCase() met en majuscules pour éviter les erreurs minuscules/majuscules
        if (promoCode.trim().toUpperCase() === "BIENVENUE20") {
            setIsPromoValid(true);
            setMessagePromo("Code promo appliqué : -20%");
        } else {
            setIsPromoValid(false);
            setMessagePromo("Code promo invalide");
        }
    };

    // Fonction pour passer la commande (Bouton = "passer commande")
    const Checkout = () => {
        if (cart.length === 0) return; // Si le panier est vide = pas de commande

        // Transmet les données de la remise promo vers la page de commande
        const checkoutState = {
            from: "/commande",
            promoApplied: isPromoValid, // // Est-ce qu'il y a une promo ?
            remiseMontant: montantRemise, // Le montant exact de la promo calculée ici
            codePromo: promoCode // Le nom du code ("BIENVENUE20")
        };


        // Est-ce que l'utilisateur est identifié ?
        if (isAuthenticated) {
            // Situation 1: OUI, il est déjà connecté - Direct sur commande
            navigate("/commande", {state: checkoutState});
            // Situation 2: NON, il n'est pas connecté. Login
        } else {
            // Diriger l'utilisateur pour se connecter sur son compte avant de passer commande
            // Ajout d'un "state" pour dire qu'on voulait aller à la page LivraisonPaiement.jsx
            // Le but ici est de dire "Va te connecter mais souviens-toi que tu voulais aller sur l'url cafthe/commande (Route dans APP.JSX)
            navigate("/login", {state: checkoutState});
        }
    };

    // --- GESTION IMAGE ---
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


    // ---- CE QUI S'AFFICHE A L'ECRAN ----


    return (
        <>
            <title>Panier - CafThé</title>
            <meta name="description" content="Page panier d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, panier, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main className="panier-page">
            <section className="hero-panier" style={{backgroundImage: `url(${HeroPanier})`}}>
                <div className="hero-overlay">
                    <h1>MON PANIER</h1>
                </div>
            </section>

            <div className="panier-container">

                {/* SI LE PANIER EST VIDE */}
                {cart.length === 0 ? (
                    <div className="empty-cart">
                        <p>Votre panier est vide pour le moment.</p>
                        <Link to="/boutique" className="button">Retourner à la boutique</Link>
                    </div>
                ) : (
                    <div className="panier-content">

                        {/* COLONNE GAUCHE : LISTE DES PRODUITS */}
                        <div className="cart-items">
                            {cart.map((item) => {
                                // Calcul du prix de la ligne (ex: 2 paquets à 9€ = 18€)
                                const prixUnitaire = item.isVrac ? (item.prix * item.poids) : item.prix;
                                const totalLigne = prixUnitaire * item.quantite;

                                const imageUrl = item.image
                                    ? `${apiUrl}/images/${item.image}`
                                    : "https://via.placeholder.com/100";

                                return (

                                    <div key={item.cartId} className="cart-item">
                                        {/* Image */}
                                        <div className="item-image">
                                            <img src={imageUrl} alt={item.nom} />
                                        </div>

                                        {/* Infos */}
                                        <div className="item-info">
                                            <span className="item-type">{item.categorie} {item.isVrac ? 'En Vrac' : ''}</span>
                                            <h3>{item.nom}</h3>
                                            <span className="item-weight">
                                                {item.isVrac ? `Poids : ${item.poids * 1000}g` : 'Unité'}
                                            </span>
                                        </div>

                                        {/* Quantité */}
                                        <div className="item-quantity">
                                            <label>Quantité :</label>
                                            <div className="qty-selector">
                                                <button onClick={() => updateQuantite(item.cartId, -1)}>-</button>
                                                <span>{item.quantite}</span>
                                                <button onClick={() => updateQuantite(item.cartId, 1)}>+</button>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="item-price">
                                            {/*<span className="unit-price">{prixUnitaire.toFixed(2)} € / unité</span>*/}
                                            <span className="total-row-price">{totalLigne.toFixed(2)} €</span>
                                            <span>{item.isVrac ? ` / ${item.poids * 1000}g`:' / unité'}</span>
                                        </div>

                                        {/* Supprimer */}
                                        <button className="btn-delete" onClick={() => removeFromCart(item.cartId)}
                                        aria-label="Supprimer le produit du panier">

                                            <img src={Corbeille} alt="Pictogramme supprimer" className="trash-icon-img" />
                                        </button>
                                    </div>
                                );
                            })}
                            <div className="continue-shopping">
                                <Link to="/boutique">← Continuer mes achats</Link>
                            </div>
                        </div>


                        {/* COLONNE DROITE : RÉCAPITULATIF */}
                        <div className="cart-summary">
                            <h2>Récapitulatif</h2>

                            {/* Code Promo */}
                            <div className="promo-code-panier">
                                <label>CODE PROMO</label>
                                <div className="promo-panier-group">
                                    <input
                                        type="text"
                                        placeholder="Code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button onClick={handleApplyPromo}>APPLIQUER</button>
                                </div>
                                {/* Message de succès ou d'erreur */}
                                {messagePromo && (
                                    <p className="promo-msg" style={{color: isPromoValid ? '#27ae60' : '#e74c3c'}}>
                                        {messagePromo}
                                    </p>
                                )}
                            </div>

                           <hr className="separator"/>

                            <div className="summary-row">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>

                            {/* Affichage conditionnel de la remise */}
                            {isPromoValid && (
                                <div className="summary-row promo">
                                    <span>Remise (20%)</span>
                                    <span> {montantRemise.toFixed(2)} €</span>
                                </div>
                            )}

                            <div className="summary-row">
                                <span>Frais de livraison</span>
                                <span>{fraisLivraison === 0 ? "Gratuit" : `${fraisLivraison} €`}</span>
                            </div>

                            {fraisLivraison > 0 &&
                                <p className="free-shipping-hint">
                                    (Gratuit dès 50€)
                                </p>
                            }

                            <div className="summary-total">
                                <span>TOTAL</span>
                                <span className="total-price">{totalFinal.toFixed(2)} € TTC</span>
                            </div>

                            <button className="btn-checkout" onClick={Checkout}>
                                PASSER LA COMMANDE →
                            </button>

                            <div className="payment-security">
                                <img src={Lock} alt="" className="lock-icon" />
                                <p>Paiement 100% sécurisé et crypté</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
                                </>


    );
}

export default Panier;