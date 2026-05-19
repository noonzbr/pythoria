import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';

const DISCO_COLORS = ['#ff4b4b','#ff9600','#facc15','#58CC02','#1CB0F6','#CE82FF','#ff69b4','#00ffcc'];

function DiscoBall() {
  const tiles = [];
  let ci = 0;
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 11; col++) {
      tiles.push({
        x: 2 + col * 8.2,
        y: 13 + row * 7.5,
        color: DISCO_COLORS[(ci + row * 3) % DISCO_COLORS.length],
        opacity: 0.45 + ((col + row) % 4) * 0.12,
      });
      ci++;
    }
  }

  const beams = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div style={{
      position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
      zIndex: 2, pointerEvents: 'none',
    }}>
      {/* Light spots on floor */}
      {beams.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const sx = 50 + Math.cos(rad) * 38;
        const sy = 50 + Math.sin(rad) * 28;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(${sx}% - 6px)`, top: `calc(${sy}% - 4px)`,
            width: 12, height: 8, borderRadius: '50%',
            background: DISCO_COLORS[i % DISCO_COLORS.length],
            opacity: 0.18,
            filter: 'blur(6px)',
            animation: `discoSpot ${1.8 + i * 0.3}s ease-in-out infinite alternate`,
            animationDelay: `${i * 0.22}s`,
          }} />
        );
      })}

      <svg width="94" height="118" viewBox="0 0 94 118" style={{ overflow: 'visible' }}>
        {/* String */}
        <line x1="47" y1="0" x2="47" y2="14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
        <defs>
          <radialGradient id="ballGrad" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor="#d4e4ff" />
            <stop offset="45%" stopColor="#4a6080" />
            <stop offset="100%" stopColor="#080e20" />
          </radialGradient>
          <clipPath id="ballClip">
            <circle cx="47" cy="60" r="44" />
          </clipPath>
        </defs>

        {/* Ball base */}
        <circle cx="47" cy="60" r="44" fill="url(#ballGrad)" />

        {/* Tile grid */}
        <g clipPath="url(#ballClip)" style={{ animation: 'discoBallShift 1.6s linear infinite' }}>
          {tiles.map((t, i) => (
            <rect key={i} x={t.x} y={t.y} width={7} height={5.5} rx={1}
              fill={t.color} opacity={t.opacity}
            />
          ))}
        </g>

        {/* Rim shadow to sell sphere */}
        <circle cx="47" cy="60" r="44" fill="none"
          stroke="rgba(0,0,20,0.6)" strokeWidth="4" />

        {/* Highlight specular */}
        <ellipse cx="35" cy="44" rx="10" ry="7" fill="rgba(255,255,255,0.55)" />
        <ellipse cx="31" cy="42" rx="4" ry="2.5" fill="rgba(255,255,255,0.82)" />

        {/* Light beams from ball */}
        {beams.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = 47 + Math.cos(rad) * 46;
          const y1 = 60 + Math.sin(rad) * 46;
          const x2 = 47 + Math.cos(rad) * 90;
          const y2 = 60 + Math.sin(rad) * 90;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={DISCO_COLORS[i % DISCO_COLORS.length]}
              strokeWidth="1.8" opacity="0.5"
              style={{ animation: `discoBeam ${1.5 + i * 0.2}s ease-in-out infinite alternate` }}
            />
          );
        })}
      </svg>

      <style>{`
        @keyframes discoBallShift {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-8.2px); }
        }
        @keyframes discoBeam {
          0%   { opacity: 0.5; }
          100% { opacity: 0.1; }
        }
        @keyframes discoSpot {
          0%   { opacity: 0.18; transform: scale(1); }
          100% { opacity: 0.35; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}

export default function Splash() {
  const navigate = useNavigate();
  const { isFirstLaunch, hasSelectedLang } = useStory();
  const { t } = useTranslation();
  const [phase, setPhase] = useState('black');   // black → logo → tagline → ready
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('logo'),    400);
    const t2 = setTimeout(() => setPhase('tagline'), 1600);
    const t3 = setTimeout(() => setPhase('ready'),   2800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  // Start music on first user gesture, stop on unmount
  useEffect(() => {
    const startMusic = () => sounds.startSplashTheme();
    window.addEventListener('keydown',   startMusic, { once: true });
    window.addEventListener('mousedown', startMusic, { once: true });
    window.addEventListener('touchstart',startMusic, { once: true });
    return () => {
      sounds.stopSplashTheme();
      window.removeEventListener('keydown',    startMusic);
      window.removeEventListener('mousedown',  startMusic);
      window.removeEventListener('touchstart', startMusic);
    };
  }, []);

  const handleStart = () => {
    if (clicked) return;
    setClicked(true);
    sounds.click();
    setTimeout(() => {
      sounds.stopSplashTheme();
      if (!hasSelectedLang()) navigate('/lang');
      else navigate(isFirstLaunch() ? '/prologue' : '/');
    }, 350);
  };

  useEffect(() => {
    if (phase !== 'ready') return;
    const handler = () => handleStart();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase]);

  return (
    <div
      onClick={phase === 'ready' ? handleStart : undefined}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 40%, #0d0830 0%, #050310 60%, #000000 100%)',
        cursor: phase === 'ready' ? 'pointer' : 'default',
        userSelect: 'none', position: 'relative', overflow: 'hidden',
        opacity: clicked ? 0 : 1, transition: 'opacity 0.35s ease',
      }}
    >
      <Stars count={60} />
      <DiscoBall />

      {/* Dragon watermark glow */}
      <div style={{
        position: 'absolute', fontSize: 320, opacity: 0.04,
        top: '50%', left: '50%', transform: 'translate(-50%, -54%)',
        animation: 'slowPulse 6s ease-in-out infinite',
        pointerEvents: 'none', zIndex: 0,
      }}>🐉</div>

      {/* Logo */}
      <div style={{
        zIndex: 1, textAlign: 'center',
        opacity: phase === 'black' ? 0 : 1,
        transform: phase === 'black' ? 'scale(0.85) translateY(12px)' : 'scale(1) translateY(0)',
        transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(.2,1,.4,1)',
      }}>
        {/* Dragon icon */}
        <div style={{
          fontSize: 80, marginBottom: 12,
          filter: 'drop-shadow(0 0 28px rgba(88,204,2,0.6))',
          animation: phase !== 'black' ? 'dragonFloat 4s ease-in-out infinite' : 'none',
        }}>🐉</div>

        {/* PYTHORIA colored title */}
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(26px, 6.5vw, 40px)',
          letterSpacing: 3,
          marginBottom: 10,
          filter: 'drop-shadow(0 0 16px rgba(88,204,2,0.45))',
          lineHeight: 1,
        }}>
          <span style={{ color: '#58CC02' }}>PY</span>
          <span style={{ color: '#ffffff' }}>TH</span>
          <span style={{ color: '#1CB0F6' }}>OR</span>
          <span style={{ color: '#facc15' }}>IA</span>
          <span style={{ fontSize: '0.65em', marginLeft: 4 }}>🐉</span>
        </div>

        {/* Subtitle */}
        <div style={{
          opacity: phase === 'tagline' || phase === 'ready' ? 1 : 0,
          transform: phase === 'tagline' || phase === 'ready' ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          fontFamily: "'Exo 2', sans-serif",
          fontSize: 13, fontWeight: 600, letterSpacing: 3,
          color: 'rgba(255,255,255,0.45)',
          textTransform: 'uppercase', marginBottom: 48,
        }}>
          {t('app.tagline')}
        </div>

        {/* Press start */}
        <div style={{
          opacity: phase === 'ready' ? 1 : 0,
          transition: 'opacity 0.5s ease',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 10, color: 'rgba(255,255,255,0.55)',
          letterSpacing: 2,
          animation: phase === 'ready' ? 'blinkText 1.4s ease-in-out infinite' : 'none',
        }}>
          {t('splash.press')}
        </div>
      </div>

      {/* Version */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20,
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: 1,
      }}>
        v1.0
      </div>

      <style>{`
        @keyframes dragonFloat {
          0%,100% { transform: translateY(0) rotate(-3deg); }
          50%      { transform: translateY(-12px) rotate(3deg); }
        }
        @keyframes blinkText {
          0%,100% { opacity: 0.55; }
          50%      { opacity: 0.15; }
        }
        @keyframes slowPulse {
          0%,100% { opacity: 0.04; transform: translate(-50%,-54%) scale(1); }
          50%      { opacity: 0.07; transform: translate(-50%,-54%) scale(1.04); }
        }
      `}</style>
    </div>
  );
}

function Stars({ count = 50 }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 137.5) % 100),
    y: ((i * 97.3 + 11) % 100),
    size: 1 + (i % 3) * 0.5,
    dur:  2 + (i % 4),
    del:  (i * 0.15) % 3,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          animation: `twinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }} />
      ))}
      <style>{`@keyframes twinkle { 0%,100%{opacity:.15} 50%{opacity:.9} }`}</style>
    </div>
  );
}
