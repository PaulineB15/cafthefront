import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "./ProductDetails.css";
import { CartContext } from "../context/CartContext.jsx";
import toast from "react-hot-toast";

// Icône Panier (SVG Inline pour éviter les erreurs d'import)
const CartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

// Icône Flèche Retour
const ArrowLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // RECUPERER L'AJOUT AU PANIER DANS LE CONTEXTE
    const { addToCart } = useContext(CartContext);

    const [produit, setProduit] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // États locaux
    const [quantite, setQuantite] = useState(1);

    // Pour le vrac, on utilise un multiplicateur : 0.25, 0.5, 0.75, 1
    const [poidsSelectionne, setPoidsSelectionne] = useState(0.25);

    useEffect(() => {
        const fetchProduit = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
                const response = await fetch(`${apiUrl}/api/produits/${id}`);

                if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

                const data = await response.json();
                setProduit(data.produit || data);
            } catch (err) {
                console.error("Erreur chargement :", err);
                setError("Impossible de charger le produit");
            } finally {
                setIsLoading(false);
            }
        };
        void fetchProduit();
    }, [id]);

    // --- CALCUL DU PRIX ---
    const getPrixAffiché = () => {
        if (!produit) return 0;
        const prixBase = parseFloat(produit.PRIX_TTC);

        // Si c'est du vrac, le prix base est au KG. On multiplie par le poids choisi.
        if (produit.TYPE_VENTE === 'Vrac') {
            return (prixBase * poidsSelectionne).toFixed(2);
        }
        // Sinon (Unité), c'est le prix fixe
        return prixBase.toFixed(2);
    };

    // --- AJOUT AU PANIER ---
    const handleAddToCart = () => {
        // Sécurité : on n'ajoute pas si le produit n'est pas chargé
        if (!produit) return;

        // 1. APPEL AU CONTEXTE
        // On envoie : le produit entier, la quantité choisie, et le poids (si c'est du vrac)
        addToCart(produit, quantite, poidsSelectionne);

        // 2. FEEDBACK UTILISATEUR (Petit message de succès)
        // Plus tard, on pourra faire une belle notification "Toast"
        // Pour l'instant, une alerte native suffit pour tester
        const messagePoids = produit.TYPE_VENTE === 'Vrac'
            ? ` (${(poidsSelectionne * 1000)}g)`
            : '';

        toast.success(`${quantite} x ${produit.NOM_PRODUIT}${messagePoids} ajouté !`, {
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

    if (isLoading) return <div style={{padding: "100px"}}><Skeleton height={500} /></div>;

    if (error) return (
        <div className="error-container">
            <p>{error}</p>
            <Link to="/boutique" className="back-link">Retour à la boutique</Link>
        </div>
    );

    if (!produit) return <div>Produit introuvable</div>;

    // Gestion Image
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const imageUrl = produit.IMAGES
        ? `${apiUrl}/images/${produit.IMAGES}`
        : `https://via.placeholder.com/500x500?text=${produit.NOM_PRODUIT}`;

    // Gestion affichage stock
    const uniteStock = produit.TYPE_VENTE === 'Vrac' ? 'kg' : 'unités';

    return (
        <div className="product-details-page">
            <div className="product-details-container">

                {/* 1. LIEN RETOUR SIMPLE */}
                <div className="top-nav">
                    <Link to="/boutique" className="back-link-simple">
                        <ArrowLeft /> Retour aux produits
                    </Link>
                </div>

                <div className="product-layout">
                    {/* COLONNE IMAGE */}
                    <div className="product-image-block">
                        <img
                            src={imageUrl}
                            alt={produit.NOM_PRODUIT}
                            onError={(e) => {e.target.onerror=null; e.target.src="https://via.placeholder.com/500x500?text=No+Image"}}
                        />
                    </div>

                    {/* COLONNE INFO */}
                    <div className="product-info-block">
                        <h4 className="category-tag">
                            {produit.CATEGORIE} {produit.TYPE ? `- ${produit.TYPE}` : ''}
                        </h4>

                        <h1>{produit.NOM_PRODUIT}</h1>

                        <div className="price-section">
                            <span className="current-price">{getPrixAffiché()} €</span>
                            <span className="ttc-label">TTC</span>
                            {produit.TYPE_VENTE === 'Vrac' && (
                                <span className="price-per-kg">({produit.PRIX_TTC} € / kg)</span>
                            )}
                        </div>

                        {/* 3. ORIGINE */}
                        {produit.ORIGINE_PRODUIT && (
                            <p className="origin-text">
                                <strong>Origine :</strong> {produit.ORIGINE_PRODUIT}
                            </p>
                        )}

                        <p className="description">{produit.DESCRIPTION}</p>

                        {/* 4. STOCK */}
                        <p className="stock-indicator">
                            <span className={`status-dot ${produit.STOCK > 0 ? 'green' : 'red'}`}></span>
                            {produit.STOCK > 0
                                ? `En stock (${produit.STOCK} ${uniteStock} disponibles)`
                                : "Rupture de stock"}
                        </p>

                        {/* SÉLECTEUR DE POIDS (Vrac uniquement) */}
                        {produit.TYPE_VENTE === 'Vrac' && (
                            <div className="options-vrac">
                                <label>POIDS :</label>
                                <div className="weight-buttons">
                                    <button className={poidsSelectionne === 0.25 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.25)}>250g</button>
                                    <button className={poidsSelectionne === 0.50 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.50)}>500g</button>
                                    <button className={poidsSelectionne === 0.75 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.75)}>750g</button>
                                    <button className={poidsSelectionne === 1.00 ? 'active' : ''} onClick={() => setPoidsSelectionne(1.00)}>1kg</button>
                                </div>
                            </div>
                        )}

                        {/* 5. ACTIONS (Quantité + Ajouter Panier) */}
                        <div className="actions-row">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantite(q => Math.max(1, q - 1))}>-</button>
                                <span>{quantite}</span>
                                <button onClick={() => setQuantite(q => q + 1)}>+</button>
                            </div>

                            <button className="btn-add-cart" onClick={handleAddToCart} disabled={produit.STOCK <= 0}>
                                <CartIcon />
                                <span>AJOUTER AU PANIER</span>
                            </button>
                        </div>

                        {/* Lien secondaire vers le panier */}
                        <div className="view-cart-link">
                            <Link to="/panier">Voir mon panier</Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
