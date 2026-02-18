import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {useLocation, useNavigate, Link} from "react-router-dom";
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


    // Fonction de connexion
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

    // --- NOUVEAU : FONCTION POUR L'INSCRIPTION ---
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
        <div className="auth-page"> {/* J'ai changé la classe pour correspondre au CSS fourni */}
            <div className="auth-container">

                {/* --- NOUVEAU : ONGLETS (TABS) --- */}
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


                    {/* --- PARTIE 1 : VOTRE FORMULAIRE DE CONNEXION EXISTANT --- */}
                    {activeTab === 'login' && (
                        <div className="form-wrapper fade-in">
                            <h2>Connexion</h2> {/* Votre titre d'origine */}

                            {/* J'ai gardé votre balise <form> et son onSubmit */}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="email">Email :</label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        required
                                        placeholder="votre@email.fr"
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password">Mot de passe :</label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={motDePasse}
                                        required
                                        placeholder="Votre mot de passe"
                                        onChange={(e) => setMotDePasse(e.target.value)}
                                    />
                                </div>

                                {/* --- AJOUT DEMANDÉ : Mot de passe oublié --- */}
                                <div className="form-footer" style={{textAlign: 'right', marginBottom: '15px'}}>
                                    <Link to="/forgot-password" style={{color: '#c5a47e', fontSize: '0.9rem'}}>
                                        Mot de passe oublié ?
                                    </Link>
                                </div>

                                {/* Affichage conditionnel du message d'erreur (VOTRE CODE) */}
                                {/* Je l'ai laissé ici, mais j'ai aussi mis un affichage global plus haut */}
                                {errorMsg && <div className="error-message">{errorMsg}</div>}

                                <button type="submit" className="login-button">
                                    Se Connecter
                                </button>
                            </form>
                        </div>
                    )}


                    {/* --- PARTIE 2 : NOUVEAU FORMULAIRE D'INSCRIPTION --- */}
                    {activeTab === 'register' && (
                        <div className="form-wrapper fade-in">
                            <h2>Créer un compte</h2>
                            <form onSubmit={handleRegisterSubmit}>
                                <div className="form-row" style={{display:'flex', gap:'10px'}}>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Prénom</label>
                                        <input type="text" name="prenom" required
                                               value={registerData.prenom} onChange={handleRegisterChange}/>
                                    </div>
                                    <div className="form-group" style={{flex:1}}>
                                        <label>Nom</label>
                                        <input type="text" name="nom" required
                                               value={registerData.nom} onChange={handleRegisterChange}/>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" required
                                           value={registerData.email} onChange={handleRegisterChange}/>
                                </div>

                                <div className="form-group">
                                    <label>Téléphone</label>
                                    <input type="tel" name="telephone"
                                           value={registerData.telephone} onChange={handleRegisterChange}/>
                                </div>

                                <div className="form-group">
                                    <label>Mot de passe</label>
                                    <input type="password" name="motDePasse" required
                                           placeholder="Minimum 12 caractères"
                                           value={registerData.motDePasse} onChange={handleRegisterChange}/>
                                </div>

                                <div className="form-group">
                                    <label>Confirmer le mot de passe</label>
                                    <input type="password" name="confirmPassword" required
                                           value={registerData.confirmPassword} onChange={handleRegisterChange}/>
                                </div>

                                <button type="submit" className="login-button">
                                    Créer mon compte
                                </button>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Login;