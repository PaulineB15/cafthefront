// IMPORT DES OUTILS REACT

// createContext : L'outil qui permet de créer l'espace de stockage global.
// useEffect : L'outil pour déclencher des actions automatiques (ici, la sauvegarde).
// useState : L'outil pour créer la mémoire du panier.
import React, {createContext, useEffect, useState} from 'react';

// CRÉATION DU composant CONTEXTE
// Création du "coffre-fort" vide et on l'exporte pour que les autres pages puissent s'y brancher
export const CartContext = createContext(null);

// COMPOSANT: Provider
// Enveloppe toute l'application (dans App.jsx) pour distribuer les données.
// {children} représente toutes les pages du site qui seront à l'intérieur
export const CartProvider = ({children}) => {



// Création de "cart" (panier)
const [cart, setCart] = useState(() => {
    // Au démarrage -> recherche dans le navigateur (localStorage)
    // pour voir s'il n'avait pas déjà un panier de sa précédente visite.
    const savedCart = localStorage.getItem('panierCafThe'); //panierCafThe = Clé(nom du fichier de sauvegarde) dans localStorage

    // S'il y a une sauvegarde -> retransforme en tableau Javascript (JSON.parse).
    // Sinon -> démarre avec un panier vide ([])
    return savedCart ? JSON.parse(savedCart) : [];
});

    // Sauvegarde automatique : À chaque fois que la variable "cart" change (ajout, modif, suppression),
    // on l'enregistre immédiatement en texte (JSON.stringify) dans le navigateur de l'utilisateur.
    useEffect(() => {
        localStorage.setItem('panierCafThe', JSON.stringify(cart));
    }, [cart]);

    // AJOUT UN PRODUIT AU PANIER
    const addToCart = (produit, quantite, poidsChoisi) => {

        // Est-ce que ce produit est du vrac ? (Vrai ou Faux) (pour différencier: ex: "Café Brésil 250g", "Café Brésil 1kg"... ?)
        const isVrac = produit.TYPE_VENTE === 'Vrac';
        // Si c'est du vrac, on note le poids choisi. Sinon, c'est null.
        const poids = isVrac ? poidsChoisi : null;

        // CREATION D'UN ID UNIQUE POUR LE PANIER
        // Fusionne l'ID du produit avec son poids ex: " (ID 12, Poids 0.25) OU "15-unit"
        // SI c'est du vrac, on utilise la variable poids, SINON on utilise 'Unit'
        const cartId = `${produit.ID_PRODUIT}-${isVrac ? poids : 'unit'}`;

        // Recherche de doublons dans le panier
        const existingItem = cart.find(item => item.cartId === cartId);

        if (existingItem) {
           // CAS 1 : Le produit existe déja -> Augmente la quantité
           const updatedCart = cart.map(item => item.cartId === cartId ? // .map() pour recréer le panier
               {...item, quantite: item.quantite + quantite} : item); // Fusionne les produit
           setCart(updatedCart);

        } else {
            // CAS 2 : Le produit n'existe pas -> Ajoute le produit au panier
            const newItem = { // Objet

             cartId: cartId, // ID unique du panier
             id: produit.ID_PRODUIT, // ID du produit de la base de donnée
             nom: produit.NOM_PRODUIT,
             image: produit.IMAGES,
             categorie: produit.CATEGORIE,
             type: produit.TYPE,
             prix: parseFloat(produit.PRIX_TTC), // Prix unitaire ou au kg (si vrac)
             quantite: quantite,
             poids: poids, // Null si ce n'est pas du vrac
             isVrac: isVrac
            };

            // Ajout du nouveau produit à la suite de la liste déjà existante
            setCart([...cart, newItem]);
        }
    };


    // MODIFIER LA QUANTITE (delta "+1 ou -1")
    const updateQuantite = (cartId, delta) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                // Recherche du bon produit
                if (item.cartId === cartId) {
                    const newQuantite = item.quantite + delta;
                    // Si quantité = 0, on garde le produit du panier mais on filtre après
                    // Ou on bloque à 1.
                    return {...item, quantite: newQuantite};
                }
                return item;
            }).filter(item => item.quantite > 0);// Suppression du produit si quantité = 0
        });
    };

    // SUPPRIMER UN PRODUIT DU PANIER (icone poubelle)
    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };


    // VIDER LE PANIER (après paiement)
    const clearCart = () => {
        setCart([]); // Remet le panier à un tableau vide
        localStorage.removeItem('panierCafThe'); // Vide le localStorage (mémoire navigateur)
    }


    // CALCULS DU NOMBRE DE PRODUIT DANS LE PANIER ET DU PRIX TOTAL

    // Nombre de produits dans le panier (pour la notification sur le panier)
    // .reduce() est une boucle qui additionne les quantités de chaque ligne. "0" est le point de départ.
    const totalItems = cart.reduce((total, item) => total + item.quantite, 0);

    // Prix total du panier (avec TTC)
    const cartTotal = cart.reduce((total, item) => {
        let prixLigne;
        if (item.isVrac) {
            // Formule Vrac : PrixAuKg * Poids * Quantité
            prixLigne = item.prix * item.poids * item.quantite;
        } else {
            // Formule Unité: PrixUnitaire * Quantité
            prixLigne = item.prix * item.quantite;
        }
        return total + prixLigne;
        }, 0);

    // DISTRIBUTION AU RESTE DU SITE (provider)
    // Rassemble toutes les données + fonctions dans une seule constante "value".
    const value = {
        cart,
        addToCart,
        updateQuantite,
        removeFromCart,
        clearCart, // Vide le panier et le localStorage
        totalItems, // Pour la notification sur le panier dans la NavBar
        cartTotal}; // Pour le prix total du panier

    // (Provider) à toutes les pages (children) qui en auront besoin.
    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};







