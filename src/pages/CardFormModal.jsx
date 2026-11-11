import { useState } from "react";
import { api } from "../services/api";
import { Overlay, ModalBox, CloseBtn, AlertBox, FieldLabel, TextInput } from "../components/ui";
import { Icon } from "../components/Icon";
import { P, T, btn } from "../utils/theme";

export function CardFormModal({ card, onClose, onSaved, toast }) {
  const isEdit = !!card;
  const [form, setForm] = useState({
    name:card?.name||"", role:card?.role||"", company:card?.company||"",
    website:card?.website||"", email:card?.email||"", phone:card?.phone||"",
    location:card?.location||"", accent:card?.accent||"#1d3557",
    accentLight:card?.accentLight||"#a8c3d8", isActive:card?.isActive??true,
  });
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type==="checkbox" ? e.target.checked : e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const saved = await api(isEdit ? `/api/cards/${card.id}` : "/api/cards",
        { method: isEdit ? "PUT" : "POST", body: JSON.stringify(form) });
      onSaved(saved); toast(isEdit ? "Carte mise à jour" : "Carte créée", "success"); onClose();
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const fields = [
    { key:"name",     label:"Nom affiché *",    placeholder:"Votre nom complet",   required:true, full:true },
    { key:"role",     label:"Poste",            placeholder:"Ingénieur logiciel" },
    { key:"company",  label:"Entreprise",       placeholder:"Acme Corp" },
    { key:"email",    label:"E-mail",           placeholder:"vous@entreprise.com" },
    { key:"phone",    label:"Téléphone",        placeholder:"+213 555 000 000" },
    { key:"website",  label:"Site web",         placeholder:"https://votresite.com" },
    { key:"location", label:"Localisation",     placeholder:"Alger, Algérie" },
  ];

  return (
    <Overlay onClose={onClose}>
      <ModalBox maxWidth={540}>
        <div style={{ display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28 }}>
          <div>
            <h2 style={{ fontSize:20,fontWeight:700,color:P.text,letterSpacing:"-0.4px" }}>
              {isEdit ? "Modifier la carte" : "Nouvelle carte de visite"}
            </h2>
            <p style={{ fontSize:13,color:P.textMuted,marginTop:3 }}>
              {isEdit ? "Mettez à jour les informations de votre carte" : "Renseignez vos coordonnées"}
            </p>
          </div>
          <CloseBtn onClick={onClose}/>
        </div>
        {error && <AlertBox>{error}</AlertBox>}
        <form onSubmit={submit}>
          {[
            { label:"Coordonnées", keys:["name","role","company","email","phone","website","location"] },
          ].map(section => (
            <div key={section.label} style={{ marginBottom:22 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
                <span style={{ fontSize:11,fontWeight:700,color:P.blue,textTransform:"uppercase",letterSpacing:"0.7px" }}>
                  {section.label}
                </span>
                <div style={{ flex:1,height:1,background:P.border }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px 16px" }}>
                {fields.map(({ key,label,placeholder,required,full }) => (
                  <div key={key} style={{ gridColumn:full?"1/-1":undefined }}>
                    <FieldLabel>{label}</FieldLabel>
                    <TextInput value={form[key]} onChange={set(key)} placeholder={placeholder} required={required}/>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ marginBottom:22 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:16 }}>
              <span style={{ fontSize:11,fontWeight:700,color:P.blue,textTransform:"uppercase",letterSpacing:"0.7px" }}>
                Apparence
              </span>
              <div style={{ flex:1,height:1,background:P.border }}/>
            </div>
            <div style={{ height:56,borderRadius:T.r.md,background:form.accent,
              marginBottom:14,display:"flex",alignItems:"center",padding:"0 18px",gap:14,
              position:"relative",overflow:"hidden" }}>
              <div style={{ position:"absolute",right:-20,top:-20,width:90,height:90,
                borderRadius:"50%",border:"1px solid rgba(255,255,255,0.12)",pointerEvents:"none" }}/>
              <div style={{ width:34,height:34,borderRadius:T.r.sm,background:form.accentLight,
                display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <Icon name="card" size={16} color={form.accent}/>
              </div>
              <span style={{ color:"#fff",fontWeight:600,fontSize:14,letterSpacing:"-0.2px" }}>
                {form.name || "Aperçu"}
              </span>
              <span style={{ fontSize:12,color:"rgba(255,255,255,0.6)",marginLeft:2 }}>
                {form.role || ""}
              </span>
            </div>
            <div style={{ display:"flex",gap:14 }}>
              {[{key:"accent",label:"Couleur d'en-tête"},{key:"accentLight",label:"Teinte des icônes"}].map(({ key,label }) => (
                <div key={key} style={{ flex:1 }}>
                  <FieldLabel>{label}</FieldLabel>
                  <div style={{ display:"flex",alignItems:"center",gap:10,padding:"7px 12px",
                    border:`1px solid ${P.border}`,borderRadius:T.r.sm,background:"#fff" }}>
                    <input type="color" value={form[key]} onChange={set(key)}
                      style={{ width:26,height:26,borderRadius:6,border:"none",cursor:"pointer",padding:0 }}/>
                    <span style={{ fontSize:12,color:P.textMuted,fontFamily:"monospace" }}>{form[key]}</span>
                    <div style={{ marginLeft:"auto",width:18,height:18,borderRadius:4,
                      background:form[key],border:`1px solid ${P.border}` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
            padding:"13px 16px",background:P.bg,borderRadius:T.r.md,marginBottom:28,cursor:"pointer" }}
            onClick={() => setForm(f => ({ ...f, isActive:!f.isActive }))}>
            <div>
              <div style={{ fontSize:14,fontWeight:500,color:P.text }}>Visibilité de la carte</div>
              <div style={{ fontSize:12,color:P.textMuted,marginTop:2 }}>
                {form.isActive ? "Publique — visible par toute personne ayant le lien" : "Masquée au public"}
              </div>
            </div>
            <div style={{ width:44,height:24,borderRadius:T.r.pill,
              background:form.isActive ? P.navy : P.border,position:"relative",transition:"background 0.2s",flexShrink:0 }}>
              <div style={{ width:18,height:18,borderRadius:"50%",background:"#fff",
                position:"absolute",top:3,left:form.isActive?23:3,
                transition:"left 0.2s",boxShadow:"0 1px 4px rgba(0,0,0,0.18)" }}/>
            </div>
            <input type="checkbox" checked={form.isActive} onChange={set("isActive")} style={{ display:"none" }}/>
          </div>

          <div style={{ display:"flex",gap:10 }}>
            <button type="button" onClick={onClose} className="hoverable" style={{ ...btn("ghost"),flex:1 }}>Annuler</button>
            <button type="submit" className="hoverable" disabled={loading}
              style={{ ...btn("primary"),flex:2,boxShadow:"0 4px 14px rgba(29,53,87,0.2)" }}>
              {loading ? "Enregistrement…" : isEdit ? "Enregistrer" : "Créer la carte"}
            </button>
          </div>
        </form>
      </ModalBox>
    </Overlay>
  );
}