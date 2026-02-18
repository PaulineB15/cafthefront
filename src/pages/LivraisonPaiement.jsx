import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import "./LivraisonPaiement.css";

// Import des assets
import Package from "../assets/picto/package.svg";
import Location from "../assets/picto/location.svg";
import Creditcard from "../assets/picto/creditcard.svg";
import Store from "../assets/picto/store.svg";
import Lock from "../assets/picto/lock.svg";
import HeroPanier from "../assets/photo/HeroPanier.webp";

const LivraisonPaiement = () => {
    // Récupération les données du panier, du total et de la fonction de vider le panier après paiement(clearCart)
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    // State pour le mode de livraison et paiement
    const [deliveryMode, setDeliveryMode] = useState('domicile'); // 'domicile' ou 'boutique'
    const [paymentMode, setPaymentMode] = useState('cb'); // 'cb' ou 'paypal'
    const [carrier, setCarrier] = useState('colissimo'); // Colissimo (par défaut) ou UPS

    // State pour le formulaire
    const [formData, setFormData] = useState({
        prenom: '', nom: '', email: '', telephone: '',
        adresse: '', complement: '', codePostal: '', ville: '', pays: 'France'
    });

    // SECURITE: Redirection si panier vide
    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate("/boutique");
        }
    }, [cart, navigate]);
    // Si pas de panier, on ne rend rien (le useEffect redirigea)
    if (!cart || cart.length === 0) return null;


    // --- LOGIQUE DE CALCUL DES FRAIS ---
    let fraisLivraison = 0

    if (deliveryMode === 'boutique') {
        fraisLivraison = 0;
    } else {
        // Mode " Domicile"
        if (carrier === 'ups') {
        fraisLivraison = 9.90; // Frais de port UPS
        } else {
            // Colissimo: Gratuit si > 50euros, sinon 4.90euros
         fraisLivraison = cartTotal > 50 ? 0 : 4.90;}
    }

    const totalFinal = cartTotal + fraisLivraison;

    // --- HANDLERS ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // GERER LE CHANGEMENT DE TRANSPORTEUR
    const handleCarrierChange = (e) => {
        setCarrier(e.target.value);
    }

    // GERER LE PAYMENT
    const handlePayment = async (e) => {
        e.preventDefault();

        // Préparation des données de l'API
        const orderData = {
            montant_total: parseFloat(totalFinal.toFixed(2)),
            produits: cart.map(item => ({ id_produit: item.id, quantite: item.quantite })),
        };

        console.log("Données envoyées:", orderData);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            // 2. Envoi à l'API
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // pas de Header d'authorization (les cookies s'en chargent)
                },
                credentials: "include", // <--- Envoi le cookie de session
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                // 3. SI C'EST BON : On vide le panier et on redirige
                clearCart();
                navigate("/confirmation");
            } else {
                alert("Erreur lors de la commande.");
            }

        } catch (error) {
            console.error("Erreur serveur", error);
        }
    };

    return (
        <main className="commande-page">
            <section className="hero-panier" style={{backgroundImage: `url(${HeroPanier})`}}>
                <div className="hero-overlay">
                    <h1>LIVRAISON ET PAIEMENT</h1>
                </div>
            </section>

            <div className="commande-container">

                {/* --- COLONNE GAUCHE --- */}
                <div className="commande-left">

                    {/* 1. MODE DE LIVRAISON */}
                    <section className="checkout-section">
                        <header className="section-header">
                            <img src={Package} alt="" className="section-icon" aria-hidden="true"/>
                            <h2>MODE DE LIVRAISON</h2>
                        </header>

                        <fieldset className="options-grid">
                            <legend className="sr-only">Choisissez votre mode de livraison</legend>

                            {/* OPTION 1 : DOMICILE */}
                            <label className={`option-card ${deliveryMode === 'domicile' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="livraison"
                                    value="domicile"
                                    checked={deliveryMode === 'domicile'}
                                    onChange={() => setDeliveryMode('domicile')}
                                />
                                <div className="option-icon-wrapper">
                                    {/* Le CSS force ce SVG en blanc */}
                                    <img src={Location} alt="" />
                                </div>
                                <div className="option-info">
                                    <p className="option-title">LIVRAISON À DOMICILE</p>
                                    <p className="option-desc">Colissimo - 48h</p>
                                    <span className="option-price">
                                        {/* Affiche le prix dynamique selon le sous-choix */}
                                        {carrier === 'ups' ? "9.90 €" : (cartTotal > 50 ? "Gratuit" : "4.90 €")}
                                    </span>
                                </div>
                            </label>

                            {/* OPTION 2 : BOUTIQUE */}
                            <label className={`option-card ${deliveryMode === 'boutique' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="livraison"
                                    value="boutique"
                                    checked={deliveryMode === 'boutique'}
                                    onChange={() => setDeliveryMode('boutique')}
                                />
                                <div className="option-icon-wrapper">
                                    {/* Le CSS force ce SVG en blanc */}
                                    <img src={Store} alt="" />
                                </div>
                                <div className="option-info">
                                    <p className="option-title">RETRAIT EN BOUTIQUE</p>
                                    <p className="option-desc">Disponible sous 24H</p>
                                    <span className="option-price">Gratuit</span>
                                </div>
                            </label>
                        </fieldset>

                        {/* Choix Transporteur (Affiché seulement si Domicile) */}
                        {deliveryMode === 'domicile' && (
                            <div className="carrier-choice">
                                <label htmlFor="carrier">Choix du transporteur :</label>
                                <select id="carrier" name="carrier" className="input-select" value={carrier} onChange={handleCarrierChange}>
                                    <option value="colissimo">Colissimo (Standard) - {cartTotal > 50 ? "Offert" : "4.90 €"}</option>
                                    <option value="ups">UPS (Express) - 9.90 €</option>
                                </select>
                            </div>
                        )}
                    </section>

                    {/* 2. ADRESSE DE LIVRAISON (CONDITION SI DOMICILE) */}
                    {deliveryMode === 'domicile' && (
                        <section className="checkout-section fade-in">
                            <header className="section-header">
                                <img src={Location} alt="" className="section-icon" aria-hidden="true"/>
                                <h2>ADRESSE DE LIVRAISON</h2>
                            </header>

                            <form id="checkout-form" onSubmit={handlePayment}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="prenom">Prénom *</label>
                                        <input type="text" id="prenom" name="prenom" required onChange={handleChange} placeholder="Jean" />
                                        {/*Required => Champs obligatoire*/}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nom">Nom *</label>
                                        <input type="text" id="nom" name="nom" required onChange={handleChange} placeholder="Dupont" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        <input type="email" id="email" name="email" required onChange={handleChange} placeholder="jean.dupont@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telephone">Téléphone *</label>
                                        <input type="tel" id="telephone" name="telephone" required onChange={handleChange} placeholder="06 12 34 56 78" />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="adresse">Adresse *</label>
                                    <input type="text" id="adresse" name="adresse" required onChange={handleChange} placeholder="123 Rue de la Paix" />
                                </div>

                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label htmlFor="codePostal">Code postal *</label>
                                        <input type="text" id="codePostal" name="codePostal" required onChange={handleChange} placeholder="75001" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ville">Ville *</label>
                                        <input type="text" id="ville" name="ville" required onChange={handleChange} placeholder="Paris" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pays">Pays *</label>
                                        <input type="text" id="pays" name="pays" value="France" readOnly />
                                    </div>
                                </div>
                            </form>
                        </section>
                    )}

                    {/* 3. PAIEMENT */}
                    <section className="checkout-section">
                        <header className="section-header">
                            <img src={Creditcard} alt="" className="section-icon" aria-hidden="true"/>
                            <h2>MÉTHODE DE PAIEMENT</h2>
                        </header>

                        {/* MÊME STRUCTURE QUE LA LIVRAISON : Fieldset + Labels */}
                        <fieldset className="options-grid">
                            <legend className="sr-only">Choisissez votre moyen de paiement</legend>

                            {/* OPTION 1 : CARTE BANCAIRE */}
                            <label className={`option-card ${paymentMode === 'cb' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paiement"
                                    value="cb"
                                    checked={paymentMode === 'cb'}
                                    onChange={() => setPaymentMode('cb')}
                                />
                                <div className="option-info full-center">
                                    <div className="payment-label">
                                        <p className="option-title">CARTE BANCAIRE</p>
                                    </div>
                                    <p className="option-desc">Visa, Mastercard</p>
                                </div>
                            </label>

                            {/* OPTION 2 : PAYPAL */}
                            <label className={`option-card ${paymentMode === 'paypal' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paiement"
                                    value="paypal"
                                    checked={paymentMode === 'paypal'}
                                    onChange={() => setPaymentMode('paypal')}
                                />
                                <div className="option-info full-center">
                                    <div className="payment-label">
                                        <p className="option-title">PAYPAL</p>
                                    </div>
                                    <p className="option-desc">Paiement sécurisé</p>
                                </div>
                            </label>
                        </fieldset>

                        <div className="payment-security">
                            <img src={Lock} alt="" className="lock-icon" />
                            <p>Paiement 100% sécurisé et crypté</p>
                        </div>
                    </section>

                    <div className="continue-shopping">
                        <Link to="/Panier">← Retour au panier</Link>
                    </div>
                </div>


                {/* --- COLONNE DROITE : RÉCAPITULATIF --- */}
                <div className="commande-right">
                    <div className="order-summary-box">
                        <h3>Récapitulatif</h3>

                        <div className="summary-items-list">
                            {cart.map(item => (
                                <div key={item.cartId} className="mini-item">
                                    <p className="item-name">{item.quantite}x {item.nom}</p>
                                    <span className="item-price">
                                        {((item.isVrac ? item.prix * item.poids : item.prix) * item.quantite).toFixed(2)} €
                                    </span>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="summary-line">
                            <span>Sous-total</span>
                            <span>{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="summary-line">
                            <span>Livraison</span>
                            <span style={{color: fraisLivraison === 0 ? '#27ae60' : 'inherit'}}>
                                {fraisLivraison === 0 ? "Gratuit" : `${fraisLivraison.toFixed(2)} €`}
                            </span>
                        </div>

                        <div className="summary-total">
                            <span>TOTAL</span>
                            <span>{totalFinal.toFixed(2)} €</span>
                        </div>

                        <button
                            type={deliveryMode === 'domicile' ? "submit" : "button"}
                            form={deliveryMode === 'domicile' ? "checkout-form" : undefined}
                            onClick={deliveryMode === 'boutique' ? handlePayment : undefined}
                            className="btn-pay"
                        >
                            PAYER {totalFinal.toFixed(2)} €
                        </button>

                        <p className="legal-text">
                            En validant votre commande, vous acceptez nos <Link to="/cgv">CGV</Link>.
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default LivraisonPaiement;