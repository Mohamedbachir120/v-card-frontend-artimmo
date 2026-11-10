import { useState } from "react";
import { api } from "../services/api";
import { Icon } from "../components/Icon";
import { AlertBox, FieldLabel, TextInput } from "../components/ui";
import { P, T, btn } from "../utils/theme";

export function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const body = mode==="login"
        ? { email:form.email, password:form.password }
        : { name:form.name, email:form.email, password:form.password };
      const data = await api(`/api/auth/${mode}`, { method:"POST", body:JSON.stringify(body) });
      localStorage.setItem("vbc_token", data.token);
      onLogin(data.user);
    } catch(err) { setError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${P.navy} 0%,${P.navyLight} 45%,${P.blue} 100%)`,
      display:"flex", alignItems:"center", justifyContent:"center", padding:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:360, height:360, borderRadius:"50%", background:"rgba(255,255,255,0.04)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:"rgba(255,255,255,0.03)", pointerEvents:"none" }}/>
      <div style={{ background:"rgba(255,255,255,0.97)", borderRadius:T.r.xl, padding:"44px 40px",
        width:"100%", maxWidth:420, boxShadow:T.shadow.xl, animation:"scaleIn 0.25s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:11, marginBottom:32 }}>
          <div style={{ width:42,height:42,borderRadius:T.r.md,background:P.navy,
            display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 12px rgba(29,53,87,0.3)" }}>
            <Icon name="card" size={20} color="#fff"/>
          </div>
          <div>
            <div style={{ fontWeight:700,fontSize:17,color:P.navy,letterSpacing:"-0.4px",lineHeight:1.2 }}>Artimmo</div>
            <div style={{ fontSize:11,color:P.textMuted,letterSpacing:"0.3px" }}>DIGITAL BUSINESS CARDS</div>
          </div>
        </div>
        <h1 style={{ fontSize:24,fontWeight:700,color:P.text,letterSpacing:"-0.5px",marginBottom:4 }}>
          {mode==="login" ? "Welcome back" : "Create your account"}
        </h1>
        <p style={{ color:P.textMuted,fontSize:14,marginBottom:28 }}>
          {mode==="login" ? "Sign in to manage your cards" : "Start sharing your contact in style"}
        </p>
        {error && <AlertBox>{error}</AlertBox>}
        <form onSubmit={submit}>
          {mode==="register" && (
            <div style={{ marginBottom:16 }}>
              <FieldLabel>Full name</FieldLabel>
              <TextInput value={form.name} onChange={set("name")} placeholder="Your full name" required/>
            </div>
          )}
          <div style={{ marginBottom:16 }}>
            <FieldLabel>Email address</FieldLabel>
            <TextInput type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required/>
          </div>
          <div style={{ marginBottom:24 }}>
            <FieldLabel>Password</FieldLabel>
            <div style={{ position:"relative" }}>
              <TextInput type={showPass?"text":"password"} value={form.password} onChange={set("password")}
                placeholder="••••••••" required style={{ paddingRight:40 }}/>
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",
                  background:"none",border:"none",cursor:"pointer",color:P.textMuted,padding:2 }}>
                <Icon name={showPass?"eyeOff":"eye"} size={16}/>
              </button>
            </div>
          </div>
          <button type="submit" className="hoverable" disabled={loading}
            style={{ ...btn("primary","lg"), width:"100%", boxShadow:"0 4px 16px rgba(29,53,87,0.25)", fontWeight:600 }}>
            {loading ? "Please wait…" : mode==="login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"22px 0 0" }}>
          <div style={{ flex:1,height:1,background:P.border }}/>
          <span style={{ fontSize:12,color:P.textFaint }}>or</span>
          <div style={{ flex:1,height:1,background:P.border }}/>
        </div>
        <div style={{ textAlign:"center", marginTop:18, fontSize:14, color:P.textMuted }}>
          {mode==="login" ? "No account yet? " : "Already have an account? "}
          <button onClick={() => { setMode(mode==="login"?"register":"login"); setError(""); }}
            style={{ background:"none",border:"none",color:P.navy,fontWeight:600,cursor:"pointer",
              fontSize:14,padding:0,textDecoration:"underline",textUnderlineOffset:2 }}>
            {mode==="login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}