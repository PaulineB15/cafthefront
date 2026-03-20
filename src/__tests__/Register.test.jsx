/**
 * Register.test.jsx
 * ==================
 * MISSION 1 — Tests unitaires du formulaire d'inscription
 *
 * Composant testé : Register (src/pages/Register.jsx)
 * Pourquoi ce composant ?
 *   - Formulaire complexe avec 5 champs
 *   - Validation côté client (correspondance des mots de passe)
 *   - Appel API asynchrone (fetch)
 *   - Gestion des états : succès, erreur, redirection
 *   → Il couvre toutes les exigences du référentiel DWWM pour les tests unitaires
 *
 * Framework : Vitest (natif pour les projets Vite)
 * Outils utilisés :
 *   - Vitest  : describe, test, expect, vi, beforeEach (exposés globalement)
 *   - React Testing Library : render, screen, fireEvent, waitFor
 *   - @testing-library/jest-dom : matchers DOM (toBeInTheDocument, etc.)
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";

// ─── Mock de useNavigate ──────────────────────────────────────────────────────
// vi.hoisted() permet de déclarer des variables AVANT que vi.mock() soit hissé
// en tête de fichier par Vitest. Sans vi.hoisted(), mockNavigate serait undefined
// au moment où le mock de react-router-dom s'exécute.
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

// vi.mock() remplace le module react-router-dom par notre version simulée.
// On garde tous les exports réels (...actual) et on remplace uniquement useNavigate
// par une fonction espion pour éviter les vraies navigations pendant les tests.
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        // useNavigate retourne notre espion à la place de la vraie fonction de navigation
        useNavigate: () => mockNavigate,
    };
});

// ─── Fonction utilitaire ──────────────────────────────────────────────────────
// On enveloppe Register dans MemoryRouter car le composant utilise <Link>
// et useNavigate, qui nécessitent un contexte de routeur pour fonctionner.
const renderRegister = () =>
    render(
        <AuthContext.Provider value={{ login: vi.fn() }}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

// ─── Suite de tests ───────────────────────────────────────────────────────────
describe("Register — Formulaire d'inscription", () => {
    // beforeEach : code exécuté avant CHAQUE test de cette suite
    beforeEach(() => {
        // Réinitialise l'espion navigate entre chaque test pour éviter les faux positifs
        mockNavigate.mockClear();
        // Réinitialise le mock global de fetch (chaque test définit ses propres réponses)
        global.fetch = vi.fn();
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // TEST 1 — Rendu initial
    // Vérifie que le composant affiche correctement tous ses éléments au chargement.
    // C'est le test le plus basique : "est-ce que l'interface s'affiche comme prévu ?"
    // Pattern AAA → Arrange (render) + Assert (expect)
    // ═══════════════════════════════════════════════════════════════════════════
    test("affiche tous les champs et le bouton de soumission au rendu initial", () => {
        // ARRANGE : on rend le composant dans le DOM virtuel (jsdom)
        renderRegister();

        // ACT : Il faut d'abord cliquer sur l'onglet pour voir les champs
        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));

        // On cherche les champs pour l'inscription (Email, MDP, Confirm, RGPD)
        expect(screen.getByPlaceholderText("votre@email.com")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Minimum 12 caractères")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(".............")).toBeInTheDocument(); // Confirmation
        expect(screen.getByLabelText(/J'accepte que mes données soient utilisées/i)).toBeInTheDocument();


        // Vérifie que le bouton "Créer un compte" est bien présent dans le DOM
        expect(
            screen.getByRole("button", { name: /créer mon compte/i })
        ).toBeInTheDocument();
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // TEST 2 — Interaction utilisateur réussie
    // Simule un utilisateur qui remplit correctement le formulaire et le soumet.
    // Vérifie que le message de succès s'affiche après une réponse API positive.
    // Pattern AAA → Arrange (mock fetch + render) + Act (saisie + clic) + Assert (waitFor)
    // ═══════════════════════════════════════════════════════════════════════════
    test("affiche le message de succès après une inscription valide", async () => {
        // ARRANGE : on simule une réponse API positive sans faire de vraie requête réseau.
        // mockResolvedValueOnce() : la prochaine fois que fetch() est appelé,
        // il retournera cette valeur Promise résolue (réponse HTTP simulée).
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ message: "Compte créé" }),
        });

        renderRegister();

        // ACT : on remplit tous les champs du formulaire
        // fireEvent.change() simule la saisie utilisateur en déclenchant l'événement onChange
        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));

        // ACT : Remplissage de tes champs
        fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
            target: { value: "test@cafte.fr" },
        });
        fireEvent.change(screen.getByPlaceholderText("Minimum 12 caractères"), {
            target: { value: "MotDePasseTresLong123!" },
        });
        fireEvent.change(screen.getByPlaceholderText("............."), {
            target: { value: "MotDePasseTresLong123!" },
        });

        // Cocher la case RGPD
        fireEvent.click(screen.getByLabelText(/J'accepte que mes données soient utilisées/i));

        fireEvent.click(screen.getByRole("button", { name: /créer mon compte/i }));

        // ASSERT : Attend ton message de succès défini dans Login.jsx
        await waitFor(() => {
            expect(
                screen.getByText(/compte créé ! veuillez vous connecter/i)
            ).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    // ═══════════════════════════════════════════════════════════════════════════
    // TEST 3 — Gestion d'erreur : mots de passe non identiques
    // Vérifie que la validation côté client bloque la soumission et affiche
    // un message d'erreur explicite quand les mots de passe ne correspondent pas.
    // Pattern AAA → Arrange (render) + Act (saisie + submit) + Assert (getByText)
    // ═══════════════════════════════════════════════════════════════════════════
    test("affiche une erreur si les mots de passe ne correspondent pas", () => {
        // ARRANGE
        renderRegister();

        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));

        // ACT : on saisit deux mots de passe DIFFÉRENTS dans les deux champs
        fireEvent.change(screen.getByPlaceholderText("Minimum 12 caractères"), {
            target: { value: "MotDePasseA1!" },
        });
        fireEvent.change(screen.getByPlaceholderText("............."), {
            target: { value: "MotDePasseB2!" },
        });

        // fireEvent.submit() soumet le formulaire directement, contournant le bouton disabled.
        // Cela déclenche le handler onSubmit du formulaire, qui effectue la validation.
        // .closest("form") remonte du bouton vers l'élément <form> parent.
        fireEvent.submit(
            screen.getByRole("button", { name: /créer mon compte/i }).closest("form")
        );

        // ASSERT : le message d'erreur doit apparaître IMMÉDIATEMENT (validation synchrone)
        // Pas besoin de waitFor() car setErrorMsg est synchrone dans ce cas
        expect(
            screen.getByText(/les mots de passe ne correspondent pas/i)
        ).toBeInTheDocument();

        // On s'assure que fetch n'a PAS été appelé :
        // la validation a bloqué l'envoi avant même d'atteindre l'appel réseau
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
