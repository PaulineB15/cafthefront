import React from 'react';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import './FAQ.css';

const FAQ = () => {
    return (
        <main className="faq-page">

            {/* HERO SECTION */}
            <section className="faq-hero" style={{ backgroundImage: `url(${HeroInformations})` }}>
                <div className="hero-faq-overlay">
                    <div className="hero-faq-content">
                        <h1>Foire Aux Questions</h1>
                        <p>Les réponses à vos questions les plus fréquentes.</p>
                    </div>
                </div>
            </section>

            {/* CONTENU (Écrit "en dur", facile à modifier) */}
            <div className="faq-container">

                {/* --- CATÉGORIE 1 --- */}
                <div className="faq-section">
                    <h2>COMMANDES & PAIEMENT</h2>

                    <div className="faq-grid">
                        {/* Question 1 */}
                        <article className="faq-card">
                            <h3>Quels sont les moyens de paiement acceptés ?</h3>
                            <p>Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que les paiements via PayPal. Toutes les transactions sont sécurisées.</p>
                        </article>

                        {/* Question 2 */}
                        <article className="faq-card">
                            <h3>Puis-je modifier ma commande après validation ?</h3>
                            <p>Nous traitons les commandes très rapidement. Si vous souhaitez modifier votre commande, contactez-nous par téléphone dans l'heure suivant votre achat.</p>
                        </article>

                        {/* Question 3 */}
                        <article className="faq-card">
                            <h3>Comment utiliser mon code promo ?</h3>
                            <p>Vous pouvez entrer votre code promotionnel dans le panier, juste avant de procéder au paiement. La réduction s'appliquera automatiquement.</p>
                        </article>
                    </div>
                </div>

                {/* --- CATÉGORIE 2 --- */}
                <div className="faq-section">
                    <h2>LIVRAISON</h2>

                    <div className="faq-grid">
                        <article className="faq-card">
                            <h3>Quels sont les délais de livraison ?</h3>
                            <p>Pour la France métropolitaine, le délai standard est de 2 à 4 jours ouvrés. En période de forte affluence, ce délai peut être légèrement allongé.</p>
                        </article>

                        <article className="faq-card">
                            <h3>Livrez-vous à l'international ?</h3>
                            <p>Oui, nous livrons dans toute l'Europe. Les frais de livraison sont calculés automatiquement lors de la validation de votre panier.</p>
                        </article>
                    </div>
                </div>

                {/* --- CATÉGORIE 3 --- */}
                <div className="faq-section">
                    <h2>NOS PRODUITS</h2>

                    <div className="faq-grid">
                        <article className="faq-card">
                            <h3>D'où viennent vos cafés et thés ?</h3>
                            <p>Nous sélectionnons nos producteurs avec soin. Nos cafés viennent principalement d'Amérique du Sud et d'Afrique, et nos thés d'Asie. L'origine exacte est indiquée sur chaque fiche produit.</p>
                        </article>

                        <article className="faq-card">
                            <h3>Proposez-vous une mouture adaptée à ma machine ?</h3>
                            <p>Absolument. Sur la boutique, vous pouvez choisir entre café en grains ou café moulu (mouture universelle).</p>
                        </article>

                        <article className="faq-card">
                            <h3>Vos produits sont-ils Bio ?</h3>
                            <p>Une grande partie de notre sélection est certifiée Agriculture Biologique. Recherchez le label Bio sur la fiche produit.</p>
                        </article>
                    </div>
                </div>

                {/* Footer FAQ */}
                <div className="faq-footer">
                    <p>Vous n'avez pas trouvé votre réponse ?</p>
                    <a href="/contact" className="btn-contact">Contactez-nous</a>
                </div>

            </div>
        </main>
    );
};

export default FAQ;