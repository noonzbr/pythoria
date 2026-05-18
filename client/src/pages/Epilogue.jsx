import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { EPILOGUE } from '../data/story.js';
import { sounds } from '../utils/sounds.js';

const TYPEWRITER_SPEED = 38;

export default function Epilogue() {
  const navigate = useNavigate();
  const [panelIdx, setPanelIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const [visible, setVisible]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const intervalRef = useRef(null);

  const panel = EPILOGUE[panelIdx];

  useEffect(() => {
    setVisible(false);
    setDisplayed('');
    setDone(false);
    setShowParticles(false);
    const t = setTimeout(() => {
      setVisible(true);
      playPanelSound(panelIdx, panel);
      startType(panel.text);
    }, 400);
    return () => { clearTimeout(t); clearInterval(intervalRef.current); };
  }, [panelIdx]);

  const playPanelSound = (idx, p) => {
    if (p.isVillain) sounds.bugLord();
    else if (idx === 2) sounds.fragmentGet();       // Codex reassembles
    else if (idx === 4) sounds.restoration();       // Bug Lord freed
    else if (idx === 5) sounds.restoration();       // Pythoria restored
    else sounds.epiloguePanel();
  };

  const startType = (text) => {
    clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i % 3 === 0 && text[i - 1] !== ' ') sounds.typeClick();
      if (i >= text.length) {
        clearInterval(intervalRef.current);
        setDone(true);
        if (panelIdx === 2) { setTimeout(() => setShowParticles(true), 200); }
      }
    }, TYPEWRITER_SPEED);
  };

  const advance = () => {
    if (!done) {
      clearInterval(intervalRef.current);
      setDisplayed(panel.text);
      setDone(true);
      if (panelIdx === 2) setShowParticles(true);
      return;
    }
    sounds.click();
    if (panelIdx + 1 < EPILOGUE.length) {
      setVisible(false);
      setTimeout(() => setPanelIdx(i => i + 1), 400);
    } else {
      sounds.victory();
      setLeaving(true);
      setTimeout(() => navigate('/'), 600);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, panelIdx]);

  const panelColors = {
    0: '#ff2222', 1: '#58CC02', 2: '#facc15',
    3: '#c084fc', 4: '#7dd3fc', 5: '#86efac',
  };
  const color = panelColors[panelIdx] || '#58CC02';

  return (
    <div
      onClick={advance}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: panel.bg,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'background 0.8s ease',
        opacity: leaving ? 0 : 1,
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <EpilogueStars color={color} />

      {/* Ambient glow */}
      {panel.glowColor && (
        <div style={{
          position: 'absolute', width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${panel.glowColor}30 0%, transparent 70%)`,
          top: '12%', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'glowPulse 3.5s ease-in-out infinite',
        }} />
      )}

      {/* Villain glitch scanlines */}
      {panel.isVillain && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.03) 3px, rgba(255,0,0,0.03) 4px)',
          animation: 'scanlines 8s linear infinite',
        }} />
      )}

      {/* Particle burst on Codex reassembly */}
      {showParticles && <FragmentBurst color="#facc15" />}

      {/* Panel content */}
      <div style={{
        zIndex: 1, maxWidth: 460, width: '100%', padding: '80px 28px 48px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
      }}>
        {/* Emoji */}
        <div style={{
          fontSize: panel.emojiSize || 72, lineHeight: 1,
          filter: panel.glowColor ? `drop-shadow(0 0 24px ${panel.glowColor}90)` : 'none',
          animation: panel.isVillain ? 'villainFloat 2s ease-in-out infinite' : 'emojiFloat 4s ease-in-out infinite',
        }}>{panel.emoji}</div>

        {/* Title */}
        {panel.title && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(8px, 2.5vw, 12px)',
            color: panel.titleColor || color,
            letterSpacing: 3, lineHeight: 1.7,
            textShadow: `0 0 18px ${panel.titleColor || color}80`,
          }}>{panel.title}</div>
        )}

        {/* Speaker badge */}
        {panel.isDialogue && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: `${color}18`, border: `1px solid ${color}40`,
            borderRadius: 20, padding: '5px 16px',
          }}>
            <span style={{ fontSize: 16 }}>🐉</span>
            <span style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1 }}>
              {panel.speaker}
            </span>
          </div>
        )}

        {/* Typewriter text */}
        <div style={{
          fontSize: 14, fontWeight: panel.isDialogue ? 500 : 400,
          fontStyle: panel.isDialogue ? 'italic' : 'normal',
          color: 'rgba(255,255,255,0.85)', lineHeight: 1.9,
          whiteSpace: 'pre-wrap', textAlign: 'center', minHeight: 110,
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}>
          {displayed}
          {!done && (
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: 'rgba(255,255,255,0.6)', verticalAlign: 'text-bottom',
              marginLeft: 2, animation: 'blinkCursor 0.8s ease-in-out infinite',
            }} />
          )}
        </div>

        {/* Continue prompt */}
        <div style={{ opacity: done ? 1 : 0, transition: 'opacity 0.4s ease 0.3s' }}>
          {panel.isFinal ? (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 9,
              color, letterSpacing: 2,
              animation: 'blinkText 1.2s ease-in-out infinite',
              textShadow: `0 0 10px ${color}`,
            }}>TAP TO COMPLETE YOUR QUEST →</div>
          ) : (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 8,
              color: 'rgba(255,255,255,0.3)', letterSpacing: 2,
              animation: 'blinkText 1.5s ease-in-out infinite',
            }}>TAP TO CONTINUE</div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 2,
      }}>
        {EPILOGUE.map((_, i) => (
          <div key={i} style={{
            width: i === panelIdx ? 20 : 6, height: 6, borderRadius: 3,
            background: i < panelIdx ? color : i === panelIdx ? color : 'rgba(255,255,255,0.15)',
            opacity: i < panelIdx ? 0.5 : 1,
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>

      <style>{`
        @keyframes emojiFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes villainFloat  { 0%,100%{transform:translateY(0) rotate(-2deg) scale(1)} 50%{transform:translateY(-6px) rotate(2deg) scale(1.04)} }
        @keyframes glowPulse     { 0%,100%{opacity:.7;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.1)} }
        @keyframes blinkCursor   { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes blinkText     { 0%,100%{opacity:.6} 50%{opacity:.15} }
        @keyframes scanlines     { 0%{background-position:0 0} 100%{background-position:0 100px} }
        @keyframes particleFly   { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes ringExpand    { 0%{transform:scale(0);opacity:0.9} 100%{transform:scale(20);opacity:0} }
      `}</style>
    </div>
  );
}

/* ─── Fragment burst particle explosion ─── */
function FragmentBurst({ color }) {
  const colors = ['#facc15', '#58CC02', '#1CB0F6', '#CE82FF', '#FF4B4B', '#ffffff'];
  const particles = Array.from({ length: 60 }, (_, i) => {
    const angle = (i / 60) * 360;
    const dist  = 100 + (i % 6) * 35;
    return {
      id: i, angle, dist,
      size: 4 + (i % 4) * 2,
      color: colors[i % colors.length],
      delay: (i % 8) * 25,
      tx: Math.cos(angle * Math.PI / 180) * dist,
      ty: Math.sin(angle * Math.PI / 180) * dist,
    };
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 5,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {/* Shockwave rings */}
      {[0, 120, 240].map((delay, i) => (
        <div key={i} style={{
          position: 'absolute', width: 20, height: 20, borderRadius: '50%',
          border: `3px solid ${colors[i]}`,
          animation: `ringExpand 1s ${delay}ms cubic-bezier(0,.5,.5,1) forwards`,
        }} />
      ))}
      {/* Particles */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
          animation: `particleFly 1s ${p.delay}ms cubic-bezier(.2,1,.4,1) forwards`,
        }} />
      ))}
      {/* Central flash */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, rgba(250,204,21,0.4) 0%, transparent 60%)',
        animation: 'ringExpand 0.8s ease-out forwards',
      }} />
    </div>
  );
}

/* ─── Stars ─── */
function EpilogueStars({ color }) {
  const s = Array.from({ length: 50 }, (_, i) => ({
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
      <style>{`@keyframes twinkle { 0%,100%{opacity:.08} 50%{opacity:.7} }`}</style>
    </div>
  );
}
