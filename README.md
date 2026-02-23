# CafThé

Site e-commerce d'une boutique de café et thé haut de gamme.

<!-- ATTENTION PAS ENCORE VU EN COURS -->
<!-- Decommenter et adapter les badges selon votre CI/CD -->
<!-- ![Build](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?branch=main) -->
<!-- ![Tests](https://img.shields.io/github/actions/workflow/status/USER/REPO/tests.yml?branch=main&label=tests) -->
<!-- ![License](https://img.shields.io/github/license/USER/REPO) -->

## Prerequis

- [Node.js](https://nodejs.org/) >= 18
- React
- npm
- Une API back-end fonctionnelle

## Quickstart

```bash
# 1. Cloner le depot
git clone https://github.com/USER/monrepoprojet.git
cd monrepoprojet

# 2. Installer les dependances
npm install

# 3. Configurer l'environnement
cp .env.example .env
# Editer .env et renseigner les variables necessaires

# 4. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Variables d'environnement

| Variable         | Description | Exemple |
| ---------------- | ----------- | ------- |
| `VITE_API_URL`   |             |         | |             |         |

## Scripts disponibles

| Commande          | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Lancer le serveur de developpement |
| `npm run build`   | Construire le projet pour la prod  |
| `npm run preview` | Previsualiser le build de prod     |
| `npm run lint`    | Lancer ESLint sur le projet        |

## Exemples d'utilisation

<!-- Lister ici les principales routes de votre application avec une courte description -->

| URL                              | Description                                         |
|----------------------------------|-----------------------------------------------------|
| `http://localhost:5173/`         | Page d'accueil avec mise en avant des produits      |
| `http://localhost:5173/login`    | Interface connexion / création de compte            | 
 `http://localhost:5173/boutique` | Catalogue complet des thés et cafés                 |
| `http://localhost:5173/contact`  | Formulaire de contact via Formspree                 |  
| `http://localhost:5173/panier`   | Récapitulatif et gestion des produits séléectionnés |



## Structure du projet

```
src/
├── assets/            # logo, photo, picto
├── components/        # Navbar, Footer, ProductCard
│   └── ...
├── pages/             # Pages principales de l'application
│   └── ...
├── styles/            #
├── App.jsx            # Configurations des routes & providers
└── main.jsx           # Point d'entrée de l'application

src/
├── assets/             # logo, photo, picto
├── components/         # Navbar, Footer, ProductCard
├── context/            # État global (AuthContext pour la sécurité, CartContext pour le panier)
├── layout/             # Conteneur structurel (Layout.jsx avec <Outlet />)
├── pages/
├── Home.jsx     # Page d'accueil avec mise en avant des produits
│   ├── Boutique.jsx     # Catalogue des produits
│   ├── ProductDetails.jsx # Fiche produit
│   ├── Panier.jsx # Panier des produits sélectionnés
│   ├── Contact.jsx      # Formulaire avec validation et intégration Formspree
│   ├── LivrasionPaiement.jsx # Choix de paiement et livraison avant le paiement
│   ├── Confirmation.jsx # Confirmation de la commande
│   ├── Login.jsx # Connexion ou création de compte
│   ├── FAQ.jsx # Page de questions les plus posées
│   ├── CGV.jsx # Conditions générales de vente
│   ├── PolitiqueConfidentialité.jsx # Gestion RGPD
│   ├── MentionsLegales.jsx # Informations réglementaires
│   └── 404.jsx / CGV.jsx # Page 404
             
├── styles/             # 
├── App.jsx             # Configuration des routes (React Router) et des Providers
└── main.jsx            # Point d'entrée de l'application

```

## Deploiement


### Build de production

```bash
npm run build
```

Les fichiers statiques sont generes dans le dossier `dist/`.

### Hebergement

<!-- Décrire la procedure de déploiement (Plesk, o2Switch, etc...) -->


## Tests
<!-- ATTENTION PAS ENCORE VU EN COURS -->
<!-- Decrire comment lancer les tests -->

```bash
# Lancer les tests
npm run test
```

## Stack technique

- **React 18**
- **Vite**
- **Hot Toast**
- **React-router-dom**
- **Skeleton**

- <!-- Ajouter les autres dépendances principales -->

## Auteurs

- **Pauline Bennoin** — Développeuse

## Licence

<!-- Choisir une licence : MIT, Apache 2.0, GPL v3... -->

Ce projet est sous licence [MIT](LICENSE).

## Liens utiles

- [Documentation React](https://react.dev/)
- [Documentation Vite](https://vite.dev/)
- [Documentation Hot Toast](https://hot-toast.js.org/)
- [Documentation React Router](https://reactrouter.com/)
- [Documentation Skeleton](https://skeleton-react.vercel.app/)
- <!-- Ajouter vos liens : wiki, maquettes, board de gestion de projet... -->

