import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import {useLocation, useNavigate} from "react-router-dom";



const Login = () => {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    // Email et mot de passe pour l'identification
    const [email, setEmail] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // C'est pour savoir d'où vient l'utilisateur
    const location = useLocation();

    // Si "location.state.from" existe, c'est notre destination, sinon -> home.jsx (Accueil)
    // ?. dit à React : "Essaye de lire from seulement si state existe. Sinon, ne plante pas et renvoie undefined
    const from = location.state?.from || "/"; // || --> OU la page d'accueil "/"
    // Cette variable from contient maintenant soit "/commande" (si on vient du panier), soit "/" (par défaut



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