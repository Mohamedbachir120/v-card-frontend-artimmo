import { useState } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/Icon";
import { Overlay, ModalBox, CloseBtn, FieldLabel, TextInput, AlertBox } from "../../components/ui";
import { P, T, btn } from "../../utils/theme";
import { PROPERTY_TYPES } from "./crmUtils";

export function LeadFormModal({ onClose, onSaved, toast }) {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", budgetMin: "", budgetMax: "",
    location: "", propertyType: "", message: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const body = {
        ...form,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
      };
      const saved = await api("/api/leads", { method: "POST", body: JSON.stringify(body) });
      toast("Prospect créé", "success");
      onSaved(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={520}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 19, fontWeight: 700, color: P.text }}>Nouveau prospect</h2>
          <CloseBtn onClick={onClose} />
        </div>
        {error && <AlertBox>{error}</AlertBox>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Nom complet</FieldLabel>
            <TextInput value={form.name} onChange={set("name")} placeholder="Nom du prospect" required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <FieldLabel>Téléphone</FieldLabel>
              <TextInput value={form.phone} onChange={set("phone")} placeholder="05XX XX XX XX" />
            </div>
            <div>
              <FieldLabel>E-mail</FieldLabel>
              <TextInput type="email" value={form.email} onChange={set("email")} placeholder="email@exemple.com" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <FieldLabel>Budget min (DA)</FieldLabel>
              <TextInput type="number" value={form.budgetMin} onChange={set("budgetMin")} placeholder="8000000" />
            </div>
            <div>
              <FieldLabel>Budget max (DA)</FieldLabel>
              <TextInput type="number" value={form.budgetMax} onChange={set("budgetMax")} placeholder="12000000" />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div>
              <FieldLabel>Localisation</FieldLabel>
              <TextInput value={form.location} onChange={set("location")} placeholder="Alger, Hydra" />
            </div>
            <div>
              <FieldLabel>Type de bien</FieldLabel>
              <select value={form.propertyType} onChange={set("propertyType")} style={{
                width: "100%", padding: "9px 13px", borderRadius: T.r.sm, border: `1px solid ${P.border}`,
                fontSize: 14, color: P.text, background: "#fff", fontFamily: "inherit",
              }}>
                <option value="">—</option>
                {PROPERTY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <FieldLabel>Message</FieldLabel>
            <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Notes, besoins exprimés…"
              style={{ width: "100%", padding: "9px 13px", borderRadius: T.r.sm, border: `1px solid ${P.border}`,
                fontSize: 14, color: P.text, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
          </div>
          <button type="submit" disabled={loading} className="hoverable"
            style={{ ...btn("primary", "lg"), width: "100%", fontWeight: 600 }}>
            <Icon name="userPlus" size={16} color="#fff" />
            {loading ? "Création…" : "Créer le prospect"}
          </button>
        </form>
      </ModalBox>
    </Overlay>
  );
}
