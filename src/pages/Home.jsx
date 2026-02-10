import React from 'react';
import Boutique from "./Boutique.jsx";
import PhotoHero from "../assets/photo/HeroAccueil.webp";
import HistoireImg from "../assets/photo/HistoireImg.webp";
import {Link} from "react-router-dom";




function Home() {
    return (
        <main className="home-page">

        <section className="hero" style={{backgroundImage: `url(${PhotoHero})`}}>
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1>L'excellence du café et du thé</h1>
                    <p>Découvrez une sélection raffinée de cafés et thés d'exception,
                        cultivés avec passion et respect de l'environnement.</p>
                    <Link to="/boutique" className="button">Voir la boutique</Link>
                </div>
            </div>
        </section>

            <section className="selection">
                <h2>Notre sélection</h2>
                <p>Découvrez nos produits les plus populaires,
                choisis avec soin pour leur qualité exceptionnelle.</p>

                {/* Grille placeholder pour la mise en page */}
                <div className="selection-grid">
                    <div className="placeholder">Produit 1</div>
                    <div className="placeholder">Produit 2</div>
                    <div className="placeholder">Produit 3</div>
                </div>
            </section>

            <section className="Offre-section">

                <h2></h2>
                <article className="card-offre">
                    <h3>Offre du moment</h3>
                    <p className="promotion-titre">-20% sur toute la boutique</p>
                    <p>Rejoignez le club, cumulez des points et gagnez des cadeaux.</p>
                    <Link to="/boutique" className="button">J'en profite</Link>
                </article>
                <article className="card-fidelite">
                    <h3>Programme fidélité</h3>
                    <p className="promotion-titre">Rejoignez notre club</p>
                    <p>Rejoignez le club, cumulez des points et gagnez des cadeaux.</p>
                    <Link to="/login" className="button">Découvrir</Link>
                </article>
            </section>


            <section className="histoire">
                <div className="histoire-text">
                    <h2>NOTRE HISTOIRE</h2>
                    <p>Depuis 2015, CafThé s'engage à offrir une expérience sensorielle
                        unique à travers une sélection rigoureuse de cafés et thés d'exception.</p>
                    <p>Notre passion pour l'excellence nous pousse à voyager aux quatre coins du monde
                        pour dénicher les meilleures variétés, tout en respectant l'environnement et les producteurs.</p>
                </div>
                <div className="histoire-image">
                    <img src={HistoireImg} alt="Notre histoire" />
                </div>
            </section>



        </main>

    );
}

export default Home;