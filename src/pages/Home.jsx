
// IMPORT DES OUTILS REACT
// useState : Permet de créer la "mémoire" de la page (les variables qui changent).
// useEffect : Permet d'exécuter une action automatique quand la page s'affiche.
import React, { useEffect, useState } from 'react';

// IMPORT DU ROUTEUR
//Remplace la balise HTML <a>. Il permet de changer de page sans recharger tout le site Web.
import { Link } from "react-router-dom";

// IMPORT DES COMPOSANTS + CSS
import ProductCard from "../components/ProductCard.jsx"; // ProductCard : Composant "moule" créé pour afficher une belle carte produit.
import "../styles/Home.css";

// IMPORT PHOTOS + LOGO
import PhotoHero from "../assets/photo/HeroAccueil.webp";
import HistoireImg from "../assets/photo/HistoireImg.webp";
import Agriculture from "../assets/picto/agriculturedurable.svg";
import Commerce from "../assets/picto/commerceequitable.svg";
import Impact from "../assets/picto/impact-positif.svg";
import Etiquette from "../assets/picto/Etiquettepromo.svg";
import Offre from "../assets/picto/Offrespromo.svg";


// CONFIGURATION STATIQUE
// Ici uniquement les (ID_PRODUITS) des 4 produits mis en avant.
const ProductsSelection = [4, 21, 15, 27];


