import React from 'react';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import '../styles/PageLegales.css';

const FAQ = () => {
    return (

        <>
            {/*REFERENCEMENT SEO */}
            <title>FAQ - CafThé</title>
            <meta name="description" content="FAQ d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, FAQ, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>


        <main>

            {/*HERO */}
            <section className="legal-hero">
                <img
                    src={HeroInformations}
                    alt="Grains de café en fond"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"
                />
                <div className="hero-legal-filtre">
                    <div className="hero-legal-contenu">
                        <h1>Foire Aux Questions</h1>
                        <p>Les réponses à vos questions les plus fréquentes.</p>
                    </div>
                </div>
            </section>


            <section className="legal-container faq">

                {/* SECTION COMMANDES & PAIEMENT */}
                <section className="legal-section">
                    <h2>Commandes & Paiement</h2>
                    <div className="faq-grid">
                        <article className="faq-card">
                            <h3>Quels sont les moyens de paiement acceptés ?</h3>
                            <p>Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que les paiements via PayPal. Toutes les transactions sont sécurisées.</p>
                        </article>

                        <article className="faq-card">
                            <h3>Puis-je modifier ma commande après validation ?</h3>
                            <p>Nous traitons les commandes très rapidement. Si vous souhaitez modifier votre commande, contactez-nous par téléphone dans l'heure suivant votre achat.</p>
                        </article>
                    </div>
                </section>

                {/* SECTION LIVRAISON */}
                <section className="legal-section">
                    <h2>Livraison</h2>
                    <div className="faq-grid">
                        <article className="faq-card">
                            <h3>Quels sont les délais de livraison ?</h3>
                            <p>Pour la France métropolitaine, le délai standard est de 2 à 4 jours ouvrés.</p>
                        </article>

                        <article className="faq-card">
                            <h3>Frais de livraison ?</h3>
                            <p>Les frais sont offerts dès 50 € d'achat ou pour tout retrait en magasin.</p>
                        </article>
                    </div>
                </section>

                {/* SECTION PRODUITS */}
                <section className="legal-section">
                    <h2>Nos produits</h2>
                    <div className="faq-grid">
                        <article className="faq-card">
                            <h3>D'où vient vos cafés et thés ?</h3>
                            <p>Nous sélectionnons nos producteurs avec soin.
                            Nos cafés viennent principalement d'Amérique du Sud, Afrique et Asie.
                            L'origine exacte est indiquée sur chaque fiche produit.</p>
                        </article>

                        <article className="faq-card">
                            <h3>Vos produits sont-ils bio ?</h3>
                            <p>Une grande partie de notre selection est certifiée Agriculture Biologique.
                            Recherchez le label Bio sur la fiche produit.</p>
                        </article>
                    </div>
                </section>
            </section>
        </main>
        </>
    );
};

export default FAQ;