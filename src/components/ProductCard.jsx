// IMPORT DES OUTILS

// useContext : Raccourci direct vers CartContext pour y récupérer des données du panier (ex:quickAdd - Bouton +)
import React, {useContext} from 'react';
// Link : Permet de créer des liens de navigation fluides (sans recharger la page)
import { Link } from "react-router-dom";
// CartContext.jsx : C'est la "mémoire globale" du panier (pour y accéder depuis n'importe où)
import { CartContext } from "../context/CartContext.jsx";
// toast : Une librairie pour afficher de jolies petites notifications pop-up
import toast from "react-hot-toast";

// DECLARATION DU COMPOSANT
// ({ produit }) : Ce composant reçoit une "Prop" (une propriété) appelée "produit".
// C'est le parent (Boutique.jsx) qui lui envoie les infos du café ou du thé à afficher.
const ProductCard = ({ produit }) => {

//CONNEXION AU PANIER GLOBAL
// On extrait la fonction "addToCart" depuis " CartContext.jsx" pour pouvoir l'utiliser ici.
// Import du useContext pour faire un ajout rapide au panier
const { addToCart } = useContext(CartContext);

// GESTION DU LIEN DE L'IMAGE
//Récupération de l'adresse du serveur (Backend) défini dans le fichier (.env - qui sont les variables d'environnement)
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Condition: Si le produit a une image, on crée le lien complet. Sinon, on met un placeholder (images grises)
const imageUrl = produit.IMAGES
        ? `${apiUrl}/images/${produit.IMAGES}`
        : "https://via.placeholder.com/210x210?text=Pas+d'image";

// FORMATAGE PRIX
// Intl.NumberFormat = outil JS pour formater parfaitement les nombres (ex: 15.5 devient "15,50 €")
    const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(produit.PRIX_TTC);


// AJOUT RAPIDE AU PANIER
// Fonction déclenchée au clic sur le "+"
const quickAdd = () => {
// Envoie du produit entier au panier, avec une quantité de 1.
// Le "null" = pour le vrac (poids) car ce bouton ne s'affiche que pour l'unité
    addToCart(produit, 1, null);

    // toast = design de la pop-up d'ajout du produit au panier
        toast.success(`${produit.NOM_PRODUIT} ajouté au panier !`, {
            style: {
                background: '#222',
                color: '#fff',
                border: '1px solid #C5A059',
            },
            iconTheme: {
                primary: '#C5A059',
                secondary: '#222',
            },
        });
    };




    return (
        <article className="carte-produit">

            {/* PHOTO DU PRODUIT */}
            <div className="cadre-photo">
                <img
                    src={imageUrl}
                    alt={produit.NOM_PRODUIT}
                    /*  Gère le cas où l'image ne charge pas (lien cassé) */
                    onError={(e) => {
                        e.target.onerror = null; // Empêche une boucle d'erreur infinie
                        e.target.src = "https://via.placeholder.com/210x210?text=Image+Introuvable"; // Remplace l'image cassée par l'image grise par défaut
                    }}
                />
            </div>

            {/* INFO DU PRODUIT */}
            <div className="carte-info">
                <h3>{produit.NOM_PRODUIT}</h3>

                {/* Affichage de la catégorie, du type, et du type de vente */}
                <p className="carte-details">
                    {produit.CATEGORIE} {produit.TYPE ? `- ${produit.TYPE}` : ''}
                    <br />
                    {/* Affiche si c'est vendu en Vrac ou à l'unité */}
                    <span className="type-vente">
                        {produit.TYPE_VENTE === 'Vrac' ? 'En vrac' : 'A l\'unité'}
                    </span>
                </p>

                {/* Affichage du prix avec " / kg" UNIQUEMENT pour le vrac */}
                <p className="prix-vrac">
                    {formattedPrice} {produit.TYPE_VENTE === 'Vrac' ? <span style={{fontSize: "0.8rem", color: "#fff"}}> / kg</span> : ""}
                </p>

                {/* BOUTON */}
                <div className="card-actions">
                    <Link to={`/produit/${produit.ID_PRODUIT}`} className="btn-detail">
                        Voir détail
                    </Link>

                    {/* Le bouton "+" ne s'affiche QUE si ce n'est pas du vrac */}
                    {produit.TYPE_VENTE !== 'Vrac' && (
                        <button onClick={quickAdd} className="btn-ajout-rapide" title="Ajouter rapidement au panier">
                            +
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
