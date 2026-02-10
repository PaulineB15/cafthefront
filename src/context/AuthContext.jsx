import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verifie si un cookie de session valide existe
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/clients/moi`,
                    { credentials: "include" }
                );

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.client);
                }
            } catch (error) {
                console.error("Erreur vérification session:", error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
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
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}