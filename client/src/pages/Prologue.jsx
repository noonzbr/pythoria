import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PROLOGUE } from '../data/story.js';
import { sounds } from '../utils/sounds.js';
import { HeroFigureSVG } from './Home.jsx';

const TYPEWRITER_SPEED = 32; // faster than before (was 55ms)
const GIO_COLOR = '#facc15'; // golden — hero not yet class-coloured

export default function Prologue() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [panelIdx, setPanelIdx]           = useState(0);
  const [displayed, setDisplayed]         = useState('');
  const [done, setDone]                   = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [panelVisible, setPanelVisible]   = useState(false);
  const [exploding, setExploding]         = useState(false);
  const [heroVisible, setHeroVisible]     = useState(false);
  const intervalRef = useRef(null);

  const panel     = PROLOGUE[panelIdx];
  const panelText = t(`prologue.panels.${panelIdx}.text`);
  const panelTitle = t(`prologue.panels.${panelIdx}.title`, { defaultValue: panel.title || '' });

  const playPanelSound = (p) => {
    switch (p.sound) {
      case 'bugLord':     sounds.bugLord();      break;
      case 'heroAppears': sounds.heroAppears();  break;
      case 'pyCallsHero': sounds.pyCallsHero();  break;
      case 'questBegins': sounds.questBegins();  break;
      default:            sounds.prologuePanel(); break;
    }
  };

  useEffect(() => {
    setPanelVisible(false);
    setHeroVisible(false);
    setDisplayed('');
    setDone(false);
    const t1 = setTimeout(() => {
      setPanelVisible(true);
      playPanelSound(panel);
      startTypewriter(panelText);
      // Hero slides in slightly after panel appears
      if (panel.isHero || panel.visualType === 'pyAndHero' || panel.visualType === 'quest') {
        setTimeout(() => setHeroVisible(true), 300);
      }
    }, 350);
    return () => { clearTimeout(t1); clearInterval(intervalRef.current); };
  }, [panelIdx]);

  const startTypewriter = (text) => {
    clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i % 3 === 0 && text[i - 1] !== ' ' && text[i - 1] !== '\n') sounds.typeClick();
      if (i >= text.length) { clearInterval(intervalRef.current); setDone(true); }
    }, TYPEWRITER_SPEED);
  };

  const skipOrAdvance = () => {
    if (exploding) return;
    if (!done) {
      clearInterval(intervalRef.current);
      setDisplayed(panelText);
      setDone(true);
      setHeroVisible(true);
      sounds.click();
      return;
    }
    sounds.click();
    if (transitioning) return;
    const isLast = panelIdx + 1 >= PROLOGUE.length;
    if (isLast) { setExploding(true); return; }
    setTransitioning(true);
    setPanelVisible(false);
    setTimeout(() => { setPanelIdx(i => i + 1); setTransitioning(false); }, 400);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') skipOrAdvance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, panelIdx, transitioning, exploding]);

  const onExplosionDone = () => navigate('/start');

  return (
    <div
      onClick={skipOrAdvance}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: panel.bg,
        cursor: exploding ? 'default' : 'pointer',
        position: 'relative', overflow: 'hidden',
        transition: 'background 0.8s ease',
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <PrologueStars />

      {/* Villain scanlines */}
      {panel.isVillain && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,0,0,0.035) 3px, rgba(255,0,0,0.035) 4px)',
          animation: 'scanlines 6s linear infinite',
        }} />
      )}

      {/* Ambient glow */}
      {panel.glowColor && (
        <div style={{
          position: 'absolute', width: 360, height: 360, borderRadius: '50%',
          background: `radial-gradient(circle, ${panel.glowColor}22 0%, transparent 70%)`,
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', zIndex: 0,
          animation: 'glowBreath 4s ease-in-out infinite',
        }} />
      )}

      {/* Panel content */}
      <div style={{
        zIndex: 1, maxWidth: 460, width: '100%', padding: '0 24px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 18,
        opacity: panelVisible && !exploding ? 1 : 0,
        transition: 'opacity 0.55s ease',
      }}>

        {/* Rich visual art per panel */}
        <PanelArt panel={panel} heroVisible={heroVisible} />

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
            background: 'rgba(88,204,2,0.10)', border: '1px solid rgba(88,204,2,0.30)',
            borderRadius: 20, padding: '5px 15px',
          }}>
            <span style={{ fontSize: 17 }}>🐉</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#86efac', letterSpacing: 1 }}>
              {panel.speaker}
            </span>
          </div>
        )}

        {/* Typewriter text */}
        <div style={{
          fontSize: panel.isDialogue ? 15 : 14,
          fontWeight: panel.isDialogue ? 500 : 400,
          fontStyle: panel.isDialogue ? 'italic' : 'normal',
          color: 'rgba(255,255,255,0.82)',
          lineHeight: 1.9,
          whiteSpace: 'pre-wrap',
          textAlign: 'center',
          minHeight: 110,
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
        <div style={{ opacity: done ? 1 : 0, transition: 'opacity 0.6s ease 0.4s' }}>
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
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
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

      {/* Skip button */}
      {!exploding && (
        <button
          onClick={e => { e.stopPropagation(); sounds.click(); navigate('/start'); }}
          style={{
            position: 'absolute', top: 20, right: 20, zIndex: 10,
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)',
            borderRadius: 8, padding: '5px 13px', color: 'rgba(255,255,255,0.35)',
            fontFamily: "'Press Start 2P', monospace", fontSize: 7,
            cursor: 'pointer', letterSpacing: 1,
          }}
        >{t('prologue.skip')}</button>
      )}

      {exploding && <ExplosionOverlay onDone={onExplosionDone} />}

      <style>{`
        @keyframes glowBreath   { 0%,100%{opacity:.55;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.12)} }
        @keyframes blinkCursor  { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes blinkPrompt  { 0%,100%{opacity:.65} 50%{opacity:.18} }
        @keyframes scanlines    { 0%{background-position:0 0} 100%{background-position:0 80px} }
        @keyframes emojiFloat   { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-10px) rotate(2deg)} }
        @keyframes codeRain     { 0%{transform:translateY(-20px);opacity:0} 10%{opacity:1} 90%{opacity:.6} 100%{transform:translateY(110px);opacity:0} }
        @keyframes glitchShift  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px)} 40%{transform:translateX(4px)} 60%{transform:translateX(-2px)} 80%{transform:translateX(2px)} }
        @keyframes haloBreath   { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.6} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:1} }
        @keyframes heroEntrance { 0%{opacity:0;transform:translateY(20px) scale(0.85)} 100%{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes gemFloat     { 0%{transform:translateY(0)} 100%{transform:translateY(-8px)} }
        @keyframes pySlide      { 0%{opacity:0;transform:translateX(-24px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes heroSlide    { 0%{opacity:0;transform:translateX(24px)} 100%{opacity:1;transform:translateX(0)} }
        @keyframes particleFly  { 0%{opacity:1;transform:translate(0,0) scale(1)} 100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0.2)} }
        @keyframes questGlow    { 0%,100%{box-shadow:0 0 12px var(--gc)} 50%{box-shadow:0 0 28px var(--gc), 0 0 48px var(--gc)} }
      `}</style>
    </div>
  );
}

