import React, {createContext, useEffect, useState} from 'react';


export const CartContext = createContext(null);

export const CartProvider = ({children}) => {

    // Initialise le panier (localStorage)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('panierCafThe'); //panierCafThe = Clé(nom du fichier de sauvegarde) dans localStorage
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('panierCafThe', JSON.stringify(cart));
    }, [cart]);

    // AJOUT UN PRODUIT AU PANIER
    const addToCart = (produit, quantite, poidsChoisi) => {
        // CREATION D'UN ID UNIQUE POUR LE PANIER
        // Pour différencier "Café Brésil 250g" de "Café Brésil 1kg"
        const isVrac = produit.TYPE_VENTE === 'Vrac';
        const poids = isVrac ? poidsChoisi : null;

        // CartID exemple : "12-0.25" (ID 12, Poids 0.25) OU "15-unit"
        // SI c'est du vrac, on utilise la variable poids, SINON on utilise 'Unit'
        const cartId = `${produit.ID_PRODUIT}-${isVrac ? poids : 'unit'}`;

        // Recherche de doublons dans le panier
        const existingItem = cart.find(item => item.cartId === cartId);

        if (existingItem) {
           // CAS 1 : Le produit existe déja -> Augmente la quantité
           const updatedCart = cart.map(item => item.cartId === cartId ?
               {...item, quantite: item.quantite + quantite} : item); // Fusionne les produit
           setCart(updatedCart);

        } else {
            // CAS 2 : Le produit n'existe pas -> Ajoute le produit au panier
            const newItem = {
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


    // MODIFIER LA QUANTITE (+ / -)
    const updateQuantite = (cartId, delta) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.cartId === cartId) {
                    const newQuantite = item.quantite + delta;
                    // Si quantité = 0, on garde le produit du panier mais on filtre après
                    // Ou on bloque à 1.
                    return {...item, quantite: newQuantite};
                }
                return item;
            }).filter(item => item.quantite > 0);// Suppression si quantité = 0
        });
    };

    // SUPPRIMER UN PRODUIT DU PANIER
    const removeFromCart = (cartId) => {
        setCart(prevCart => prevCart.filter(item => item.cartId !== cartId));
    };


    // VIDER LE PANIER
    const clearCart = () => {
        setCart([]); // Remet le panier à un tableau vide
        localStorage.removeItem('panierCafThe'); // Vide le localStorage
    }

    // CALCULS DU NOMBRE DE PRODUIT DANS LE PANIER ET DU PRIX TOTAL

    // Nombre de produits dans le panier (pour la notification sur le panier)
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

    // DISTRIBUTION (provider)
    const value = {
        cart,
        addToCart,
        updateQuantite,
        removeFromCart,
        clearCart, // Vide le panier et le localStorage
        totalItems, // Pour la notification sur le panier dans la NavBar
        cartTotal}; // Pour le prix total du panier

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};







