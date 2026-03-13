
// IMPORTS REACT ET ROUTER
import React from 'react';
import { Link } from 'react-router-dom';


function Page404() {
    return (
        <main className="page-erreur">
            <section className="erreurr-container">
                <h1>404</h1>
                <h2>Votre café a refroidi...</h2>
                <p>La page que vous cherchez s'est volatilisée. Pas de panique, il reste encore du café frais en boutique !</p>

                <Link to="/" className="btn btn-primaire">
                    Retourner à l'accueil
                </Link>
            </section>
        </main>
    );
}

export default Page404;