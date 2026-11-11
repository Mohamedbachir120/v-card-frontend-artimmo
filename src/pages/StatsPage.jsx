import { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { Icon } from "../components/Icon";
import { P, T, btn } from "../utils/theme";
import { AlertBox } from "../components/ui";

// ── helpers ──────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }

function dowHeatmap(viewsLast30Days) {
  const by = Array(7).fill(0);
  viewsLast30Days.forEach(({ date, count }) => {
    by[new Date(date + "T00:00:00").getDay()] += count;
  });
  return by;
}

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

// ── sub-components ───────────────────────────────────────────────────

function MiniStat({ num, label }) {
  return (
    <div style={{ background: "#f8fafc", border: `1px solid ${P.border}`, borderRadius: T.r.md, padding: "14px" }}>
      <div style={{ fontSize: 20, fontWeight: 800, color: P.text, letterSpacing: "-0.5px" }}>{num}</div>
      <div style={{ fontSize: 11, color: P.textMuted, fontWeight: 500, marginTop: 3 }}>{label}</div>
    </div>
  );
}

function BarChart({ data }) {
  const [tooltip, setTooltip] = useState(null);
  const maxDay = Math.max(...data.map(d => d.count), 1);

  return (
    <div style={{ position: "relative" }}>
      {/* bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 80 }}>
        {data.map((d, i) => {
          const isToday = i === data.length - 1;
          const h = Math.max((d.count / maxDay) * 100, d.count > 0 ? 3 : 1);
          return (
            <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "flex-end", height: "100%", cursor: "pointer" }}
              onMouseEnter={e => {
                const dt = new Date(d.date + "T00:00:00").toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
                setTooltip({ x: e.clientX, y: e.clientY, label: `${isToday ? "Aujourd'hui" : dt} · ${d.count} vue${d.count !== 1 ? "s" : ""}` });
              }}
              onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
              onMouseLeave={() => setTooltip(null)}>
              <div style={{
                width: "100%", height: `${h}%`, borderRadius: "3px 3px 0 0",
                background: isToday
                  ? `linear-gradient(to top, ${P.navy}, ${P.blue})`
                  : `linear-gradient(to top, ${P.blue}, #6366f1)`,
                opacity: tooltip?.label.includes(d.date) ? 0.75 : 1,
                transition: "opacity 0.15s",
              }}/>
            </div>
          );
        })}
      </div>
      {/* x-axis labels */}
      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
        {data.map((d, i) => {
          const isToday = i === data.length - 1;
          const showLabel = i % 5 === 0 || isToday;
          const dt = new Date(d.date + "T00:00:00").toLocaleDateString("fr-FR", { month: "short", day: "numeric" });
          return (
            <div key={d.date} style={{ flex: 1, textAlign: "center", fontSize: 9,
              color: isToday ? P.navy : P.textMuted, fontWeight: isToday ? 700 : 400 }}>
              {showLabel ? (isToday ? "Aujourd'hui" : dt) : ""}
            </div>
          );
        })}
      </div>
      {/* tooltip */}
      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y,
          transform: "translate(-50%, -130%)", background: "#1e293b", color: "#fff",
          fontSize: 11, fontWeight: 600, padding: "4px 8px", borderRadius: 6,
          pointerEvents: "none", whiteSpace: "nowrap", zIndex: 50 }}>
          {tooltip.label}
        </div>
      )}
    </div>
  );
}

