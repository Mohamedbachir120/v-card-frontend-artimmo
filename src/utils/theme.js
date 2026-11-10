export const P = {
    navy:       "#1d3557",
    navyMid:    "#243f6a",
    navyLight:  "#2d4a6e",
    blue:       "#457b9d",
    blueSoft:   "#5a8faf",
    blueLight:  "#a8c3d8",
    bluePale:   "#ddeaf3",
    bg:         "#eef2f7",
    bgAlt:      "#f5f8fb",
    bgCard:     "#ffffff",
    text:       "#111827",
    textSub:    "#374151",
    textMuted:  "#6b7280",
    textFaint:  "#9ca3af",
    border:     "#dde4ee",
    borderDark: "#c8d3e4",
    accent:     "#457b9d",
    accentLt:   "#e8f2f9",
    danger:     "#e5484d",
    dangerLt:   "#fff0f0",
    success:    "#12a150",
    successLt:  "#edfcf2",
    warn:       "#f59e0b",
  };
  
  export const T = {
    shadow: {
      xs: "0 1px 3px rgba(29,53,87,0.06)",
      sm: "0 2px 8px rgba(29,53,87,0.08), 0 1px 3px rgba(29,53,87,0.04)",
      md: "0 4px 16px rgba(29,53,87,0.10), 0 2px 6px rgba(29,53,87,0.05)",
      lg: "0 8px 32px rgba(29,53,87,0.13), 0 3px 10px rgba(29,53,87,0.06)",
      xl: "0 16px 56px rgba(29,53,87,0.18), 0 6px 16px rgba(29,53,87,0.08)",
    },
    r: { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 },
  };
  
  export const btn = (variant = "primary", size = "md") => {
    const sz = {
      xs: { padding: "5px 10px",  fontSize: 12, borderRadius: T.r.sm,  gap: 5 },
      sm: { padding: "6px 13px",  fontSize: 13, borderRadius: T.r.sm,  gap: 6 },
      md: { padding: "9px 18px",  fontSize: 14, borderRadius: T.r.md,  gap: 7 },
      lg: { padding: "12px 24px", fontSize: 15, borderRadius: T.r.md,  gap: 8 },
    };
    const vr = {
      primary:    { background: P.navy,   color: "#fff",      border: "none" },
      blue:       { background: P.blue,   color: "#fff",      border: "none" },
      ghost:      { background: "transparent", color: P.textSub, border: `1px solid ${P.border}` },
      soft:       { background: P.accentLt, color: P.blue,    border: `1px solid ${P.bluePale}` },
      danger:     { background: P.danger, color: "#fff",      border: "none" },
      dangerSoft: { background: P.dangerLt, color: P.danger,  border: "1px solid #fdc0c2" },
      success:    { background: P.success, color: "#fff",     border: "none" },
      nav:        { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.15)" },
    };
    return { display:"inline-flex", alignItems:"center", justifyContent:"center",
      fontWeight:500, cursor:"pointer", whiteSpace:"nowrap", letterSpacing:"-0.01em",
      ...sz[size], ...vr[variant] };
  };
  
  export const initials = (name) =>
    name ? name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() : "?";
  
  export const GLOBAL_CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; font-family: 'Inter', system-ui, sans-serif; background: ${P.bg}; }
    ::selection { background: ${P.bluePale}; color: ${P.navy}; }
    input:focus { border-color: ${P.blue} !important; box-shadow: 0 0 0 3px rgba(69,123,157,0.15) !important; outline: none; }
    button { font-family: inherit; }
    a { color: inherit; text-decoration: none; }
  
    @keyframes slideUp   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
    @keyframes scaleIn   { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
    @keyframes toastIn   { from { opacity:0; transform:translateX(14px); } to { opacity:1; transform:translateX(0); } }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes barGrow   { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  
    .card-tile { transition: transform 0.2s ease, box-shadow 0.2s ease; }
    .card-tile:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(29,53,87,0.18) !important; }
  
    .hoverable { transition: background 0.13s, border-color 0.13s, opacity 0.13s; }
    .hoverable:hover { opacity: 0.88; }
  
    .icon-btn { transition: background 0.13s, transform 0.1s; }
    .icon-btn:hover { background: ${P.border} !important; }
    .icon-btn:active { transform: scale(0.93); }
  
    .nav-link { transition: background 0.13s; cursor: pointer; }
    .nav-link:hover { background: rgba(255,255,255,0.12) !important; }
  
    .contact-row { transition: background 0.12s; }
    .contact-row:hover { background: ${P.bg}; }
  
    .stat-card { transition: transform 0.18s, box-shadow 0.18s; }
    .stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(29,53,87,0.13) !important; }
  
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${P.borderDark}; border-radius: 3px; }
  `;