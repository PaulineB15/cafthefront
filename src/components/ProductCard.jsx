import React, {useContext} from 'react';
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext.jsx";
import toast from "react-hot-toast";


const ProductCard = ({ produit }) => {

    // Import du useContext pour faire un quick ajout au panier
    const { addToCart } = useContext(CartContext);

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

    // Fonction déclenchée au clic sur le "+"
    const handleQuickAdd = () => {
        // On ajoute 1 quantité, et null pour le poids car ce bouton ne s'affiche que pour l'unité
        addToCart(produit, 1, null);
        // toast = design de la pop-up d'ajout du produit au panier
        toast.success(`${produit.NOM_PRODUIT} ajouté au panier !`, {
            style: {
                background: '#222', // Fond gris foncé comme tes cartes
                color: '#fff',      // Texte blanc
                border: '1px solid #C5A059', // Bordure dorée
            },
            iconTheme: {
                primary: '#C5A059', // Icône de validation dorée
                secondary: '#222',  // Fond de l'icône
            },
        });
    };

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

                {/* Affichage de la catégorie, du type, et du type de vente */}
                <p className="card-details">
                    {produit.CATEGORIE} {produit.TYPE ? `- ${produit.TYPE}` : ''}
                    <br />
                    <span className="type-vente">
                        {produit.TYPE_VENTE === 'Vrac' ? 'En vrac' : 'A l\'unité'}
                    </span>
                </p>

                {/* Affichage du prix avec la mention " / kg" UNIQUEMENT pour le vrac */}
                <p className="card-price">
                    {formattedPrice} {produit.TYPE_VENTE === 'Vrac' ? <span style={{fontSize: "0.8rem", color: "#fff"}}> / kg</span> : ""}
                </p>

                <div className="card-actions">
                    <Link to={`/produit/${produit.ID_PRODUIT}`} className="btn-detail">
                        Voir détail
                    </Link>

                    {/* Le bouton "+" ne s'affiche QUE si ce n'est pas du vrac */}
                    {produit.TYPE_VENTE !== 'Vrac' && (
                        <button onClick={handleQuickAdd} className="btn-quick-add" title="Ajouter rapidement au panier">
                            +
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
