import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '../i18n/index.js';
import { sounds } from '../utils/sounds.js';

const LANGUAGES = [
  { code: 'en',   flag: '🇺🇸', label: 'English',        sub: 'Continue in English' },
  { code: 'ptBR', flag: '🇧🇷', label: 'Português (BR)', sub: 'Continuar em Português' },
  { code: 'es',   flag: '🇪🇸', label: 'Español',        sub: 'Continuar en Español' },
];

export default function LangSelect() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(i18n.language || 'en');
  const [leaving, setLeaving] = useState(false);

  const confirm = () => {
    sounds.langConfirm();
    i18n.changeLanguage(selected);
    localStorage.setItem('cq_lang_selected', '1');
    setLeaving(true);
    setTimeout(() => navigate('/prologue'), 500);
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 35%, #0d0830 0%, #050310 65%, #000 100%)',
      padding: '24px 20px',
      opacity: leaving ? 0 : 1, transition: 'opacity 0.4s ease',
      fontFamily: "'Exo 2', sans-serif",
    }}>
      <Stars />

      <div style={{
        fontSize: 64, marginBottom: 16,
        filter: 'drop-shadow(0 0 24px rgba(88,204,2,0.7))',
        animation: 'dragonFloat 4s ease-in-out infinite',
        position: 'relative', zIndex: 1,
      }}>🐉</div>

      <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(8px, 2.8vw, 12px)',
          color: '#58CC02', letterSpacing: 3, lineHeight: 2.2,
          textShadow: '0 0 12px rgba(88,204,2,0.6)',
        }}>
          CHOOSE YOUR LANGUAGE
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4, letterSpacing: 1 }}>
          Escolha seu idioma · Elige tu idioma
        </div>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 12,
        width: '100%', maxWidth: 340, position: 'relative', zIndex: 1,
      }}>
        {LANGUAGES.map(lang => {
          const active = selected === lang.code;
          return (
            <button
              key={lang.code}
              onClick={() => { if (selected !== lang.code) sounds.langPick(); setSelected(lang.code); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', borderRadius: 16,
                background: active ? 'rgba(88,204,2,0.12)' : 'rgba(255,255,255,0.04)',
                border: `2px solid ${active ? '#58CC02' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', textAlign: 'left',
                boxShadow: active ? '0 0 20px rgba(88,204,2,0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span style={{ fontSize: 32, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontWeight: 800, fontSize: 15,
                  color: active ? '#86efac' : 'rgba(255,255,255,0.85)',
                }}>{lang.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{lang.sub}</div>
              </div>
              {active && (
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: '#58CC02', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}>✓</div>
              )}
            </button>
          );
        })}
      </div>

      <button
        onClick={confirm}
        style={{
          marginTop: 28, padding: '14px 48px',
          background: 'linear-gradient(135deg, #58CC02, #45A800)',
          color: 'white', borderRadius: 16,
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 11, letterSpacing: 2,
          boxShadow: '0 5px 0 #2D6A00, 0 0 24px rgba(88,204,2,0.4)',
          cursor: 'pointer',
          animation: 'btnPulse 2s ease-in-out infinite',
          position: 'relative', zIndex: 1,
        }}
      >
        CONTINUE →
      </button>

      <style>{`
        @keyframes dragonFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes btnPulse { 0%,100%{box-shadow:0 5px 0 #2D6A00,0 0 18px rgba(88,204,2,0.35)} 50%{box-shadow:0 5px 0 #2D6A00,0 0 30px rgba(88,204,2,0.65)} }
        @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.7} }
      `}</style>
    </div>
  );
}

function Stars() {
  const s = Array.from({ length: 55 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3 + 11) % 100),
    size: 1 + (i % 3) * 0.5, dur: 2 + (i % 4), del: (i * 0.15) % 3,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {s.map(x => (
        <div key={x.id} style={{
          position: 'absolute', left: `${x.x}%`, top: `${x.y}%`,
          width: x.size, height: x.size, background: 'white', borderRadius: '50%',
          animation: `twinkle ${x.dur}s ${x.del}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}
