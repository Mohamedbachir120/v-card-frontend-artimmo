import { Overlay, ModalBox } from "../components/ui";
import { Icon } from "../components/Icon";
import { P, T, btn } from "../utils/theme";

export function DeleteModal({ card, onCancel, onConfirm }) {
  return (
    <Overlay onClose={onCancel}>
      <ModalBox maxWidth={360}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:56,height:56,borderRadius:T.r.lg,background:P.dangerLt,
            border:"1px solid #fac0c2",display:"flex",alignItems:"center",
            justifyContent:"center",margin:"0 auto 18px" }}>
            <Icon name="trash" size={24} color={P.danger}/>
          </div>
          <h2 style={{ fontSize:18,fontWeight:700,color:P.text,marginBottom:8,letterSpacing:"-0.3px" }}>
            Supprimer cette carte ?
          </h2>
          <p style={{ color:P.textMuted,fontSize:14,marginBottom:28,lineHeight:1.6 }}>
            <strong style={{ color:P.text }}>{card.name}</strong> sera définitivement supprimée
            et son lien public cessera de fonctionner.
          </p>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onCancel} className="hoverable" style={{ ...btn("ghost"),flex:1 }}>Annuler</button>
            <button onClick={onConfirm} className="hoverable"
              style={{ ...btn("danger"),flex:1,boxShadow:"0 4px 12px rgba(229,72,77,0.3)" }}>
              <Icon name="trash" size={14} color="#fff"/>Supprimer
            </button>
          </div>
        </div>
      </ModalBox>
    </Overlay>
  );
}