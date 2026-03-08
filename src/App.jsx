
// --- IMPORT DES OUTILS ---

//Imports des outils de routage pour créer les URLs du site
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Squelette/structure visuel (Navbar + Footer)
import Layout from "./layout/Layout.jsx";

//Imports de TOUTES les pages du site
import Home from "./pages/Home.jsx";
import Boutique from "./pages/Boutique.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Panier from "./pages/Panier.jsx";
import MonCompte from "./pages/MonCompte.jsx";
import MotDePasseOublie from "./pages/OublieMotDePasse.jsx";

// Librairie externe pour afficher des alertes élégantes (toast) partout sur le site.
import {Toaster} from "react-hot-toast";

 //IMPORT DU CONTEXTE AUTH ET CART
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import LivraisonPaiement from "./pages/LivraisonPaiement.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Confidentialite from "./pages/PolitiqueConfidentialité.jsx";
import CVG from "./pages/CGV.jsx";
import Page404 from "./pages/Page404.jsx";
import PlanSite from "./pages/PlanDuSite.jsx";


function App() {

    return (
        // AuthProvider : L'authentification. Tout le site sait si on est connecté ou non.
        <AuthProvider>
            {/* CartProvider : Le Panier. Tout le site a accès au panier et à son total. */}
            <CartProvider>

                {/* Composant Toaster --> placé en haut pour pouvoir s'afficher par-dessus n'importe quelle page. */}
                <Toaster position="bottom-right" reverseOrder={false} />

                {/* BrowserRouter = moteur qui écoute la barre d'adresse URL du navigateur */}
                <BrowserRouter>
                    <Routes>
                        {/* ROUTE PARENTE. Toutes les pages à l'intérieur s'afficheront DANS le Layout (entre la Navbar et le Footer) */}
                        <Route path="/" element={<Layout />}>
                            {/* L'attribut 'index' signifie que c'est la page par défaut quand on va sur "/" */}
                            <Route index element={<Home />}/>
                            <Route path="boutique" element={<Boutique />} />
                            {/* Route DYNAMIQUE. Le ":id" veut dire que cette valeur va changer (ex: produit/12 ou produit/45) */}
                            <Route path="produit/:id"  element={<ProductDetails />} />
                            <Route path="login" element={<Login />} />
                            <Route path="contact" element={<Contact />} />
                            <Route path="panier" element={<Panier />} />
                            <Route path="commande" element={<LivraisonPaiement />} />
                            <Route path="confirmation" element={<Confirmation />} />
                            <Route path="faq" element={<FAQ />} />
                            <Route path="MentionsLegales" element={<MentionsLegales />} />
                            <Route path="confidentialite" element={<Confidentialite />} />
                            <Route path="cgv" element={<CVG />} />
                            {/* 404. L'étoile '*' capture toutes les URLs qui n'existent pas dans la liste au-dessus, et affiche la page d'erreur. */}
                            <Route path="*" element={<Page404 />} /> // * Page 404 si aucune route ne correspond
                            <Route path="plan-du-site" element={<PlanSite />} />
                            <Route path="mon-compte" element={<MonCompte />} />
                            <Route path="MotDePasseOublie" element={<MotDePasseOublie />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
        </AuthProvider>
    )
}

export default App;