import React from 'react';
import HeroInformations from '../assets/photo/HeroInformations.webp';
import './PageLegales.css';

const Confidentialite = () => {
    return (
        <main className="legal-page">
            <section className="legal-hero" style={{ backgroundImage: `url(${HeroInformations})` }}>
                <div className="hero-legal-overlay">
                    <div className="hero-legal-content">
                        <h1>Politique de Confidentialité</h1>
                        <p>Protection de vos données personnelles (RGPD).</p>
                    </div>
                </div>
            </section>

            <div className="legal-container">
                <section className="legal-section">
                    <h2>Collecte des données</h2>
                    <p>Nous collectons vos informations lors de la création de votre compte et du passage de commande (nom, adresse, email, téléphone).</p>
                </section>

                <section className="legal-section">
                    <h2>Formulaire de contact et Sous-traitance</h2>
                    <p>
                        Pour la gestion de vos demandes de contact, nous utilisons le service tiers <strong>Formspree</strong>.
                        En soumettant notre formulaire de contact, vous acceptez que les informations saisies (nom, adresse email, message)
                        soient transmises à Formspree pour traitement conformément à leur
                        <a href="https://formspree.io/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="legal-link"> politique de confidentialité</a>.
                    </p>
                    <p>
                        Ces données sont utilisées exclusivement pour nous permettre de vous répondre et ne sont jamais revendues à des tiers.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>Utilisation des données</h2>
                    <p>Vos données servent exclusivement à :</p>
                    <ul className="legal-list">
                        <li>Traiter vos commandes et livraisons.</li>
                        <li>Vous envoyer notre newsletter (uniquement avec votre consentement).</li>
                        <li>Améliorer votre expérience sur notre boutique.</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>Vos droits</h2>
                    <p>Vous disposez d'un droit d'accès, de modification et de suppression de vos données. Pour l'exercer, contactez-nous à <b>contact@cafthe.fr</b>.</p>
                </section>
            </div>
        </main>
    );
};

export default Confidentialite;