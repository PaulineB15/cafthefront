// --- IMPORTS REACT ET ROUTER ---

import React, { useState } from "react";
// useSearchParams : Outil pour extraire le jeton (token) de l'URL (ex: ?token=123)
// useNavigate : Outil pour rediriger l'utilisateur vers une autre page (ex: vers Login après succès)
import { useSearchParams, useNavigate } from "react-router-dom";
import HeroCompte from "../assets/photo/HeroCompte.webp";
import "../styles/Login.css"; // Réutilise le design du Login !

const MotDePasseOublie = () => {
    // --- INITIALISATION DES OUTILS ---

    // Permet de lire "?token=xyz" dans l'URL
    const [searchParams] = useSearchParams(); // On active la lecture des paramètres d'URL
    const token = searchParams.get("token"); // On récupère spécifiquement la valeur après "?token="
    const navigate = useNavigate(); // On prépare la fonction de redirection

    // --- MÉMOIRE (STATE) POUR LE FORMULAIRE DE CONNEXION ---
    const [password, setPassword] = useState(""); // Stocke le 1er mot de passe saisi
    const [confirm, setConfirm] = useState(""); // Stocke la confirmation
    const [message, setMessage] = useState({ type: "", text: "" }); // Gère les alertes (erreur ou succès)

    // --- FONCTION DE SOUMISSION (Déclenchée au clic sur VALIDER) ---
    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche le rechargement de la page par défaut
        setMessage({ type: "", text: "" }); // Réinitialise les messages à chaque tentative

        // Vérification de sécurité côté client : les deux champs doivent être identiques
        if (password !== confirm) return setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });

        try {
            // APPEL API : On envoie le nouveau mot de passe au serveur
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/reset-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                // Le jeton secret récupéré dans l'URL
                // Le nouveau mot de passe choisi
                body: JSON.stringify({ token, nouveauMotDePasse: password })
            });
            const data = await res.json();

            if (res.ok) {
                // Si ça marche : message de succès et redirection après 2 secondes
                setMessage({ type: "success", text: "Mot de passe modifié ! Redirection vers la connexion..." });
                setTimeout(() => navigate("/login"), 3000);
            } else {
                // Si le serveur refuse (ex: token expiré)
                setMessage({ type: "error", text: data.message });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erreur serveur." });
        }
    };

    // --- SECURITE D'AFFICHAGE---
    // Si l'URL ne contient pas de token, on affiche un message d'erreur au lieu du formulaire

    if (!token) {
        return <div style={{textAlign:"center", padding:"100px", color:"white"}}><h2>Lien invalide ou manquant.</h2></div>;
    }



    // ---- CE QUI S'AFFICHE A L'ECRAN ----

    return (
        <main className="auth-page">
            <section className="login-hero">
                <img
                    src={HeroCompte}
                    alt="Espace de récupération de compte CafThé"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"
                />

                <div className="hero-login-filtre">
                    <div className="hero-login-entete">
                        <h2>NOUVEAU MOT DE PASSE</h2>
                        <p>Réinitialisez votre accès pour retrouver votre espace personnel</p>
                    </div>
                </div>
            </section>

            <section className="auth-section">
                <div className="auth-container" style={{padding: '40px'}}>
                    {/* Affichage dynamique du message d'alerte si besoin */}
                    {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nouveau mot de passe</label>
                            <input type="password" required placeholder="12 caractères minimum" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                            <label>Confirmer le mot de passe</label>
                            <input type="password" required placeholder="..............." value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        </div>
                        <button type="submit" className="btn btn-primaire w-100">VALIDER</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default MotDePasseOublie;