// IMPORT DES OUTILS REACT ET ROUTER

import React, { useState, useContext } from "react";
// useLocation : Pour lire les données invisibles envoyées par la page précédente (ex: le Panier)
// useNavigate : Pour forcer le changement de page
import {useLocation, useNavigate} from "react-router-dom";


//  IMPORT AUTHCONTEXT
// AuthContext permet de dire à TOUT le site : "Cet utilisateur est connecté !"
import { AuthContext } from "../context/AuthContext.jsx"

//  IMPORT PHOTO / CSS
import HeroCompte from "../assets/photo/HeroCompte.webp";
import "../styles/Login.css";



const Login = () => {
    //  RÉCUPÉRATION DE L'OUTIL DE CONNEXION DEPUIS AUTHCONTEXT
    // On extrait la fonction 'login' qui mettra à jour l'état global de l'application
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    // GESTION DES ONGLETS (CONNEXION / INSCRIPTION)
    // activeTab détermine ce qui s'affiche : 'login' (par défaut), 'register', ou 'forgot'
    const [activeTab, setActiveTab] = useState("login");

    // MÉMOIRE (STATE) POUR LE FORMULAIRE DE CONNEXION
    // Email et mot de passe pour l'identification
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errorMsg, setErrorMsg] = useState(""); // Stocke les messages d'erreur en rouge

    // (STATE) POUR LE MOT DE PASSE OUBLIÉ
    const [forgotEmail, setForgotEmail] = useState("");

    // GESTION DE L'INSCRIPTION
    const [registerData, setRegisterData] = useState({
        email: "",
        motDePasse: "",
        confirmPassword: "",
        rgpd: false // La case RGPD est décochée par défaut -> consentement de l'utilisateur
    });

    // Pour indiquer si l'inscription a réussi ( message)
    const [successMsg, setSuccessMsg] = useState(""); // Stocke les messages de succès en vert

    // D' OU VIENT L'UTILISATEUR ?
    const location = useLocation();
    // On cherche à savoir d'où vient l'utilisateur.
    // S'il vient du panier, location.state.from vaudra "/commande".
    // Sinon (grâce au ||), il ira vers l'accueil "/" par défaut.
    const from = location.state?.from || "/"; // || --> OU la page d'accueil "/"
    // Cette variable from contient maintenant soit "/commande" (si on vient du panier), soit "/" (par défaut



    // FONCTION DE CONNEXION
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        setErrorMsg(""); // Efface anciennes erreurs

        try {
            // Appel à l'API (Backend) pour vérifier l'email et le mot de passe
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/clients/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // Très important : autorise la création du cookie de session sécurisé
                    body: JSON.stringify({
                        email,
                        mot_de_passe: motDePasse,
                    }),
                },
            );

            const data = await response.json();

            // Si le serveur répond que les identifiants sont faux (Erreur 400 ou 401)
            if (!response.ok) {
                setErrorMsg(data.message || "Erreur de connexion");
                return; // Arrêt de la fonction ici
            }


            // Envoie les données du client au AuthContext pour l'enregistrer dans toute l'appli
            login(data.client);


            // Si on vient du panier, on ira vers "/commande"
            navigate(from, { replace: true, state: location.state });
            // replace: true pour éviter que l'utilisateur ne
            // retombe sur la page de connexion s'il clique sur le bouton 'Retour'.
            // Cela remplace la page Login par la page Commande dans l'historique du navigateur.

        } catch (error) {
            console.error("Erreur lors de la connexion: ", error);
            setErrorMsg("Une erreur s'est produite lors de la connexion");
        }
    };

    //  FONCTION POUR L'INSCRIPTION POUR RECUPERER A LA FOIS LES DONNEES EMAIL / MOT DE PASSE + CASE A COCHER RGPD
    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterData({
            ...registerData,
            // Si c'est une checkbox, on prend 'checked' (vrai/faux), sinon on prend 'value' (le texte)
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Déclenché quand on clique sur "CRÉER MON COMPTE"
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        // Sécurité: Vérification 12 caractères
        if (registerData.motDePasse.length < 12) {
            setErrorMsg("Le mot de passe doit contenir au moins 12 caractères.");
            return;
        }

        // Sécurité: Vérification que les mots de passe sont identiques
        if (registerData.motDePasse !== registerData.confirmPassword) {
            setErrorMsg("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            // Envoi de la demande de création de compte à l'API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: registerData.email,
                    mot_de_passe: registerData.motDePasse
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.message || "Erreur lors de l'inscription");
                return;
            }

            // Si c'est un succès --> message vert et on bascule l'onglet sur "Connexion"
            setSuccessMsg("Compte créé ! Veuillez vous connecter.");
            setActiveTab("login");

        } catch (error) {
            console.error("Erreur inscription:", error);
            setErrorMsg("Erreur technique lors de l'inscription.");
        }
    };




    return (

        <>
            <title>Login - CafThé</title>
            <meta name="description" content="Page login d'un site e-commerce d'une boutique de café et thé haut de gamme"/>
            <meta name="keywords"
                  content="CafThé, login, site e-commerce, haut de gamme, café, thé, produits de qualité, engagement RSE, commerce équitable"/>

        <main className="login-page">

            {/*  HERO SECTION  */}

            <section className="login-hero">
                <img
                    src={HeroCompte}
                    alt="Zoom d'une photo d'un homme d'affaire tenant une tasse de café"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"/>

                <div className="hero-login-filtre">
                    <div className="hero-login-entete">
                        <div className="login-icone">
                            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                <circle cx="12" cy="7" r="4"/>
                            </svg>
                        </div>
                        <h1>MON COMPTE</h1>
                        <p>Connectez-vous ou créez un compte pour accéder à votre espace personnel</p>
                    </div>
                </div>
            </section>


            {/* CONTAINER GLOBAL CONNEXION / INSCRIPTION  */}
            <section className="login-section">
                <div className="login-container">

                    {/*  NAVIGATION ONGLETS (TABS)  */}
                    {/* Les boutons changent la valeur de activeTab ('login' ou 'register') au clic */}
                    <nav className="login-onglet">
                        <button
                            className={`onglet-btn ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            SE CONNECTER
                        </button>
                        <button
                            className={`onglet-btn ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            CRÉER UN COMPTE
                        </button>
                    </nav>

                    <div className="login-content">
                        {/* Zone d'affichage des erreurs/succès (S'il y en a, on les affiche) */}
                        {errorMsg && <div className="alert error">{errorMsg}</div>}
                        {successMsg && <div className="alert success">{successMsg}</div>}

                        {/*  ONGLET 1 : FORMULAIRE DE CONNEXION  */}
                        {/* N'apparaît que si activeTab === 'login' */}
                        {activeTab === 'login' && (
                            <section className="form-wrapper fade-in">
                                <h2>BIENVENUE</h2>
                                <p className="subtitle">Connectez-vous pour accéder à votre compte et retrouver vos commandes.</p>

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="email">Adresse Email</label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            required
                                            placeholder="votre@email.com"
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="password">Mot de passe</label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={motDePasse}
                                            required
                                            placeholder="............."
                                            onChange={(e) => setMotDePasse(e.target.value)}
                                        />
                                    </div>

                                    {/* Lien "Mot de passe oublié" : bascule sur le 3ème onglet " Mot de passe oublié" */}
                                    <div className="form-footer">
                                        <button type="button" className="btn-link" onClick={() => {setActiveTab('forgot'); setErrorMsg(""); setSuccessMsg("");}}>
                                            Mot de passe oublié ?
                                        </button>
                                    </div>

                                    <button type="submit" className="btn btn-primaire w-100">
                                        SE CONNECTER
                                    </button>
                                </form>
                            </section>
                        )}

                        {/*  ONGLET 2 : CREER UN COMPTE  */}
                        {/* N'apparaît que si activeTab === 'register'*/}
                        {activeTab === 'register' && (
                            <section className="form-wrapper fade-in">
                                <h2>CRÉER UN COMPTE</h2>
                                <p className="subtitle">Rejoignez-nous et profitez d'une expérience personnalisée.</p>

                                <form onSubmit={handleRegisterSubmit}>

                                    <div className="form-group">
                                        <label>Adresse Email</label>
                                        <input type="email" name="email" required
                                               placeholder="votre@email.com"
                                               value={registerData.email} onChange={handleRegisterChange} />
                                    </div>


                                    <div className="form-group">
                                        <label>Mot de passe</label>
                                        <input type="password" name="motDePasse" required
                                               placeholder="Minimum 12 caractères"
                                               value={registerData.motDePasse} onChange={handleRegisterChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirmer le mot de passe</label>
                                        <input type="password" name="confirmPassword" required // Mot de passe à retaper obligatoirement
                                               placeholder="............."
                                               value={registerData.confirmPassword} onChange={handleRegisterChange} />
                                    </div>

                                    <div className="form-checkbox" style={{ marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                        <input
                                            type="checkbox"
                                            id="rgpd"
                                            name="rgpd"
                                            checked={registerData.rgpd}
                                            onChange={handleRegisterChange}
                                            required //Case à coché obligatoire
                                            style={{ width: 'auto', marginTop: '4px' }}
                                        />
                                        <label htmlFor="rgpd" style={{ color: '#aaa', fontSize: '0.85rem', textTransform: 'none', letterSpacing: 'normal' }}>
                                            J'accepte que mes données soient utilisées pour la création et la gestion de mon compte.
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primaire w-100">
                                        CRÉER MON COMPTE
                                    </button>
                                </form>
                            </section>
                        )}

                        {/*  ONGLET 3 : MOT DE PASSE OUBLIÉ  */}
                        {/* N'apparaît que si activeTab === 'forgot'*/}
                        {activeTab === 'forgot' && (
                            <section className="form-wrapper fade-in">
                                <h2>MOT DE PASSE OUBLIÉ</h2>
                                <p className="subtitle">Entrez votre email. Si un compte y est associé, nous vous enverrons un lien de réinitialisation.</p>

                                {/* Ici, l'envoi à l'API est écrit directement "en ligne" dans le onSubmit */}
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    setErrorMsg(""); setSuccessMsg("");
                                    try {
                                        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/forgot-password`, {
                                            method: "POST", headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ email: forgotEmail })
                                        });
                                        const data = await res.json();
                                        setSuccessMsg(data.message);
                                    } catch (err) { setErrorMsg("Erreur de connexion au serveur."); }
                                }}>
                                    <div className="form-group">
                                        <label>Adresse Email</label>
                                        <input type="email" required placeholder="votre@email.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-primaire w-100" style={{marginBottom: "15px"}}>
                                        ENVOYER LE LIEN
                                    </button>
                                    {/* Bouton pour revenir à la connexion */}
                                    <button type="button" className="btn btn-secondaire w-100" onClick={() => { setActiveTab('login'); setErrorMsg(""); setSuccessMsg(""); }}>
                                        RETOUR À LA CONNEXION
                                    </button>
                                </form>
                            </section>
                        )}

                    </div>
                </div>
            </section>
        </main>
        </>
    );
};

export default Login;