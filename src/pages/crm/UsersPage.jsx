import { useState, useEffect, useCallback } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/Icon";
import { AlertBox, FieldLabel, TextInput } from "../../components/ui";
import { P, T, btn } from "../../utils/theme";

export function UsersPage({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api("/api/users");
      setUsers(data);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "36px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.6px" }}>
            Équipe
          </h1>
          <p style={{ color: P.textMuted, fontSize: 14, marginTop: 4 }}>
            Gérez les comptes admin et commerciaux
          </p>
        </div>
        <button onClick={() => setIsFormOpen(true)} className="hoverable"
          style={{ ...btn("primary", "md"), boxShadow: T.shadow.md }}>
          <Icon name="plus" size={16} color="#fff" />
          Nouveau compte
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${P.border}`,
            borderTopColor: P.navy, animation: "spin 0.7s linear infinite" }} />
        </div>
      ) : (
        <div style={{ background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.lg, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: "left", color: P.textMuted, fontSize: 12, background: P.bg }}>
                <th style={{ padding: "12px 20px" }}>Nom</th>
                <th style={{ padding: "12px 20px" }}>E-mail</th>
                <th style={{ padding: "12px 20px" }}>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} style={{ borderTop: `1px solid ${P.border}` }}>
                  <td style={{ padding: "12px 20px", fontWeight: 600, color: P.text }}>{u.name}</td>
                  <td style={{ padding: "12px 20px", color: P.textSub }}>{u.email}</td>
                  <td style={{ padding: "12px 20px" }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700, padding: "3px 10px", borderRadius: T.r.pill,
                      color: u.role === "admin" ? P.navy : P.blue,
                      background: u.role === "admin" ? "#eef2f7" : P.accentLt,
                      border: `1px solid ${u.role === "admin" ? P.border : P.bluePale}`,
                    }}>
                      {u.role === "admin" ? "Admin" : "Commercial"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isFormOpen && (
        <NewUserModal
          onClose={() => setIsFormOpen(false)}
          onCreated={(u) => { setUsers(prev => [...prev, u].sort((a, b) => a.name.localeCompare(b.name))); toast("Compte créé", "success"); }}
        />
      )}
    </main>
  );
}

function NewUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "commercial" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const created = await api("/api/users", { method: "POST", body: JSON.stringify(form) });
      onCreated(created);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, background: "rgba(6,14,30,0.6)", backdropFilter: "blur(6px)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20,
    }}>
      <div style={{ background: "#fff", borderRadius: T.r.xl, padding: 28, width: "100%", maxWidth: 420 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: P.text, marginBottom: 18 }}>Nouveau compte</h2>
        {error && <AlertBox>{error}</AlertBox>}
        <form onSubmit={submit}>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Nom complet</FieldLabel>
            <TextInput value={form.name} onChange={set("name")} placeholder="Nom de la personne" required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>E-mail</FieldLabel>
            <TextInput type="email" value={form.email} onChange={set("email")} placeholder="personne@entreprise.com" required />
          </div>
          <div style={{ marginBottom: 14 }}>
            <FieldLabel>Mot de passe</FieldLabel>
            <TextInput type="password" value={form.password} onChange={set("password")} placeholder="••••••••" required />
          </div>
          <div style={{ marginBottom: 20 }}>
            <FieldLabel>Rôle</FieldLabel>
            <select value={form.role} onChange={set("role")} style={{
              width: "100%", padding: "9px 13px", borderRadius: T.r.sm, border: `1px solid ${P.border}`,
              fontSize: 14, color: P.text, background: "#fff", fontFamily: "inherit" }}>
              <option value="commercial">Commercial</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={onClose} className="hoverable" style={{ ...btn("ghost"), flex: 1 }}>Annuler</button>
            <button type="submit" disabled={loading} className="hoverable" style={{ ...btn("primary"), flex: 2 }}>
              {loading ? "Création…" : "Créer le compte"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
