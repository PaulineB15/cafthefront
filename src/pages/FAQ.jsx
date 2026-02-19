import React from 'react';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import './PageLegales.css';

const FAQ = () => {
    return (
        <main className="legal-page">
            {/* HERO SECTION : Même classe que MentionsLegales/CGV */}
            <section className="legal-hero" style={{ backgroundImage: `url(${HeroInformations})` }}>
                <div className="hero-legal-overlay">
                    <div className="hero-legal-content">
                        <h1>Foire Aux Questions</h1>
                        <p>Les réponses à vos questions les plus fréquentes.</p>
                    </div>
                </div>
            </section>

            {/* CONTAINER = classe wide pour la grille FAQ */}
            <div className="legal-container faq-wide">

                {/* --- Section Questions: Commandes & Paiement --- */}
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

                {/* --- Section Questions: Livraison --- */}
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

                {/* --- Section Questions: Produits --- */}
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
            </div>
        </main>
    );
};

export default FAQ;