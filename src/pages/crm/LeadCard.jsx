import { Icon } from "../../components/Icon";
import { P, T } from "../../utils/theme";
import { formatBudget, formatDate } from "./crmUtils";

export function LeadCard({ lead, onOpen }) {
  const budget = formatBudget(lead.budgetMin, lead.budgetMax);

  return (
    <div
      onClick={() => onOpen(lead)}
      className="hoverable"
      style={{
        background: P.bgCard, border: `1px solid ${P.border}`, borderRadius: T.r.md,
        padding: "12px 14px", marginBottom: 10, cursor: "pointer", boxShadow: T.shadow.xs,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: P.text }}>{lead.name}</div>
        {lead.source === "ads" && (
          <span style={{ fontSize: 10, fontWeight: 700, color: P.blue, background: P.accentLt,
            border: `1px solid ${P.bluePale}`, borderRadius: T.r.pill, padding: "2px 7px", flexShrink: 0 }}>
            ADS
          </span>
        )}
      </div>

      {lead.campaign && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, color: P.blue, fontSize: 11.5, fontWeight: 600 }}>
          <Icon name="trendUp" size={11} color={P.blue} />
          {lead.campaign}
        </div>
      )}

      {lead.location && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 6, color: P.textMuted, fontSize: 12.5 }}>
          <Icon name="mapPin" size={12} color={P.textMuted} />
          {lead.location}
        </div>
      )}

      {budget && (
        <div style={{ marginTop: 5, color: P.textSub, fontSize: 12.5, fontWeight: 600 }}>
          {budget}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
        <div style={{ fontSize: 11, color: P.textFaint }}>{formatDate(lead.createdAt)}</div>
        {lead.assignee && (
          <div title={lead.assignee.name} style={{
            width: 22, height: 22, borderRadius: "50%", background: P.navy, color: "#fff",
            fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {lead.assignee.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
}
