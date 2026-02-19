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

    // Gestion pour l'inscription
    const [registerData, setRegisterData] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        motDePasse: "",
        confirmPassword: ""
    });

    // Pour indiquer si l'inscription a réussi ( message)
    const [successMsg, setSuccessMsg] = useState("");

    // C'est pour savoir d'où vient l'utilisateur
    const location = useLocation();
    // Si "location.state.from" existe, c'est notre destination, sinon -> home.jsx (Accueil)
    // ?. dit à React : "Essaye de lire from seulement si state existe. Sinon, ne plante pas et renvoie undefined
    const from = location.state?.from || "/"; // || --> OU la page d'accueil "/"
    // Cette variable from contient maintenant soit "/commande" (si on vient du panier), soit "/" (par défaut


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

    // --- FONCTION POUR L'INSCRIPTION ---
    const handleRegisterChange = (e) => {
        setRegisterData({...registerData, [e.target.name]: e.target.value});
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
                    prenom: registerData.prenom,
                    nom: registerData.nom,
                    email: registerData.email,
                    tel: registerData.telephone,
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
                    <div className="auth-tabs">
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
                    </div>

                    <div className="auth-content">
                        {/* Affichage des messages globaux */}
                        {errorMsg && <div className="alert error">{errorMsg}</div>}
                        {successMsg && <div className="alert success">{successMsg}</div>}

                        {/* --- PARTIE 1 : FORMULAIRE DE CONNEXION --- */}
                        {activeTab === 'login' && (
                            <div className="form-wrapper fade-in">
                                <h2>BIENVENUE</h2>
                                <p className="subtitle">Connectez-vous pour accéder à votre compte et retrouver vos commandes</p>

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
                                            placeholder="......."
                                            onChange={(e) => setMotDePasse(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-footer">
                                        <label className="checkbox-label">
                                            <input type="checkbox" /> Se souvenir de moi
                                        </label>
                                        <Link to="/forgot-password" style={{ color: 'var(--gold-detail)', fontSize: '0.85rem' }}>
                                            Mot de passe oublié ?
                                        </Link>
                                    </div>

                                    <button type="submit" className="btn btn-primary w-100">
                                        SE CONNECTER
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* --- PARTIE 2 : FORMULAIRE D'INSCRIPTION --- */}
                        {activeTab === 'register' && (
                            <div className="form-wrapper fade-in">
                                <h2>CRÉER UN COMPTE</h2>
                                <p className="subtitle">Rejoignez-nous et profitez d'une expérience personnalisée</p>

                                <form onSubmit={handleRegisterSubmit}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Prénom</label>
                                            <input type="text" name="prenom" required
                                                   placeholder="Jean"
                                                   value={registerData.prenom} onChange={handleRegisterChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Nom</label>
                                            <input type="text" name="nom" required
                                                   placeholder="Dupont"
                                                   value={registerData.nom} onChange={handleRegisterChange} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Adresse Email</label>
                                        <input type="email" name="email" required
                                               placeholder="votre@email.com"
                                               value={registerData.email} onChange={handleRegisterChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input type="tel" name="telephone" required
                                               placeholder="+33 6 12 34 56 78"
                                               value={registerData.telephone} onChange={handleRegisterChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Mot de passe</label>
                                        <input type="password" name="motDePasse" required
                                               placeholder="Minimum 12 caractères"
                                               value={registerData.motDePasse} onChange={handleRegisterChange} />
                                    </div>

                                    <div className="form-group">
                                        <label>Confirmer le mot de passe</label>
                                        <input type="password" name="confirmPassword" required
                                               placeholder="......."
                                               value={registerData.confirmPassword} onChange={handleRegisterChange} />
                                    </div>

                                    <p className="legal-text">
                                        J'accepte les conditions générales de vente et la politique de confidentialité
                                    </p>

                                    <button type="submit" className="btn btn-primary w-100">
                                        CRÉER MON COMPTE
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;