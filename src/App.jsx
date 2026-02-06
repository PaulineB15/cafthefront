
import './App.css'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import ProductList from "./pages/ProductList.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Login from "./pages/Login.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                {/* Route parent : layout contient navbar + outlet + footer */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    {/* id est un paramêtre dynamique contenu dans l'url */}
                    <Route path="produit/:id"  element={<ProductDetails />} />
                    <Route path="login" element={<Login />} />
                </Route>
            </Routes>

        </BrowserRouter>

    )
}

export default App;
