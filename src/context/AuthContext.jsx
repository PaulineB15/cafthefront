
// IMPORT DES OUTILS REACT
import React, { createContext, useState, useEffect } from "react";

// CREATION DE AUTHcontexts
// Création d'un "Badge" global vide. Tous les composants du site pourront écouter ce badge.
export const AuthContext = createContext(null);

// PROVIDER: C'est le "système de sécurité" qui entoure tout ton site (dans App.js)
// AuthProvider est un composant invisible qui va englober tout ton site (dans App.jsx).
// { children } représente toutes les pages de ton site qui sont à l'intérieur.
export function AuthProvider({ children }) {

    //CRÉATION DE LA MÉMOIRE (STATES)

    // Variable 'user' stocke les infos du client (ex: {prenom: "Sophie", email: "..."}) ou 'null' (visiteur anonyme).
    const [user, setUser] = useState(null);
    // Variable 'loading' : Tant que c'est TRUE, on dit au site : "Attends, je suis en train de vérifier qui est là"
    const [loading, setLoading] = useState(true);


    // --- ACTION AUTO: CŒUR DU SYSTÈME (Vérification au démarrage) ---

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

                // Si le serveur répond "Code 200 OK" --> le cookie est bon.
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.client); // ex: On met "Sophie" dans la mémoire du site
                }
            } catch (error) {
                // Si pas de réponse ou erreur, user reste null (visiteur anonyme)
                console.error("Erreur vérification session:", error);
            } finally {
                // 'finally' s'exécute TOUJOURS à la fin, que ça ait réussi ou échoué.
                // On dit au site : "C'est bon, j'ai fini de vérifier. Tu peux afficher les pages."
                setLoading(false);
            }
        };

        checkSession();
    }, []); // <--- Les crochets vides sont très important pour que le useEffect ne se réexécute pas à chaque rendu


    // --- FONCTION LOGIN (Quand Sophie remplit le formulaire) ---
    // Attention : Elle ne fait pas l'appel API (c'est la page Login.jsx qui s'en charge).
    // Elle sert juste à recevoir les données trouvées et à les injecter dans la mémoire globale.
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


    // CE QUI EST DISTRIBUER SUR TOUT LE SITE (VALUE)
    // On donne à tous les composants (NavBar, Panier, etc.)
    const value = {
        user,            // Les infos du client (ex: {prenom: "Sophie", id: 25})
        login,           // Se connecter (recevoir les infos de Sophie)
        logout,          // Se déconnecter
        loading,         // Le statut de vérification (vrai/faux)
    // Astuce : !!user transforme un objet en booléen.
    // Si user = null, !!user donne 'false'. Si user = {prenom...}, !!user donne 'true'.
        isAuthenticated: !!user, // Raccourci : VRAI si user existe, FAUX sinon
    };

    // Englobe tout le site ({children}) en lui distribuant la "value".
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}