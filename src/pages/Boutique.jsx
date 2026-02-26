// IMPORT DES OUTILS REACT ET REACT ROUTER

import React, { useEffect, useState } from "react";
// useSearchParams : Permet de lire ce qui est écrit dans l'URL
import { useSearchParams } from "react-router-dom";
// Skeleton : Outil pour afficher des fausses cartes grises pendant le chargement
import Skeleton from "react-loading-skeleton";
// ProductCard : Composant de la card du produit
import ProductCard from "../components/ProductCard.jsx";
import "../styles/Boutique.css";
import HeroBoutique from "../assets/photo/HeroBoutique.webp";


const Boutique = () => {
    // --- CRÉATION DE LA MÉMOIRE (STATES)---


    const [produits, setProduits] = useState([]); // Stockage des produits venant de la BDD
    const [isLoading, setIsLoading] = useState(true); // Gestion du chargement
    const [error, setError] = useState(null); // Gestion des erreurs


    // --- COLONNE FILTRE---
    const [selectedCategory, setSelectedCategory] = useState("Tous"); // Catégorie
    const [selectedType, setSelectedType] = useState("Tous"); // Type
    const [priceRange, setPriceRange] = useState("Tous"); // Prix

    // --- BARRE DE RECHERCHE (NavBar) ---

    const [searchParams] = useSearchParams();  // Récupère le paramètre "search" de l'URL (ex: ?search=cafe)"
    const searchItems = searchParams.get("search") || "";   // Si pas de recherche, chaîne vide

    // --- ACTION AUTOMATIQUE (USE EFFECT) ---

    // BUT:  Éviter les conflits de filtres (Navbar VS Colonne filtre)
    // S'active UNIQUEMENT quand l'utilisateur tape une nouvelle recherche dans la navbar
    useEffect(() => {
        if (searchItems) {
            // S'il cherche un mot précis (ex: "Earl Grey"), on annule les filtres (Colonne filtre)
            // pour être sûr qu'il cherche dans TOUT le magasin sans être bloqué.
            setSelectedCategory("Tous");
            setSelectedType("Tous");
            setPriceRange("Tous");
        }
    }, [searchItems]); // Se déclenche uniquement quand le mot recherché change

    // BUT : Récupérer les produits depuis l'API (Fetch)
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                setError(null);   // On remet l'erreur à zéro avant de commencer
                // 1. Appel avec l'API (Backend) pour récupérer les produits
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
                // 2. Gestion de l'erreur si le serveur répond mal (erreur 404, 500...)
                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}`);
                }
                // 3. Traduit la réponse du serveur en JSON
                const data = await response.json();
                // Sauvegarde les produits dans le state (mémoire)
                setProduits(data.produit);

                } catch (err) {
                console.error("Erreur lors du chargement des produits :", err);
                setError("Impossible de charger les produits");
                } finally {
                // Quoi qu'il arrive (réussite ou échec) = fin au chargement
                setIsLoading(false);
            }
        };
        // Lancement de la fonction asynchrone qui vient d'être créee
        void fetchProduits();
        // IMPORTANT --> Tableau vide []: Execute la fonction une seule fois car il y a besoin
        // seulement de récupérer + afficher les 4 produits UNE SEULE FOIS.
    }, []);


    // --- BARRE DE RECHERCHE (NavBar) + COLONNE FILTRE  ---

    // On prend la liste complète des produits et on la filtre pour créer une liste finale (filteredProduits)
    const filteredProduits = produits.filter(produit => {

        // 1. Filtrage par mot clé (BARRE DE RECHERCHE)
        // On met tout en minuscule pour éviter les erreurs dans la recherche (ex: "Earl Grey" vs "earl grey")
        const recherche = searchItems.toLowerCase();
        const nom = (produit.NOM_PRODUIT || "").toLowerCase();
        const categorie = (produit.CATEGORIE || "").toLowerCase();
        const type = (produit.TYPE || "").toLowerCase();

        // Le produit est gardé si le mot tapé se trouve dans son NOM, sa CATÉGORIE, OU (||) son TYPE
        const matchSearch = nom.includes(recherche) ||
                                    categorie.includes(recherche) ||
                                    type.includes(recherche);


        // 2. Filtrage par Catégorie (FILTRE COLONNE)
        // Est-ce que l'utilisateur a cliqué sur 'Tous' ? Si oui = produit accepté direct
        // OU Est-ce que la catégorie du produit = la base de données ? Si oui = produit accepté.
        const matchCategory = selectedCategory === "Tous" || produit.CATEGORIE === selectedCategory;

        // 3. Filtrage par Type (Vrac / Unité) (FILTRE COLONNE)
        // Vérifie d'abord que le produit possède bien un type enregistré (produit.TYPE) car certains n'en ont pas.
        // SI OUI vérifie que ce type correspond à ce que l'utilisateur cherche (produit.TYPE === selectedType)."
        const matchType = selectedType === "Tous" || (produit.TYPE && produit.TYPE === selectedType);

        // 3. Filtrage par prix (FILTRE COLONNE)
        let matchPrice = true; // Acceptation du prix par défaut
        const prix = parseFloat(produit.PRIX_TTC); // S'assurer que le prix = nombre à virgule
        if (priceRange === "moin20") matchPrice = prix < 20;
        else if (priceRange === "20-50") matchPrice = prix >= 20 && prix <= 50;
        else if (priceRange === "plus50") matchPrice = prix > 50;

        // --- RESULTAT FINAL ---
        // Le produit n'est affiché que si TOUTES (&&) les conditions sont remplies !
        return matchSearch && matchCategory && matchType && matchPrice;
    });


    // Fonction pour le bouton "Réinitialiser" de COLONNE FILTRE
    const resetFilters = () => {
        setSelectedCategory("Tous");
        setSelectedType("Tous");
        setPriceRange("Tous");
    };


    // ---- CE QUI S'AFFICHE A L'ECRAN ----

    // 1. SCENARIO 1: EN TRAIN DE CHARGER (Affichage conditionnel)
    if (isLoading) {
        return (
            <div className="product-list-skeleton-container">
                <div className="product-list">
                    {/* Génère 6 fausses cards (Skeleton) de chargement */}
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

    // 2. SCENARIO 2: LE SERVEUR A PLANTé
    if (error) {
        return (
            <div className="product-list-error">
                <div className="error-container">
                    <p>Une erreur est survenue</p>
                    <p>{error}</p>
                    {/* Bouton pour forcer le rechargement de la page */}
                    <button
                        onClick={() => window.location.reload()}
                        className="retry-button">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }


    // 3. SCENARIO 3: AFFICHAGE PRINCIPAL

    return (

        <>
            {/*REFERENCEMENT SEO */}
            <title>Boutique - CafThé</title>
            <meta name="description" content="Boutique d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, boutique, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main>

            {/* HERO */}
            <section className="hero-boutique" >
                <img
                    src={HeroBoutique}
                    alt="Photo d'une tasse de thé"
                    fetchpriority="high" // Chargement prioritaire pour l'image du héro
                    loading="eager"
                    className="hero-image"/>
                <div className="hero-boutique-filtre">
                    <div className="hero-boutique-entete">
                        <h1>NOTRE BOUTIQUE</h1>
                        <p>Découvrez notre collection complète de cafés et thés d'exception.</p>
                    </div>
                </div>
            </section>

            {/* CONTENEUR PRINCIPAL (COLONNE FILTRE + Liste produits) */}
            <div className="boutique-container">

                {/* COLONNE FILTRE */}
                <aside className="filtrage-container">
                    <div className="filtrage-entete">
                        <p>FILTRES</p>
                        <button onClick={resetFilters} className="reset-btn">Réinitialiser</button>
                    </div>

                    {/* Filtres Catégories */}
                    <div className="filtrage">
                        <h2>CATÉGORIES</h2>

                        <div className="filtrage-section">
                            <span className="filtrage-nom">Cafés</span>
                            {/* Les boutons "radio" modifient les Variables d'états (selectedCategory, etc.) */}
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Café"); setSelectedType("Grains")}} checked={selectedType === "Grains"} /> En Grains</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Café"); setSelectedType("Moulu")}} checked={selectedType === "Moulu"} /> Moulu</label>
                        </div>

                        <div className="filtrage-section">
                            <span className="filtrage-nom">Thés</span>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Noir")}} checked={selectedType === "Noir"} /> Thé Noir</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Vert")}} checked={selectedType === "Vert"} /> Thé Vert</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Thé"); setSelectedType("Infusion")}} checked={selectedType === "Infusion"} /> Infusions</label>
                        </div>

                        <div className="filtrage-section">
                            <span className="filtrage-nom">Autres</span>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Coffret"); setSelectedType("Tous")}} checked={selectedCategory === "Coffret"} /> Coffrets</label>
                            <label><input type="radio" name="type" onChange={() => {setSelectedCategory("Accessoire"); setSelectedType("Tous")}} checked={selectedCategory === "Accessoire"} /> Accessoires</label>
                        </div>
                    </div>

                    {/* Filtres Prix */}
                    <div className="filtrage">
                        <h2>PRIX</h2>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("Tous")} checked={priceRange === "Tous"} /> Tous les prix</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("moin20")} checked={priceRange === "moin20"} /> Moins de 20€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("20-50")} checked={priceRange === "20-50"} /> 20€ - 50€</label>
                        <label><input type="radio" name="prix" onChange={() => setPriceRange("plus50")} checked={priceRange === "plus50"} /> Plus de 50€</label>
                    </div>
                </aside>


                {/* LISTE DES PRODUITS */}
                <section className="liste-de-produits">
                    {/* Affichage dynamique du nombre produits passé par les filtres */}
                    <p className="resultat-produits">{filteredProduits.length} produits trouvés</p>

                    {filteredProduits.length > 0 ? (
                        <div className="carte-produit-liste">
                            {/* Boucle (.map) sur les produits filtrés pour dessiner les cartes via le composant ProductCard.jsx*/}
                            {filteredProduits.map((produit) => (
                                <ProductCard key={produit.ID_PRODUIT} produit={produit}/>
                            ))}
                        </div>
                    ) : (
                        /* Si les filtres sont trop restrictifs et qu'il n'y a plus de produit */
                        <div className="pas-resultat">
                            <p>Aucun produit ne correspond à vos critères.</p>
                        </div>
                    )}
                </section>

            </div>
        </main>
        </>
    );
};

export default Boutique;