// ─── Per-panel visual art ─────────────────────────────────────────────────────
function PanelArt({ panel, heroVisible }) {
  if (panel.visualType === 'world') return <WorldArt />;
  if (panel.visualType === 'villain') return <VillainArt />;
  if (panel.visualType === 'hero') return <HeroArt visible={heroVisible} />;
  if (panel.visualType === 'pyAndHero') return <PyAndHeroArt visible={heroVisible} />;
  if (panel.visualType === 'quest') return <QuestArt visible={heroVisible} />;
  // fallback
  return (
    <div style={{
      fontSize: panel.emojiSize || 72, lineHeight: 1,
      filter: panel.glowColor ? `drop-shadow(0 0 22px ${panel.glowColor}90)` : undefined,
      animation: 'emojiFloat 5s ease-in-out infinite',
    }}>{panel.emoji}</div>
  );
}

// Panel 1 — falling Python code rain over the world emoji
function WorldArt() {
  const words = ['print()', 'def', 'for i in:', 'True', 'return', '[]', 'if:', 'class', '= 0', 'range(']  ;
  return (
    <div style={{ position: 'relative', width: 200, height: 130, overflow: 'hidden' }}>
      {words.map((w, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: `${(i * 19 + 5) % 90}%`,
          top: 0,
          fontSize: 9,
          color: `rgba(88,204,2,${0.25 + (i % 4) * 0.15})`,
          fontFamily: "'Press Start 2P', monospace",
          whiteSpace: 'nowrap',
          animation: `codeRain ${1.8 + (i % 5) * 0.5}s ${i * 0.35}s linear infinite`,
          pointerEvents: 'none',
        }}>{w}</div>
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 72, lineHeight: 1,
        filter: 'drop-shadow(0 0 24px #3b4fd4)',
        animation: 'emojiFloat 5s ease-in-out infinite',
        zIndex: 1,
      }}>🌌</div>
    </div>
  );
}

