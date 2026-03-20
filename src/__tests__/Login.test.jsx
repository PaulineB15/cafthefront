/**
 * Login.test.jsx
 * ==================
 * MISSION : Tests unitaires de la fonctionnalité de connexion
 * * Ce test suit les 4 scénarios de la Fiche 6 du référentiel CafThé.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";

// ─── 1. MOCKS OBLIGATOIRES (Fiche 4 & 5) ──────────────────────────────────────

// Mock de useNavigate avec vi.hoisted pour éviter les erreurs de hoisting [cite: 99]
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return { ...actual, useNavigate: () => mockNavigate };
});

// ─── 2. HELPER DE RENDU ───────────────────────────────────────────────────────

const mockLoginFn = vi.fn(); // Espion pour la fonction login du contexte [cite: 78]

const renderLogin = () =>
    render(
        <AuthContext.Provider value={{ login: mockLoginFn }}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

// ─── 3. SUITE DE TESTS ────────────────────────────────────────────────────────

describe("Login — Formulaire de connexion", () => {

    beforeEach(() => {
        vi.clearAllMocks(); // Réinitialise les compteurs d'appels [cite: 100]
        global.fetch = vi.fn(); // Initialise le mock de fetch avant chaque test [cite: 137]
    });

    // SCÉNARIO 1 : Rendu initial
    test("affiche les champs Email, Mot de passe et le bouton Se Connecter", () => {
        renderLogin();
        // On vérifie la présence des éléments clés
        expect(screen.getByLabelText(/Adresse Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Mot de passe/i)).toBeInTheDocument();
        expect(screen.getAllByRole("button", { name: /SE CONNECTER/i })).toHaveLength(2);
    });

    // SCÉNARIO 2 : Connexion réussie
    test("connecte l'utilisateur et redirige en cas de succès API", async () => {
        // ARRANGE : simule une réponse fetch ok:true [cite: 91, 143]
        const mockUser = { id: 1, email: "test@cafte.fr" };
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ client: mockUser }),
        });

        renderLogin();

        // ACT : saisie et soumission [cite: 55]
        fireEvent.change(screen.getByLabelText(/Adresse Email/i), { target: { value: "test@cafte.fr" } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "password123456" } });

        // On récupère tous les boutons et on clique sur celui qui a la classe de soumission
        const buttons = screen.getAllByRole("button", { name: /SE CONNECTER/i });
        const submitButton = buttons.find(btn => btn.className.includes("btn-primaire"));
        fireEvent.click(submitButton);

        // ASSERT : vérifie les appels
        await waitFor(() => {
            expect(mockLoginFn).toHaveBeenCalledWith(mockUser); // login(client) appelé
            expect(mockNavigate).toHaveBeenCalledWith("/", expect.objectContaining({ replace: true }));
        });
    });

    // SCÉNARIO 3 : Identifiants invalides
    test("affiche un message d'erreur si les identifiants sont faux", async () => {
        // Arrange : simule fetch ok:false
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: "Erreur de connexion" }),
        });

        renderLogin();

        fireEvent.change(screen.getByLabelText(/Adresse Email/i), { target: { value: "faux@email.com" } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "mauvais_mdp" } });

        // On récupère tous les boutons et on clique sur celui qui a la classe de soumission
        const buttons = screen.getAllByRole("button", { name: /SE CONNECTER/i });
        const submitButton = buttons.find(btn => btn.className.includes("btn-primaire"));
        fireEvent.click(submitButton);

        // Assert : message d'erreur présent et pas de redirection
        await waitFor(() => {
            expect(screen.getByText(/Erreur de connexion/i)).toBeInTheDocument();
        });
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // SCÉNARIO 4 : Erreur réseau
    test("affiche un message générique en cas d'erreur réseau", async () => {
        // Arrange : simule un rejet de fetch (throw Error) [cite: 93, 143]
        global.fetch.mockRejectedValueOnce(new Error("Network error"));

        renderLogin();

        //Remplir les champs pour permettre la soumission du formulaire
        fireEvent.change(screen.getByLabelText(/Adresse Email/i), { target: { value: "test@cafte.fr" } });
        fireEvent.change(screen.getByLabelText(/Mot de passe/i), { target: { value: "password123" } });

        // On récupère tous les boutons et on clique sur celui qui a la classe de soumission
        const buttons = screen.getAllByRole("button", { name: /SE CONNECTER/i });
        const submitButton = buttons.find(btn => btn.className.includes("btn-primaire"));
        fireEvent.click(submitButton);

        // Assert : waitFor est indispensable pour l'asynchrone
        await waitFor(() => {
            // Utilisation d'une regex plus souple /.../i pour être sûr de trouver le texte
            expect(screen.getByText(/Une erreur s'est produite/i)).toBeInTheDocument();
        });
    });
});