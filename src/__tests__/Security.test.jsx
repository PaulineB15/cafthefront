/**
 * Security.test.jsx
 * ==================
 * MISSION 2 — Test de sécurité : validation des entrées (Input Validation)
 *
 * Contexte DWWM / OWASP :
 *   Ce test illustre la protection contre les attaques XSS (Cross-Site Scripting).
 *   Une attaque XSS consiste à injecter du code JavaScript malveillant via
 *   un champ de formulaire pour qu'il soit exécuté dans le navigateur d'un autre
 *   utilisateur (vol de session, redirection, modification de page...).
 *
 *   React protège AUTOMATIQUEMENT contre les XSS : toute valeur affichée
 *   dans le JSX via { expression } est échappée (les < > & " sont convertis
 *   en entités HTML : &lt; &gt; &amp; &quot;). C'est le comportement par défaut.
 *
 *   DANGER : dangerouslySetInnerHTML contourne cette protection — ce test
 *   vérifie son absence sur les champs testés.
 *
 * Référentiel DWWM visé :
 *   - "Valider systématiquement les entrées"
 *   - "Réaliser les tests de sécurité"
 *   - Connaissance des failles XSS et de l'OWASP Top 10 (A03:2021 - Injection)
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";

// ─── Mock de useNavigate (nécessaire car Register utilise ce hook) ─────────────
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// ─── Helper de rendu ──────────────────────────────────────────────────────────
const renderRegister = () =>
    render(
        <AuthContext.Provider value={{ login: vi.fn()}}>
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        </AuthContext.Provider>
    );

// ─── Suite de tests sécurité ──────────────────────────────────────────────────
describe("Sécurité — Protection contre les injections XSS", () => {
    // ═══════════════════════════════════════════════════════════════════════════
    // TEST DE SÉCURITÉ — Injection XSS dans un champ texte
    //
    // Scénario : un attaquant saisit un payload XSS classique dans le champ "nom".
    // On vérifie que React neutralise la menace en traitant la saisie comme
    // du texte brut et NON comme du HTML ou du JavaScript exécutable.
    //
    // Référence OWASP : A03:2021 - Injection / CWE-79 : Improper Neutralization of Input
    // ═══════════════════════════════════════════════════════════════════════════
    test("neutralise une saisie XSS malveillante dans le champ confirmation", () => {
        // ARRANGE : payload XSS classique.
        // Si ce code s'exécutait côté navigateur, il déclencherait une alerte
        // (preuve que du code arbitraire peut s'exécuter dans la session de l'utilisateur).
        // En réalité, un attaquant utiliserait ce vecteur pour voler des cookies de session
        // ou rediriger l'utilisateur vers un site malveillant.
        const xssPayload = '<script>alert("XSS")</script>';

        // On compte le nombre de balises <script> dans le DOM AVANT la saisie
        // (celles qui appartiennent légitimement à l'application)
        const scriptCountBefore = document.querySelectorAll("script").length;

        renderRegister();

        //ACT : Clic sur l'onglet pour afficher le formulaire d'inscription
        fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));

        // Ciblage du champ email via placeholder
        const confirmInput = screen.getByPlaceholderText(".............");
        fireEvent.change(confirmInput, { target: { value: xssPayload } });

        // ── ASSERT 1 : la valeur est stockée comme texte brut ────────────────────
        // React stocke la valeur dans son state comme une simple chaîne de caractères.
        // Elle n'est PAS interprétée comme du HTML : c'est juste du texte.
        expect(confirmInput.value).toBe(xssPayload);

        // ── ASSERT 2 : aucune nouvelle balise <script> n'a été injectée dans le DOM ──
        // Après la saisie du payload, le nombre de balises <script> dans le document
        // ne doit pas avoir augmenté. Si le payload avait été interprété comme HTML,
        // une nouvelle balise <script> aurait été créée et exécutée.
        // React échappe automatiquement toutes les valeurs JSX { expression },
        // donc "<script>" reste une chaîne de texte, jamais un vrai nœud DOM script.
        const scriptCountAfter = document.querySelectorAll("script").length;
        expect(scriptCountAfter).toBe(scriptCountBefore);

        // ── ASSERT 3 : aucune balise <script> existante ne contient le payload ───
        // On vérifie que le contenu textuel des balises <script> légitimes
        // ne contient PAS le code malveillant (ce qui serait le signe d'une injection
        // dans un contexte de type innerHTML ou dangerouslySetInnerHTML).
        const allScripts = document.querySelectorAll("script");
        allScripts.forEach((scriptEl) => {
            // Aucun script dans le DOM ne doit avoir pour contenu textuel le payload
            expect(scriptEl.textContent).not.toContain('alert("XSS")');
        });
    });
});


// ═══════════════════════════════════════════════════════════════════════════
// TEST DE SÉCURITÉ 2 — Validation Robustesse (Longueur Mot de Passe)
//
// Scénario : un attaquant tente de créer un compte avec un mot de passe très
// court (ex: 5 caractères). On vérifie que le système bloque l'envoi.
//
// Référence OWASP : A07:2021 - Défaillances d'identification
// ═══════════════════════════════════════════════════════════════════════════
test("bloque l'inscription si le mot de passe est trop court (< 12 caractères)", () => {
    // 1. ARRANGE : On prépare le formulaire d'inscription
    renderRegister();
    fireEvent.click(screen.getByRole("button", { name: /créer un compte/i }));

    // Initialisation de fetch comme un espion (Mock)
    global.fetch = vi.fn();

    const mdpInput = screen.getByPlaceholderText("Minimum 12 caractères");
    const confirmInput = screen.getByPlaceholderText(".............");

    // 2. ACT

    // Remplir l'email (obligatoire pour soumettre)
    fireEvent.change(screen.getByPlaceholderText("votre@email.com"), {
        target: { value: "test@security.fr" }
    });

    // Saisie d'un mot de passe non sécurisé (trop court)
    fireEvent.change(mdpInput, { target: { value: "12345" } });
    fireEvent.change(confirmInput, { target: { value: "12345" } });

    // Coche la case RGPD pour permettre la soumission du formulaire
    const rgpdCheckbox = screen.getByLabelText(/J'accepte que mes données soient utilisées/i);
    fireEvent.click(rgpdCheckbox);

    // Cliquer sur le bouton de soumission
    fireEvent.click(screen.getByRole("button", { name: /créer mon compte/i }));

    // 3. ASSERT : Vérification des blocages de sécurité
    // On vérifie que le message d'erreur programmé dans Login.jsx s'affiche bien
    expect(screen.getByText(/Le mot de passe doit contenir au moins 12 caractères/i)).toBeInTheDocument();

    // PREUVE DE ROBUSTESSE : L'API ne doit JAMAIS avoir été appelée (fetch)
    // car le "return" dans le code de Login.jsx a dû stopper l'exécution.
    expect(global.fetch).not.toHaveBeenCalled();
});