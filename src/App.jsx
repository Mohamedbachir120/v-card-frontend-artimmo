import { useState, useEffect, useCallback } from "react";
import { api } from "./services/api";
import { GLOBAL_CSS, P, T, btn } from "./utils/theme";
import { useToast, Toasts } from "./components/ui";
import { Icon } from "./components/Icon";
import { CardTile } from "./components/CardTile";
import { AuthPage } from "./pages/AuthPage";
import { StatsPage } from "./pages/StatsPage";
import { PublicCard } from "./pages/PublicCard";
import { CardFormModal } from "./pages/CardFormModal";
import { QRModal } from "./pages/QrModal";
import { DeleteModal } from "./pages/DeleteModal";
import { LeadsBoard } from "./pages/crm/LeadsBoard";
import { CrmDashboardPage } from "./pages/crm/CrmDashboardPage";
import { LeadCaptureForm } from "./pages/crm/LeadCaptureForm";

export default function App() {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loadingCards, setLoadingCards] = useState(true);
  
  // View routing state
  const [view, setView] = useState("dashboard"); // dashboard | stats | public
  const [publicUuid, setPublicUuid] = useState(null);

  // Modal states
  const [editingCard, setEditingCard] = useState(null);
  const [qrCard, setQrCard] = useState(null);
  const [deletingCard, setDeletingCard] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { toasts, show } = useToast();
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/card/")) {       // ← was "/public/"
      const uuid = path.replace("/card/", ""); // ← was "/public/"
      setPublicUuid(uuid);
      setView("public");
    } else if (path.startsWith("/contact")) {
      // Public landing page that ad campaigns redirect to.
      setView("lead-capture");
    } else {
      setView("dashboard");
    }
  }, []);
  // ─── Auth Bootstrapping ─────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("vbc_token");
    if (token) {
      api("/api/auth/me")
        .then(u => setUser(u))
        .catch(() => localStorage.removeItem("vbc_token"));
    }
  }, []);

  // ─── Fetch Cards ────────────────────────────────────────
  const fetchCards = useCallback(async () => {
    if (!user) return;
    setLoadingCards(true);
    try {
      const data = await api("/api/cards");
      setCards(data);
    } catch (err) {
      show(err.message, "error");
    } finally {
      setLoadingCards(false);
    }
  }, [user, show]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // ─── Handlers ───────────────────────────────────────────
  const handleLogin = (u) => {
    setUser(u);
    setView("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("vbc_token");
    setUser(null);
    setCards([]);
    setView("dashboard");
  };

  const handleSavedCard = (savedCard) => {
    setCards(prev => {
      const exists = prev.find(c => c.id === savedCard.id);
      return exists 
        ? prev.map(c => c.id === savedCard.id ? savedCard : c)
        : [savedCard, ...prev];
    });
  };

  const handleDelete = async () => {
    if (!deletingCard) return;
    try {
      await api(`/api/cards/${deletingCard.id}`, { method: "DELETE" });
      setCards(prev => prev.filter(c => c.id !== deletingCard.id));
      show("Carte supprimée avec succès", "success");
      setDeletingCard(null);
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handleToggle = async (card) => {
    try {
      const updated = await api(`/api/cards/${card.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...card, isActive: !card.isActive })
      });
      setCards(prev => prev.map(c => c.id === card.id ? updated : c));
      show(`Carte désormais ${updated.isActive ? "active" : "masquée"}`, "success");
    } catch (err) {
      show(err.message, "error");
    }
  };

  const handlePreview = (card) => {
    setPublicUuid(card.uuid);
    setView("public");
    window.history.pushState({}, "", `/card/${card.uuid}`);
  };

  // ─── Render Gates ───────────────────────────────────────
  
  // 1. Inject Global CSS
  const injectCss = () => {
    const style = document.createElement("style");
    style.innerHTML = GLOBAL_CSS;
    document.head.appendChild(style);
  };
  useEffect(() => { injectCss(); }, []);

  // 2. Public Views (no auth required)
  if (view === "public") {
    return <PublicCard uuid={publicUuid} onBack={() => setView("dashboard")} />;
  }

  if (view === "lead-capture") {
    return <LeadCaptureForm />;
  }

  // 3. Auth View
  if (!user) {
    return (
      <>
        <AuthPage onLogin={handleLogin} />
        <Toasts toasts={toasts} />
      </>
    );
  }

  // 4. Main Dashboard Layout
  const navItems = [
    { key: "dashboard",    icon: "card",     label: "Cartes" },
    { key: "crm-board",    icon: "kanban",   label: "CRM" },
    { key: "crm-dashboard",icon: "trendUp",  label: "Tableau de bord" },
    { key: "stats",        icon: "barChart", label: "Statistiques" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: P.bg, display: "flex" }}>
      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: 230,
        flexShrink: 0,
        background: P.navy,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
        boxShadow: T.shadow.sm,
        zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 20px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: T.r.md,
            background: "rgba(255,255,255,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon name="card" size={18} color="#fff" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.3px" }}>Artimmo</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Bonjour, {user.name?.split(" ")[0]}
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4, padding: "8px 14px", flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className="nav-link"
              style={{
                ...btn(view === item.key ? "nav" : "ghost", "sm"),
                width: "100%", justifyContent: "flex-start",
                background: view === item.key ? "rgba(255,255,255,0.14)" : "transparent",
                border: "1px solid transparent",
                color: "#fff",
              }}
            >
              <Icon name={item.icon} size={15} color="#fff" />
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{ ...btn("nav", "sm"), width: "100%", justifyContent: "flex-start" }}
          >
            <Icon name="logOut" size={14} color="#fff" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ─── CONTENT ─── */}
      <div style={{ flex: 1, minWidth: 0 }}>

      {/* ─── STATS PAGE ─── */}
      {view === "stats" && (
        <StatsPage onBack={() => setView("dashboard")} />
      )}

      {/* ─── CRM PAGES ─── */}
      {view === "crm-board" && <LeadsBoard toast={show} />}
      {view === "crm-dashboard" && <CrmDashboardPage toast={show} />}

      {/* ─── DASHBOARD PAGE ─── */}
      {view === "dashboard" && (
        <main style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px" }}>

          {/* Page Title & Add Button */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.6px" }}>
                Vos cartes de visite
              </h1>
              <p style={{ color: P.textMuted, fontSize: 14, marginTop: 4 }}>
                Créez, gérez et partagez votre identité numérique
              </p>
            </div>
            <button
              onClick={() => { setEditingCard(null); setIsFormOpen(true); }}
              className="hoverable"
              style={{ ...btn("primary", "md"), boxShadow: T.shadow.md }}
            >
              <Icon name="plus" size={16} color="#fff" />
              Nouvelle carte
            </button>
          </div>

          {/* Cards Grid */}
          {loadingCards ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                border: `2.5px solid ${P.border}`,
                borderTopColor: P.navy,
                animation: "spin 0.7s linear infinite"
              }} />
            </div>
          ) : cards.length === 0 ? (
            <div style={{
              background: P.bgCard,
              border: `2px dashed ${P.border}`,
              borderRadius: T.r.xl,
              padding: "60px 20px",
              textAlign: "center"
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: T.r.lg,
                background: P.accentLt,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px"
              }}>
                <Icon name="card" size={28} color={P.blue} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: P.text, marginBottom: 6 }}>
                Aucune carte pour le moment
              </h3>
              <p style={{ color: P.textMuted, fontSize: 14, marginBottom: 20 }}>
                Créez votre première carte de visite numérique pour commencer à la partager.
              </p>
              <button
                onClick={() => { setEditingCard(null); setIsFormOpen(true); }}
                className="hoverable"
                style={btn("primary", "md")}
              >
                <Icon name="plus" size={16} color="#fff" />
                Créer votre première carte
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: 20
            }}>
              {cards.map(card => (
                <CardTile
                  key={card.id}
                  card={card}
                  onEdit={(c) => { setEditingCard(c); setIsFormOpen(true); }}
                  onDelete={(c) => setDeletingCard(c)}
                  onToggle={handleToggle}
                  onQR={(c) => setQrCard(c)}
                  onPreview={handlePreview}
                />
              ))}
            </div>
          )}
        </main>
      )}

      </div>

      {/* ─── MODALS ─── */}
      {isFormOpen && (
        <CardFormModal 
          card={editingCard} 
          onClose={() => setIsFormOpen(false)} 
          onSaved={handleSavedCard}
          toast={show}
        />
      )}

      {qrCard && (
        <QRModal 
          card={qrCard} 
          onClose={() => setQrCard(null)} 
        />
      )}

      {deletingCard && (
        <DeleteModal 
          card={deletingCard} 
          onCancel={() => setDeletingCard(null)} 
          onConfirm={handleDelete} 
        />
      )}

      {/* ─── TOASTS ─── */}
      <Toasts toasts={toasts} />
    </div>
  );
}