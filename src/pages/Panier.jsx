import React, { useContext, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext } from "../context/AuthContext.jsx"; // Pour vérifier si connecté
import HeroPanier from "../assets/photo/HeroPanier.webp";
import Corbeille from "../assets/picto/Corbeille.svg";
import "./Panier.css";
import Lock from "../assets/picto/lock.svg";


const Panier = () => {
    // 1. On récupère les données du Panier
    const { cart, updateQuantite, removeFromCart, cartTotal } = useContext(CartContext);

    // 2. On récupère l'utilisateur pour le bouton "Passer la commande"
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // 3. Gestion du Code Promo (Local à cette page)
    const [promoCode, setPromoCode] = useState("");
    const [isPromoValid, setIsPromoValid] = useState(false); // On stocke si le code est valide ou non
    const [messagePromo, setMessagePromo] = useState("");


    // --- LOGIQUE DES CALCULS (Automatique) ---
    // 1. Calcul de la remise (Si code valide : 20% du total, sinon 0)
    const montantRemise = isPromoValid ? (cartTotal * 0.20) : 0;

    // 2. Frais de port (Gratuit si > 50€ APRES remise ou AVANT remise ? Souvent avant)
    // Ici : Gratuit si le sous-total dépasse 50€
    const fraisLivraison = cartTotal > 50 ? 0 : 4.90;

    // 3. Total final
    const totalFinal = cartTotal + fraisLivraison - montantRemise;

    // Fonction pour vérifier le code
    const handleApplyPromo = () => {
        if (promoCode.trim().toUpperCase() === "BIENVENUE20") {
            setIsPromoValid(true);
            setMessagePromo("Code promo appliqué : -20%");
        } else {
            setIsPromoValid(false);
            setMessagePromo("Code promo invalide");
        }
    };

    // Fonction pour passer la commande
    const handleCheckout = () => {
        if (cart.length === 0) return;

        // Est-ce que l'utilisateur est identifié ?
        if (isAuthenticated) {
            // Situation 1: OUI, il est déjà connecté - Direct sur commande
            navigate("/commande");
            // Situation 2: NON, il n'est pas connecté. Login
        } else {
            // Diriger l'utilisateur pour se connecter sur son compte avant de passer commande
            // Ajout d'un "state" pour dire qu'on voulait aller à la page LivraisonPaiement.jsx
            // Le but ici est de dire "Va te connecter mais souviens-toi que tu voulais aller sur l'url cafthe/commande (Route dans APP.JSX)
            navigate("/login", {state: {from:"/commande"}});
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

                            <button className="btn-checkout" onClick={handleCheckout}>
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
    );
}

export default Panier;