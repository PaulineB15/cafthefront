
// IMPORT DES OUTILS REACT ET ROUTER

import React, { useState } from 'react';
// Link : Pour naviguer vers la FAQ sans recharger la page
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// IMPORT PHOTO + ICONES
import HeroContact from '../assets/photo/Hero-Contact.webp';
import IconMap from '../assets/picto/contact1.svg';
import IconPhone from '../assets/picto/contact2.svg';
import IconMail from '../assets/picto/contact3.svg';
import IconClock from '../assets/picto/contact4.svg';
import '../styles/Contact.css';



const Contact = () => {
    //--- MÉMOIRE DU FORMULAIRE ("State")
    // Regrouper toutes les données du formulaire qui sont necessaires.
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        message: '',
        rgpd: false  // La case RGPD est décochée par défaut pour obtenir le consentement de l'utilisateur'
    });


    // --- FONCTION DE MISE À JOUR (Quand l'utilisateur tape au clavier)

    const handleChange = (e) => {
        // e.target représente le champ HTML exact que l'utilisateur est en train de modifier.
        // On extrait son nom (name), sa valeur (value), son type, et s'il est coché (checked).
        const { name, value, type, checked } = e.target;
        // Mise à jour l'objet formData en gardant les anciennes valeurs (...prev)
        setFormData(prev => ({
            ...prev,
            // Astuce : Si c'est la case à cocher, on enregistre "checked" (Vrai/Faux). Sinon, on enregistre le texte tapé.
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    // --- FONCTION D'ENVOI DU FORMULAIRE (Quand on clique sur "Envoyer")

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
            // Envoi le message vers une vrai adresse email API "Formspree"
        const response = await fetch("https://formspree.io/f/xnjbgzao", {
            method: "POST", // Envoi les données
            body: JSON.stringify(formData), // On transforme notre objet JS en texte lisible par le serveur
            headers: {
                'Accept': 'application/json' // On dit au serveur : "Réponds-moi en format JSON s'il te plaît"
            }
        });

        // --- REPONSE DU SERVEUR---
        if (response.ok) {
            // Si l'envoi a réussi -> jolie notification via toast
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
            // Si le serveur a planté --> affiche une alerte d'erreur
            toast.error("Oups ! Un problème est survenu lors de l'envoi.");
        }
    };

    // ---- CE QUI S'AFFICHE A L'ECRAN ----

    return (
        <>
                {/*REFERENCEMENT SEO */}
                <title>Contact - CafThé</title>
                <meta name="description" content="Page contact d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
                <meta name="keywords"
                      content="CafThé, contact, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main className="contact-page">

            {/* SECTION HERO */}

            <section className="contact-hero">
                {/* Couche 1 : Image de fond */}
                <img
                    src={HeroContact}
                    alt="Ambiance boutique CafThé"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"/>

                {/* Couche 2 : Filtre sombre */}
                <div className="hero-contact-filtre">
                    {/* Couche 3 : Contenu */}
                    <div className="hero-contact-contenu">
                        <div className="hero-icone">
                            <svg aria-hidden="true" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                        </div>
                        <h1>CONTACTEZ-NOUS</h1>
                        <p>Une question ? Un projet ? Notre équipe est à votre écoute.</p>
                    </div>
                </div>
            </section>

            {/* CONTENU PRINCIPAL (2 colonnes) */}
            <section className="contact-container">
                <div className="contact-structure">

                    {/* COLONNE GAUCHE : COORDONNÉES */}
                    <aside className="contact-infos">
                        <h2>NOS COORDONNÉES</h2>

                        <aside className="info-list">
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
                        </aside>

                        {/* Bloc Besoin d'aide */}
                        <article className="help-box">
                            <h3>BESOIN D'AIDE ?</h3>
                            <p>Consultez notre FAQ pour trouver rapidement des réponses à vos questions.</p>
                            <Link to="/faq" className="btn btn-secondaire">VOIR LA FAQ</Link>
                        </article>
                    </aside>


                    {/* COLONNE DROITE : FORMULAIRE */}
                    <section className="contact-form-wrapper">
                        <h2>ENVOYEZ-NOUS UN MESSAGE</h2>
                        <p className="form-intro">Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.</p>

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
                                    required /* Le navigateur bloquera l'envoi si c'est vide */
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

                            <button type="submit" className="btn btn-primaire w100 flex-center">
                                <span>ENVOYER LE MESSAGE</span>
                                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </form>
                    </section>

                </div>
            </section>
        </main>
        </>
    );
};

export default Contact;