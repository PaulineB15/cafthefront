
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


        // CONDITION: Est-ce que l'utilisateur est identifié ?
        if (isAuthenticated) {
            // Situation 1: OUI, il est déjà connecté -> LivraisonPaiement.jsx (avec le prix total, remise, livraison, etc.)
            navigate("/commande", {state: checkoutState});
            // Situation 2: NON, il n'est pas connecté. Login
        } else {
            // Diriger l'utilisateur sur login.jsx avant de passer commande
            navigate("/login", {state: checkoutState});
        }
    };

    // Adresse API pour récupérer les images
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";



    // ---- CE QUI S'AFFICHE A L'ECRAN ----


    return (

        <main className="panier-page">

            <section className="hero-panier">
                <img
                    src={HeroPanier}
                    alt="Photo d'ambiance du panier"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"
                />

                <div className="hero-panier-filtre">
                    <div className="hero-panier-entete">
                        <h1>MON PANIER</h1>
                    </div>
                </div>
            </section>

            <section className="panier-container">

                {/* SI LE PANIER EST VIDE */}
                {cart.length === 0 ? (
                    <div className="panier-vide">
                        <p>Votre panier est vide pour le moment.</p>
                        <Link to="/boutique" className="button">Retourner à la boutique</Link>
                    </div>
                ) : (
                    <div className="panier-contenu">

                        {/* COLONNE GAUCHE : LISTE DES PRODUITS */}
                        <div className="cart-items">
                            {/* Boucle (.map) pour créer une ligne par produit */}
                            {cart.map((item) => {
                                // Calcul du prix spécifique pour cette ligne (Vrac vs Unité)
                                const prixUnitaire = item.isVrac ? (item.prix * item.poids) : item.prix;
                                const totalLigne = prixUnitaire * item.quantite;

                                const imageUrl = item.image
                                    ? `${apiUrl}/images/${item.image}`
                                    : "https://via.placeholder.com/100";


                                return (

                                    // Carte produit
                                    <div key={item.cartId} className="cart-item">
                                        {/* Image */}
                                        <div className="produit-image">
                                            <img src={imageUrl} alt={item.nom} />
                                        </div>

                                        {/* Infos produit */}
                                        <div className="item-info">
                                            <span className="produit-categorie">{item.categorie} {item.isVrac ? 'En Vrac' : ''}</span>
                                            <h3>{item.nom}</h3>
                                            <span className="poids-produit">
                                                {/* Multiplie par 1000 pour transformer les kilos (0.25) en grammes (250g) pour le client */}
                                                {item.isVrac ? `Poids : ${item.poids * 1000}g` : 'Unité'}
                                            </span>
                                        </div>

                                        {/* Quantité */}
                                        <div className="produit-quantite">
                                            {/* Modificateur de quantité connecté via CartContext */}
                                            <label>Quantité :</label>
                                            <div className="quantite-compteur">
                                                <button onClick={() => updateQuantite(item.cartId, -1)}>-</button>
                                                <span>{item.quantite}</span>
                                                <button onClick={() => updateQuantite(item.cartId, 1)}>+</button>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="produit-prix">
                                            {/* toFixed(2) pour forcer l'affichage de 2 chiffres après la virgule */}
                                            <span className="total-prix">{totalLigne.toFixed(2)} €</span>
                                            <span>{item.isVrac ? ` / ${item.poids * 1000}g`:' / unité'}</span>
                                        </div>

                                        {/* Supprimer */}
                                        <button className="btn-supprimer" onClick={() => removeFromCart(item.cartId)}
                                            aria-label="Supprimer le produit du panier">
                                            <img src={Corbeille} alt="Pictogramme supprimer" className="poubelle-picto" />
                                        </button>
                                    </div>
                                );
                            })}
                            <div className="continue-achat">
                                <Link to="/boutique">← Continuer mes achats</Link>
                            </div>
                        </div>


                        {/* COLONNE DROITE : RÉCAPITULATIF + PAIEMENT */}
                        <aside className="panier-summary">
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

                            <div className="panier-total">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>

                            {/* Affichage conditionnel de la remise - Uniquement si le code est bon*/}
                            {isPromoValid && (
                                <div className="panier-total promo">
                                    <span>Remise (20%)</span>
                                    <span> {montantRemise.toFixed(2)} €</span>
                                </div>
                            )}

                            <div className="panier-total">
                                <span>Frais de livraison</span>
                                {/* Si frais de livraison 0 = Gratuit en toutes lettres, sinon on affiche le prix */}
                                <span>{fraisLivraison === 0 ? "Gratuit" : `${fraisLivraison} €`}</span>
                            </div>

                            {fraisLivraison > 0 &&
                                <p className="livraison-gratuite">
                                    (Gratuit dès 50€)
                                </p>
                            }

                            {/* Total du panier */}
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
                        </aside>

                    </div>
                )}
            </section>
        </main>


    );
}

export default Panier;