// Panel 2 — villain skull with glitch effect + red particle burst
function VillainArt() {
  const particles = Array.from({ length: 10 }, (_, i) => ({
    angle: i * 36, dist: 40 + (i % 3) * 20,
    color: ['#ff4444','#ff0000','#cc0000','#ff6666'][i % 4],
  }));
  return (
    <div style={{ position: 'relative', width: 120, height: 120 }}>
      {/* Red particle ring */}
      {particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', top: '50%', left: '50%',
          width: 6, height: 6, borderRadius: '50%',
          background: p.color,
          boxShadow: `0 0 6px ${p.color}`,
          transform: `translate(-50%, -50%) translate(${Math.cos(p.angle * Math.PI / 180) * p.dist}px, ${Math.sin(p.angle * Math.PI / 180) * p.dist}px)`,
          animation: `emojiFloat ${1.2 + i * 0.15}s ${i * 0.08}s ease-in-out infinite alternate`,
        }} />
      ))}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 72, lineHeight: 1,
        filter: 'drop-shadow(0 0 30px #ff000099)',
        animation: 'glitchShift 2.5s ease-in-out infinite, emojiFloat 4s ease-in-out infinite',
      }}>💀</div>
    </div>
  );
}

// Panel 3 — GIO appears! Large hero character with golden halo
function HeroArt({ visible }) {
  return (
    <div style={{ position: 'relative', width: 160, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Outer halo ring */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 160, height: 160, borderRadius: '50%',
        border: '1px solid rgba(250,204,21,0.25)',
        animation: 'haloBreath 3s ease-in-out infinite',
      }} />
      {/* Inner glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        width: 110, height: 110, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(250,204,21,0.20) 0%, transparent 70%)',
        animation: 'haloBreath 2.5s ease-in-out infinite',
      }} />
      {/* Gio character */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.85)',
        transition: 'opacity 0.7s cubic-bezier(.2,1.2,.4,1), transform 0.7s cubic-bezier(.2,1.2,.4,1)',
        position: 'relative', zIndex: 2,
      }}>
        <HeroFigureSVG cls={{ color: GIO_COLOR }} size={120} animate />
      </div>
      {/* Star sparks around Gio */}
      {[0,1,2,3,4].map(i => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + Math.sin(i * 72 * Math.PI / 180) * 55}%`,
          left: `${50 + Math.cos(i * 72 * Math.PI / 180) * 38}%`,
          fontSize: 10,
          opacity: visible ? 1 : 0,
          transition: `opacity 0.4s ease ${0.3 + i * 0.1}s`,
          animation: `emojiFloat ${1.5 + i * 0.3}s ${i * 0.2}s ease-in-out infinite`,
          filter: 'drop-shadow(0 0 4px #facc15)',
        }}>✦</div>
      ))}
    </div>
  );
}

// Panel 4 — Py dragon + Gio side by side
function PyAndHeroArt({ visible }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 20, height: 130 }}>
      {/* Py slides in from left */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-24px)',
        transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(.2,1.2,.4,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <div style={{
          fontSize: 72,
          filter: 'drop-shadow(0 0 24px #58CC02cc)',
          animation: 'emojiFloat 3.5s ease-in-out infinite',
        }}>🐉</div>
        <div style={{ fontSize: 7, color: '#86efac', fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, opacity: 0.8 }}>PY</div>
      </div>

      {/* Connection glow */}
      <div style={{
        width: 30, height: 2,
        background: 'linear-gradient(90deg, #58CC02, #facc15)',
        borderRadius: 2, marginBottom: 36,
        opacity: visible ? 0.7 : 0,
        transition: 'opacity 0.8s ease 0.3s',
        boxShadow: '0 0 8px #58CC0288',
      }} />

      {/* Gio slides in from right */}
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(24px)',
        transition: 'opacity 0.6s ease 0.15s, transform 0.6s cubic-bezier(.2,1.2,.4,1) 0.15s',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      }}>
        <HeroFigureSVG cls={{ color: GIO_COLOR }} size={80} animate />
        <div style={{ fontSize: 7, color: '#facc15', fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, opacity: 0.8 }}>GIO</div>
      </div>
    </div>
  );
}

// Panel 5 — Quest art: five fragment gems in arc + Gio with sword
function QuestArt({ visible }) {
  const fragments = [
    { color: '#58CC02', emoji: '💚', label: 'I' },
    { color: '#1CB0F6', emoji: '💙', label: 'II' },
    { color: '#FF9600', emoji: '🧡', label: 'III' },
    { color: '#CE82FF', emoji: '💜', label: 'IV' },
    { color: '#FF4B4B', emoji: '❤️',  label: 'V' },
  ];
  return (
    <div style={{ position: 'relative', width: 220, height: 140 }}>
      {/* Five fragment gems in arc above Gio */}
      {fragments.map((f, i) => {
        const angle = -50 + i * 25;
        const rad   = angle * Math.PI / 180;
        const x     = Math.sin(rad) * 85;
        const y     = -Math.cos(rad) * 50 + 20;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`,
            top: y,
            transform: 'translateX(-50%)',
            fontSize: 20,
            filter: `drop-shadow(0 0 8px ${f.color})`,
            opacity: visible ? 1 : 0,
            transition: `opacity 0.4s ease ${0.1 + i * 0.1}s`,
            animation: `gemFloat ${1.4 + i * 0.25}s ${i * 0.18}s ease-in-out infinite alternate`,
          }}>{f.emoji}</div>
        );
      })}
      {/* Gio at bottom center */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease 0.3s',
      }}>
        <HeroFigureSVG cls={{ color: GIO_COLOR }} size={70} animate />
      </div>
    </div>
  );
}

