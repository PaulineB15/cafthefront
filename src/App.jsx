
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Boutique from "./pages/Boutique.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";
import Contact from "./pages/Contact.jsx";
import FAQ from "./pages/FAQ.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

function App() {

    return (
        // AuthProvider enveloppe toute l'app pour partager l'état de l'authentification
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                {/* Route parent : layout contient navbar + outlet + footer */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    {/* id est un paramêtre dynamique contenu dans l'url */}
                    <Route path="boutique" element={<Boutique />} />
                    <Route path="produit/:id"  element={<ProductDetails />} />
                    <Route path="login" element={<Login />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="faq" element={<FAQ />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </AuthProvider>

    )
}

export default App;
