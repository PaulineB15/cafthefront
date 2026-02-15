import React from 'react';
import {Link} from "react-router-dom";
import PhotoHero from "../assets/photo/HeroAccueil.webp";
import HistoireImg from "../assets/photo/HistoireImg.webp";
import Agriculture from "../assets/picto/agriculturedurable.svg";
import Commerce from "../assets/picto/commerceequitable.svg";
import Impact from "../assets/picto/impact-positif.svg";
import Etiquette from "../assets/picto/Etiquettepromo.svg";
import Offre from "../assets/picto/Offrespromo.svg";
import "./Home.css";
import {useEffect, useState} from "react";
import ProductCard from "../components/ProductCard.jsx";


// DECLARATION DES PRODUITS PHARES (ID_PRODUIT de la base de donnée)
const featuredProduitsID = [4, 21, 15, 27];

function Home() {
    const [selectionProduits, setSelectionProduits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // RECUPERER LES PRODUITS PHARES VIA L'API
    useEffect(() => {
        const fetchProduits = async () => {
          try {
             // On récupère tout
             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);
             const data = await response.json();

             if (data.produit) {
                 // On garde seulement les produits de la const featuredProduitsID
             const filtered = data.produit.filter(p => featuredProduitsID.includes(p.ID_PRODUIT))

                 setSelectionProduits(filtered);
             }
          } catch (err) {
              console.error("Erreur lors du chargement des produits :", err);
          } finally {
              setIsLoading(false);
          }

        };
        fetchProduits();

    }, []);


    return (
        <main className="home-page">

            {/* --- HERO --- */}
            <section className="hero-home" style={{backgroundImage: `url(${PhotoHero})`}}>
                <div className="hero-home-overlay">
                    <div className="hero-home-content">
                        <h1>L'excellence <br/> du café et du thé</h1>
                        <p>Découvrez une sélection raffinée de cafés et thés d'exception,
                            <br /> cultivés avec passion et respect de l'environnement.</p>
                        <Link to="/boutique" className="button">Voir la boutique</Link>
                    </div>
                </div>
            </section>

            {/* --- SELECTION --- */}
            <section className="selection">
                <h2>Notre sélection</h2>
                <p>Découvrez nos produits les plus populaires,
                    choisis avec soin pour leur qualité exceptionnelle.</p>

                <div className="selection-grid">
                    {/* Chargement... */}
                    {isLoading && <p>Chargement de nos pépites...</p>}

                    {/* Affichage des produits choisis */}
                    {!isLoading && selectionProduits.length > 0 ? (
                        selectionProduits.map((produit) => (
                            // On contraint un peu la largeur pour que ça reste joli sur la home
                            <div key={produit.ID_PRODUIT} style={{ width: '280px' }}>
                                <ProductCard produit={produit} />
                            </div>
                        ))
                    ) : (
                        // Si jamais les ID n'existent pas ou erreur
                        !isLoading && <p>Aucune sélection pour le moment.</p>
                    )}
                </div>

                <div style={{marginTop: '50px'}}>
                    <Link to="/boutique" className="button-dark">Voir toute la boutique</Link>
                </div>
            </section>

            {/* --- OFFRES --- */}
            <section className="Offre-section">
                {/* Titre caché pour le SEO */}
                <h2 className="sr-only">Nos Offres et Programmes Fidélité</h2>

                {/* CARTE 1 */}
                <article className="card-offre">
                    <div className="card-header">
                    <h3>Offre du moment</h3>
                        <img src={Etiquette} alt="Etiquette promo" />
                    </div>
                    <p className="promotion-titre">-20% sur toute la boutique</p>
                    <p className="card-desc">Profitez de notre offre exceptionnelle sur l'ensemble de nos cafés et thés premium.</p>
                    <Link to="/boutique" className="button">J'en profite</Link>
                </article>

                {/* CARTE 2 */}
                <article className="card-fidelite">
                    <div className="card-header">
                    <h3>Programme fidélité</h3>
                        <img src={Offre} alt="Cadeau fidélité" />
                    </div>
                    <p className="promotion-titre">Rejoignez notre club</p>
                    <p className="card-desc">Bénéficiez d'avantages exclusifs, de réductions privilèges et d'un accès prioritaire.</p>
                    <Link to="/login" className="button">Découvrir</Link>
                </article>
            </section>

            {/* --- HISTOIRE --- */}
            <section className="histoire">
                <div className="histoire-image">
                    <img src={HistoireImg} alt="Notre histoire" />
                </div>

                <div className="histoire-text">
                    <h2>NOTRE HISTOIRE</h2>

                    <p className="intro-text">Depuis 2015, CafThé s'engage à offrir une expérience sensorielle
                        unique à travers une sélection rigoureuse de cafés et thés d'exception.</p>

                    <p className="intro-text">Notre passion pour l'excellence nous pousse à voyager aux quatre coins du monde
                        pour dénicher les meilleures variétés, tout en respectant l'environnement et les producteurs.</p>

                    <div className="valeurs-list">

                        <div className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Agriculture} alt="Feuille" />
                            </div>
                            <div className="valeur-content">
                                <strong>AGRICULTURE DURABLE</strong>
                                <p>Nos produits sont issus de cultures biologiques.</p>
                            </div>
                        </div>

                        <div className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Commerce} alt="Coeur" />
                            </div>
                            <div className="valeur-content">
                                <strong>COMMERCE ÉQUITABLE</strong>
                                <p>Nous travaillons directement avec les producteurs.</p>
                            </div>
                        </div>

                        <div className="valeur-item">
                            <div className="valeur-icon">
                                <img src={Impact} alt="Globe" />
                            </div>
                            <div className="valeur-content">
                                <strong>IMPACT POSITIF</strong>
                                <p>Projets de reforestation et développement local.</p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}

export default Home;