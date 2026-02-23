import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroContact from '../assets/photo/Hero-Contact.webp';
import toast from 'react-hot-toast';

// IMPORT DES ICONES (Assure-toi que les fichiers existent bien dans src/assets/picto/)
import IconMap from '../assets/picto/contact1.svg';
import IconPhone from '../assets/picto/contact2.svg';
import IconMail from '../assets/picto/contact3.svg';
import IconClock from '../assets/picto/contact4.svg';

import './Contact.css';
import {Helmet} from "react-helmet-async";

const Contact = () => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        message: '',
        rgpd: false  // La case RGPD est décochée par défaut pour obtenir le consentement de l'utilisateur'
    });

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
            // Envoi le message vers une vrai adresse email
        const response = await fetch("https://formspree.io/f/xnjbgzao", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            toast.success(`Merci ${formData.nom} ! Votre message a bien été envoyé.`, {
                style: {
                    background: '#222',
                    color: '#fff',
                    border: '1px solid #C5A059',
                },
                iconTheme: {
                    primary: '#C5A059',
                    secondary: '#222',
                },
            });
            // Reset du formulaire après succès
            setFormData({ nom: '', email: '', message: '', rgpd: false });
        } else {
            toast.error("Oups ! Un problème est survenu lors de l'envoi.");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <>
                <title>Contact - CafThé</title>
                <meta name="description" content="Page contact d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
                <meta name="keywords"
                      content="CafThé, contact, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main className="contact-page">

            {/* SECTION HERO */}
            <section className="contact-hero" style={{ backgroundImage: `url(${HeroContact})` }}>
                <div className="hero-contact-overlay">
                    <div className="hero-contact-content">
                        <div className="hero-icon">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </div>
                        <h1>CONTACTEZ-NOUS</h1>
                        <p>Une question ? Un projet ? Notre équipe est à votre écoute.</p>
                    </div>
                </div>
            </section>

            {/* CONTENU PRINCIPAL */}
            <div className="contact-container">
                <div className="contact-grid">

                    {/* COLONNE GAUCHE : COORDONNÉES */}
                    <section className="contact-infos">
                        <h2>NOS COORDONNÉES</h2>

                        <div className="info-list">
                            {/* Adresse */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src={IconMap} alt="Icone localisation" aria-hidden="true"/>
                                </div>
                                <div className="info-content">
                                    <span className="info-label">ADRESSE</span>
                                    <p>123 Rue de la Paix<br/>75001 Paris, France</p>
                                </div>
                            </div>

                            {/* Téléphone */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src={IconPhone} alt="Icone téléphone" aria-hidden="true"/>
                                </div>
                                <div className="info-content">
                                    <span className="info-label">TÉLÉPHONE</span>
                                    <p>+33 1 23 45 67 89</p>
                                    <span className="info-detail">Du lundi au vendredi, 9h - 18h</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src={IconMail} alt="Icone email" aria-hidden="true"/>
                                </div>
                                <div className="info-content">
                                    <span className="info-label">EMAIL</span>
                                    <p><a href="mailto:contact@cafthe.fr">contact@cafthe.fr</a></p>
                                    <span className="info-detail">Réponse sous 24h</span>
                                </div>
                            </div>

                            {/* Horaires */}
                            <div className="info-item">
                                <div className="icon-circle">
                                    <img src={IconClock} alt="Icone horloge" aria-hidden="true"/>
                                </div>
                                <div className="info-content">
                                    <span className="info-label">HORAIRES D'OUVERTURE</span>
                                    <p>Lun - Ven : 9h00 - 18h00</p>
                                    <p>Sam : 10h00 - 17h00</p>
                                    <span className="info-detail">Dimanche : Fermé</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloc Besoin d'aide */}
                        <div className="help-box">
                            <p>BESOIN D'AIDE ?</p>
                            <p>Consultez notre FAQ pour trouver rapidement des réponses à vos questions.</p>
                            <Link to="/faq" className="btn btn-secondary">VOIR LA FAQ</Link>
                        </div>
                    </section>

                    {/* COLONNE DROITE : FORMULAIRE */}
                    <section className="contact-form-wrapper">
                        <h2>ENVOYEZ-NOUS UN MESSAGE</h2>
                        <p className="form-intro">Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.</p>

                        <form className="contact-form"
                              action="https://formspree.io/f/xnjbgzao"   // Lien pour envoyer le formulaire vers une vrai email
                              method="POST"
                              onSubmit={handleSubmit}>

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
                                    placeholder="jean.dupont@email.com"
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
                                    placeholder="Votre message..."
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
                                    required // Case à coché obligatoire
                                />
                                <label htmlFor="rgpd" style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'none', letterSpacing: 'normal' }}>
                                    J'accepte que mes données soient utilisées pour traiter ma demande.
                                </label>
                            </div>

                            <button type="submit" className="btn-submit">
                                <span>ENVOYER LE MESSAGE</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </main>
        </>
    );
};

export default Contact;