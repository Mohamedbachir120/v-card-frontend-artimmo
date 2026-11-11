import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/Icon";
import { TextInput } from "../../components/ui";
import { P, T, btn } from "../../utils/theme";
import { STATUSES } from "./crmUtils";
import { LeadCard } from "./LeadCard";
import { LeadFormModal } from "./LeadFormModal";
import { LeadDetailModal } from "./LeadDetailModal";

export function LeadsBoard({ toast, user }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openLead, setOpenLead] = useState(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const params = search ? `?q=${encodeURIComponent(search)}` : "";
      const data = await api(`/api/leads${params}`);
      setLeads(data);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  useEffect(() => {
    const t = setTimeout(fetchLeads, 250);
    return () => clearTimeout(t);
  }, [fetchLeads]);

  const handleSaved = (lead) => setLeads(prev => [lead, ...prev]);

  const handleUpdated = (updated) => setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));

  return (
    <main style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.6px" }}>
            Pipeline commercial
          </h1>
          <p style={{ color: P.textMuted, fontSize: 14, marginTop: 4 }}>
            Prospects et clients, du premier contact à la vente
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ width: 220 }}>
            <TextInput value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher un prospect…" />
          </div>
          <button onClick={() => setIsFormOpen(true)} className="hoverable" style={{ ...btn("primary", "md"), boxShadow: T.shadow.md }}>
            <Icon name="plus" size={16} color="#fff" />
            Nouveau prospect
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${P.border}`,
            borderTopColor: P.navy, animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(240px, 1fr))", gap: 16, overflowX: "auto" }}>
          {STATUSES.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage.key);
            return (
              <div key={stage.key} style={{ background: P.bgAlt, borderRadius: T.r.lg, padding: 12, minHeight: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, padding: "0 2px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: stage.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: P.text }}>{stage.label}</span>
                  <span style={{ fontSize: 12, color: P.textFaint, marginLeft: "auto" }}>{stageLeads.length}</span>
                </div>
                {stageLeads.length === 0 ? (
                  <div style={{ fontSize: 12.5, color: P.textFaint, textAlign: "center", padding: "20px 0" }}>
                    Aucun prospect
                  </div>
                ) : (
                  stageLeads.map(lead => <LeadCard key={lead.id} lead={lead} onOpen={setOpenLead} />)
                )}
              </div>
            );
          })}
        </div>
      )}

      {isFormOpen && (
        <LeadFormModal onClose={() => setIsFormOpen(false)} onSaved={handleSaved} toast={toast} />
      )}

      {openLead && (
        <LeadDetailModal
          lead={openLead}
          onClose={() => setOpenLead(null)}
          onUpdated={(u) => { handleUpdated(u); setOpenLead(u); }}
          toast={toast}
          currentUser={user}
        />
      )}
    </main>
  );
}
