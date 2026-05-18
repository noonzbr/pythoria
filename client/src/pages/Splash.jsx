import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';

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

  const handleStart = () => {
    if (clicked) return;
    setClicked(true);
    sounds.click();
    // Brief flash-out before navigating
    setTimeout(() => {
      if (!hasSelectedLang()) navigate('/lang');
      else navigate(isFirstLaunch() ? '/prologue' : '/');
    }, 350);
  };

  // Allow any key/click once ready
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

        {/* Title */}
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 'clamp(28px, 7vw, 42px)',
          letterSpacing: 4,
          background: 'linear-gradient(135deg, #58CC02 0%, #facc15 50%, #58CC02 100%)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation: phase !== 'black' ? 'shimmer 3s linear infinite' : 'none',
          textShadow: 'none',
          marginBottom: 10,
        }}>
          {t('app.name')}
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
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
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
