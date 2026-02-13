import React from 'react';
import HeroFAQ from '../assets/photo/HeroBoutique.webp'; // Ou une autre photo
import './FAQ.css';

const FAQ = () => {

    // Données de la FAQ
    const faqData = [
        {
            category: "COMMANDES & PAIEMENT",
            items: [
                {
                    question: "Quels sont les moyens de paiement acceptés ?",
                    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que les paiements via PayPal. Toutes les transactions sont sécurisées."
                },
                {
                    question: "Puis-je modifier ma commande après validation ?",
                    answer: "Nous traitons les commandes très rapidement. Si vous souhaitez modifier votre commande, contactez-nous par téléphone dans l'heure suivant votre achat."
                },
                {
                    question: "Comment utiliser mon code promo ?",
                    answer: "Vous pouvez entrer votre code promotionnel dans le panier, juste avant de procéder au paiement. La réduction s'appliquera automatiquement."
                }
            ]
        },
        {
            category: "LIVRAISON",
            items: [
                {
                    question: "Quels sont les délais de livraison ?",
                    answer: "Pour la France métropolitaine, le délai standard est de 2 à 4 jours ouvrés. En période de forte affluence, ce délai peut être légèrement allongé."
                },
                {
                    question: "Livrez-vous à l'international ?",
                    answer: "Oui, nous livrons dans toute l'Europe. Les frais de livraison sont calculés automatiquement lors de la validation de votre panier."
                }
            ]
        },
        {
            category: "NOS PRODUITS",
            items: [
                {
                    question: "D'où viennent vos cafés et thés ?",
                    answer: "Nous sélectionnons nos producteurs avec soin. Nos cafés viennent principalement d'Amérique du Sud et d'Afrique, et nos thés d'Asie. L'origine exacte est indiquée sur chaque fiche produit."
                },
                {
                    question: "Proposez-vous une mouture adaptée à ma machine ?",
                    answer: "Absolument. Sur la boutique, vous pouvez choisir entre café en grains ou café moulu (mouture universelle)."
                },
                {
                    question: "Vos produits sont-ils Bio ?",
                    answer: "Une grande partie de notre sélection est certifiée Agriculture Biologique. Recherchez le label Bio sur la fiche produit."
                }
            ]
        }
    ];

    return (
        <main className="faq-page">

            {/* HERO SECTION (Identique aux autres pages) */}
            <section className="faq-hero" style={{ backgroundImage: `url(${HeroFAQ})` }}>
                <div className="hero-overlay">
                    <div className="hero-content centered">
                        <h1>Foire Aux Questions</h1>
                        <p>Les réponses à vos questions les plus fréquentes</p>
                    </div>
                </div>
            </section>

            {/* CONTENU STATIQUE */}
            <div className="faq-container">
                {faqData.map((section, index) => (
                    <div key={index} className="faq-section">
                        {/* Titre de la catégorie (ex: LIVRAISON) */}
                        <h2>{section.category}</h2>

                        {/* Grille de questions */}
                        <div className="faq-grid">
                            {section.items.map((item, i) => (
                                <article key={i} className="faq-card">
                                    <h3>{item.question}</h3>
                                    <p>{item.answer}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                ))}

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