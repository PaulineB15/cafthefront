import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Permet a Vitest de comprendre et transformer le JSX React
  test: {
    // Cette ligne permet d'utiliser describe, test, it, expect, etc.
    // sans devoir faire d'imports manuels dans vos fichiers .test.jsx
    globals: true,
    environment: 'jsdom',
    // Simule un navigateur (DOM, window, document, localStorage...)
    setupFiles: './vitest.setup.js',
    // ^ Fichier charge AVANT chaque fichier de test
  },

})
