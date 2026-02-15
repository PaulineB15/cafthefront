import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroContact from '../assets/photo/Hero-Contact.webp';
import './Contact.css';

const Contact = () => {
    // Petit état pour gérer la soumission du formulaire (simulation)
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        message: '',
        rgpd: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Merci ! Votre message a bien été envoyé.");
        // Ici, tu connecteras plus tard ton envoi d'email (API)
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <main>

            {/* SECTION HERO */}
            <section className="contact-hero" style={{ backgroundImage: `url(${HeroContact})` }}>
                <div className="hero-contact-overlay">
                    <div className="hero-contact-content">
                        {/* Icône bulle de message (décorative) */}
                        <div className="hero-icon">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </div>
                        <h1>CONTACTEZ-NOUS</h1>
                        <p>Notre équipe est à votre écoute pour répondre à toutes vos questions</p>
                    </div>
                </div>
            </section>

            {/* CONTENU PRINCIPAL */}
            <div className="contact-container">
                <div className="contact-grid">

                    {/* COLONNE GAUCHE : COORDONNÉES */}
                    <section className="contact-infos">
                        <h2>NOS COORDONNÉES</h2>

                        <address className="info-list">
                            {/* Adresse */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src="src/assets/picto/contact1.svg" alt="Icone de localisation"/>
                                </div>
                                <div>
                                    <span className="info-label">ADRESSE</span>
                                    <p>123 Rue de la Paix<br/>75001 Paris, France</p>
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src="src/assets/picto/contact2.svg" alt="Icone de téléphone"/>
                                </div>
                                <div>
                                    <span className="info-label">TÉLÉPHONE</span>
                                    <p><a href="tel:+33123456789">+33 1 23 45 67 89</a></p>
                                    <small className="info-detail">Du lundi au vendredi, 9h - 18h</small>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src="src/assets/picto/contact3.svg" alt="Icone de mail"/>
                                </div>
                                <div>
                                    <span className="info-label">EMAIL</span>
                                    <p><a href="mailto:contact@cafthe.fr">contact@cafthe.fr</a></p>
                                    <small className="info-detail">Réponse sous 24h</small>
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src="src/assets/picto/contact4.svg" alt="Icone d'horaires"/>
                                </div>
                                <div>
                                    <span className="info-label">HORAIRES D'OUVERTURE</span>
                                    <p>Lundi - Vendredi : 9h00 - 18h00</p>
                                    <p>Samedi : 10h00 - 17h00</p>
                                    <p>Dimanche : Fermé</p>
                                </div>
                            </div>
                        </address>

                        {/* Bloc Besoin d'aide */}
                        <div className="help-box">
                            <p>BESOIN D'AIDE ?</p>
                            <p>Consultez notre FAQ pour trouver rapidement des réponses à vos questions les plus fréquentes.</p>
                            <Link to="/faq" className="btn-outline">VOIR LA FAQ</Link>
                        </div>
                    </section>

                    {/* COLONNE DROITE : FORMULAIRE */}
                    <section className="contact-form-wrapper">
                        <h2>ENVOYEZ-NOUS UN MESSAGE</h2>
                        <p className="form-intro">Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais</p>

                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="nom">NOM COMPLET</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    placeholder="Jean Dupont"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">ADRESSE EMAIL</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">MESSAGE</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    placeholder="Écrivez votre message ici..."
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-checkbox">
                                <input
                                    type="checkbox"
                                    id="rgpd"
                                    name="rgpd"
                                    checked={formData.rgpd}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="rgpd">
                                    J'accepte que mes données soient utilisées pour traiter ma demande. <Link to="/confidentialite">Politique de confidentialité</Link>
                                </label>
                            </div>

                            <button type="submit" className="btn-submit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight:'8px'}}><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                ENVOYER LE MESSAGE
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default Contact;