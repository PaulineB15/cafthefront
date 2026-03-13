// --- IMPORTS REACT ET ROUTER ---

// UseState: mémoire locale
// UseContext: accès aux données globales
// UseEffect: déclencher des actions auto (synchronise le site avec api)
import React, { useState, useContext, useEffect } from "react";
// UseNavigate: redirection vers une autre page
// UseLocation: récupérer l'URL actuelle
import { useNavigate, useLocation } from "react-router-dom";

// --- IMPORTS DES CONTEXTES ---
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";

// --- IMPORT DE TOAST (Pour les notifications pop-up) ---
import { toast } from "react-hot-toast";

// --- IMPORTS PHOTO + CSS ---
import HeroCompte from "../assets/photo/HeroCompte.webp";
import "../styles/MonCompte.css";

const MonCompte = () => {
    // --- 1. RÉCUPÉRATION DES OUTILS GLOBAUX
    // Récupération des données utilisateur et authentification
    const { user, loading, isAuthenticated } = useContext(AuthContext);
    const { addMultipleToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    // --- 2. GESTION DES ONGLETS (TABS)
    // 'activeTab' = l'interrupteur qui décide quel onglet afficher.
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || "personnel");

    // Si l'URL change (par exemple on clique sur un lien qui ramène ici avec un nouveau state), on met à jour l'onglet.
    useEffect(() => {
        if (location.state && location.state.activeTab) {
            setActiveTab(location.state.activeTab);
        }
    }, [location.state]);

    // --- 3. SÉCURITÉ DE LA ROUTE PRIVÉE ---
    // Si l'application a fini de charger (!loading) ET que l'utilisateur n'est pas connecté (!isAuthenticated), on l'expulse vers /login.
    useEffect(() => {
        if (!loading && !isAuthenticated) navigate("/login");
    }, [loading, isAuthenticated, navigate]);


    // --- 4. MEMOIRE LOCALE DE LA PAGE (state) ---

    // Toggle (interrupteur Vrai/Faux) pour afficher soit le texte, soit le formulaire de modification des infos.
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    // Stockage des informations saisies dans le formulaire "Informations Personnelles"
    const [infoData, setInfoData] = useState({
        prenom: "", nom: "", email: "", telephone: "",
        adresse_facturation: "", cp_facturation: "", ville_facturation: ""
    });

    // Stockage du formulaire de changement de mot de passe.
    const [passwordData, setPasswordData] = useState({
        actuel: "", nouveau: "", confirmation: ""
    });


    // Stockage des commandes reçues depuis l'API Back-end.
    const [commandesSuivi, setCommandesSuivi] = useState([]);
    const [historiqueCommandes, setHistoriqueCommandes] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true); // Gère l'affichage du texte "Chargement..."


    // Stockage des messages de retour (Succès ou Erreur) à afficher sous les formulaires.
    const [updateMsg, setUpdateMsg] = useState({ type: "", text: "" });
    const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

    // PRE-REMPLISSAGE DES CHAMPS AU CHARGEMENT
    // Dès que l'objet 'user' est disponible, je remplis les cases de mes formulaires avec ses données pour lui éviter de tout retaper
    useEffect(() => {
        if (user) {
            setInfoData({
                prenom: user.prenom || "", nom: user.nom || "", email: user.email || "", telephone: user.tel || "",
                adresse_facturation: user.adresse_facturation || "", cp_facturation: user.cp_facturation || "", ville_facturation: user.ville_facturation || ""
            });
        }
    }, [user]);


    // --- 6. APPEL API (FETCH) RECUPERER LES COMMANDES ---
    useEffect(() => {
        // Fonction asynchrone pour aller chercher les commandes dans la base de données.
        const fetchDonneesCompte = async () => {
            try {
                // Requête HTTP GET vers ma route sécurisée. 'credentials: include' envoie le cookie (le Token) au serveur.
                const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/me`, {
                    method: 'GET', credentials: 'include'
                });
                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    const toutesLesCommandes = ordersData.orders;
                    // .filter() pour séparer les commandes en deux catégories :

                    // Celles qui ne sont pas "Livrées" vont dans le tableau de Suivi
                    setCommandesSuivi(toutesLesCommandes.filter(cmd => cmd.STATUT_COMMANDE !== 'Livrée').map(cmd => ({
                        id: `CMD-${cmd.ID_COMMANDE}`,
                        date: new Date(cmd.DATE_COMMANDE).toLocaleDateString('fr-FR'),
                        numSuivi: "FR" + Math.floor(Math.random() * 100000000),
                        articles: cmd.total_articles ? `${cmd.total_articles} article(s)` : "1 article",
                        total: parseFloat(cmd.MONTANT_TOTAL),
                        statut: cmd.STATUT_COMMANDE
                    })));

                    // Celles qui sont "Livrées" vont dans l'Historique
                    setHistoriqueCommandes(toutesLesCommandes.filter(cmd => cmd.STATUT_COMMANDE === 'Livrée').map(cmd => ({
                        id: `CMD-${cmd.ID_COMMANDE}`,
                        date: new Date(cmd.DATE_COMMANDE).toLocaleDateString('fr-FR'),
                        articles: cmd.total_articles ? `${cmd.total_articles} article(s)` : "1 article",
                        total: parseFloat(cmd.MONTANT_TOTAL),
                        statut: cmd.STATUT_COMMANDE,
                        produits: cmd.produits || [] // On garde les produits pour la fonction "Commander à nouveau"
                    })));
                }
            } catch (error) {
                console.error(error);
            } finally {
                // Quoi qu'il arrive, on arrête l'état de chargement.
                setIsLoadingData(false);
            }
        };
        // Déclenche la recherche uniquement si le client est bien connecté.
        if (isAuthenticated) fetchDonneesCompte();
    }, [isAuthenticated]);

    // Met à jour la mémoire du formulaire (le State) à chaque lettre tapée par l'utilisateur.
    const handleInfoChange = (e) => setInfoData({ ...infoData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });


    // --- 7. SOUMISSION: MODIFIER LES INFOS PERSONNELLES ---
    const handleUpdateInfo = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger brusquement au clic sur le bouton submit.
        setUpdateMsg({ type: "", text: "" }); // Vider les anciens messages d'erreur.
        try {
            // PUT = standard pour la "Mise à jour" (Update) d'une donnée existante en API
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/moi`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({
                    nom: infoData.nom,
                    prenom: infoData.prenom,
                    email: infoData.email,
                    tel: infoData.telephone,
                    adresse_facturation: infoData.adresse_facturation,
                    cp_facturation: infoData.cp_facturation,
                    ville_facturation: infoData.ville_facturation
                })
            });
            const data = await response.json();
            if (response.ok) {
                setUpdateMsg({ type: "success", text: "Modifications enregistrées avec succès !" });
                // Recharge la page après 1.5s pour que les nouvelles données s'affichent partout (NavBar, etc.)
                setTimeout(() => window.location.reload(), 1500);
            } else { setUpdateMsg({ type: "error", text: data.message }); }

        } catch (error) {
            console.error(error);
            setUpdateMsg({ type: "error", text: "Erreur technique." });
        }
    };


    // --- 8. SOUMISSION: MODIFIER LE MOT DE PASSE ---
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setPasswordMsg({ type: "", text: "" });

        // Contrôle de sécurité en Front-end. Si les mots de passe ne correspondent pas --> bloque l'envoi vers le serveur
        if (passwordData.nouveau !== passwordData.confirmation) {
            return setPasswordMsg({ type: "error", text: "Les mots de passe ne correspondent pas." });
        }

        try {
            // Requête PUT pour modifier le mot de passe
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/clients/password`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
                body: JSON.stringify({ actuel: passwordData.actuel, nouveau: passwordData.nouveau })
            });
            const data = await response.json();
            if (response.ok) {
                setPasswordMsg({ type: "success", text: "Mot de passe modifié avec succès !" });
                setPasswordData({ actuel: "", nouveau: "", confirmation: "" }); // On vide les cases pour la sécurité.
            } else {
                setPasswordMsg({ type: "error", text: data.message });
            }
        } catch (error) {
            setPasswordMsg({ type: "error", text: "Erreur de connexion au serveur." });
        }
    };


    // --- 9. COMMANDER À NOUVEAU (depuis L'onglet " historique des commandes" ---

        // Prend les produits d'une ancienne commande, les adapte au format requis par mon Panier (notamment la gestion des Vracs en grammes), et les ajoute en masse.
        const handleReorder = (produits) => {
        if (!produits || produits.length === 0) {
            toast.error("Impossible de récupérer les articles de cette commande.");
            return;
        }


        // Reformate les données issues de la base de données pour qu'elles collent à la structure de CartContext
        const produitsAajouter = produits.map(prod => {
            const typeVente = prod.type_vente || prod.TYPE_VENTE || "Unité";

            return {
                produit: {
                    ID_PRODUIT: prod.id || prod.ID_PRODUIT,
                    NOM_PRODUIT: prod.nom || prod.NOM_PRODUIT,
                    PRIX_TTC: prod.prix || prod.PRIX_TTC,
                    IMAGES: prod.image || prod.IMAGES,
                    CATEGORIE: prod.categorie || prod.CATEGORIE,
                    TYPE_VENTE: typeVente,
                    TYPE: prod.type || ""
                },
                quantite: prod.quantite || prod.QUANTITE_COMMANDEE || 1,
                poidsChoisi: typeVente === 'Vrac' ? 0.25 : null // Si c'est du vrac, on remet le sachet par défaut à 250g
            };
        });

        // Appel de la fonction du CartContext pour tout ajouter d'un coup
        addMultipleToCart(produitsAajouter);

        toast.success("Commande ajoutée au panier !");
        navigate('/panier'); // Redirection automatique vers la page panier.
    };



    // ---- CE QUI S'AFFICHE A L'ECRAN ----

    return (


        <main>
            {/* --- HERO SECTION --- */}
            <section className="compte-hero">
                <img
                    src={HeroCompte}
                    alt="Espace client CafThé"
                    fetchPriority="high"
                    loading="eager"
                    className="hero-image"/>

                <div className="compte-filtre">
                    <div className="compte-entete">
                        <div className="icone-compte">
                            <svg
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </div>
                        <h1>MON COMPTE</h1>
                        <p>Gérez vos informations personnelles et suivez vos commandes</p>
                    </div>
                </div>
            </section>

            <div className="compte-section">
                <div className="compte-container">

                    <nav className="dashboard-nav" aria-label="Menu de l'espace client" role="tablist">
                        <button className={`dashboard-tab ${activeTab === 'personnel' ? 'active' : ''}`} onClick={() => setActiveTab('personnel')}>
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ESPACE PERSONNEL
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'suivi' ? 'active' : ''}`} onClick={() => setActiveTab('suivi')}>
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                            SUIVI
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'historique' ? 'active' : ''}`} onClick={() => setActiveTab('historique')}>
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            HISTORIQUE
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'offres' ? 'active' : ''}`} onClick={() => setActiveTab('offres')}>
                            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                            OFFRES
                        </button>
                    </nav>

                    <div className="dashboard-contenu">

                        {/* ================= ONGLET 1 : PERSONNEL ================= */}
                        {/*  && --> "Si ce qui est à gauche est VRAI, alors affiche ce qui est à droite entre parenthèses". */}
                        {activeTab === 'personnel' && (
                            <section className="tab-pane fade-in" aria-label="Vos informations personnelles">

                                {/* --- BLOC 1: INFOS & FACTURATION --- */}
                                <article className="content-block">
                                    <header className="block-header" style={{ marginBottom: '20px' }}>
                                        <div>
                                            <h2>INFORMATIONS PERSONNELLES</h2>
                                            <p className="block-desc">Gérez vos informations de contact et adresse de facturation.</p>
                                        </div>

                                        {!isEditingInfo && (
                                            <button className="btn-edit" onClick={() => setIsEditingInfo(true)}>
                                                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Modifier
                                            </button>
                                        )}
                                    </header>

                                    {isEditingInfo ? (
                                        <form className="fade-in" onSubmit={handleUpdateInfo}>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>PRÉNOM</label>
                                                    <input type="text" name="prenom" value={infoData.prenom} onChange={handleInfoChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>NOM</label>
                                                    <input type="text" name="nom" value={infoData.nom} onChange={handleInfoChange} />
                                                </div>
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>EMAIL</label>
                                                    <input type="email" name="email" value={infoData.email} onChange={handleInfoChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label>TÉLÉPHONE</label>
                                                    <input type="tel" name="telephone" value={infoData.telephone} onChange={handleInfoChange} />
                                                </div>
                                            </div>

                                            <h3 style={{marginTop: '30px', color: 'var(--gold-detail)', fontSize: '0.9rem'}}>ADRESSE DE FACTURATION</h3>
                                            <div className="form-group">
                                                <label>ADRESSE</label>
                                                <input type="text" name="adresse_facturation" value={infoData.adresse_facturation} onChange={handleInfoChange} />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>CODE POSTAL</label>
                                                    <input type="text" name="cp_facturation" value={infoData.cp_facturation} onChange={handleInfoChange} />
                                                </div>
                                                <div className="form-group" style={{ flex: '2' }}>
                                                    <label>VILLE</label>
                                                    <input type="text" name="ville_facturation" value={infoData.ville_facturation} onChange={handleInfoChange} />
                                                </div>
                                            </div>

                                            {updateMsg.text && (
                                                <div style={{ padding: '10px', marginTop: '15px', textAlign: 'center', color: updateMsg.type === 'success' ? '#9fe2a9' : '#ff6b6b' }}>
                                                    {updateMsg.text}
                                                </div>
                                            )}

                                            <div style={{display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px'}}>
                                                <button type="button" className="btn btn-secondaire" onClick={() => setIsEditingInfo(false)}>
                                                    Annuler
                                                </button>
                                                <button type="submit" className="btn btn-primaire">
                                                    Enregistrer les modifications
                                                </button>
                                            </div>
                                        </form>

                                    ) : (
                                        <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                                            <div>
                                                <h4 style={{ color: 'var(--gold-detail)', fontSize: '0.8rem', marginBottom: '10px' }}>COORDONNÉES</h4>
                                                <p style={{ color: '#ccc', margin: 0, lineHeight: '1.6' }}>
                                                    <strong>{user?.prenom} {user?.nom}</strong><br/>
                                                    {user?.email}<br/>
                                                    {user?.tel || "Aucun téléphone"}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 style={{ color: 'var(--gold-detail)', fontSize: '0.8rem', marginBottom: '10px' }}>FACTURATION</h4>
                                                <p style={{ color: '#ccc', margin: 0, lineHeight: '1.6' }}>
                                                    {user?.adresse_facturation || "Aucune adresse"}<br/>
                                                    {user?.cp_facturation} {user?.ville_facturation}<br/>
                                                    France
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </article>

                                {/* --- BLOC 2: ADRESSE DE LIVRAISON --- */}
                                <article className="content-block">
                                    <header className="block-header">
                                        <div>
                                            <h2>ADRESSE DE LIVRAISON</h2>
                                            <p className="block-desc">Cette adresse est la dernière utilisée lors de vos commandes.</p>
                                        </div>
                                    </header>

                                    <div style={{border: '1px solid #333', padding: '20px', borderRadius: '4px', backgroundColor: 'var(--bg-dark)'}}>
                                        <h4 style={{margin: '0 0 10px 0', color: 'var(--text-light)', fontSize: '1rem', textTransform: 'uppercase'}}>
                                            {user?.prenom} {user?.nom}
                                        </h4>
                                        <p style={{margin: '0', color: '#aaa', fontSize: '0.9rem', lineHeight: '1.6'}}>
                                            {user?.adresse_livraison || "Aucune adresse de livraison renseignée"}<br/>
                                            {user?.cp_livraison} {user?.ville_livraison}<br/>
                                            France
                                        </p>
                                    </div>
                                </article>

                                {/* --- BLOC 3: CHANGER MOT DE PASSE --- */}
                                <article className="content-block">
                                    <h2>SÉCURITÉ DU COMPTE</h2>
                                    <form onSubmit={handleUpdatePassword} className="password-form">
                                        <div className="form-group">
                                            <label htmlFor="pass-actuel">MOT DE PASSE ACTUEL</label>
                                            <input
                                                id="pass-actuel"
                                                type="password"
                                                name="actuel"
                                                value={passwordData.actuel}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pass-nouveau">NOUVEAU MOT DE PASSE</label>
                                            <input
                                                id="pass-nouveau"
                                                type="password"
                                                name="nouveau"
                                                value={passwordData.nouveau}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="pass-confirm">CONFIRMER LE NOUVEAU</label>
                                            <input
                                                id="pass-confirm"
                                                type="password"
                                                name="confirmation"
                                                value={passwordData.confirmation}
                                                onChange={handlePasswordChange}
                                                required
                                            />
                                        </div>

                                        {/* Affichage des messages d'erreur ou succès de l'API */}
                                        {passwordMsg.text && (
                                            <p className={`msg-${passwordMsg.type}`}>{passwordMsg.text}</p>
                                        )}

                                        <button type="submit" className="btn btn-primaire">
                                            MODIFIER LE MOT DE PASSE
                                        </button>
                                    </form>
                                </article>
                            </section>
                        )}

                        {/* ================= ONGLET 2 : SUIVI ================= */}
                        {activeTab === 'suivi' && (
                            <section className="tab-pane fade-in" aria-label="Suivi de vos commandes">
                                <h2>SUIVI DES COMMANDES</h2>
                                {isLoadingData ? <p className="loading-text">Chargement...</p> : commandesSuivi.length === 0 ? <p className="empty-text">Aucune commande en cours.</p> :
                                    commandesSuivi.map((cmd) => (
                                        <article className="order-card" key={cmd.id}>
                                            <header className="order-header">
                                                <div>
                                                    <h4>COMMANDE {cmd.id}</h4>
                                                    <span className="order-date">Passée le {cmd.date}</span>
                                                </div>
                                                <span className={`badge ${cmd.statut === 'En attente' ? 'badge-gold' : 'badge-green'}`}>
                                                    {cmd.statut}
                                                </span>
                                            </header>

                                            <div className="order-grid" style={{ marginBottom: '20px' }}>
                                                <div>
                                                    <p className="grid-label">NUMÉRO DE SUIVI</p>
                                                    <p className="grid-value">{cmd.numSuivi}</p>
                                                </div>
                                                <div>
                                                    <p className="grid-label">ARTICLES</p>
                                                    <p className="grid-value">{cmd.articles}</p>
                                                </div>
                                                <div>
                                                    <p className="grid-label">TOTAL</p>
                                                    <p className="grid-value price">{cmd.total.toFixed(2)} €</p>
                                                </div>
                                            </div>
                                        </article>
                                    ))
                                }
                            </section>
                        )}

                        {/* ================= ONGLET 3 : HISTORIQUE ================= */}
                        {activeTab === 'historique' && (
                            <section className="tab-pane fade-in" aria-label="Historique de vos commandes">
                                <h2>HISTORIQUE DES COMMANDES</h2>
                                {isLoadingData ? <p className="loading-text">Chargement...</p> : historiqueCommandes.length === 0 ? <p className="empty-text">Aucun historique.</p> :
                                    historiqueCommandes.map((cmd) => (
                                        <article className="history-card" key={cmd.id}>
                                            <div className="history-info">
                                                <h3>{cmd.id} <span className="badge badge-grey">Livré</span></h3>
                                                <div className="history-meta">
                                                    <span><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {cmd.date}</span>
                                                    <span><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> {cmd.articles}</span>
                                                    <span className="price">{cmd.total.toFixed(2)} €</span>
                                                </div>
                                            </div>
                                            <div className="history-actions">
                                                <button className="btn btn-primaire btn-sm" onClick={() => handleReorder(cmd.produits)}>
                                                    Commander à nouveau
                                                </button>
                                            </div>
                                        </article>
                                    ))
                                }
                            </section>
                        )}

                        {/* ================= ONGLET 4 : OFFRES ================= */}
                        {activeTab === 'offres' && (
                            <section className="tab-pane fade-in" aria-label="Vos offres exclusives">
                                <h2>OFFRES EXCLUSIVES</h2>
                                <article className="offer-card">
                                    <div className="offer-content">
                                        <h3>BIENVENUE CHEZ CAFTHÉ</h3>
                                        <p>-15% sur votre prochaine commande</p>
                                        <div className="promo-box">
                                            <div className="promo-code">
                                                <span className="label">CODE PROMO</span>
                                                <strong>BIENVENUE15</strong>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MonCompte;