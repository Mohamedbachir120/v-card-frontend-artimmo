import { useState, useEffect } from "react";
import { publicApi, BASE } from "../services/api";
import { Icon } from "../components/Icon";
import { P, initials } from "../utils/theme";

const PUBLIC_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');
  
  .pc-page { 
    min-height: 100vh; 
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    justify-content: center; 
    padding: 2rem 1rem; 
    font-family: 'DM Sans', system-ui, sans-serif; 
  }
  
  .pc-dots { 
    position: fixed; 
    inset: 0; 
    z-index: 0; 
    pointer-events: none; 
    background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px); 
    background-size: 30px 30px; 
  }
  
  .pc-wrapper { 
    position: relative; 
    z-index: 1; 
    width: 100%; 
    max-width: 410px; 
    opacity: 0; 
    transform: translateY(28px) scale(0.97); 
    transition: opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1), transform 0.55s cubic-bezier(0.22, 1, 0.36, 1); 
  }
  
  .pc-wrapper.visible { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
  
  .pc-shell { 
    background: #ffffff; 
    border-radius: 22px; 
    overflow: hidden; 
    box-shadow: 0 2px 4px var(--shadow-1), 0 8px 24px var(--shadow-2), 0 20px 60px var(--shadow-3); 
    position: relative; 
  }
  
  .pc-shell::before { 
    content: ''; 
    position: absolute; 
    inset: 0; 
    border-radius: 22px; 
    border: 1px solid var(--border-subtle); 
    pointer-events: none; 
    z-index: 2; 
  }
  
  .pc-powered { 
    text-align: center; 
    font-size: 11px; 
    color: #d0d0d0; 
    margin-top: 22px; 
    letter-spacing: 0.5px; 
  }
  
  .pc-header { 
    position: relative; 
    padding: 2.25rem 1.75rem 1.65rem; 
    overflow: hidden; 
  }
  
  .pc-orb { 
    position: absolute; 
    border-radius: 50%; 
    pointer-events: none; 
  }
  
  .pc-orb1 { 
    right: -40px; top: -40px; width: 150px; height: 150px; 
    background: rgba(255, 255, 255, 0.06); 
    animation: pc-orbFloat 8s ease-in-out infinite; 
  }
  
  .pc-orb2 { 
    right: 30px; bottom: -55px; width: 100px; height: 100px; 
    background: rgba(255, 255, 255, 0.04); 
    animation: pc-orbFloat 10s ease-in-out infinite reverse; 
  }
  
  .pc-orb3 { 
    left: -20px; bottom: 10px; width: 60px; height: 60px; 
    background: rgba(255, 255, 255, 0.03); 
    animation: pc-orbFloat 6s ease-in-out infinite 2s; 
  }
  
  .pc-content { 
    display: flex; 
    align-items: center; 
    gap: 1rem; 
    position: relative; 
    z-index: 1; 
  }
  
  .pc-avatar { 
    width: 64px; height: 64px; 
    border-radius: 50%; 
    border: 2.5px solid rgba(255, 255, 255, 0.32); 
    background: rgba(255, 255, 255, 0.16); 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    font-size: 21px; 
    font-weight: 700; 
    color: #fff; 
    flex-shrink: 0; 
    letter-spacing: 1.5px; 
    backdrop-filter: blur(4px); 
    transition: transform 0.3s ease, box-shadow 0.3s ease; 
  }
  
  .pc-avatar:hover { 
    transform: scale(1.06); 
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.12); 
  }
  
  .pc-info { min-width: 0; }
  
  .pc-name { 
    color: #fff; 
    font-size: 19px; 
    font-weight: 700; 
    letter-spacing: 0.3px; 
    line-height: 1.3; 
  }
  
  .pc-role { 
    color: rgba(255, 255, 255, 0.7); 
    font-size: 13px; 
    margin-top: 3px; 
    font-weight: 400; 
  }
  
  .pc-badge { 
    display: inline-block; 
    margin-top: 8px; 
    background: rgba(255, 255, 255, 0.14); 
    backdrop-filter: blur(6px); 
    border: 1px solid rgba(255, 255, 255, 0.12); 
    border-radius: 100px; 
    padding: 3px 12px; 
    color: rgba(255, 255, 255, 0.92); 
    font-size: 10.5px; 
    letter-spacing: 1.8px; 
    text-transform: uppercase; 
    font-weight: 500; 
  }
  
  .pc-row { 
    display: flex; 
    align-items: center; 
    gap: 14px; 
    padding: 14px 1.75rem; 
    text-decoration: none; 
    color: inherit; 
    transition: background 0.18s ease; 
    position: relative; 
  }
  
  .pc-row + .pc-row::before { 
    content: ''; 
    position: absolute; 
    top: 0; left: 1.75rem; right: 1.75rem; 
    height: 0.5px; 
    background: var(--row-border, #f0f0f0); 
  }
  
  .pc-row:hover { background: var(--row-hover, #f5f5f5); }
  .pc-row.static { cursor: default; }
  .pc-row.static:hover { background: transparent; }
  
  .pc-iconBox { 
    width: 38px; height: 38px; 
    border-radius: 11px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    flex-shrink: 0; 
    transition: transform 0.2s ease; 
  }
  
  .pc-row:hover .pc-iconBox { transform: scale(1.08); }
  .pc-row.static:hover .pc-iconBox { transform: none; }
  
  .pc-label { font-size: 11px; color: #9a9a9a; margin-bottom: 1.5px; font-weight: 400; }
  .pc-value { font-size: 14px; color: #1a1a1a; font-weight: 450; }
  
  .pc-footer { position: relative; padding: 0.5rem 1.5rem 1.25rem; }
  .pc-footer::before { 
    content: ''; position: absolute; top: 0; left: 1.75rem; right: 1.75rem; 
    height: 0.5px; background: var(--row-border, #f0f0f0); 
  }
  
  .pc-addBtn { 
    display: flex; align-items: center; justify-content: center; gap: 8px; 
    width: 100%; padding: 13px 20px; 
    border-radius: 14px; font-size: 14px; font-weight: 600; 
    letter-spacing: 0.2px; transition: all 0.25s ease; 
    outline: none; font-family: inherit; cursor: pointer; 
    border: none; text-decoration: none; 
  }
  
  .pc-addBtn:hover { transform: translateY(-1px); filter: brightness(1.06); }
  .pc-addBtn:active { transform: scale(0.98); }
  .pc-addBtn:focus-visible { box-shadow: 0 0 0 3px var(--focus-ring, rgba(0, 0, 0, 0.15)); }
  
  @media (max-width: 440px) {
    .pc-header { padding: 1.75rem 1.35rem 1.35rem; }
    .pc-row { padding: 13px 1.35rem; }
    .pc-row + .pc-row::before { left: 1.35rem; right: 1.35rem; }
    .pc-footer { padding: 0.5rem 1.15rem 1.15rem; }
    .pc-footer::before { left: 1.35rem; right: 1.35rem; }
  }
  
  @keyframes pc-orbFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(10px, -10px) scale(1.08); }
  }
`;

export function PublicCard({ uuid }) {
  const [card, setCard] = useState(null);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    publicApi(`/api/public/card/${uuid}`)
      .then(c => {
        setCard(c);
        // Trigger entrance animation shortly after card loads
        setTimeout(() => setVisible(true), 50);
      })
      .catch(() => setError("Carte introuvable ou inactive"));
  }, [uuid]);

  if (error) return (
    <>
      <style>{PUBLIC_CSS}</style>
      <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 32, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: P.dangerLt, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #fac0c2" }}>
          <Icon name="x" size={28} color={P.danger} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: P.textSub }}>{error}</div>
      </div>
    </>
  );

  if (!card) return (
    <>
      <style>{PUBLIC_CSS}</style>
      <div style={{ minHeight: "100vh", background: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${P.border}`, borderTopColor: P.navy, animation: "spin 0.7s linear infinite" }} />
          <span style={{ color: P.textMuted, fontSize: 14 }}>Chargement de la carte…</span>
        </div>
      </div>
    </>
  );

  const accent = card.accent || P.navy;
  const accentLight = card.accentLight || P.accentLt;
  const vcardUrl = `${BASE}/api/public/card/${uuid}/vcard`;

  const contactRows = [
    { key: "website", icon: "globe", label: "Site web", value: card.website, href: card.website },
    { key: "email", icon: "mail", label: "E-mail", value: card.email, href: `mailto:${card.email}` },
    { key: "phone", icon: "phone", label: "Téléphone", value: card.phone, href: `tel:${card.phone}` },
    { key: "location", icon: "mapPin", label: "Adresse", value: card.location },
  ].filter(r => r.value);

  const cssVars = {
    '--dot-color': accent + '09',
    '--shadow-1': accent + '10',
    '--shadow-2': accent + '18',
    '--shadow-3': accent + '0e',
    '--border-subtle': accent + '0c',
    '--row-border': '#f0f0f0',
    '--row-hover': accentLight,
    '--focus-ring': accent + '30'
  };

  return (
    <>
      <style>{PUBLIC_CSS}</style>
      
      <div 
        className="pc-page"
        style={{
          background: `linear-gradient(145deg, ${accent}10 0%, #f7f8fa 55%, #f0f1f3 100%)`,
          ...cssVars
        }}
      >
        <div className="pc-dots" />
        
        <div className={`pc-wrapper ${visible ? 'visible' : ''}`}>
          <div className="pc-shell" style={cssVars}>
            
            {/* Header */}
            <div className="pc-header" style={{ background: accent }}>
              <div className="pc-orb pc-orb1" />
              <div className="pc-orb pc-orb2" />
              <div className="pc-orb pc-orb3" />
              
              <div className="pc-content">
                <div className="pc-avatar">{initials(card.name)}</div>
                <div className="pc-info">
                  <div className="pc-name">{card.name}</div>
                  {card.role && <div className="pc-role">{card.role}</div>}
                  {card.company && <span className="pc-badge">{card.company}</span>}
                </div>
              </div>
            </div>

            {/* Contact Rows */}
            <div>
              {contactRows.map(row => {
                const isStatic = !row.href;
                const sharedProps = {
                  className: `pc-row ${isStatic ? 'static' : ''}`,
                  'aria-label': `${row.label} : ${row.value}`
                };

                const content = (
                  <>
                    <div className="pc-iconBox" style={{ background: accentLight, color: accent }}>
                      <Icon name={row.icon} size={17} color={accent} />
                    </div>
                    <div>
                      <div className="pc-label">{row.label}</div>
                      <div className="pc-value">{row.value}</div>
                    </div>
                  </>
                );

                if (isStatic) {
                  return <div key={row.key} {...sharedProps}>{content}</div>;
                }

                return (
                  <a key={row.key} {...sharedProps} href={row.href} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                );
              })}
            </div>

            {/* Footer */}
            <div className="pc-footer" style={cssVars}>
              <a 
                href={vcardUrl} 
                download 
                className="pc-addBtn" 
                style={{ background: accent, color: '#ffffff' }}
                aria-label={`Ajouter ${card.name} aux contacts`}
              >
                <Icon name="userPlus" size={17} color="#ffffff" />
                Ajouter contact
              </a>
            </div>
          </div>

          <p className="pc-powered">
            {card.company || 'Artimmo'} · Carte de visite virtuelle
          </p>
        </div>
      </div>
    </>
  );
}