import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx"; // Pour vérifier si connecté
import HeroPanier from "../assets/photo/HeroPanier.webp";
import "./Panier.css";

// Petites icônes SVG pour la corbeille et les boutons
const TrashIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
);

const Panier = () => {
    // 1. On récupère les données du Panier
    const { cart, updateQuantite, removeFromCart, cartTotal } = useContext(CartContext);

    // 2. On récupère l'utilisateur pour le bouton "Passer la commande"
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // 3. Gestion du Code Promo (Local à cette page)
    const [promoCode, setPromoCode] = useState("");
    const [remise, setRemise] = useState(0); // Montant de la remise
    const [messagePromo, setMessagePromo] = useState("");

    // --- LOGIQUE DES CALCULS ---
    const fraisLivraison = cartTotal > 50 ? 0 : 4.90;
    const totalFinal = cartTotal + fraisLivraison - remise;

    // Fonction pour appliquer le code promo
    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === "BIENVENUE20") {
            const montantRemise = cartTotal * 0.20; // 20%
            setRemise(montantRemise);
            setMessagePromo("Code promo appliqué : -20%");
        } else {
            setRemise(0);
            setMessagePromo("Code promo invalide");
        }
    };

    // Fonction pour passer la commande
    const handleCheckout = () => {
        if (cart.length === 0) return;

        if (isAuthenticated) {
            navigate("/commande"); // Vers la page livraison/paiement (à créer plus tard)
        } else {
            // On l'envoie se connecter, mais on lui dit de revenir ici après !
            navigate("/login");
        }
    };

    // --- GESTION IMAGE ---
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    return (
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
                        <Link to="/boutique" className="btn-gold">Retourner à la boutique</Link>
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
                                            <span className="unit-price">{prixUnitaire.toFixed(2)} € / unit</span>
                                            <span className="total-row-price">{totalLigne.toFixed(2)} €</span>
                                        </div>

                                        {/* Supprimer */}
                                        <button className="btn-delete" onClick={() => removeFromCart(item.cartId)}>
                                            <TrashIcon />
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
                            <h2>RÉCAPITULATIF</h2>

                            {/* Code Promo */}
                            <div className="promo-code">
                                <label>CODE PROMO</label>
                                <div className="promo-input-group">
                                    <input
                                        type="text"
                                        placeholder="Code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button onClick={handleApplyPromo}>APPLIQUER</button>
                                </div>
                                {messagePromo && <p className="promo-msg">{messagePromo}</p>}
                            </div>

                            <hr />

                            <div className="summary-row">
                                <span>Sous-total</span>
                                <span>{cartTotal.toFixed(2)} €</span>
                            </div>

                            {remise > 0 && (
                                <div className="summary-row promo">
                                    <span>Remise</span>
                                    <span>- {remise.toFixed(2)} €</span>
                                </div>
                            )}

                            <div className="summary-row">
                                <span>Frais de livraison</span>
                                <span>{fraisLivraison === 0 ? "Gratuit" : `${fraisLivraison} €`}</span>
                            </div>
                            {fraisLivraison > 0 && <p className="free-shipping-hint">Livraison gratuite dès 50€</p>}

                            <div className="summary-total">
                                <span>TOTAL</span>
                                <span className="total-price">{totalFinal.toFixed(2)} € TTC</span>
                            </div>

                            <button className="btn-checkout" onClick={handleCheckout}>
                                PASSER LA COMMANDE →
                            </button>

                            <div className="secure-payment">
                                <p>🔒 Paiement 100% sécurisé</p>
                                <p className="small">Carte bancaire, PayPal, Virement</p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}

export default Panier;