import { useState, useCallback } from "react";
import { Icon } from "./Icon";
import { P, T } from "../utils/theme";

// ─── TOAST ───────────────────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  return { toasts, show };
}

export function Toasts({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:"flex", alignItems:"center", gap:10,
          background: t.type==="success" ? P.navy : P.danger,
          color:"#fff", padding:"10px 16px", borderRadius:T.r.md,
          fontSize:13.5, fontWeight:500, boxShadow:T.shadow.lg,
          animation:"toastIn 0.2s ease", maxWidth:300,
        }}>
          <span style={{ width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.2)",
            display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Icon name={t.type==="success"?"check":"x"} size={11} color="#fff"/>
          </span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ─── SHARED PRIMITIVES ───────────────────────────────────────────────────────
export function FieldLabel({ children }) {
  return <label style={{ display:"block", fontSize:11, fontWeight:600, color:P.textMuted,
    marginBottom:5, textTransform:"uppercase", letterSpacing:"0.6px" }}>{children}</label>;
}

export function TextInput({ value, onChange, placeholder, type="text", required, style: s }) {
  return <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    required={required} style={{ width:"100%", padding:"9px 13px", borderRadius:T.r.sm,
    border:`1px solid ${P.border}`, fontSize:14, color:P.text, background:"#fff",
    boxSizing:"border-box", fontFamily:"inherit", transition:"border-color 0.15s,box-shadow 0.15s", ...s }}/>;
}

export function AlertBox({ type="error", children }) {
  const isErr = type==="error";
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"10px 14px",
      borderRadius:T.r.sm, marginBottom:14, fontSize:13.5,
      background: isErr ? P.dangerLt : P.successLt,
      color: isErr ? "#c0252b" : "#0a7a3e",
      border: `1px solid ${isErr ? "#fac0c2" : "#9fedc4"}` }}>
      <Icon name={isErr?"x":"check"} size={15} color={isErr?"#c0252b":"#0a7a3e"}/>
      <span>{children}</span>
    </div>
  );
}

export function StatusBadge({ active }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px",
      borderRadius:T.r.pill, fontSize:11, fontWeight:600, letterSpacing:"0.2px",
      background: active ? P.successLt : "#fff4f4",
      color: active ? "#0a7a3e" : "#c0252b",
      border: `1px solid ${active ? "#a6f0c4" : "#fac0c2"}` }}>
      <span style={{ width:5, height:5, borderRadius:"50%",
        background: active ? P.success : P.danger, flexShrink:0 }}/>
      {active ? "Active" : "Masquée"}
    </span>
  );
}

export function Overlay({ onClose, children }) {
  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(6,14,30,0.6)",
        backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
        justifyContent:"center", zIndex:200, padding:20, animation:"fadeIn 0.15s ease" }}>
      {children}
    </div>
  );
}

export function ModalBox({ maxWidth=520, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:T.r.xl, padding:"32px",
      width:"100%", maxWidth, maxHeight:"92vh", overflowY:"auto",
      boxShadow:T.shadow.xl, animation:"scaleIn 0.2s ease", position:"relative" }}>
      {children}
    </div>
  );
}

export function CloseBtn({ onClick }) {
  return (
    <button onClick={onClick} className="icon-btn" style={{ width:32,height:32,borderRadius:T.r.sm,
      background:P.bg, border:`1px solid ${P.border}`, display:"flex", alignItems:"center",
      justifyContent:"center", cursor:"pointer", color:P.textMuted, flexShrink:0 }}>
      <Icon name="x" size={15}/>
    </button>
  );
}