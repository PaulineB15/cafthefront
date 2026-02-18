
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Boutique from "./pages/Boutique.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import Panier from "./pages/Panier.jsx";


// 1. IMPORT DU CONTEXTE AUTH ET CART
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";

import LivraisonPaiement from "./pages/LivraisonPaiement.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MentionsLegales from "./pages/MentionsLegales.jsx";
import Confidentialite from "./pages/PolitiqueConfidentialité.jsx";
import CVG from "./pages/CGV.jsx";

function App() {

    return (
        // AuthProvider : La sécurité globale
        <AuthProvider>
            {/* CartProvider : La gestion du panier (AJOUT ICI) */}
            <CartProvider>

                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />}/>
                            <Route path="boutique" element={<Boutique />} />
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

                        </Route>
                    </Routes>
                </BrowserRouter>
            </CartProvider>
            {/* Fin CartProvider */}
        </AuthProvider>
    )
}

export default App;