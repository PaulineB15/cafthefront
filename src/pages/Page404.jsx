import React from 'react';
import { Link } from 'react-router-dom';

function Page404() {
    return (
        <main className="error-page">
            <div className="error-container">
                <h1>404</h1>
                <h2>Votre café a refroidi...</h2>
                <p>La page que vous cherchez s'est volatilisée. Pas de panique, il reste encore du café frais en boutique !</p>

                {/* Utilisation de tes classes globales .btn et .btn-primary */}
                <Link to="/" className="btn btn-primary">
                    Retourner à l'accueil
                </Link>
            </div>
        </main>
    );
}

export default Page404;