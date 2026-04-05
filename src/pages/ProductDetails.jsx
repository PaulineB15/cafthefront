// IMPORT DES OUTILS REACT ET REACT ROUTER

import React, { useEffect, useState, useContext } from "react";
// useParams : Permet de lire l'URL (ex: dans /produit/12, il récupère le "12")
// useNavigate : Permet de forcer le changement de page (ex: rediriger vers le panier)
import { Link, useParams, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
// CartContext : "Coffre-fort" /espace stockage du panier
import { CartContext } from "../context/CartContext.jsx";
// Pour les pop-up
import toast from "react-hot-toast";
import"../styles/ProductDetails.css"

// IMPORT DES ICONES Panier + FLECHE (SVG)
const Panier = () => (
    <svg aria-hidden="true"
        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
    </svg>
);

const Fleche = () => (
    <svg aria-hidden="true"
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
);



const ProductDetails = () => {
    // LECTURE DE L'URL
    // On extrait l'ID depuis l'URL (ex: mon-site.com/produit/15 -> id = 15)
    const { id } = useParams();
    const navigate = useNavigate();

    // RECUPERER L'AJOUT AU PANIER DANS LE CONTEXTE
    const { addToCart } = useContext(CartContext);

    // MÉMOIRE DE LA PAGE (STATES)
    const [produit, setProduit] = useState(null); // Stock les infos du produit (titre, prix..)
    const [isLoading, setIsLoading] = useState(true); // Gère le chargement de la page
    const [error, setError] = useState(null); // Gère les erreurs de chargement


    // VARIABLES D'INTERACTION CLIENT
    // Quantité choisie (par défaut 1)
    const [quantite, setQuantite] = useState(1);
    // Pour le vrac : 0.25 = 250g, 0.50 = 500g, etc. Par défaut, on présélectionne 250g.
    const [poidsSelectionne, setPoidsSelectionne] = useState(0.25);

    // RÉCUPÉRATION DES DONNÉES (FETCH)

    // Action auto: Se déclenche à l'ouverture de la page, ou si l'ID dans l'URL change
    useEffect(() => {

        //Fonction asynchrone (async) car demander des données au serveur prend un peu de temps.
        const fetchProduit = async () => {
            try {
                setIsLoading(true); // Chargement en cours
                setError(null);
                // 1. Appel avec l'API (Backend) pour récupérer les produits
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
                // Récupère les infos du produit avec l'ID"
                const response = await fetch(`${apiUrl}/api/produits/${id}`);

                // 2. Gestion de l'erreur si le serveur répond mal (erreur 404, 500...)
                if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

                // 3. Traduit la réponse du serveur en JSON (un format que Javascript comprend).
                const data = await response.json();

                // Sauvegarder le produit dans la mémoire (State)
                setProduit(data.produit || data);
            } catch (err) {
                console.error("Erreur chargement :", err);
                setError("Impossible de charger le produit");
            } finally {
                setIsLoading(false); // Chargement terminé
            }
        };
        void fetchProduit(); // Execution de la fonction asynchrone qui vient d'être créee
        // IMPORTANT --> Tableau vide []: Execute la fonction une seule fois car il y a besoin
        // seulement de récupérer + afficher les produits UNE SEULE FOIS.
    }, [id]);



    // CALCUL DU PRIX
    const getPrixAffiché = () => {
        if (!produit) return 0; // Si le produit n'est pas encore chargé
        const prixBase = parseFloat(produit.PRIX_TTC);

        // Si le produit est vendu en Vrac :
        // Le prix en BDD est au Kilo. S'il choisit 250g, on fait Prix * 0.25
        if (produit.TYPE_VENTE === 'Vrac') {
            return (prixBase * poidsSelectionne).toFixed(2); // .toFixed(2) = 2 chiffres après la virgule
        }
        // Sinon (Unité) -> le prix fixe
        return prixBase.toFixed(2);
    };


    // AJOUT AU PANIER
    const handleAddToCart = () => {
        // Sécurité : on n'ajoute pas si le produit n'est pas chargé
        if (!produit) return;


        // 1. Envoi au CONTEXTE -> le produit, la quantité (ex:2), et le poids (si c'est du vrac)
        // Note: Si c'est à l'unité, notre logique dans CartContext transformera ce poids en "null"
        addToCart(produit, quantite, poidsSelectionne);

        // 2. Préparation de la Pop-up (Toast) pour afficher selon Vrac (ex: Matcha Imperial (500g)) ou pas
        const messagePoids = produit.TYPE_VENTE === 'Vrac'
            ? ` (${(poidsSelectionne * 1000)}g)` // Transforme 0.25 en "250g" pour l'affichage
            : '';
        // 3. Affichage la Pop-up (toast)
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


    //  CE QUI S'AFFICHE A L'ECRAN


    // 1. SCENARIO 1: EN TRAIN DE CHARGER (Affichage conditionnel)
    if (isLoading) return <div style={{padding: "100px"}}><Skeleton height={500} /></div>;

    // 2. SCENARIO 2: LE SERVEUR A PLANTé
    if (error) return (
        <div>
            <p>{error}</p>
            <Link to="/boutique" className="retour">Retour à la boutique</Link>
        </div>
    );

    // 3. SCENARIO 3: PRODUIT ID INEXISTANT
    if (!produit) return <div>Produit introuvable</div>;


    // Gestion Image
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const imageUrl = produit.IMAGES
        ? `${apiUrl}/images/${produit.IMAGES}`
        : `https://via.placeholder.com/500x500?text=${produit.NOM_PRODUIT}`;

    // Gestion affichage stock: change selon le type de vente
    const uniteStock = produit.TYPE_VENTE === 'Vrac' ? 'kg' : 'unités';




    // 4. SCENARIO 4: AFFICHAGE PRINCIPAL

    return (
        <>
            {/*REFERENCEMENT SEO */}
            <title>Fiche Produit - CafThé</title>
            <meta name="description" content="Fiche produit d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, fiche produit, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main className="ficheProduit-page">
            <article className="ficheProduit-container">
                {/* Retour à la boutique */}
                <nav className="retourProduits">
                    <Link to="/boutique" className="retour">
                        <Fleche /> Retour aux produits
                    </Link>
                </nav>


                <div className="ficheProduit-structure">
                    {/* COLONNE GAUCHE : PHOTO PRODUIT */}
                    <div className="ficheProduit-image">
                        <img
                            src={imageUrl}
                            alt={produit.NOM_PRODUIT}
                            onError={(e) => {e.target.onerror=null; e.target.src="https://via.placeholder.com/500x500?text=No+Image"}}
                        />
                    </div>

                    {/* COLONNE DROITE : INFOS PRODUIT */}
                    <div className="ficheProduit-info">
                        <h2 className="ficheProduit-categorie">
                            {produit.CATEGORIE} {produit.TYPE ? `- ${produit.TYPE}` : ''}
                        </h2>

                        <h1>{produit.NOM_PRODUIT}</h1>

                        {/* PRIX */}
                        <div className="ficheProduit-prix">
                            <span className="prix">{getPrixAffiché()} €</span>
                            <span className="ttc">TTC</span>
                            {produit.TYPE_VENTE === 'Vrac' && (
                                <span className="prixKG">({produit.PRIX_TTC} € / kg)</span>
                            )}
                        </div>


                        {produit.ORIGINE_PRODUIT && (
                            <p className="ficheProduit-origine">
                                <strong>Origine :</strong> {produit.ORIGINE_PRODUIT}
                            </p>
                        )}

                        <p className="description">{produit.DESCRIPTION}</p>

                        {/* INDICATION STOCK */}
                        <p className="ficheProduit-stock">
                            <span className={`status-stock ${produit.STOCK > 0 ? 'vert' : 'rouge'}`}></span>
                            {produit.STOCK > 0
                                ? `En stock (${produit.STOCK} ${uniteStock} disponibles)`
                                : "Rupture de stock"}
                        </p>

                        {/* SÉLECTION DU POIDS (Affiché UNIQUEMENT si c'est du Vrac) */}
                        {produit.TYPE_VENTE === 'Vrac' && (
                            <div className="options-vrac">
                                <label>POIDS :</label>
                                <div className="btn-poids">
                                    <button className={poidsSelectionne === 0.25 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.25)}>250g</button>
                                    <button className={poidsSelectionne === 0.50 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.50)}>500g</button>
                                    <button className={poidsSelectionne === 0.75 ? 'active' : ''} onClick={() => setPoidsSelectionne(0.75)}>750g</button>
                                    <button className={poidsSelectionne === 1.00 ? 'active' : ''} onClick={() => setPoidsSelectionne(1.00)}>1kg</button>
                                </div>
                            </div>
                        )}

                        {/* BLOC ACTIONS : QUANTITÉ ET AJOUT PANIER */}
                        <div className="ficheProduit-actions">
                            <div className="ficheProduit-quantite">
                                <button onClick={() => setQuantite(q => Math.max(1, q - 1))}>-</button>
                                <span>{quantite}</span>
                                <button onClick={() => setQuantite(q => q + 1)}>+</button>
                            </div>

                            <button className="btn-ajout" onClick={handleAddToCart} disabled={produit.STOCK <= 0}>
                                <Panier />
                                <span>AJOUTER AU PANIER</span>
                            </button>
                        </div>

                        <div className="voir-panier">
                            <Link to="/panier">Voir mon panier</Link>
                        </div>

                    </div>
                </div>
            </article>
        </main>
        </>
    );
};

export default ProductDetails;
