import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROLOGUE } from '../data/story.js';
import { sounds } from '../utils/sounds.js';

// Slow, deliberate typewriter — one character every 55ms
const TYPEWRITER_SPEED = 55;

export default function Prologue() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [panelIdx, setPanelIdx]     = useState(0);
  const [displayed, setDisplayed]   = useState('');
  const [done, setDone]             = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [panelVisible, setPanelVisible]   = useState(false);
  const [exploding, setExploding]         = useState(false);
  const intervalRef = useRef(null);
  const panel = PROLOGUE[panelIdx];
  const panelText  = t(`prologue.panels.${panelIdx}.text`);
  const panelTitle = t(`prologue.panels.${panelIdx}.title`, { defaultValue: panel.title || '' });

  // Fade panel in (opacity only — no flying), then start typing
  useEffect(() => {
    setPanelVisible(false);
    setDisplayed('');
    setDone(false);
    const t = setTimeout(() => {
      setPanelVisible(true);
      if (panel.isFinal) sounds.prologueFinal();
      else if (panel.isVillain) sounds.bugLord();
      else sounds.prologuePanel();
      startTypewriter(panelText);
    }, 350);
    return () => { clearTimeout(t); clearInterval(intervalRef.current); };
  }, [panelIdx]);

  const startTypewriter = (text) => {
    clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      // Tick on non-space characters every 3 chars to avoid AudioContext spam
      if (i % 3 === 0 && text[i - 1] !== ' ') sounds.typeClick();
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setDone(true);
      }
    }, TYPEWRITER_SPEED);
  };

  const skipOrAdvance = () => {
    if (exploding) return;

    // Still typing — skip to full text instantly
    if (!done) {
      clearInterval(intervalRef.current);
      setDisplayed(panelText);
      setDone(true);
      sounds.click();
      return;
    }

    sounds.click();
    if (transitioning) return;

    const isLast = panelIdx + 1 >= PROLOGUE.length;

    if (isLast) {
      // Trigger the explosion before navigating
      setExploding(true);
      return;
    }

    setTransitioning(true);
    setPanelVisible(false);
    setTimeout(() => {
      setPanelIdx(i => i + 1);
      setTransitioning(false);
    }, 450);
  };

  const onExplosionDone = () => {
    navigate('/start');
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') skipOrAdvance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, panelIdx, transitioning, exploding]);

  return (
    <div
      onClick={skipOrAdvance}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: panel.bg,
        cursor: exploding ? 'default' : 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.7s ease',
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <PrologueStars />

      {/* Villain glitch scanlines */}
      {panel.isVillain && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.04) 3px, rgba(255,0,0,0.04) 4px)',
          animation: 'scanlines 6s linear infinite',
        }} />
      )}

      {/* Ambient glow */}
      {panel.glowColor && (
        <div style={{
          position: 'absolute', width: 340, height: 340, borderRadius: '50%',
          background: `radial-gradient(circle, ${panel.glowColor}28 0%, transparent 70%)`,
          top: '18%', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'glowBreath 4s ease-in-out infinite',
        }} />
      )}

      {/* Panel content — fades in/out, no vertical movement */}
      <div style={{
        zIndex: 1, maxWidth: 460, width: '100%', padding: '0 28px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 22,
        opacity: panelVisible && !exploding ? 1 : 0,
        transition: 'opacity 0.6s ease',
      }}>

        {/* Floating emoji */}
        <div style={{
          fontSize: panel.emojiSize || 72, lineHeight: 1,
          filter: panel.glowColor
            ? `drop-shadow(0 0 22px ${panel.glowColor}90)`
            : 'drop-shadow(0 0 10px rgba(255,255,255,0.15))',
          animation: 'emojiFloat 5s ease-in-out infinite',
        }}>
          {panel.emoji}
        </div>

        {/* Title */}
        {panelTitle && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(9px, 2.8vw, 13px)',
            color: panel.titleColor || 'rgba(255,255,255,0.88)',
            letterSpacing: 3, lineHeight: 1.7,
            textShadow: panel.glowColor
              ? `0 0 18px ${panel.glowColor}, 0 2px 4px rgba(0,0,0,0.9)`
              : '0 0 10px rgba(255,255,255,0.25), 0 2px 4px rgba(0,0,0,0.9)',
          }}>
            {panelTitle}
          </div>
        )}

        {/* Dialogue speaker badge */}
        {panel.isDialogue && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(88,204,2,0.10)', border: '1px solid rgba(88,204,2,0.28)',
            borderRadius: 20, padding: '5px 15px',
          }}>
            <span style={{ fontSize: 17 }}>🐉</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#86efac', letterSpacing: 1 }}>
              {panel.speaker}
            </span>
          </div>
        )}

        {/* Typewriter text — no animation, just appears character by character */}
        <div style={{
          fontSize: panel.isDialogue ? 15 : 14,
          fontWeight: panel.isDialogue ? 500 : 400,
          fontStyle: panel.isDialogue ? 'italic' : 'normal',
          color: 'rgba(255,255,255,0.80)',
          lineHeight: 1.95,
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          minHeight: 130,
          textShadow: '0 2px 6px rgba(0,0,0,0.9)',
          letterSpacing: 0.2,
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: 'rgba(255,255,255,0.7)',
              verticalAlign: 'text-bottom', marginLeft: 2,
              animation: 'blinkCursor 0.9s ease-in-out infinite',
            }} />
          )}
        </div>

        {/* Continue prompt */}
        <div style={{
          opacity: done ? 1 : 0,
          transition: 'opacity 0.6s ease 0.5s',
        }}>
          {panel.isFinal ? (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 10,
              color: '#facc15', letterSpacing: 3,
              animation: 'blinkPrompt 1.3s ease-in-out infinite',
              textShadow: '0 0 14px rgba(250,204,21,0.7)',
            }}>
              {t('prologue.tapBegin')}
            </div>
          ) : (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              color: 'rgba(255,255,255,0.28)', letterSpacing: 2,
              animation: 'blinkPrompt 1.6s ease-in-out infinite',
            }}>
              {t('prologue.tap')}
            </div>
          )}
        </div>
      </div>

      {/* Panel dots */}
      <div style={{
        position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 2,
        opacity: exploding ? 0 : 1, transition: 'opacity 0.3s',
      }}>
        {PROLOGUE.map((_, i) => (
          <div key={i} style={{
            width: i === panelIdx ? 22 : 6, height: 6, borderRadius: 3,
            background: i === panelIdx ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.18)',
            transition: 'all 0.4s ease',
          }} />
        ))}
      </div>

      {/* Skip */}
      {!exploding && (
        <button
          onClick={(e) => { e.stopPropagation(); sounds.click(); navigate('/start'); }}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 8, padding: '5px 13px', color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
            cursor: 'pointer', letterSpacing: 1,
          }}
        >
          {t('prologue.skip')}
        </button>
      )}

      {/* Explosion overlay */}
      {exploding && <ExplosionOverlay onDone={onExplosionDone} />}

      <style>{`
        @keyframes emojiFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes glowBreath   { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.12)} }
        @keyframes blinkCursor  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes blinkPrompt  { 0%,100%{opacity:.65} 50%{opacity:.18} }
        @keyframes scanlines    { 0%{background-position:0 0} 100%{background-position:0 80px} }
      `}</style>
    </div>
  );
}

