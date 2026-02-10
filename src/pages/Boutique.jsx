import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import ProductCard from "../components/ProductCard.jsx";
import HeroBoutique from "../assets/photo/HeroBoutique.webp";

const Boutique = () => {
    const [produits, setProduits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchProduits = async () => {
            try {
                setError(null);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/produits`,
                );

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }

                const data = await response.json();
                setProduits(data.produit); // On charge Tous les produits

            } catch (err) {
                console.error("Erreur lors du chargement des produits :", err);
                setError("Impossible de charger les produits");
            } finally {
                setIsLoading(false);
            }
        };

        void fetchProduits();
    }, []);


    // Chargement : Skeleton
    if (isLoading) {
        return (
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
        );
    }

    // Erreur
    if (error) {
        return (
            <div className="product-list-error">
                <div className="error-container">
                    <h3> Une erreur est survenue</h3>
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

    // Affichage normal (si tout est OK)
    return (
        <main>
            <section className="hero" style={{ backgroundImage: `url(${HeroBoutique})` }}>

                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Notre Boutique</h1>
                        <p>Découvrez notre collection complète de cafés et thés d'exception.</p>
                    </div>
                </div>
            </section>
            <section className="product-list">
                {produits.map((produit) => (
                    <ProductCard key={produit.ID_PRODUIT} produit={produit}/>
                ))}
            </section>

        </main>
    );
};

export default Boutique;
