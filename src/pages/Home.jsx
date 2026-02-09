import React from 'react';
import Boutique from "./Boutique.jsx";
import PhotoHero from "../assets/photo/HeroAccueil.webp";
import {Link} from "react-router-dom";

function Home() {
    return (
        <hero>

          <h1>L'excellence du café et du thé</h1>
            <img src={PhotoHero} alt="Photo de café" className="photo-hero"/>
           <Link to="/boutique">Voir la boutique</Link>

        </hero>

    );
}

export default Home;