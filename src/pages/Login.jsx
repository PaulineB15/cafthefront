import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {useLocation, useNavigate, Link} from "react-router-dom";
import HeroCompte from "../assets/photo/HeroCompte.webp";
import Moncompte from "../assets/picto/Moncompte.svg";
import "./Login.css";




const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();

    // Gestion des onglets (Connexion / Inscription)
    const [activeTab, setActiveTab] = useState("login");

    // Email et mot de passe pour l'identification
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Mot de passe oublié
    const [forgotEmail, setForgotEmail] = useState("");

    // Gestion pour l'inscription
    const [registerData, setRegisterData] = useState({
        email: "",
        motDePasse: "",
        confirmPassword: "",
        rgpd: false // La case RGPD est décochée par défaut obtenir le consentement de l'utilisateur'
    });

    // Pour indiquer si l'inscription a réussi ( message)
    const [successMsg, setSuccessMsg] = useState("");

    // C'est pour savoir d'où vient l'utilisateur
    const location = useLocation();
    // Si "location.state.from" existe, c'est notre destination, sinon -> home.jsx (Accueil)
    // ?. dit à React : "Essaye de lire from seulement si state existe. Sinon, ne plante pas et renvoie undefined
    const from = location.state?.from || "/"; // || --> OU la page d'accueil "/"
    // Cette variable from contient maintenant soit "/commande" (si on vient du panier), soit "/" (par défaut

    // const [forgotPassword, setForgotPassword] = useState("");


    // FONCTION DE CONNEXION
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/clients/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        email,
                        mot_de_passe: motDePasse,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMsg(data.message || "Erreur de connexion");
                return;
            }

            // const {client} = data;

            // Appel au login via le contexte
            login(data.client);

            // Puis retour à l'accueil
            // navigate("/");

            // Au lieu de navigate("/"), on va vers la variable "from"
            // Si on vient du panier, on ira vers "/commande"
            navigate(from, { replace: true });
            // replace: true pour éviter que l'utilisateur ne
            // retombe sur la page de connexion s'il clique sur le bouton 'Retour'.
            // Cela remplace la page Login par la page Commande dans l'historique du navigateur.

        } catch (error) {
            console.error("Erreur lors de la connexion: ", error);
            setErrorMsg("Une erreur s'est produite lors de la connexion");
        }
    };

    // --- FONCTION POUR L'INSCRIPTION POUR RECUPERER A LA FOIS LES DONNEES EMAIL / MOT DE PASSE + CASE A COCHER RGPD  ---
    const handleRegisterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setRegisterData({
            ...registerData,
            // Si c'est une checkbox, on prend 'checked' (vrai/faux), sinon on prend 'value' (le texte)
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        // Vérification 12 caractères
        if (registerData.motDePasse.length < 12) {
            setErrorMsg("Le mot de passe doit contenir au moins 12 caractères.");
            return;
        }

        if (registerData.motDePasse !== registerData.confirmPassword) {
            setErrorMsg("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
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

            setSuccessMsg("Compte créé ! Veuillez vous connecter.");
            setActiveTab("login"); // On bascule sur l'onglet connexion

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

        <main className="auth-page">
            <section className="auth-hero" style={{backgroundImage: `url(${HeroCompte})`}}>
                <div className="hero-overlay">
                    <div className="user-icon-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                    </div>
                    <h1>MON COMPTE </h1>
                    <p>Connectez-vous ou créez un compte pour accéder à votre espace personnel</p>
                </div>
            </section>

            {/* CONTAINER FENETRE CONNEXION / INSCRIPTION  */}

            <section className="auth-section">
                <div className="auth-container">
                    {/* --- ONGLETS (TABS) --- */}
                    <nav className="auth-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
                            onClick={() => setActiveTab('login')}
                        >
                            SE CONNECTER
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                            onClick={() => setActiveTab('register')}
                        >
                            CRÉER UN COMPTE
                        </button>
                    </nav>

                    <div className="auth-content">
                        {/* Affichage des messages globaux */}
                        {errorMsg && <div className="alert error">{errorMsg}</div>}
                        {successMsg && <div className="alert success">{successMsg}</div>}

                        {/* --- PARTIE 1 : FORMULAIRE DE CONNEXION --- */}
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

                                    <div className="form-footer">
                                        <button type="button" onClick={() => {setActiveTab('forgot'); setErrorMsg(""); setSuccessMsg("");}} style={{ background: 'none', border: 'none', color: 'var(--gold-detail)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                            Mot de passe oublié ?
                                        </button>
                                    </div>

                                    <button type="submit" className="btn btn-primaire w-100">
                                        SE CONNECTER
                                    </button>
                                </form>
                            </section>
                        )}

                        {/* --- PARTIE 2 : CREER UN COMPTE --- */}
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

                                    <button type="submit" className="btn btn-primary w-100">
                                        CRÉER MON COMPTE
                                    </button>
                                </form>
                            </section>
                        )}

                        {/* --- PARTIE 3 : MOT DE PASSE OUBLIÉ --- */}
                        {activeTab === 'forgot' && (
                            <section className="form-wrapper fade-in">
                                <h2>MOT DE PASSE OUBLIÉ</h2>
                                <p className="subtitle">Entrez votre email. Si un compte y est associé, nous vous enverrons un lien de réinitialisation.</p>

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
                                    <button type="submit" className="btn btn-primary w-100" style={{marginBottom: "15px"}}>
                                        ENVOYER LE LIEN
                                    </button>
                                    <button type="button" className="btn btn-secondary w-100" onClick={() => { setActiveTab('login'); setErrorMsg(""); setSuccessMsg(""); }}>
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