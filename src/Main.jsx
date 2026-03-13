
// IMPORT DES OUTILS REACT

// Outil de React qui agit comme un garde du corps en développement.
import { StrictMode } from 'react'
// Outil permet de lier React au navigateur (au vrai HTML).
import { createRoot } from 'react-dom/client'
// Import de l'application principale'
import App from './App.jsx'

import './index.css'


// <StrictMode> filet de sécurité de React = vérifier que tout ce qui est à l'intérieur respecte les bonnes pratiques.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