// ─── Explosion transition ──────────────────────────────────────────────────────
function ExplosionOverlay({ onDone }) {
  const [phase, setPhase] = useState('flash'); // flash → burst → fade

  useEffect(() => {
    sounds.combo();
    const t1 = setTimeout(() => setPhase('burst'), 180);
    const t2 = setTimeout(() => setPhase('fade'),  900);
    const t3 = setTimeout(() => onDone(),          1700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  // Generate particles that fly outward from center
  const particles = Array.from({ length: 48 }, (_, i) => {
    const angle  = (i / 48) * 360;
    const dist   = 120 + (i % 5) * 40;
    const size   = 4 + (i % 4) * 2;
    const colors = ['#facc15','#58CC02','#ffffff','#ff9600','#ce82ff','#1cb0f6'];
    const color  = colors[i % colors.length];
    const delay  = (i % 6) * 30;
    return { angle, dist, size, color, delay };
  });

  // Expanding rings
  const rings = [0, 80, 160, 240];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {/* White flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: phase === 'flash' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0)',
        transition: phase === 'flash' ? 'none' : 'background 0.5s ease',
      }} />

      {/* Fade to black at end */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'black',
        opacity: phase === 'fade' ? 1 : 0,
        transition: phase === 'fade' ? 'opacity 0.8s ease' : 'none',
      }} />

      {/* Shockwave rings */}
      {phase === 'burst' && rings.map((delay, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 20, height: 20, borderRadius: '50%',
          border: `3px solid ${['#facc15','#58CC02','rgba(255,255,255,0.8)','#ff9600'][i]}`,
          animation: `shockRing 0.9s ${delay}ms cubic-bezier(0,.5,.5,1) forwards`,
        }} />
      ))}

      {/* Particles */}
      {phase === 'burst' && particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: p.size, height: p.size,
          borderRadius: p.size > 6 ? '50%' : '2px',
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animation: `particle_${i % 8} 0.85s ${p.delay}ms cubic-bezier(.2,1,.4,1) forwards`,
          '--tx': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
          '--ty': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
        }} />
      ))}

      {/* Central dragon emoji burst */}
      {phase === 'burst' && (
        <div style={{
          fontSize: 80, position: 'absolute',
          animation: 'dragonBurst 0.9s cubic-bezier(.2,1,.4,1) forwards',
          filter: 'drop-shadow(0 0 30px #facc15)',
        }}>🐉</div>
      )}

      <style>{`
        @keyframes shockRing {
          0%   { transform:scale(0);   opacity:1; }
          100% { transform:scale(18);  opacity:0; }
        }
        @keyframes dragonBurst {
          0%   { transform:scale(0.2) rotate(-20deg); opacity:1; }
          60%  { transform:scale(1.4) rotate(10deg);  opacity:1; }
          100% { transform:scale(3)   rotate(0deg);   opacity:0; }
        }
        /* 8 directional particle animations */
        @keyframes particle_0 { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_1 { 0%{transform:translate(0,0) scale(1.2);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_2 { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) rotate(360deg);opacity:0} }
        @keyframes particle_3 { 0%{transform:translate(0,0) scale(0.8);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_4 { 0%{transform:translate(0,0) scale(1);opacity:1} 80%{opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0.2);opacity:0} }
        @keyframes particle_5 { 0%{transform:translate(0,0) rotate(-45deg);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) rotate(180deg);opacity:0} }
        @keyframes particle_6 { 0%{transform:translate(0,0) scale(1.5);opacity:0.9} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_7 { 0%{transform:translate(0,0);opacity:1} 70%{opacity:0.7} 100%{transform:translate(var(--tx),var(--ty)) scale(0.1);opacity:0} }
      `}</style>
    </div>
  );
}

function PrologueStars() {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3 + 11) % 100),
    size: 1 + (i % 3) * 0.4, dur: 2.5 + (i % 4), del: (i * 0.13) % 3,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`@keyframes twinkle { 0%,100%{opacity:.08} 50%{opacity:.8} }`}</style>
    </div>
  );
}
