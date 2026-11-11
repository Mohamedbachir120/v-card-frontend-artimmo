import { Icon } from "./Icon";
import { StatusBadge } from "./ui";
import { P, T, btn, initials } from "../utils/theme";

export function CardTile({ card, onEdit, onDelete, onToggle, onQR, onPreview }) {
  const accent     = card.accent     || P.navy;
  const accentLight = card.accentLight || P.accentLt;

  const contactRows = [
    { icon:"mail",   value:card.email },
    { icon:"phone",  value:card.phone },
    { icon:"globe",  value:card.website },
    { icon:"mapPin", value:card.location },
  ].filter(r => r.value).slice(0, 3);

  return (
    <div className="card-tile" style={{ background:"#fff", borderRadius:T.r.xl,
      overflow:"hidden", boxShadow:T.shadow.sm, border:`1px solid ${P.border}` }}>

      <div style={{ background:accent, padding:"18px 20px 16px",
        position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute",right:-30,top:-30,width:110,height:110,
          borderRadius:"50%",border:"1px solid rgba(255,255,255,0.1)",pointerEvents:"none" }}/>
        <div style={{ position:"absolute",left:-20,bottom:-35,width:80,height:80,
          borderRadius:"50%",border:"1px solid rgba(255,255,255,0.07)",pointerEvents:"none" }}/>

        <div style={{ display:"flex",alignItems:"flex-start",
          justifyContent:"space-between",position:"relative",gap:10 }}>
          <div style={{ display:"flex",alignItems:"center",gap:11,minWidth:0,flex:1 }}>
            <div style={{ width:42,height:42,borderRadius:T.r.md,flexShrink:0,
              background:"rgba(255,255,255,0.22)",
              border:"1.5px solid rgba(255,255,255,0.3)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:14,fontWeight:700,color:"#fff" }}>
              {initials(card.name)}
            </div>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:15,fontWeight:700,color:"#fff",letterSpacing:"-0.3px",
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{card.name}</div>
              {card.role && <div style={{ fontSize:12,color:"rgba(255,255,255,0.68)",marginTop:1 }}>{card.role}</div>}
            </div>
          </div>
          <StatusBadge active={card.isActive}/>
        </div>

        {card.company && (
          <div style={{ display:"inline-block",marginTop:10,
            background:"rgba(255,255,255,0.13)",
            border:"1px solid rgba(255,255,255,0.2)",borderRadius:T.r.pill,
            padding:"2px 10px",fontSize:10,fontWeight:700,
            color:"rgba(255,255,255,0.85)",letterSpacing:"0.7px",
            textTransform:"uppercase",position:"relative" }}>{card.company}</div>
        )}
      </div>

      <div style={{ padding:"4px 0",minHeight:contactRows.length===0?40:undefined }}>
        {contactRows.length === 0 ? (
          <div style={{ padding:"12px 18px",fontSize:12,color:P.textFaint,fontStyle:"italic" }}>
            Aucune coordonnée ajoutée pour l'instant
          </div>
        ) : contactRows.map((r, i) => (
          <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"9px 18px",
            borderBottom: i < contactRows.length-1 ? `1px solid ${P.bg}` : "none" }}>
            <div style={{ width:28,height:28,borderRadius:7,background:accentLight,
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <Icon name={r.icon} size={13} color={accent}/>
            </div>
            <span style={{ fontSize:13,color:P.textSub,fontWeight:500,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{r.value}</span>
          </div>
        ))}
      </div>

      <div style={{ padding:"10px 14px 14px",
        borderTop:`1px solid ${P.bg}`,
        display:"flex",gap:6,alignItems:"center" }}>

        <button onClick={() => onQR(card)} className="hoverable"
          style={{ ...btn("soft","sm"),flex:1 }}>
          <Icon name="qr" size={13} color={P.blue}/>Code QR
        </button>
        <button onClick={() => onPreview(card)} className="hoverable"
          style={{ ...btn("soft","sm"),flex:1 }}>
          <Icon name="eye" size={13} color={P.blue}/>Aperçu
        </button>

        <div style={{ width:1,height:20,background:P.border,flexShrink:0 }}/>

        {[
          { icon: card.isActive?"eyeOff":"eye", action:()=>onToggle(card),
            title: card.isActive?"Masquer la carte":"Rendre visible", danger:false },
          { icon:"edit",  action:()=>onEdit(card),   title:"Modifier la carte",   danger:false },
          { icon:"trash", action:()=>onDelete(card), title:"Supprimer la carte", danger:true  },
        ].map(({ icon,action,title,danger }) => (
          <button key={icon} onClick={action} title={title} className="icon-btn"
            style={{ width:30,height:30,borderRadius:7,background:"transparent",
              border:`1px solid ${P.border}`,display:"flex",alignItems:"center",
              justifyContent:"center",cursor:"pointer",flexShrink:0,
              color: danger ? P.danger : P.textMuted }}>
            <Icon name={icon} size={13} color={danger ? P.danger : P.textMuted}/>
          </button>
        ))}
      </div>
    </div>
  );
}