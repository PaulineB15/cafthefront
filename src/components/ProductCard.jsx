

import React from 'react';
import { Link } from "react-router-dom";

const ProductCard = ({ produit }) => {

    // Image provenant de l'API
    const imageURL = produit.IMAGES ? `${import.meta.env.VITE_API_URL}/images/${produit.IMAGES}` :
        "https://placehold.co/600x400";

    return (
        <div className="product-card">

            <img
                src={imageURL}
                alt={produit.NOM_PRODUIT}
                className="product-card-img"
            />

            <h3>{produit.NOM_PRODUIT}</h3>
            <p>{produit.PRIX_TTC} €</p>

            <Link to={`/produit/${produit.ID_PRODUIT}`} className="details-btn">
                Voir détails
            </Link>
        </div>
    );
};

export default ProductCard;