function Home() {
    // --- CRÉATION DE LA MÉMOIRE (STATES) ---

    // selectionProduits : Va contenir les vraies données des 4 produits (titre, prix, image). Vide [] au départ
    const [selectionProduits, setSelectionProduits] = useState([]);

    // isLoading : "interrupteur" (vrai/faux) pour dire à la page si elle est en train de chercher les données. Vrai au départ.
    const [isLoading, setIsLoading] = useState(true);

    // --- ACTION AUTOMATIQUE (USE EFFECT) ---
    // Le code à l'intérieur s'exécutera au moment où la page s'affiche à l'écran
    useEffect(() => {

        //Fonction asynchrone (async) car demander des données au serveur prend un peu de temps.
        const fetchProduits = async () => {
            try {
                // 1. Appel avec l'API (Backend) pour récupérer les produits
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/produits`);

                // 2. Gestion de l'erreur si le serveur répond mal (erreur 404, 500...)
                if (!response.ok) {
                    throw new Error("Erreur réseau lors du chargement des produits");
                }

                // 3. Traduit la réponse du serveur en JSON (un format que Javascript comprend).
                const data = await response.json();

                // 4. Filtrage: Si on a des produits, on filtre pour ne garder que ceux de la liste FEATURED_PRODUCT_IDS
                if (data.produit) {
                    // On prend la liste de tous les produits, et on la filtre (.filter) :
                    // Garde que les produits dont l'ID est présent dans "ProductsSelection" [4, 21, 15, 27].
                    const filtered = data.produit.filter(p => ProductsSelection.includes(p.ID_PRODUIT));
                    // Sauvegarde des 4 produits dans la mémoire de la page (state)
                    setSelectionProduits(filtered);
                }
            } catch (err) {
                // S'il y a eu un crash (serveur éteint, pas de wifi...), message --> console.
                console.error("Erreur chargement Home :", err);
            } finally {
                // 5. Quoi qu'il arrive (succès ou échec), "l'interrupteur" de chargement s'éteint
                setIsLoading(false);
            }
        };
        // Execution de la fonction asynchrone qui vient d'être créee
        fetchProduits();
        // IMPORTANT --> Tableau vide []: Execute la fonction une seule fois car il y a besoin
        // seulement de récupérer + afficher les 4 produits UNE SEULE FOIS.
    }, []);


    // ---- CE QUI S'AFFICHE A L'ECRAN ----
    return (
        <>
            {/*REFERENCEMENT SEO */}
            <title>Accueil - CafThé</title>
            <meta name="description" content="Accueil d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, accueil, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

    <main>

            {/*HERO */}
            <section className="hero-home">
                 <img
                     src={PhotoHero}
                     alt="Photo d'une tasse de café"
                     fetchpriority="high"
                     loading="eager"
                     className="hero-image"
                 />

                    <div className="home-entete">
                        <h1>L'excellence du café et du thé</h1>
                        <p>
                            Découvrez une sélection raffinée de cafés et thés d'exception,
                            cultivés avec passion et respect de l'environnement.
                        </p>
                        <Link to="/boutique" className="btn btn-primaire">
                        Voir la boutique
                        </Link>
                    </div>
            </section>


            {/* SELECTION DES PRODUITS */}

            <section className="section-container selection">
                <h2>Notre sélection</h2>
                <p>
                    Découvrez nos produits les plus populaires,
                    choisis avec soin pour leur qualité exceptionnelle.
                </p>

                <div className="selection-card">
                    {/* C'est ici que l'on gère l'affichage*/}
                    {isLoading ? (

                        // Si "l'interrupteur" est vrai, on affiche un message de chargement"
                        <p>Chargement de nos sélections...</p>

                    ) : selectionProduits.length > 0 ? (
                        // SINON SI on a bien trouvé les 4 produits -> on fait une boucle (.map) pour créer les 4 cartes visuelles */
                        selectionProduits.map((produit) => (
                            <ProductCard key={produit.ID_PRODUIT} produit={produit} />
                        ))
                    ) : (
                        // SINON aucun produit trouvé -> on affiche un message
                        <p>Aucune sélection disponible pour le moment.</p>
                    )}
                </div>

                    <Link to="/boutique" className="btn btn-secondaire">
                        Voir toute la boutique
                    </Link>
            </section>

                   {/* OFFRES ET PROGRAMME */}
            <section className="section-container offre">
                <h2>Nos Offres et Programmes Fidélité</h2>

                {/* CARTE 1 : OFFRE DU MOMENT */}
                <div className="offres-programme">
                    <article className="card-offre">
                        <div className="card-entete">
                            <h3>Offre du moment</h3>
                            {/* RGAA => aria-hidden="true": demande aux lecteurs d'écran d'igonrer le logo décoratif  */}
                            <img src={Etiquette} alt="pictogramme étiquette" aria-hidden="true" />
                        </div>
                            <p className="promotion-titre">-20% sur toute la boutique</p>
                            <p className="card-desc">
                                Profitez de notre offre exceptionnelle sur l'ensemble de nos cafés et thés premium
                                avec le code promo "BIENVENUE20".
                            </p>
                            <Link to="/boutique" className="btn btn-primaire">
                                J'en profite
                            </Link>
                    </article>


                    {/* CARTE 2 : FIDÉLITÉ */}
                    <article className="card-offre bordure">
                        <div className="card-entete">
                            <h3>Programme fidélité</h3>
                            <img src={Offre} alt="pictogramme cadeau" aria-hidden="true" />
                        </div>
                        <p className="promotion-titre">Rejoignez notre club</p>
                        <p className="card-desc">
                            Bénéficiez d'avantages exclusifs, de réductions privilèges et
                            d'un accès prioritaire à nos nouvelles collections.
                        </p>
                        <Link to="/login" className="btn btn-primaire">
                            Découvrir
                        </Link>
                    </article>
                </div>
            </section>




            {/*HISTOIRE */}
            <section className="section-container histoire">

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

                    {/* ENGAGEMENTS */}
                    <div className="engagements">

                        <article className="engagements-article">
                            <div className="engagements-icone">
                                <img src={Agriculture} alt="Pictogramme d'une feuille" aria-hidden="true" />
                            </div>
                            <div className="engagements-text">
                                <strong>AGRICULTURE DURABLE</strong>
                                <p>Nos produits sont issus de cultures biologiques.</p>
                            </div>
                        </article>

                        <article className="engagements-article">
                            <div className="engagements-icone">
                                <img src={Commerce} alt="Pictogramme d'un coeur" aria-hidden="true" />
                            </div>
                            <div className="engagements-text">
                                <strong>COMMERCE ÉQUITABLE</strong>
                                <p>Nous travaillons directement avec les producteurs.</p>
                            </div>
                        </article>

                        <article className="engagements-article">
                            <div className="engagements-icone">
                                <img src={Impact} alt="Pictogramme du globe terrestre" aria-hidden="true" />
                            </div>
                            <div className="engagements-text">
                                <strong>IMPACT POSITIF</strong>
                                <p>Projets de reforestation et développement local.</p>
                            </div>
                        </article>
                    </div>

                </div>

            </section>

        </main>
        </>

    );
}
export default Home;