function CardBreakdown({ cards, total }) {
  const max = Math.max(...cards.map(c => c.count), 1);
  const colors = [P.navy, P.blue, "#6366f1", P.success, "#f59e0b"];
  return (
    <div>
      {cards.map((c, i) => {
        const pct = (c.count / max) * 100;
        const share = Math.round((c.count / total) * 100);
        const initials = c.name.slice(0, 2).toUpperCase();
        return (
          <div key={c.cardId} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < cards.length - 1 ? 14 : 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: colors[i % colors.length],
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: P.text,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
              <div style={{ fontSize: 11, color: P.textMuted }}>{c.count} vue{c.count !== 1 ? "s" : ""}</div>
              <div style={{ marginTop: 5, height: 5, background: "#f1f5f9", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 99,
                  background: colors[i % colors.length], transition: "width 0.6s ease" }}/>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: P.text, minWidth: 30, textAlign: "right" }}>
              {share}%
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DowHeatmap({ viewsLast30Days }) {
  const byDow = dowHeatmap(viewsLast30Days);
  const maxDow = Math.max(...byDow, 1);
  // interpolate #f1f5f9 → P.navy
  const loRGB = [241, 245, 249];
  const hiRGB = [30,  58,  95];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 4 }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 9, color: P.textMuted }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
        {byDow.map((count, i) => {
          const t = count / maxDow;
          const r = Math.round(lerp(loRGB[0], hiRGB[0], t));
          const g = Math.round(lerp(loRGB[1], hiRGB[1], t));
          const b = Math.round(lerp(loRGB[2], hiRGB[2], t));
          return (
            <div key={i} title={`${DAY_LABELS[i]}: ${count} views`}
              style={{ aspectRatio: "1", borderRadius: 4, background: `rgb(${r},${g},${b})` }}/>
          );
        })}
      </div>
    </div>
  );
}

// ── main page ────────────────────────────────────────────────────────
export function StatsPage({ onBack }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/api/stats/dashboard").then(setStats).catch(e => setError(e.message));
  }, []);

  // derived values
  const counts     = stats?.viewsLast30Days.map(d => d.count) ?? [];
  const peak       = counts.length ? Math.max(...counts) : 0;
  const avg        = counts.length ? (counts.reduce((a, b) => a + b, 0) / 30).toFixed(1) : "0";
  const activeDays = counts.filter(c => c > 0).length;
  const peakDate   = stats?.viewsLast30Days.find(d => d.count === peak)?.date ?? "";
  const peakLabel  = peakDate
    ? new Date(peakDate + "T00:00:00").toLocaleDateString("fr-FR", { month: "short", day: "numeric" })
    : "—";

  const statItems = stats ? [
    { num: stats.totalViews,          label: "Vues totales",     delta: "+12% vs mois dernier", up: true,  color: P.navy,    icon: "eye"      },
    { num: stats.viewsToday,          label: "Aujourd'hui",      delta: "jusqu'à présent",       up: null,  color: P.blue,    icon: "trendUp"  },
    { num: stats.viewsThisMonth,      label: "Ce mois-ci",       delta: "sur les 30 derniers jours", up: true, color: "#6366f1", icon: "calendar" },
    { num: stats.viewsPerCard.length, label: "Cartes actives",   delta: "toutes les cartes actives", up: null, color: P.success, icon: "card"     },
  ] : [];

  const sectionCard = (children, extraStyle = {}) => (
    <div style={{ background: "#fff", borderRadius: T.r.lg, padding: "24px",
      boxShadow: T.shadow.xs, border: `1px solid ${P.border}`, ...extraStyle }}>
      {children}
    </div>
  );

  const sectionHead = (title, sub) => (
    <>
      <div style={{ fontSize: 14, fontWeight: 700, color: P.text, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 12, color: P.textMuted, marginBottom: 18 }}>{sub}</div>
    </>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "36px 28px", animation: "slideUp 0.2s ease" }}>

      {/* ── header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
        <button onClick={onBack} className="hoverable" style={{ ...btn("ghost", "sm"), flexShrink: 0 }}>
          <Icon name="arrowLeft" size={15}/>
        </button>
        <div>
          <h1 style={{ fontSize: 25, fontWeight: 800, color: P.text, letterSpacing: "-0.6px" }}>Statistiques</h1>
          <p style={{ color: P.textMuted, fontSize: 13, marginTop: 2 }}>Performance de vos cartes</p>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: P.textMuted,
          background: "#f1f5f9", padding: "5px 10px", borderRadius: 6, border: `1px solid ${P.border}` }}>
          30 derniers jours
        </div>
      </div>

      {error && <AlertBox>{error}</AlertBox>}

      {!stats && !error && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2.5px solid ${P.border}`,
            borderTopColor: P.navy, animation: "spin 0.7s linear infinite" }}/>
        </div>
      )}

      {stats && (<>
        {/* ── stat cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14, marginBottom: 24 }}>
          {statItems.map((s, i) => (
            <div key={i} className="stat-card"
              style={{ background: "#fff", borderRadius: T.r.lg, padding: "20px",
                boxShadow: T.shadow.xs, border: `1px solid ${P.border}`,
                animation: `slideUp 0.22s ease ${i * 0.06}s both` }}>
              <div style={{ width: 36, height: 36, borderRadius: T.r.md, background: s.color,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                <Icon name={s.icon} size={18} color="#fff"/>
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: P.text, letterSpacing: "-0.6px", marginBottom: 2 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: P.textMuted, fontWeight: 500 }}>{s.label}</div>
              {s.delta && (
                <div style={{ fontSize: 11, fontWeight: 600, marginTop: 6, display: "flex", alignItems: "center", gap: 3,
                  color: s.up ? P.success : P.textMuted }}>
                  {s.up && <Icon name="arrowUp" size={10} color={P.success}/>}
                  {s.delta}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── 30-day bar chart (full width) ── */}
        {sectionCard(<>
          {sectionHead("Vues quotidiennes — 30 derniers jours", "Chaque barre représente le nombre de vues d'un jour")}
          <BarChart data={stats.viewsLast30Days}/>
        </>, { marginBottom: 16 })}

        {/* ── per-card + snapshot + heatmap ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

          {sectionCard(<>
            {sectionHead("Vues par carte", "Performance de chaque carte")}
            <CardBreakdown cards={stats.viewsPerCard} total={stats.totalViews}/>
          </>)}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {sectionCard(<>
              {sectionHead("Aperçu des performances", "Basé sur les 30 derniers jours")}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <MiniStat num={peak}       label={`Pic · ${peakLabel}`}/>
                <MiniStat num={avg}        label="Moyenne quotidienne"/>
                <MiniStat num={activeDays} label="Jours actifs"/>
              </div>
            </>)}

            {sectionCard(<>
              {sectionHead("Schéma d'activité", "Densité des vues par jour de la semaine")}
              <DowHeatmap viewsLast30Days={stats.viewsLast30Days}/>
            </>)}

          </div>
        </div>
      </>)}
    </div>
  );
}