// ─── Explosion transition ─────────────────────────────────────────────────────
function ExplosionOverlay({ onDone }) {
  const [phase, setPhase] = useState('flash');

  useEffect(() => {
    sounds.combo();
    const t1 = setTimeout(() => setPhase('burst'), 180);
    const t2 = setTimeout(() => setPhase('fade'),  900);
    const t3 = setTimeout(() => onDone(),         1700);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  const particles = Array.from({ length: 48 }, (_, i) => {
    const angle  = (i / 48) * 360;
    const dist   = 120 + (i % 5) * 40;
    const size   = 4 + (i % 4) * 2;
    const colors = ['#facc15','#58CC02','#ffffff','#ff9600','#ce82ff','#1cb0f6'];
    return { angle, dist, size, color: colors[i % colors.length], delay: (i % 6) * 30 };
  });

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: phase === 'flash' ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0)',
        transition: phase === 'flash' ? 'none' : 'background 0.5s ease',
      }} />
      <div style={{
        position: 'absolute', inset: 0, background: 'black',
        opacity: phase === 'fade' ? 1 : 0,
        transition: phase === 'fade' ? 'opacity 0.8s ease' : 'none',
      }} />
      {phase === 'burst' && [0,80,160,240].map((delay, i) => (
        <div key={i} style={{
          position: 'absolute', width: 20, height: 20, borderRadius: '50%',
          border: `3px solid ${['#facc15','#58CC02','rgba(255,255,255,0.8)','#ff9600'][i]}`,
          animation: `shockRing 0.9s ${delay}ms cubic-bezier(0,.5,.5,1) forwards`,
        }} />
      ))}
      {phase === 'burst' && particles.map((p, i) => (
        <div key={i} style={{
          position: 'absolute', width: p.size, height: p.size,
          borderRadius: p.size > 6 ? '50%' : '2px',
          background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          animation: `particle_${i % 8} 0.85s ${p.delay}ms cubic-bezier(.2,1,.4,1) forwards`,
          '--tx': `${Math.cos(p.angle * Math.PI / 180) * p.dist}px`,
          '--ty': `${Math.sin(p.angle * Math.PI / 180) * p.dist}px`,
        }} />
      ))}
      {phase === 'burst' && (
        <div style={{ fontSize: 80, position: 'absolute', animation: 'dragonBurst 0.9s cubic-bezier(.2,1,.4,1) forwards', filter: 'drop-shadow(0 0 30px #facc15)' }}>🐉</div>
      )}
      <style>{`
        @keyframes shockRing    { 0%{transform:scale(0);opacity:1} 100%{transform:scale(18);opacity:0} }
        @keyframes dragonBurst  { 0%{transform:scale(0.2) rotate(-20deg);opacity:1} 60%{transform:scale(1.4) rotate(10deg);opacity:1} 100%{transform:scale(3) rotate(0deg);opacity:0} }
        @keyframes particle_0   { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_1   { 0%{transform:translate(0,0) scale(1.2);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_2   { 0%{transform:translate(0,0) rotate(0deg);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) rotate(360deg);opacity:0} }
        @keyframes particle_3   { 0%{transform:translate(0,0) scale(0.8);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_4   { 0%{transform:translate(0,0) scale(1);opacity:1} 80%{opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0.2);opacity:0} }
        @keyframes particle_5   { 0%{transform:translate(0,0) rotate(-45deg);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) rotate(180deg);opacity:0} }
        @keyframes particle_6   { 0%{transform:translate(0,0) scale(1.5);opacity:.9} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
        @keyframes particle_7   { 0%{transform:translate(0,0);opacity:1} 70%{opacity:.7} 100%{transform:translate(var(--tx),var(--ty)) scale(0.1);opacity:0} }
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
