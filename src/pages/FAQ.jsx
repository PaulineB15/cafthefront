import React, { useState } from 'react';
import HeroFAQ from '../assets/photo/HeroBoutique.webp'; // Tu peux mettre une autre photo ici
import './FAQ.css';

const FAQ = () => {
    // État pour savoir quelle question est ouverte (null = aucune)
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        // Si on clique sur celle déjà ouverte, on la ferme, sinon on l'ouvre
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Données de la FAQ (Tu pourras modifier les textes ici)
    const faqData = [
        {
            category: "COMMANDES & PAIEMENT",
            items: [
                {
                    question: "Quels sont les moyens de paiement acceptés ?",
                    answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express) ainsi que les paiements via PayPal. Toutes les transactions sont sécurisées."
                },
                {
                    question: "Puis-je modifier ma commande après validation ?",
                    answer: "Nous traitons les commandes très rapidement. Si vous souhaitez modifier votre commande, contactez-nous par téléphone dans l'heure suivant votre achat. Passé ce délai, nous ne pourrons plus garantir la modification."
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
                    answer: "Pour la France métropolitaine, le délai standard est de 2 à 4 jours ouvrés. En période de forte affluence (Noël, Soldes), ce délai peut être légèrement allongé."
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
                    answer: "Nous sélectionnons nos producteurs avec soin. Nos cafés viennent principalement d'Amérique du Sud et d'Afrique, et nos thés d'Asie (Chine, Japon, Inde). L'origine exacte est indiquée sur chaque fiche produit."
                },
                {
                    question: "Proposez-vous une mouture adaptée à ma machine ?",
                    answer: "Absolument. Sur la boutique, vous pouvez choisir entre café en grains ou café moulu. La mouture proposée est une mouture universelle adaptée aux cafetières filtres et italiennes."
                },
                {
                    question: "Vos produits sont-ils Bio ?",
                    answer: "Une grande partie de notre sélection est certifiée Agriculture Biologique. Recherchez le label Bio sur la fiche produit pour en être sûr."
                }
            ]
        }
    ];

    return (
        <main className="faq-page">

            {/* HERO SECTION */}
            <section className="faq-hero" style={{ backgroundImage: `url(${HeroFAQ})` }}>
                <div className="hero-overlay">
                    <div className="hero-content centered">
                        <h1>Foire Aux Questions</h1>
                        <p>Toutes les réponses à vos questions sur l'univers CafThé</p>
                    </div>
                </div>
            </section>

            {/* CONTENU ACCORDÉON */}
            <div className="faq-container">
                {faqData.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="faq-section">
                        <h2>{section.category}</h2>

                        <div className="faq-list">
                            {section.items.map((item, itemIndex) => {
                                // On crée un ID unique pour chaque question
                                const globalIndex = `${sectionIndex}-${itemIndex}`;
                                const isOpen = activeIndex === globalIndex;

                                return (
                                    <div
                                        key={globalIndex}
                                        className={`faq-item ${isOpen ? 'open' : ''}`}
                                        onClick={() => toggleFAQ(globalIndex)}
                                    >
                                        <div className="faq-question">
                                            <h3>{item.question}</h3>
                                            <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                                        </div>

                                        <div className={`faq-answer ${isOpen ? 'show' : ''}`}>
                                            <p>{item.answer}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Bloc contact si pas de réponse */}
                <div className="faq-footer">
                    <p>Vous ne trouvez pas la réponse à votre question ?</p>
                    <a href="/contact" className="btn-contact">Contactez-nous</a>
                </div>
            </div>
        </main>
    );
};

export default FAQ;