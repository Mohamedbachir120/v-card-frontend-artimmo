import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/Icon";
import { Overlay, ModalBox, CloseBtn, TextInput, AlertBox } from "../../components/ui";
import { P, T, btn } from "../../utils/theme";
import { STATUSES, INTERACTION_TYPES, formatBudget, formatDateTime } from "./crmUtils";

export function LeadDetailModal({ lead, onClose, onUpdated, toast }) {
  const [current, setCurrent] = useState(lead);
  const [interactions, setInteractions] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [noteType, setNoteType] = useState("note");
  const [reminderDue, setReminderDue] = useState("");
  const [reminderNote, setReminderNote] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [ints, rems] = await Promise.all([
        api(`/api/leads/${lead.id}/interactions`),
        api(`/api/reminders`),
      ]);
      setInteractions(ints);
      setReminders(rems.filter(r => r.leadId === lead.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [lead.id]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (status) => {
    try {
      const updated = await api(`/api/leads/${current.id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      setCurrent(updated);
      onUpdated(updated);
      toast(`Statut mis à jour : ${STATUSES.find(s => s.key === status)?.label}`, "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const addInteraction = async (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    try {
      const created = await api(`/api/leads/${current.id}/interactions`, {
        method: "POST", body: JSON.stringify({ type: noteType, content: note }),
      });
      setInteractions(prev => [created, ...prev]);
      setNote("");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    if (!reminderDue) return;
    try {
      const created = await api("/api/reminders", {
        method: "POST",
        body: JSON.stringify({ leadId: current.id, dueAt: reminderDue.replace("T", " ") + ":00", note: reminderNote }),
      });
      setReminders(prev => [...prev, created]);
      setReminderDue(""); setReminderNote("");
      toast("Rappel ajouté", "success");
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const completeReminder = async (id) => {
    try {
      const updated = await api(`/api/reminders/${id}/complete`, { method: "PATCH" });
      setReminders(prev => prev.map(r => r.id === id ? updated : r));
    } catch (err) {
      toast(err.message, "error");
    }
  };

  const budget = formatBudget(current.budgetMin, current.budgetMax);

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={640}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: P.text }}>{current.name}</h2>
            <div style={{ display: "flex", gap: 14, marginTop: 6, flexWrap: "wrap", fontSize: 13, color: P.textMuted }}>
              {current.phone && <span><Icon name="phone" size={12} /> {current.phone}</span>}
              {current.email && <span><Icon name="mail" size={12} /> {current.email}</span>}
              {current.location && <span><Icon name="mapPin" size={12} /> {current.location}</span>}
            </div>
          </div>
          <CloseBtn onClick={onClose} />
        </div>

        {error && <AlertBox>{error}</AlertBox>}

        {budget && (
          <div style={{ fontSize: 13.5, fontWeight: 600, color: P.textSub, marginBottom: 14 }}>{budget}</div>
        )}

        {/* Pipeline stage pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
          {STATUSES.map(s => (
            <button key={s.key} onClick={() => changeStatus(s.key)} className="hoverable"
              style={{
                padding: "6px 13px", borderRadius: T.r.pill, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                border: current.status === s.key ? `1px solid ${s.color}` : `1px solid ${P.border}`,
                background: current.status === s.key ? s.color : "#fff",
                color: current.status === s.key ? "#fff" : P.textMuted,
              }}>
              {s.label}
            </button>
          ))}
        </div>

        {current.message && (
          <div style={{ background: P.bg, borderRadius: T.r.sm, padding: "10px 13px", fontSize: 13.5,
            color: P.textSub, marginBottom: 20 }}>
            {current.message}
          </div>
        )}

        {/* Reminders */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Icon name="calendar" size={15} color={P.navy} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: P.text }}>Rappels</h3>
          </div>
          {reminders.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              {reminders.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
                  borderBottom: `1px solid ${P.border}`, opacity: r.isDone ? 0.5 : 1 }}>
                  <button onClick={() => !r.isDone && completeReminder(r.id)} className="icon-btn"
                    style={{ width: 20, height: 20, borderRadius: "50%", border: `1.5px solid ${r.isDone ? P.success : P.border}`,
                      background: r.isDone ? P.success : "transparent", display: "flex", alignItems: "center",
                      justifyContent: "center", cursor: r.isDone ? "default" : "pointer", flexShrink: 0 }}>
                    {r.isDone && <Icon name="check" size={11} color="#fff" />}
                  </button>
                  <div style={{ fontSize: 13, color: P.textSub, flex: 1 }}>
                    {r.note || "Rappel"} — <span style={{ color: P.textMuted }}>{formatDateTime(r.dueAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={addReminder} style={{ display: "flex", gap: 8 }}>
            <input type="datetime-local" value={reminderDue} onChange={e => setReminderDue(e.target.value)}
              style={{ padding: "7px 10px", borderRadius: T.r.sm, border: `1px solid ${P.border}`, fontSize: 13, fontFamily: "inherit" }} />
            <TextInput value={reminderNote} onChange={e => setReminderNote(e.target.value)} placeholder="Note (optionnel)" />
            <button type="submit" className="hoverable" style={btn("soft", "sm")}>Ajouter</button>
          </form>
        </div>

        {/* Interactions */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
            <Icon name="messageCircle" size={15} color={P.navy} />
            <h3 style={{ fontSize: 14, fontWeight: 700, color: P.text }}>Historique des interactions</h3>
          </div>
          <form onSubmit={addInteraction} style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            <select value={noteType} onChange={e => setNoteType(e.target.value)} style={{
              padding: "8px 10px", borderRadius: T.r.sm, border: `1px solid ${P.border}`, fontSize: 13, fontFamily: "inherit" }}>
              {INTERACTION_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
            <TextInput value={note} onChange={e => setNote(e.target.value)} placeholder="Ajouter une note, un appel, une visite…" />
            <button type="submit" className="hoverable" style={btn("primary", "sm")}>
              <Icon name="plus" size={13} color="#fff" />
            </button>
          </form>
          {loading ? (
            <div style={{ fontSize: 13, color: P.textMuted }}>Chargement…</div>
          ) : interactions.length === 0 ? (
            <div style={{ fontSize: 13, color: P.textFaint }}>Aucune interaction pour le moment.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {interactions.map(i => {
                const meta = INTERACTION_TYPES.find(t => t.key === i.type) || INTERACTION_TYPES[0];
                return (
                  <div key={i.id} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: P.accentLt,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name={meta.icon} size={13} color={P.blue} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: P.textSub }}>{i.content}</div>
                      <div style={{ fontSize: 11.5, color: P.textFaint, marginTop: 2 }}>
                        {meta.label} · {i.author?.name || "—"} · {formatDateTime(i.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </ModalBox>
    </Overlay>
  );
}
