import React, { createContext, useState, useEffect } from "react";

// 1. On crée le "Badge". Au début, il est vide (null).
export const AuthContext = createContext(null);

// 2. Le Provider : C'est le "système de sécurité" qui entoure tout ton site (dans App.js)
export function AuthProvider({ children }) {
    // Variable 'user' : C'est ici qu'on stocke "Sophie", "Jean", ou null (personne).
    const [user, setUser] = useState(null);

    // Variable 'loading' : Tant que c'est TRUE, le site attend (écran blanc ou chargement).
    // On ne veut pas afficher "Se connecter" si Sophie est déjà là mais qu'on vérifie juste son passeport.
    const [loading, setLoading] = useState(true);

    // --- LE CŒUR DU SYSTÈME (Vérification au démarrage) ---
    // Dès que le site CafThé se charge (ou qu'on rafraîchit la page F5) :
    //Vérifie si un cookie de session valide existe
    useEffect(() => {
        const checkSession = async () => {
            try {
                // On demande au serveur (Backend) : "Hé, ce navigateur a-t-il un cookie valide ?"
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/clients/moi`,
                    { credentials: "include" } // CRUCIAL : "Envoie le cookie avec la demande !"
                );

                // Si le serveur répond : "Oui, c'est Sophie (ID 25)"
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.client); // On met "Sophie" dans la mémoire du site
                }
            } catch (error) {
                // Si pas de réponse ou erreur, user reste null (visiteur anonyme)
                console.error("Erreur vérification session:", error);
            } finally {
                // Quoi qu'il arrive, on a fini de vérifier. On ouvre les portes du magasin.
                setLoading(false);
            }
        };

        checkSession();
    }, []); // <--- Les crochets vides sont très important pour que le useEffect ne se réexécute pas à chaque rendu

    // --- FONCTION LOGIN (Quand Sophie remplit le formulaire) ---
    const login = (userData) => {
        // Le formulaire de login nous envoie les infos de Sophie.
        // On les met tout de suite dans le contexte pour mettre à jour la NavBar instantanément.
        setUser(userData);
    };

    // --- FONCTION LOGOUT (Quand Sophie clique sur "Déconnexion") ---
    const logout = async () => {
        try {
            // 1. On dit au serveur : "Détruis le cookie de session"
            await fetch(
                `${import.meta.env.VITE_API_URL}/api/clients/logout`,
                {
                    method: "POST",
                    credentials: "include"
                }
            );
        } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
        }
        // 2. On vide la mémoire du navigateur : Le site redevient anonyme
        setUser(null);
    };

    // Voici la "boîte à outils" qu'on donne à tous les composants (NavBar, Panier, etc.)
    const value = {
        user,            // Les infos du client (ex: {prenom: "Sophie", id: 25})
        login,           // La télécommande pour se connecter
        logout,          // La télécommande pour sortir
        loading,         // Est-ce qu'on attend encore ?
        isAuthenticated: !!user, // Raccourci : VRAI si user existe, FAUX sinon
    };

    // On englobe les "enfants" (tout le site) avec ces valeurs disponibles partout
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}