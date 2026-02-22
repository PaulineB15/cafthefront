import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

// --- IMPORT DES IMAGES ---
import PhotoHero from "../assets/photo/HeroAccueil.webp";
import HistoireImg from "../assets/photo/HistoireImg.webp";

// Pictos
import Agriculture from "../assets/picto/agriculturedurable.svg";
import Commerce from "../assets/picto/commerceequitable.svg";
import Impact from "../assets/picto/impact-positif.svg";
import Etiquette from "../assets/picto/Etiquettepromo.svg";
import Offre from "../assets/picto/Offrespromo.svg";

// CSS
import "./Home.css";

// --- CONFIGURATION ---
// On définit les ID des produits à afficher en vedette ici
// (Sorti du composant pour la performance)
const FEATURED_PRODUCT_IDS = [4, 21, 15, 27];

function Home() {
    const [selectionProduits, setSelectionProduits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // --- RECUPERATION DES DONNEES (FETCH) ---
    useEffect(() => {
        // Fonction asynchrone auto-invoquée (IIFE) pour un code plus propre
        (async () => {
            try {
                // On appelle l'API (Backend)
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

                if (!response.ok) {
                    throw new Error("Erreur réseau lors du chargement des produits");
                }

                const data = await response.json();

                // Si on a des produits, on filtre pour ne garder que ceux de la liste FEATURED_PRODUCT_IDS
                if (data.produit) {
                    const filtered = data.produit.filter(p => FEATURED_PRODUCT_IDS.includes(p.ID_PRODUIT));
                    setSelectionProduits(filtered);
                }
            } catch (err) {
                console.error("Erreur chargement Home :", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <main className="home-page">

            {/* =========================================
               1. SECTION HERO (Bannière Principale)
               ========================================= */}
            <section className="hero-home" style={{backgroundImage: `url(${PhotoHero})`}} alt="Photo d'une tasse de café" aria-label="Bannière d'accueil">
                {/* Overlay sombre pour la lisibilité du texte */}
                <div className="hero-home-overlay"></div>

                <div className="hero-home-content">
                    <h1>L'excellence <br/> du café et du thé</h1>
                    <p>
                        Découvrez une sélection raffinée de cafés et thés d'exception,
                         cultivés avec passion et respect de l'environnement.
                    </p>
                    {/* Bouton utilisant les nouvelles classes globales */}
                    <Link to="/boutique" className="btn btn-primary">
                        Voir la boutique
                    </Link>
                </div>
            </section>

            {/* =========================================
               2. SECTION SÉLECTION (Produits Phares)
               ========================================= */}
            <section className="section-padding selection">
                <h2>Notre sélection</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto 40px auto' }}>
                    Découvrez nos produits les plus populaires,
                    choisis avec soin pour leur qualité exceptionnelle.
                </p>

                <div className="selection-grid">
                    {/* Gestion du chargement */}
                    {isLoading ? (
                        <p>Chargement de nos pépites...</p>
                    ) : selectionProduits.length > 0 ? (
                        /* Affichage des cartes produits */
                        selectionProduits.map((produit) => (
                            <ProductCard key={produit.ID_PRODUIT} produit={produit} />
                        ))
                    ) : (
                        <p>Aucune sélection disponible pour le moment.</p>
                    )}
                </div>

                <div style={{marginTop: '50px'}}>
                    {/* Bouton secondaire (contour doré ou simple) */}
                    <Link to="/boutique" className="btn btn-secondary">
                        Voir toute la boutique
                    </Link>
                </div>
            </section>

            {/* =========================================
               3. SECTION OFFRES (Promo & Fidélité)
               ========================================= */}
            <section className="section-padding offre-section">
                {/* Titre invisible pour l'accessibilité (Screen Readers) */}
                <h2>Nos Offres et Programmes Fidélité</h2>

                {/* CARTE 1 : OFFRE DU MOMENT */}
                <div className="offres-grid">
                    <article className="card-offre">
                        <div className="card-header">
                            <h3>Offre du moment</h3>
                            {/* aria-hidden="true" car l'image est décorative */}
                            <img src={Etiquette} alt="pictogramme étiquette" aria-hidden="true" />
                         </div>
                            <p className="promotion-titre">-20% sur toute la boutique</p>
                            <p className="card-desc">
                                Profitez de notre offre exceptionnelle sur l'ensemble de nos cafés et thés premium
                                avec le code promo "BIENVENUE20".
                            </p>
                            <Link to="/boutique" className="btn btn-primary">
                                J'en profite
                            </Link>
                    </article>


                    {/* CARTE 2 : FIDÉLITÉ (Avec bordure dorée via classe gold-border) */}
                    <article className="card-offre gold-border">
                        <div className="card-header">
                            <h3>Programme fidélité</h3>
                            <img src={Offre} alt="pictogramme cadeau" aria-hidden="true" />
                        </div>
                        <p className="promotion-titre">Rejoignez notre club</p>
                        <p className="card-desc">
                            Bénéficiez d'avantages exclusifs, de réductions privilèges et
                            d'un accès prioritaire à nos nouvelles collections.

                        </p>
                        <Link to="/login" className="btn btn-primary">
                            Découvrir
                        </Link>
                    </article>
                </div>
            </section>

            {/* =========================================
               4. SECTION HISTOIRE & VALEURS
               ========================================= */
                /* Note: J'ai retiré la classe 'histoire' du CSS global index.css pour
                   éviter les conflits, tout est géré via Home.css maintenant */
            }

            <section className="section-padding histoire">

                <div className="histoire-image">
                    {/* loading="lazy" pour améliorer la vitesse de chargement de la page */}
                    <img src={HistoireImg} alt="Plantation de café équitable" loading="lazy" />
                </div>

                <div className="histoire-text">
                    <h2>NOTRE HISTOIRE</h2>

                    <p>
                        Depuis 2015, CafThé s'engage à offrir une expérience sensorielle
                        unique à travers une sélection rigoureuse de cafés et thés d'exception.
                    </p>

                    <p>
                        Notre passion pour l'excellence nous pousse à voyager aux quatre coins du monde
                        pour dénicher les meilleures variétés, tout en respectant l'environnement et les producteurs.
                    </p>

                    <p>
                        Au-delà du goût, notre démarche s'inscrit dans une forte Responsabilité Sociétale des Entreprises (RSE).
                        Nous croyons qu'une grande tasse commence par le respect de la terre et des femmes et des hommes qui la cultivent.
                    </p>

                    <p>
                        Nos produits sont issus de cultures biologiques certifiées. Nous privilégions l'agroforesterie et les méthodes
                        de récolte manuelles qui préservent la biodiversité, protègent la santé des sols et limitent drastiquement notre empreinte carbone.
                    </p>

                    <p>
                        Nous travaillons en circuit court avec les coopératives locales. En supprimant les intermédiaires superflus,
                        nous garantissons une rémunération juste, stable et transparente aux producteurs, assurant ainsi des conditions de travail dignes.
                    </p>

                    {/*<p>
                        Nous réinvestissons une partie de nos bénéfices dans les communautés qui nous nourrissent. Nos actions financent des projets concrets
                        de développement local, comme l'accès à l'eau potable et des programmes de reforestation dans les pays producteurs.
                    </p> */}

                    {/* Liste des Valeurs (Pictos) */}
                    <div className="valeurs-list">

                        <article className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Agriculture} alt="Pictogramme d'une feuille" aria-hidden="true" />
                            </div>
                            <div className="valeur-content">
                                <strong>AGRICULTURE DURABLE</strong>
                                <p>Nos produits sont issus de cultures biologiques.</p>
                            </div>
                        </article>

                        <article className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Commerce} alt="Pictogramme d'un coeur" aria-hidden="true" />
                            </div>
                            <div className="valeur-content">
                                <strong>COMMERCE ÉQUITABLE</strong>
                                <p>Nous travaillons directement avec les producteurs.</p>
                            </div>
                        </article>

                        <article className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Impact} alt="Pictogramme du globe terrestre" aria-hidden="true" />
                            </div>
                            <div className="valeur-content">
                                <strong>IMPACT POSITIF</strong>
                                <p>Projets de reforestation et développement local.</p>
                            </div>
                        </article>

                    </div>
                </div>
            </section>

        </main>
    );
}

export default Home;
