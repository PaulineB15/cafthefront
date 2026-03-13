
// IMPORT DES OUTILS REACT

import React, { useContext, useState, useEffect } from 'react';
// useLocation : l'outil  -> Lire le state envoyé par le Panier/Login
import { Link, useNavigate, useLocation} from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import { AuthContext} from "../context/AuthContext.jsx";


// IMPORT PHOTOS + PICTO
import Package from "../assets/picto/package.svg";
import Location from "../assets/picto/location.svg";
import Creditcard from "../assets/picto/creditcard.svg";
import Store from "../assets/picto/store.svg";
import Lock from "../assets/picto/lock.svg";
import HeroPanier from "../assets/photo/HeroPanier.webp";
import "../styles/LivraisonPaiement.css";


// -- CARTCONTEXT + AUTHCONTEXT --

const LivraisonPaiement = () => {
    // Récupération les données du panier, du total et de la fonction de vider le panier après paiement(clearCart)
    const { cart, cartTotal, clearCart } = useContext(CartContext);
    // Récupérer les infos de l'utilisateur connecté (nom, adresse...) pour passer la commande
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

// --- RÉCUPÉRATION DE LA REMISE-PROMO ---

    // Récupèrer les infos de promo transmis par le login. S'il n'y a rien -> objet vide {}
    const promoInfo = location.state || {};
    // // On extrait le montant de la remise. Si pas de remise, c'est 0
    const remiseMontant = promoInfo.remiseMontant || 0;


    // --- CRÉATION DE LA MÉMOIRE (STATES) POUR LIVRAISON/PAIEMENT/TRANSPORTEUR/ FORMULAIRE ADRESSE ---

    const [deliveryMode, setDeliveryMode] = useState('domicile'); // 'domicile' ou 'boutique'
    const [paymentMode, setPaymentMode] = useState('cb'); // 'cb' ou 'paypal'
    const [carrier, setCarrier] = useState('colissimo'); // Colissimo (par défaut) ou UPS
    // Ce State stocke toutes les informations tapées dans le formulaire d'adresse
    const [formData, setFormData] = useState({
        prenom: '', nom: '', email: '', telephone: '',
        adresse: '', complement: '', codePostal: '', ville: '', pays: 'France', cvg: false

    });

    // --- PRE-REMPLISSAGE DU FORMULAIRE ADRESSE ---
    // Si l'utilisateur est connect2 -> éviter de retaper son adresse.
    useEffect(() => {
        // Condition : on vérifie (formData.email === '') pour être sûr de ne le remplir qu'UNE SEULE FOIS.
        // Sinon, React va le re-remplir en boucle à l'infini (Boucle infernale).
        if (user && formData.email === '') {
            setFormData(prevData => ({
                ...prevData, // Garder les données existantes (pays, cvg)
                prenom: user.prenom || '',
                nom: user.nom || '',
                email: user.email || '',
                telephone: user.tel || '',
                adresse: user.adresse_livraison || '',
                codePostal: user.cp_livraison || '',
                ville: user.ville_livraison || ''
            }));
        }
    }, [user, formData.email]); // On dit à React de surveiller ces deux variables



    // --- SECURITE: REDIRECTION SI PANIER VIDE ---
    useEffect(() => {
        if (!cart || cart.length === 0) {
            navigate("/boutique");
        }
    }, [cart, navigate]);

    // Si pas de panier, on ne rend rien (le useEffect redirigea)
    if (!cart || cart.length === 0) return null;



    // --- CALCUL DES FRAIS ---

    let fraisLivraison = 0;
    if (deliveryMode === 'boutique') {
        fraisLivraison = 0; // Retrait = gratuit
    } else {
        if (carrier === 'ups') {
            fraisLivraison = 9.90; // UPS = toujours payant
        } else {
            // // Colissimo = gratuit SI le total du panier dépasse 50€
            fraisLivraison = cartTotal > 50 ? 0 : 4.90;
        }
    }

    // Le total final prend en compte la remise reçue
    const totalFinal = cartTotal + fraisLivraison - remiseMontant;


    // --- GERER LE CHANGEMENT DE L'ADRESSE DE LIVRAISON  ---
    // Met à jour la mémoire du formulaire à chaque fois que le client tape une lettre
    const handleChange = (e) => {
        // CORRECTION ICI AUSSI : Permet de gérer la case à cocher CGV correctement
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        // [e.target.name] est dynamique (si on tape dans le champ 'ville', ça met à jour la case 'ville' du state)
    };

    // --- GéRER LE CHANGEMENT DE TRANSPORTEUR ---
    const handleCarrierChange = (e) => {
        setCarrier(e.target.value);
    }

    // --- GERER LE PAYMENT - VALIDATION DE LA COMMANDE ---

    const handlePayment = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger (comportement par défaut des formulaires)

        // Préparation des données vers l'API
        const orderData = {
            montant_total: parseFloat(totalFinal.toFixed(2)),
            // Transformer le panier complet en une petite liste simple : {id, quantite}
            produits: cart.map(item => ({ id_produit: item.id, quantite: item.quantite })),
        };

        // Sécurité pour l'email de confirmation (au cas où on est en retrait boutique)
        const emailConfirmation = formData.email || (user ? user.email : "");


        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

            // Appel le serveur (Fetch POST) pour sauvegarder la commande dans la base de données
            const response = await fetch(`${apiUrl}/api/orders`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include", // <--- Envoi le cookie de session
                body: JSON.stringify(orderData)
            });


            if (response.ok) {
                // On lit la réponse JSON envoyée par ton API (OrderController)
                const data = await response.json();

                // Récupère le vrai ID de la base de données pour faire un numéro de commande
                // Ex: Si l'ID est 1005, ça donnera "CFT-1005"
                const vraiNumeroCommande = "CFT-" + data.orderId;

                // REDIRIGE LE CLIENT VERS LA PAGE CONFIRMATION
                navigate("/confirmation", {
                    state: {
                        numeroCommande: vraiNumeroCommande,
                        email: emailConfirmation,           // L'email du client
                        prenom: formData.prenom || (user ? user.prenom : "Cher client"),
                        items: cart,                        // Contenu du panier
                        totalTTC: totalFinal,               // Prix total calculé
                        fraisLivraison: fraisLivraison,      // Les frais de livraison (0, 4.90 ou 9.90)
                        remiseMontant: remiseMontant // Remise 20%
                    }
                });


                // VIDER LE PANIER
                // Le setTimeout retarde l'action d'1/10ème de seconde.
                // Ça évite que l'affichage de la page actuelle ne "saute" pendant qu'on est redirigé
                setTimeout(() => {
                    clearCart();
                }, 100);


            } else {
                alert("Erreur lors de la commande.");
            }

        } catch (error) {
            console.error("Erreur serveur", error);
        }
    };


    // ---- CE QUI S'AFFICHE A L'ECRAN ----


    return (

        <>
            {/*REFERENCEMENT SEO */}
            <title>Commande - CafThé</title>
            <meta name="description" content="Page commande et paiement d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, site e-commerce, commande, haut de gamme, café, thé, produits de qualité"/>

        <main className="commande-page">

            <section className="hero-commande">
                <img
                    src={HeroPanier}
                    alt="Photo d'ambiance du panier"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"
                />

                <div className="hero-commande-filtre">
                    <div className="hero-commande-entete">
                        <h1>LIVRAISON ET PAIEMENT</h1>
                    </div>
                </div>
            </section>


            <form className="commande-container" onSubmit={handlePayment}>
                {/* COLONNE GAUCHE / FORMULAIRE */}
                <div>

                    {/* 1. MODE DE LIVRAISON */}
                    <section className="livraison-section">
                        <header className="section-header">
                            <img src={Package} alt="Icone d'un colis" className="livraison-icone" aria-hidden="true"/>
                            <h2>MODE DE LIVRAISON</h2>
                        </header>

                        <fieldset className="options-grid">
                            <legend className="sr-only">Choisissez votre mode de livraison</legend>


                            {/* OPTION 1 : DOMICILE */}
                            {/* La classe CSS 'active' s'ajoute dynamiquement si ce mode est sélectionné */}
                            <label className={`option-card ${deliveryMode === 'domicile' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="livraison"
                                    value="domicile"
                                    checked={deliveryMode === 'domicile'}
                                    onChange={() => setDeliveryMode('domicile')}
                                />
                                <div className="option-icon-wrapper">
                                    <img src={Location} alt="Icone de localisation" />
                                </div>
                                <div className="option-info">
                                    <p className="option-title">LIVRAISON À DOMICILE</p>
                                    <p className="option-desc">
                                        {carrier === 'ups' ? "UPS (Express) - 24h" : "Colissimo (Standard)- 72h"}
                                    </p>
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
                                    <img src={Store} alt="Icone d'une boutique" />
                                </div>
                                <div className="option-info">
                                    <p className="option-title">RETRAIT EN BOUTIQUE</p>
                                    <p className="option-desc">Disponible sous 24H</p>
                                    <span className="option-price">Gratuit</span>
                                </div>
                            </label>
                        </fieldset>


                        {/* MENU DÉROULANT : Choix Transporteur (N'apparaît QUE si Domicile est coché) */}
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
                    {/* Le formulaire entier disparaît si le client a choisi 'Retrait en boutique' */}
                    {deliveryMode === 'domicile' && (
                        <section className="livraison-section fade-in">
                            <header className="section-header">
                                <img src={Location} alt="" className="livraison-icone" aria-hidden="true"/>
                                <h2>ADRESSE DE LIVRAISON</h2>
                            </header>

                            {/* Formulaire d'adresse.
                                Note : onSubmit={handlePayment} permet de valider la commande si on tape "Entrée" au clavier */}

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="prenom">Prénom *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="text" id="prenom" name="prenom" required value={formData.prenom} onChange={handleChange} placeholder="Jean" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="nom">Nom *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="text" id="nom" name="nom" required value={formData.nom} onChange={handleChange} placeholder="Dupont" />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="email">Email *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} placeholder="jean.dupont@email.com" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="telephone">Téléphone *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="tel" id="telephone" name="telephone" required value={formData.telephone} onChange={handleChange} placeholder="06 12 34 56 78" />
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="adresse">Adresse *</label>
                                    {/*Required => Champs obligatoire*/}
                                    <input type="text" id="adresse" name="adresse" required value={formData.adresse} onChange={handleChange} placeholder="123 Rue de la Paix" />
                                </div>

                                <div className="form-row three-cols">
                                    <div className="form-group">
                                        <label htmlFor="codePostal">Code postal *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="text" id="codePostal" name="codePostal" required value={formData.codePostal} onChange={handleChange} placeholder="75001" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="ville">Ville *</label>
                                        {/*Required => Champs obligatoire*/}
                                        <input type="text" id="ville" name="ville" required value={formData.ville} onChange={handleChange} placeholder="Paris" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="pays">Pays</label>
                                        <input type="text" id="pays" name="pays" value="France" readOnly />
                                    </div>
                                </div>
                        </section>
                    )}

                    {/* 3. METHODE DE PAIEMENT */}
                    <section className="livraison-section">
                        <header className="section-header">
                            <img src={Creditcard} alt="" className="livraison-icone" aria-hidden="true"/>
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
                                <div className="option-info">
                                    <p className="option-title">CARTE BANCAIRE</p>
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
                                <div className="option-info">
                                    <p className="option-title">PAYPAL</p>
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


                {/*  COLONNE DROITE : RÉCAPITULATIF  */}
                <aside>
                    <div className="order-summary-box">
                        <h3>Récapitulatif</h3>
                        {/* LISTE DES PRODUITS EN PETIT FORMAT */}
                        <div className="summary-items-list">
                            {cart.map(item => (
                                <div key={item.cartId} className="mini-item">
                                    <p>{item.quantite}x {item.nom}</p>
                                    <span>
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

                        {/* AFFICHAGE CONDITIONNEL : La ligne Code Promo apparaît uniquement s'il y en a un */}
                        {remiseMontant > 0 && (
                            <div className="summary-line" style={{ color: '#27ae60' }}>
                                <span>Remise Code Promo</span>
                                <span>-{remiseMontant.toFixed(2)} €</span>
                            </div>
                        )}

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
                                type="submit" /* Obligatoire pour déclencher la bulle orange */
                                className="btn-pay">
                                PAYER {totalFinal.toFixed(2)} €
                            </button>

                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id="cvg"
                                    name="cvg"
                                    checked={formData.cvg}
                                    onChange={handleChange}
                                    required /* Active la bulle native */
                                />
                                <label htmlFor="cvg" style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'none', letterSpacing: 'normal' }}>
                                    En validant votre commande, vous acceptez nos <Link to="/cgv">CGV</Link>.
                                </label>
                            </div>
                    </div>
                </aside>
            </form>
        </main>
            </>
    );
}

export default LivraisonPaiement;