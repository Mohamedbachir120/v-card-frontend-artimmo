import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Overlay, ModalBox, CloseBtn } from "../components/ui";
import { Icon } from "../components/Icon";
import { P, T, btn } from "../utils/theme";

export function QRModal({ card, onClose }) {
  const [qr, setQr] = useState(null);
  const [copied, setCopied] = useState(false);
  const pubUrl = `${window.location.origin}/card/${card.uuid}`;
  useEffect(() => {
    api(`/api/cards/${card.id}/qr`).then(d => setQr(d.qrCode)).catch(() => {});
  }, [card.id]);

  const copy = () => {
    navigator.clipboard.writeText(pubUrl);
    setCopied(true); setTimeout(() => setCopied(false), 2200);
  };

  const accent = card.accent || P.navy;

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={380}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:T.r.md,background:accent,
              display:"flex",alignItems:"center",justifyContent:"center",
              boxShadow:`0 4px 12px ${accent}55` }}>
              <Icon name="qr" size={19} color="#fff"/>
            </div>
            <div>
              <div style={{ fontSize:15,fontWeight:700,color:P.text,letterSpacing:"-0.2px" }}>{card.name}</div>
              <div style={{ fontSize:12,color:P.textMuted }}>Share your card</div>
            </div>
          </div>
          <CloseBtn onClick={onClose}/>
        </div>

        <div style={{ padding:20,background:P.bg,borderRadius:T.r.lg,border:`1px solid ${P.border}`,
          display:"flex",flexDirection:"column",alignItems:"center",gap:16,marginBottom:18 }}>
          <div style={{ padding:10,background:"#fff",borderRadius:T.r.md,
            boxShadow:T.shadow.sm,border:`1px solid ${P.border}` }}>
            {qr ? (
              <img src={qr} alt="QR Code" style={{ width:180,height:180,display:"block",borderRadius:6 }}/>
            ) : (
              <div style={{ width:180,height:180,display:"flex",alignItems:"center",
                justifyContent:"center",flexDirection:"column",gap:10,color:P.textMuted,fontSize:13 }}>
                <div style={{ width:22,height:22,borderRadius:"50%",border:`2.5px solid ${P.border}`,
                  borderTopColor:P.navy,animation:"spin 0.7s linear infinite" }}/>
                Generating…
              </div>
            )}
          </div>
          <div style={{ fontSize:12,color:P.textMuted,textAlign:"center",lineHeight:1.5 }}>
            Scan with any camera app to open this card
          </div>
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:8,padding:"9px 12px",
          background:P.bg,border:`1px solid ${P.border}`,borderRadius:T.r.sm,marginBottom:14 }}>
          <Icon name="link" size={13} color={P.textMuted}/>
          <span style={{ fontSize:11,color:P.textMuted,fontFamily:"monospace",
            overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",flex:1 }}>{pubUrl}</span>
        </div>

        <button onClick={copy} className="hoverable"
          style={{ ...btn(copied?"success":"primary","md"), width:"100%",
            boxShadow: copied ? "0 4px 12px rgba(18,161,80,0.25)" : "0 4px 12px rgba(29,53,87,0.2)" }}>
          <Icon name={copied?"check":"copy"} size={15} color="#fff"/>
          {copied ? "Link copied!" : "Copy link"}
        </button>
      </ModalBox>
    </Overlay>
  );
}