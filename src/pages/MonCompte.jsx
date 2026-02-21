import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import HeroCompte from "../assets/photo/HeroCompte.webp";
import "./MonCompte.css";

const MonCompte = () => {
    const { user, loading, isAuthenticated } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Onglet actif par défaut
    const [activeTab, setActiveTab] = useState("personnel");

    // Protection de la route
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    // Données des formulaires
    const [infoData, setInfoData] = useState({
        prenom: "", nom: "", email: "", telephone: "", adresse: ""
    });
    const [passwordData, setPasswordData] = useState({
        actuel: "", nouveau: "", confirmation: ""
    });

    // Données API (Commandes)
    const [commandesSuivi, setCommandesSuivi] = useState([]);
    const [historiqueCommandes, setHistoriqueCommandes] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // Récupération des données au chargement
    useEffect(() => {
        const fetchDonneesCompte = async () => {
            try {
                const ordersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/me`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if (ordersResponse.ok) {
                    const ordersData = await ordersResponse.json();
                    const toutesLesCommandes = ordersData.orders;

                    const enCours = toutesLesCommandes.filter(cmd => cmd.STATUT_COMMANDE !== 'Livrée');
                    const terminees = toutesLesCommandes.filter(cmd => cmd.STATUT_COMMANDE === 'Livrée');

                    setCommandesSuivi(enCours.map(cmd => ({
                        id: `CMD-${cmd.ID_COMMANDE}`,
                        date: new Date(cmd.DATE_COMMANDE).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                        numSuivi: "FR" + Math.floor(Math.random() * 100000000),
                        articles: "Plusieurs",
                        total: parseFloat(cmd.MONTANT_TOTAL),
                        statut: cmd.STATUT_COMMANDE,
                        progression: cmd.STATUT_COMMANDE === 'En attente' ? 20 : 60,
                        dateEstimee: "À définir"
                    })));

                    setHistoriqueCommandes(terminees.map(cmd => ({
                        id: `CMD-${cmd.ID_COMMANDE}`,
                        date: new Date(cmd.DATE_COMMANDE).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
                        articles: "Plusieurs",
                        total: parseFloat(cmd.MONTANT_TOTAL),
                        statut: cmd.STATUT_COMMANDE,
                        produits: []
                    })));
                }
            } catch (error) {
                console.error("Erreur API :", error);
            } finally {
                setIsLoadingData(false);
            }
        };

        if (isAuthenticated) {
            fetchDonneesCompte();
        }
    }, [isAuthenticated]);

    // Mise à jour des infos personnelles quand `user` est chargé
    useEffect(() => {
        if (user) {
            setInfoData({
                prenom: user.prenom || "",
                nom: user.nom || "",
                email: user.email || "",
                telephone: user.tel || "",
                adresse: user.adresse ? `${user.adresse}, ${user.cp} ${user.ville}` : ""
            });
        }
    }, [user]);

    const handleInfoChange = (e) => setInfoData({ ...infoData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

    const handleReorder = (produits) => {
        if(produits && produits.length > 0) {
            produits.forEach(prod => addToCart(prod, prod.quantite, null));
            navigate("/panier");
        } else {
            alert("Le détail de cette commande n'est pas encore disponible.");
        }
    };

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '100px' }}>Chargement...</div>;
    if (!isAuthenticated) return null;

    return (
        <main className="compte-page">
            {/* HERO SECTION */}
            <section className="compte-hero" style={{ backgroundImage: `url(${HeroCompte})` }}>
                <div className="hero-compte-overlay">
                    <div className="user-icon-circle">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h1>MON COMPTE</h1>
                    <p>Gérez vos informations personnelles et suivez vos commandes</p>
                </div>
            </section>

            <section className="compte-section">
                <div className="compte-container">

                    {/* ONGLETS DE NAVIGATION */}
                    <nav className="dashboard-nav">
                        <button className={`dashboard-tab ${activeTab === 'personnel' ? 'active' : ''}`} onClick={() => setActiveTab('personnel')}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            ESPACE PERSONNEL
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'suivi' ? 'active' : ''}`} onClick={() => setActiveTab('suivi')}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                            SUIVI
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'historique' ? 'active' : ''}`} onClick={() => setActiveTab('historique')}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            HISTORIQUE
                        </button>
                        <button className={`dashboard-tab ${activeTab === 'offres' ? 'active' : ''}`} onClick={() => setActiveTab('offres')}>
                            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
                            OFFRES
                        </button>
                    </nav>

                    <div className="dashboard-content fade-in">

                        {/* ================= ONGLET 1 : ESPACE PERSONNEL ================= */}
                        {activeTab === 'personnel' && (
                            <div className="tab-pane">
                                {/* Bloc Infos */}
                                <div className="content-block">
                                    <div className="block-header">
                                        <div>
                                            <h2>INFORMATIONS PERSONNELLES</h2>
                                            <p className="block-desc">Gérez vos informations de compte</p>
                                        </div>
                                        <button className="btn-edit">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                            Modifier
                                        </button>
                                    </div>

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
                                    <div className="form-group">
                                        <label>ADRESSE EMAIL</label>
                                        <div className="input-with-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                                            <input type="email" name="email" value={infoData.email} onChange={handleInfoChange} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>TÉLÉPHONE</label>
                                        <div className="input-with-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                            <input type="tel" name="telephone" value={infoData.telephone} onChange={handleInfoChange} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{marginTop:'15px'}}>
                                        <label>ADRESSE DE LIVRAISON</label>
                                        <div className="input-with-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            <input type="text" name="adresse" value={infoData.adresse} onChange={handleInfoChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Bloc Sécurité */}
                                <div className="content-block">
                                    <h2>SÉCURITÉ</h2>
                                    <div className="form-group" style={{marginTop:'20px'}}>
                                        <label>MOT DE PASSE ACTUEL</label>
                                        <div className="input-with-icon right-icon">
                                            <svg className="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            <input type="password" name="actuel" value={passwordData.actuel} onChange={handlePasswordChange} placeholder="......."/>
                                            <svg className="icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>NOUVEAU MOT DE PASSE</label>
                                        <div className="input-with-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            <input type="password" name="nouveau" value={passwordData.nouveau} onChange={handlePasswordChange} placeholder="......."/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>CONFIRMER LE NOUVEAU MOT DE PASSE</label>
                                        <div className="input-with-icon right-icon">
                                            <svg className="icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            <input type="password" name="confirmation" value={passwordData.confirmation} onChange={handlePasswordChange} placeholder="......."/>
                                            <svg className="icon-right" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        </div>
                                    </div>
                                    <button className="btn btn-primary" style={{marginTop:'15px'}}>CHANGER LE MOT DE PASSE</button>
                                </div>
                            </div>
                        )}

                        {/* ================= ONGLET 2 : SUIVI ================= */}
                        {activeTab === 'suivi' && (
                            <div className="tab-pane">
                                <h2>SUIVI DES COMMANDES</h2>
                                {isLoadingData ? <p className="loading-text">Chargement...</p> : commandesSuivi.length === 0 ? <p className="empty-text">Aucune commande en cours.</p> :
                                    commandesSuivi.map((cmd) => (
                                        <div className="order-card" key={cmd.id}>
                                            <div className="order-header">
                                                <div>
                                                    <h4>COMMANDE {cmd.id}</h4>
                                                    <span className="order-date">Passée le {cmd.date}</span>
                                                </div>
                                                <span className={`badge ${cmd.progression === 60 ? 'badge-green' : 'badge-gold'}`}>{cmd.statut}</span>
                                            </div>

                                            <div className="order-grid">
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

                                            <div className="progress-box">
                                                <div className="progress-header">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold-detail)" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                                    Livraison estimée le {cmd.dateEstimee}
                                                </div>
                                                <div className="progress-bar-container">
                                                    <div className="progress-bar-fill" style={{width: `${cmd.progression}%`}}></div>
                                                </div>
                                                <div className="progress-labels">
                                                    <span className={cmd.progression >= 10 ? 'active-step' : ''}>Confirmée</span>
                                                    <span className={cmd.progression >= 50 ? 'active-step' : ''}>En transit</span>
                                                    <span className={cmd.progression >= 100 ? 'active-step' : ''}>Livrée</span>
                                                </div>
                                            </div>
                                            <button className="btn btn-primary w-100 btn-suivi">Suivre ma commande &gt;</button>
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                        {/* ================= ONGLET 3 : HISTORIQUE ================= */}
                        {activeTab === 'historique' && (
                            <div className="tab-pane">
                                <h2>HISTORIQUE DES COMMANDES</h2>
                                {isLoadingData ? <p className="loading-text">Chargement...</p> : historiqueCommandes.length === 0 ? <p className="empty-text">Aucun historique.</p> :
                                    historiqueCommandes.map((cmd) => (
                                        <div className="history-card" key={cmd.id}>
                                            <div className="history-info">
                                                <h4>{cmd.id} <span className="badge badge-grey">Livré</span></h4>
                                                <div className="history-meta">
                                                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> {cmd.date}</span>
                                                    <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> {cmd.articles}</span>
                                                    <span className="price">{cmd.total.toFixed(2)} €</span>
                                                </div>
                                            </div>
                                            <div className="history-actions">
                                                <button className="btn btn-primary btn-sm">Voir les détails</button>
                                                <button className="btn btn-outline btn-sm" onClick={() => handleReorder(cmd.produits)}>Commander à nouveau</button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        )}

                        {/* ================= ONGLET 4 : OFFRES ================= */}
                        {activeTab === 'offres' && (
                            <div className="tab-pane">
                                <h2>OFFRES EXCLUSIVES</h2>

                                <div className="offer-card">
                                    <div className="offer-content">
                                        <h4><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold-detail)" strokeWidth="2"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> BIENVENUE CHEZ CAFTHÉ</h4>
                                        <p>-15% sur votre prochaine commande</p>
                                        <div className="promo-box">
                                            <div className="promo-code">
                                                <span className="label">CODE PROMO</span>
                                                <strong>BIENVENUE15</strong>
                                            </div>
                                            <div className="promo-date">
                                                Valable jusqu'au<br/><span>31 Janvier 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-gold">UTILISER</button>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </section>
        </main>
    );
};

export default MonCompte;