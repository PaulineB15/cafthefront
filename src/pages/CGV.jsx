import React from 'react';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import './MentionsLegales.css';

const CGV = () => {
    return (
        <main className="legal-page">
            <section className="legal-hero" style={{ backgroundImage: `url(${HeroInformations})` }}>
                <div className="hero-legal-overlay">
                    <div className="hero-legal-content">
                        <h1>Conditions Générales de Vente</h1>
                        <p>Dernière mise à jour : Février 2026</p>
                    </div>
                </div>
            </section>

            <div className="legal-container">
                <section className="legal-section">
                    <h2>Article 1 : Objet</h2>
                    <p>Les présentes conditions générales de vente (CGV) s'appliquent à toutes les ventes conclues sur le site CafThé. Elles visent à définir les relations contractuelles entre CafThé et le Client.</p>
                </section>

                <section className="legal-section">
                    <h2>Article 2 : Produits</h2>
                    <p>CafThé propose des cafés (grains ou moulus) et des thés. Compte tenu de la nature périssable de ces produits, les photographies du catalogue sont les plus fidèles possibles mais ne peuvent assurer une similitude parfaite avec le produit livré.</p>
                </section>

                <section className="legal-section">
                    <h2>Article 3 : Commande et Paiement</h2>
                    <p>Toute commande implique l'adhésion aux présentes CGV. Le paiement est exigible immédiatement par carte bancaire (Visa, Mastercard) ou PayPal.</p>
                </section>

                <section className="legal-section">
                    <h2>Article 4 : Livraison et Frais de port</h2>
                    <p>Les produits sont livrés sous 2 à 4 jours ouvrés en France métropolitaine.</p>
                    <ul className="legal-list">
                        <li><strong>Frais de port :</strong> Offerts pour toute commande supérieure ou égale à 50 €.</li>
                        <li><strong>Retrait magasin :</strong> Gratuit dans notre boutique au 123 Rue de la Paix, 75001 Paris.</li>
                        <li><strong>Livraison standard :</strong> Pour toute commande inférieure à 50 €, les frais sont calculés lors de la validation du panier.</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>Article 5 : Droit de rétractation</h2>
                    <p>Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation de 14 jours ne s'applique pas aux produits alimentaires descellés ou ouverts après la livraison pour des raisons d'hygiène et de protection de la santé.</p>
                    <p>Pour les accessoires non alimentaires (théières, moulins), le Client dispose de 14 jours pour retourner le produit dans son emballage d'origine.</p>
                </section>

                <section className="legal-section">
                    <h2>Article 6 : Médiation</h2>
                    <p>En cas de litige, le Client peut s'adresser au service client de CafThé. Si aucune solution n'est trouvée, le Client peut recourir gratuitement à un médiateur de la consommation conformément aux dispositions du Code de la consommation.</p>
                </section>

                <div className="legal-footer">
                    <p>CafThé SAS — Capital social n/a€ — SIRET en cours</p>
                    <a href="/contact" className="btn btn-primary">Une question ? Contactez-nous</a>
                </div>
            </div>
        </main>
    );
};

export default CGV;