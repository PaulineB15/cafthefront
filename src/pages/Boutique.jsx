import React, { useEffect, useState } from "react";
// useSeachParams = HOOK POUR LIRE URL (ex: ?search=cafe)
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ProductCard from "../components/ProductCard.jsx";
import HeroBoutique from "../assets/photo/HeroBoutique.webp";
import "./Boutique.css";

const Boutique = () => {
    // --- 1. ETATS (STATE) ---
    // Stockage des produits venant de l'API
    const [produits, setProduits] = useState([]);
    // Gestion du chargement (pour afficher un skeleton)
    const [isLoading, setIsLoading] = useState(true);
    // Gestion des erreurs (pour afficher un message d'erreur)')
    const [error, setError] = useState(null);

    // ---2. ÉTATS DES FILTRES (Sidebar sur le coté gauche)---
    const [selectedCategory, setSelectedCategory] = useState("Tous");
    const [selectedType, setSelectedType] = useState("Tous");
    const [priceRange, setPriceRange] = useState("Tous");

    // ---3. ÉTATS DE LA RECHERCHE URL---
    // Récupère le paramètre "search" de l'URL (ex: ?search=cafe)"
    const [searchParams] = useSearchParams();
    // Si pas de recherche, chaîne vide
    const searchItems = searchParams.get("search") || "";

    // --- 4. RESET AUTOMATIQUE DES FILTRES (Sidebar gauche) ---
    // UX : Si l'utilisateur lance une recherche, on désactive les filtres latéraux
    // pour éviter les conflits (ex: chercher "Thé" alors que le filtre "Café" est actif)
    // Dès que le mot recherché (searchItems) change, on remet les filtres à zéro.
    useEffect(() => {
        if (searchItems) {
            // On remet tout à "Tous" pour chercher dans tout le magasin
            setSelectedCategory("Tous");
            setSelectedType("Tous");
            setPriceRange("Tous");
        }
    }, [searchItems]); // Se déclenche uniquement quand le mot recherché change

    // --- 5. CHARGEMENT DES DONNEES (FETCH) ---
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                // On remet l'erreur à null avant de commencer
                setError(null);
                // Appel de l'API
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                // Stock les produits dans le state
                setProduits(data.produit);
            } catch (err) {
                console.error("Erreur lors du chargement des produits :", err);
                setError("Impossible de charger les produits");
            } finally {
                // Quoi qu'il arrive (réussite ou échec), on met fin au chargement
                setIsLoading(false);
            }
        };
        // Lancement de la fonction asynchrone
        void fetchProduits();
    }, []); // [] = se lance une seule fois au montage de la page

    // --- 6. LOGIQUE DE FILTRAGE (COEUR DU SYSTEME)---
    const filteredProduits = produits.filter(produit => {

        // A. FILTRE RECHERCHE (NAVBAR)
        // On met tout en minuscule pour comparer (insensible à la casse)
        const recherche = searchItems.toLowerCase();

        // Sécurité : on s'assure que les champs existent (|| "")
        const nom = (produit.NOM_PRODUIT || "").toLowerCase();
        const categorie = (produit.CATEGORIE || "").toLowerCase(); //ex: Café
        const type = (produit.TYPE || "").toLowerCase(); // ex: Moulu

        // Logique "Large" : Si le mot cherché est dans le Nom OU la Catégorie OU le Type
        // Cela permet de taper "Thé" et de trouver "Earl Grey" (car sa catégorie est Thé)
        // On cherche PARTOUT (Nom OU Catégorie OU Type)
        // Le symbole || signifie "OU"
        const matchSearch = nom.includes(recherche) ||
                                    categorie.includes(recherche) ||
                                    type.includes(recherche);

        // B. FILTRES LATÉRAUX (SIDEBAR)
        // Si "Tous" est sélectionné, on prend tout, sinon on vérifie la correspondance
        const matchCategory = selectedCategory === "Tous" || produit.CATEGORIE === selectedCategory;
        // Pour le type, on vérifie aussi que produit.TYPE existe (certains produits n'en ont pas)
        const matchType = selectedType === "Tous" || (produit.TYPE && produit.TYPE === selectedType);

        // C. FILTRE PRIX
        let matchPrice = true;
        const prix = parseFloat(produit.PRIX_TTC);
        if (priceRange === "moin20") matchPrice = prix < 20;
        else if (priceRange === "20-50") matchPrice = prix >= 20 && prix <= 50;
        else if (priceRange === "plus50") matchPrice = prix > 50;

        // D. RESULTAT FINAL
        // On garde le produit uniquement si toutes les conditions sont vraies (&&)
        return matchSearch && matchCategory && matchType && matchPrice;
    });

    // Fonction pour le bouton "Réinitialiser" de la sidebar
    const resetFilters = () => {
        setSelectedCategory("Tous");
        setSelectedType("Tous");
        setPriceRange("Tous");
    };

    // ---7. AFFICHAGE CONDITIONNEL : CHARGEMENT ---
    if (isLoading) {
        return (
            <div className="product-list-skeleton-container">
                <div className="product-list">
                    {/* Génère 6 squelettes de chargement */}
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="product-skeleton">
                            <Skeleton height={200} width={300} />
                            <div style={{ marginTop: "0.5rem" }}>
                                <Skeleton height={20} width="70%" />
                            </div>
                            <div style={{ marginTop: "0.3rem" }}>
                                <Skeleton height={20} width="40%" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- 8. AFFICHAGE CONDITIONNEL: ERREUR ---
    if (error) {
        return (
            <div className="product-list-error">
                <div className="error-container">
                    <p>Une erreur est survenue</p>
                    <p>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    // --- 9. AFFICHAGE PRINCIPAL ---
    return (
        <main className="boutique-page">

            {/* SECTION HERO */}
            <section className="hero-boutique" style={{ backgroundImage: `url(${HeroBoutique})` }}>
                <div className="hero-boutique-overlay">
                    <div className="hero-boutique-content">
                        <h1>NOTRE BOUTIQUE</h1>
                        <p>Découvrez notre collection complète de cafés et thés d'exception.</p>
                    </div>
                </div>
            </section>

            {/* CONTENEUR PRINCIPAL (Sidebar + Liste) */}
            <div className="boutique-content-wrapper">

                {/* 1. SIDEBAR (Filtres) */}
                <aside className="filters-sidebar">
                    <div className="filter-header">
                        <p>FILTRES</p>
                        <button onClick={resetFilters} className="reset-btn">Réinitialiser</button>
                    </div>

                    {/* Filtres Catégories */}
                    <div className="filter-group">
                        <h2>CATÉGORIES</h2>

                        <div className="filter-section">
                            <span className="filter-subtitle">Cafés</span>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Café"); setSelectedType("Grains")}} checked={selectedType === "Grains"} /> En Grains</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Café"); setSelectedType("Moulu")}} checked={selectedType === "Moulu"} /> Moulu</label>
                        </div>

                        <div className="filter-section">
                            <span className="filter-subtitle">Thés</span>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Noir")}} checked={selectedType === "Noir"} /> Thé Noir</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Vert")}} checked={selectedType === "Vert"} /> Thé Vert</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Infusion")}} checked={selectedType === "Infusion"} /> Infusions</label>
                        </div>

                        <div className="filter-section">
                            <span className="filter-subtitle">Autres</span>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Coffret"); setSelectedType("Tous")}} checked={selectedCategory === "Coffret"} /> Coffrets</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Accessoire"); setSelectedType("Tous")}} checked={selectedCategory === "Accessoire"} /> Accessoires</label>
                        </div>
                    </div>

                    {/* Filtres Prix */}
                    <div className="filter-group">
                        <h2>PRIX</h2>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("Tous")} checked={priceRange === "Tous"} /> Tous les prix</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("moin20")} checked={priceRange === "moin20"} /> Moins de 20€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("20-50")} checked={priceRange === "20-50"} /> 20€ - 50€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("plus50")} checked={priceRange === "plus50"} /> Plus de 50€</label>
                    </div>
                </aside>

                {/* 2. LISTE DES PRODUITS (Section product-list) */}
                <section className="product-list-section">
                    <p className="results-count">{filteredProduits.length} produits trouvés</p>

                    {filteredProduits.length > 0 ? (
                        /* J'ai gardé la classe "product-list" ici pour la grille */
                        <div className="product-list">
                            {filteredProduits.map((produit) => (
                                <ProductCard key={produit.ID_PRODUIT} produit={produit}/>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <p>Aucun produit ne correspond à vos critères.</p>
                        </div>
                    )}
                </section>

            </div>
        </main>
    );
};

export default Boutique;