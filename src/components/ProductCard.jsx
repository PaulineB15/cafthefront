import React from 'react';
import { Link } from "react-router-dom";

const ProductCard = ({ produit }) => {

    // 1. GESTION DE L'IMAGE
    // Assure-toi que VITE_API_URL est bien défini dans ton fichier .env
    // Sinon, remplace import.meta.env.VITE_API_URL par "http://localhost:3000" (ou ton port serveur)
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // Si le produit a une image, on crée le lien complet. Sinon, on met un placeholder.
    const imageUrl = produit.IMAGES
        ? `${apiUrl}/images/${produit.IMAGES}`
        : "https://via.placeholder.com/210x210?text=Pas+d'image";

    // 2. FORMATAGE PRIX (Ex: 15.50 €)
    const formattedPrice = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(produit.PRIX_TTC);

    return (
        <article className="product-card">
            {/* Conteneur de l'image */}
            <div className="card-image-wrapper">
                <img
                    src={imageUrl}
                    alt={produit.NOM_PRODUIT}
                    /* Cette fonction gère le cas où l'image ne charge pas (lien cassé) */
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/210x210?text=Image+Introuvable";
                    }}
                />
            </div>

            {/* Informations du produit */}
            <div className="card-info">
                <h3>{produit.NOM_PRODUIT}</h3>

                <p className="card-details">
                    {produit.CATEGORIE} {produit.TYPE ? `- ${produit.TYPE}` : ''}
                </p>

                <p className="card-price">{formattedPrice}</p>

                <Link to={`/produit/${produit.ID_PRODUIT}`} className="btn-detail">
                    Voir détail
                </Link>
            </div>
        </article>
    );
};

export default ProductCard;
