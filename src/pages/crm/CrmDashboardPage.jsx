import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Icon } from "../../components/Icon";
import { P, T } from "../../utils/theme";
import { STATUSES } from "./crmUtils";

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.lg,
      padding: "18px 20px", boxShadow: T.shadow.xs }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: T.r.sm, background: color + "18",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={16} color={color} />
        </div>
        <div style={{ fontSize: 12.5, color: P.textMuted, fontWeight: 600 }}>{label}</div>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: P.text }}>{value}</div>
    </div>
  );
}

export function CrmDashboardPage({ toast }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/crm/dashboard").then(setStats).catch(e => { setError(e.message); toast(e.message, "error"); });
  }, [toast]);

  if (error) return <div style={{ padding: 40, color: P.danger }}>{error}</div>;
  if (!stats) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${P.border}`,
        borderTopColor: P.navy, animation: "spin 0.7s linear infinite" }} />
    </div>
  );

  const maxStatus = Math.max(1, ...Object.values(stats.byStatus));

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.6px", marginBottom: 4 }}>
        Tableau de bord CRM
      </h1>
      <p style={{ color: P.textMuted, fontSize: 14, marginBottom: 28 }}>
        Vue d'ensemble du pipeline commercial
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Total prospects" value={stats.total} icon="users" color={P.navy} />
        <StatCard label="Cette semaine" value={stats.leadsThisWeek} icon="trendUp" color={P.blue} />
        <StatCard label="Ce mois" value={stats.leadsThisMonth} icon="calendar" color="#6366f1" />
        <StatCard label="Taux de conversion" value={`${stats.conversionRate}%`} icon="barChart" color={P.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, marginBottom: 28 }}>
        {/* Pipeline breakdown */}
        <div style={{ background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.lg, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 16 }}>Répartition du pipeline</h3>
          {STATUSES.map(s => {
            const count = stats.byStatus[s.key] || 0;
            const pct = Math.round((count / maxStatus) * 100);
            return (
              <div key={s.key} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ color: P.textSub, fontWeight: 600 }}>{s.label}</span>
                  <span style={{ color: P.textMuted }}>{count}</span>
                </div>
                <div style={{ height: 8, borderRadius: T.r.pill, background: P.bg, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: s.color, borderRadius: T.r.pill,
                    transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Sources */}
        <div style={{ background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.lg, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 16 }}>Sources</h3>
          {stats.bySource.length === 0 ? (
            <div style={{ fontSize: 13, color: P.textFaint }}>Aucune donnée</div>
          ) : (
            stats.bySource.map(s => (
              <div key={s.source} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 0", borderBottom: `1px solid ${P.border}` }}>
                <span style={{ fontSize: 13.5, color: P.textSub, textTransform: "capitalize" }}>
                  {s.source === "ads" ? "Campagnes publicitaires" : s.source === "manual" ? "Saisie manuelle" : s.source}
                </span>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: P.navy }}>{s.count}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {stats.perCommercial && (
        <div style={{ background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.lg, padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: P.text, marginBottom: 16 }}>Performance par commercial</h3>
          {stats.perCommercial.length === 0 ? (
            <div style={{ fontSize: 13, color: P.textFaint }}>Aucun prospect assigné pour le moment</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5 }}>
              <thead>
                <tr style={{ textAlign: "left", color: P.textMuted, fontSize: 12 }}>
                  <th style={{ padding: "6px 0" }}>Commercial</th>
                  <th style={{ padding: "6px 0" }}>Prospects</th>
                  <th style={{ padding: "6px 0" }}>Vendus</th>
                  <th style={{ padding: "6px 0" }}>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {stats.perCommercial.map(c => (
                  <tr key={c.userId} style={{ borderTop: `1px solid ${P.border}` }}>
                    <td style={{ padding: "9px 0", fontWeight: 600, color: P.text }}>{c.name}</td>
                    <td style={{ padding: "9px 0", color: P.textSub }}>{c.total}</td>
                    <td style={{ padding: "9px 0", color: P.textSub }}>{c.vendu}</td>
                    <td style={{ padding: "9px 0", color: P.success, fontWeight: 600 }}>
                      {c.total > 0 ? Math.round((c.vendu / c.total) * 100) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
