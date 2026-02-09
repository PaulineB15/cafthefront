import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";



const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/clients/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
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

            const { token, client } = data;
            console.log(token);

            // Appel au login via le contexte
            login(token, client);

            // Puis retour à l'accueil
            navigate("/");

        } catch (error) {
            console.error("Erreur lors de la connexion: ", error);
            setErrorMsg("Une erreur s'est produite lors de la connexion");
        }
    };

    return (
        <div className="login-container">
            <h2>Connexion</h2>

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

                {/* Affichage conditionnel du message d'erreur */}
                {errorMsg && <div className="error-message">{errorMsg}</div>}

                <button type="submit" className="login-button">
                    Se Connecter
                </button>
            </form>
        </div>
    );
};

export default Login;