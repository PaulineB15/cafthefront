import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import HeroCompte from "../assets/photo/HeroCompte.webp";
import "./Login.css"; // On réutilise le design du Login !

const ResetPassword = () => {
    // Permet de lire "?token=xyz" dans l'URL
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState({ type: "", text: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (password !== confirm) return setMessage({ type: "error", text: "Les mots de passe ne correspondent pas." });

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/reset-password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, nouveauMotDePasse: password })
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: "success", text: "Mot de passe modifié ! Redirection vers la connexion..." });
                setTimeout(() => navigate("/login"), 3000);
            } else {
                setMessage({ type: "error", text: data.message });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Erreur serveur." });
        }
    };

    // Si on arrive ici sans Token, c'est une erreur !
    if (!token) {
        return <div style={{textAlign:"center", padding:"100px", color:"white"}}><h2>Lien invalide ou manquant.</h2></div>;
    }

    return (
        <main className="auth-page">
            <section className="auth-hero" style={{backgroundImage: `url(${HeroCompte})`}}>
                <div className="hero-overlay">
                    <h1>NOUVEAU MOT DE PASSE</h1>
                </div>
            </section>

            <section className="auth-section">
                <div className="auth-container" style={{padding: '40px'}}>
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
                        <button type="submit" className="btn btn-primary w-100">VALIDER</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default ResetPassword;