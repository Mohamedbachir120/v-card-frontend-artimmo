import { useState } from "react";
import { publicPost } from "../../services/api";
import { Icon } from "../../components/Icon";
import { P, T, btn } from "../../utils/theme";
import { PROPERTY_TYPES } from "./crmUtils";

/**
 * Public, unauthenticated landing page that ad-campaign clicks redirect to.
 * Submits straight into the CRM pipeline as a lead with source=ads.
 * Reads utm_campaign (or ?campaign=) from the URL so the lead is tagged
 * with the campaign that brought it in.
 */
export function LeadCaptureForm() {
  const params = new URLSearchParams(window.location.search);
  const campaign = params.get("campaign") || params.get("utm_campaign") || null;

  const [form, setForm] = useState({
    name: "", phone: "", email: "", budgetMin: "", budgetMax: "",
    location: "", propertyType: "", message: "",
    optPieces: "", optAscenseur: false, optParking: false, optMeuble: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setCheck = k => e => setForm(f => ({ ...f, [k]: e.target.checked }));

  const submit = async e => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await publicPost("/api/leads/capture", {
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
        location: form.location || null,
        propertyType: form.propertyType || null,
        message: form.message || null,
        campaign,
        options: {
          pieces: form.optPieces ? Number(form.optPieces) : null,
          ascenseur: form.optAscenseur,
          parking: form.optParking,
          meuble: form.optMeuble,
        },
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Une erreur est survenue. Merci de réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const wrap = (children) => (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg,${P.navy} 0%,${P.navyLight} 45%,${P.blue} 100%)`,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "rgba(255,255,255,0.98)", borderRadius: T.r.xl, padding: "40px 36px",
        width: "100%", maxWidth: 560, boxShadow: T.shadow.xl }}>
        {children}
      </div>
    </div>
  );

  if (submitted) {
    return wrap(
      <div style={{ textAlign: "center", padding: "30px 10px" }}>
        <div style={{ width: 64, height: 64, borderRadius: T.r.lg, background: P.successLt, margin: "0 auto 18px",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={28} color={P.success} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: P.text, marginBottom: 8 }}>Merci !</h2>
        <p style={{ color: P.textMuted, fontSize: 14.5 }}>
          Votre demande a bien été reçue. Un conseiller Artimmo vous contactera très prochainement.
        </p>
      </div>
    );
  }

  return wrap(
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 22 }}>
        <div style={{ width: 42, height: 42, borderRadius: T.r.md, background: P.navy,
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="building" size={20} color="#fff" />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, color: P.navy, letterSpacing: "-0.4px" }}>Artimmo</div>
          <div style={{ fontSize: 11, color: P.textMuted }}>TROUVEZ VOTRE BIEN IDÉAL</div>
        </div>
      </div>

      <h1 style={{ fontSize: 23, fontWeight: 700, color: P.text, marginBottom: 6 }}>
        Parlez-nous de votre projet immobilier
      </h1>
      <p style={{ color: P.textMuted, fontSize: 14, marginBottom: 24 }}>
        Quelques informations et un conseiller vous recontacte rapidement.
      </p>

      {error && (
        <div style={{ background: P.dangerLt, border: "1px solid #fac0c2", color: "#c0252b", borderRadius: T.r.sm,
          padding: "10px 14px", fontSize: 13.5, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Field label="Nom complet *">
            <Input value={form.name} onChange={set("name")} placeholder="Votre nom" required />
          </Field>
          <Field label="Téléphone *">
            <Input value={form.phone} onChange={set("phone")} placeholder="05XX XX XX XX" required />
          </Field>
        </div>

        <Field label="E-mail">
          <Input type="email" value={form.email} onChange={set("email")} placeholder="email@exemple.com" />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "14px 0" }}>
          <Field label="Budget minimum (DA)">
            <Input type="number" value={form.budgetMin} onChange={set("budgetMin")} placeholder="8 000 000" />
          </Field>
          <Field label="Budget maximum (DA)">
            <Input type="number" value={form.budgetMax} onChange={set("budgetMax")} placeholder="12 000 000" />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <Field label="Localisation souhaitée">
            <Input value={form.location} onChange={set("location")} placeholder="Alger, Hydra…" />
          </Field>
          <Field label="Type de bien">
            <select value={form.propertyType} onChange={set("propertyType")} style={selectStyle}>
              <option value="">Sélectionner…</option>
              {PROPERTY_TYPES.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Nombre de pièces souhaité">
          <Input type="number" value={form.optPieces} onChange={set("optPieces")} placeholder="3" />
        </Field>

        <div style={{ display: "flex", gap: 18, margin: "14px 0 18px", flexWrap: "wrap" }}>
          <Checkbox label="Ascenseur" checked={form.optAscenseur} onChange={setCheck("optAscenseur")} />
          <Checkbox label="Parking" checked={form.optParking} onChange={setCheck("optParking")} />
          <Checkbox label="Meublé" checked={form.optMeuble} onChange={setCheck("optMeuble")} />
        </div>

        <Field label="Message (optionnel)">
          <textarea value={form.message} onChange={set("message")} rows={3} placeholder="Précisez votre besoin…"
            style={{ ...selectStyle, resize: "vertical", fontFamily: "inherit" }} />
        </Field>

        <button type="submit" disabled={loading} className="hoverable"
          style={{ ...btn("primary", "lg"), width: "100%", marginTop: 8, fontWeight: 600 }}>
          {loading ? "Envoi en cours…" : "Envoyer ma demande"}
        </button>

        <p style={{ fontSize: 11.5, color: P.textFaint, textAlign: "center", marginTop: 12 }}>
          Vos informations sont transmises uniquement à l'équipe commerciale Artimmo.
        </p>
      </form>
    </>
  );
}

const selectStyle = {
  width: "100%", padding: "9px 13px", borderRadius: T.r.sm, border: `1px solid ${P.border}`,
  fontSize: 14, color: P.text, background: "#fff", boxSizing: "border-box",
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 0 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: P.textMuted,
        marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</label>
      {children}
    </div>
  );
}

function Input(props) {
  return <input {...props} style={selectStyle} />;
}

function Checkbox({ label, checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13.5, color: P.textSub, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: 16, height: 16 }} />
      {label}
    </label>
  );
}
