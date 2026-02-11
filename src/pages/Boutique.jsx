import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ProductCard from "../components/ProductCard.jsx";
import HeroBoutique from "../assets/photo/HeroBoutique.webp";
import "./Boutique.css";

const Boutique = () => {
    const [produits, setProduits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- ÉTATS DES FILTRES ---
    const [selectedCategory, setSelectedCategory] = useState("Tous");
    const [selectedType, setSelectedType] = useState("Tous");
    const [priceRange, setPriceRange] = useState("Tous");

    const [searchParams] = useSearchParams();
    const searchItems = searchParams.get("search") || "";

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                setError(null);
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                setProduits(data.produit);
            } catch (err) {
                console.error("Erreur lors du chargement des produits :", err);
                setError("Impossible de charger les produits");
            } finally {
                setIsLoading(false);
            }
        };
        void fetchProduits();
    }, []);

    // --- LOGIQUE DE FILTRAGE ---
    const filteredProduits = produits.filter(produit => {
        const matchSearch = produit.NOM_PRODUIT.toLowerCase().includes(searchItems.toLowerCase());
        const matchCategory = selectedCategory === "Tous" || produit.CATEGORIE === selectedCategory;
        const matchType = selectedType === "Tous" || (produit.TYPE && produit.TYPE === selectedType);

        let matchPrice = true;
        const prix = parseFloat(produit.PRIX_TTC);
        if (priceRange === "moin20") matchPrice = prix < 20;
        else if (priceRange === "20-50") matchPrice = prix >= 20 && prix <= 50;
        else if (priceRange === "plus50") matchPrice = prix > 50;

        return matchSearch && matchCategory && matchType && matchPrice;
    });

    // Fonction reset
    const resetFilters = () => {
        setSelectedCategory("Tous");
        setSelectedType("Tous");
        setPriceRange("Tous");
    };

    // --- CHARGEMENT (Ton code Skeleton conservé) ---
    if (isLoading) {
        return (
            <div className="product-list-skeleton-container">
                {/* J'ai ajouté un wrapper pour que le skeleton soit centré si besoin */}
                <div className="product-list">
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

    // --- ERREUR (Ton code Erreur conservé) ---
    if (error) {
        return (
            <div className="product-list-error">
                <div className="error-container">
                    <h3>Une erreur est survenue</h3>
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

    // --- AFFICHAGE NORMAL ---
    return (
        <main className="boutique-page">

            {/* SECTION HERO */}
            <section className="hero" style={{ backgroundImage: `url(${HeroBoutique})` }}>
                <div className="hero-overlay">
                    <div className="hero-content">
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
                        <h3>FILTRES</h3>
                        <button onClick={resetFilters} className="reset-btn">Réinitialiser</button>
                    </div>

                    {/* Filtres Catégories */}
                    <div className="filter-group">
                        <h4>CATÉGORIES</h4>

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
                        <h4>PRIX</h4>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("Tous")} checked={priceRange === "Tous"} /> Tous les prix</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("moin20")} checked={priceRange === "moin20"} /> Moins de 20€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("20-50")} checked={priceRange === "20-50"} /> 20€ - 50€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("plus50")} checked={priceRange === "plus50"} /> Plus de 50€</label>
                    </div>
                </aside>

                {/* 2. LISTE DES PRODUITS (Ta section product-list) */}
                <section className="product-list-section">
                    <p className="results-count">{filteredProduits.length} produits trouvés</p>

                    {filteredProduits.length > 0 ? (
                        /* J'ai gardé ta classe "product-list" ici pour la grille */
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