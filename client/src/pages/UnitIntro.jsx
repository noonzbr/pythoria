import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UNIT_INTROS } from '../data/story.js';
import { UNITS } from '../data/curriculum.js';
import { locIntro, locIntroPanel } from '../utils/loc.js';
import { useStory } from '../hooks/useStory.js';
import { useProgress } from '../hooks/useProgress.js';
import { sounds } from '../utils/sounds.js';

const TYPEWRITER_SPEED = 20;

export default function UnitIntro() {
  const { unitId } = useParams();
  const navigate   = useNavigate();
  const { markUnitIntroSeen } = useStory();
  const { completed } = useProgress();
  const { t, i18n } = useTranslation();

  const uid   = parseInt(unitId);
  const intro = UNIT_INTROS[uid];
  const unit  = UNITS.find(u => u.id === uid);

  const [panelIdx, setPanelIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [done, setDone]           = useState(false);
  const [visible, setVisible]     = useState(false);
  const [leaving, setLeaving]     = useState(false);
  const intervalRef = useRef(null);

  const panel  = intro?.panels[panelIdx];
  const lIntro = intro  ? locIntro(uid, intro)                 : null;
  const lPanel = panel  ? locIntroPanel(uid, panelIdx, panel)  : null;

  useEffect(() => {
    sounds.intro();
  }, []);

  useEffect(() => {
    if (!lPanel) return;
    setVisible(false);
    setDisplayed('');
    setDone(false);
    const t = setTimeout(() => {
      setVisible(true);
      startType(lPanel.text);
    }, 350);
    return () => clearTimeout(t);
  }, [panelIdx, i18n.language]);

  const startType = (text) => {
    clearInterval(intervalRef.current);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(intervalRef.current); setDone(true); }
    }, TYPEWRITER_SPEED);
  };

  const advance = () => {
    if (!done) {
      clearInterval(intervalRef.current);
      setDisplayed(lPanel.text);
      setDone(true);
      return;
    }
    sounds.click();
    if (panelIdx + 1 < intro.panels.length) {
      setVisible(false);
      setTimeout(() => { setPanelIdx(i => i + 1); }, 400);
    } else {
      // Done — mark seen, go to first incomplete lesson
      markUnitIntroSeen(uid);
      setLeaving(true);
      const nextLesson = unit?.lessons.find(l =>
        !completed.some(c => c.unit_id === uid && c.lesson_id === l.id)
      ) || unit?.lessons[0];
      setTimeout(() => navigate(`/lesson/${uid}/${nextLesson.id}/learn`), 400);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') advance();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, panelIdx]);

  if (!intro || !panel || !lPanel) { navigate('/learn'); return null; }

  const realmColors = {
    1: { color: '#58CC02', bg: 'linear-gradient(180deg, #021a04, #010e02)' },
    2: { color: '#1CB0F6', bg: 'linear-gradient(180deg, #00101a, #000a12)' },
    3: { color: '#FF9600', bg: 'linear-gradient(180deg, #1a0a00, #0f0500)' },
    4: { color: '#CE82FF', bg: 'linear-gradient(180deg, #0d0020, #060010)' },
    5: { color: '#FF4B4B', bg: 'linear-gradient(180deg, #1a0000, #0a0000)' },
  };
  const theme = realmColors[uid] || realmColors[1];

  return (
    <div
      onClick={advance}
      style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: panel.bg || theme.bg,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'background 0.6s ease',
        opacity: leaving ? 0 : 1,
        fontFamily: "'Exo 2', sans-serif",
      }}
    >
      <Stars />

      {/* Realm glow */}
      <div style={{
        position: 'absolute', width: 280, height: 280, borderRadius: '50%',
        background: `radial-gradient(circle, ${theme.color}25 0%, transparent 70%)`,
        top: '15%', left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'glowPulse 3s ease-in-out infinite',
      }} />

      {/* Realm banner */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        background: `linear-gradient(90deg, ${theme.color}20, transparent, ${theme.color}20)`,
        borderBottom: `1px solid ${theme.color}30`,
        padding: '12px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: theme.color, letterSpacing: 2 }}>
            {t('unitIntro.realm', { n: uid })}
          </div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 3 }}>
            {lIntro.unitName}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: "'Press Start 2P', monospace" }}>
            {lIntro.fragmentName}
          </div>
        </div>
      </div>

      {/* Panel content */}
      <div style={{
        zIndex: 1, maxWidth: 440, width: '100%', padding: '80px 24px 40px',
        textAlign: 'center', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 18,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(14px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}>

        {/* Main emoji */}
        <div style={{
          fontSize: 72, lineHeight: 1,
          filter: `drop-shadow(0 0 20px ${theme.color}80)`,
          animation: 'emojiFloat 3.5s ease-in-out infinite',
        }}>{panel.emoji}</div>

        {/* Title */}
        {lPanel.title && (
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(9px, 2.5vw, 13px)',
            color: theme.color, letterSpacing: 3, lineHeight: 1.6,
            textShadow: `0 0 16px ${theme.color}80`,
          }}>{lPanel.title}</div>
        )}

        {/* Dialogue speaker */}
        {panel.isDialogue && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(88,204,2,0.1)', border: '1px solid rgba(88,204,2,0.25)',
            borderRadius: 20, padding: '5px 14px',
          }}>
            <span style={{ fontSize: 16 }}>🐉</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#86efac', letterSpacing: 1 }}>{panel.speaker}</span>
          </div>
        )}

        {/* Typewriter text */}
        <div style={{
          fontSize: 14, fontWeight: panel.isDialogue ? 500 : 400,
          fontStyle: panel.isDialogue ? 'italic' : 'normal',
          color: 'rgba(255,255,255,0.82)', lineHeight: 1.85,
          whiteSpace: 'pre-wrap', textAlign: 'center', minHeight: 100,
          textShadow: '0 1px 4px rgba(0,0,0,0.9)',
        }}>
          {displayed}
          {!done && <span style={{ animation: 'blinkCursor 0.7s ease-in-out infinite' }}>▌</span>}
        </div>

        {/* Continue */}
        <div style={{ opacity: done ? 1 : 0, transition: 'opacity 0.4s ease 0.2s' }}>
          {panelIdx + 1 >= intro.panels.length ? (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 10,
              color: theme.color, letterSpacing: 2,
              animation: 'blinkText 1.2s ease-in-out infinite',
              textShadow: `0 0 10px ${theme.color}`,
            }}>
              {t('unitIntro.tapEnter')}
            </div>
          ) : (
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 9,
              color: 'rgba(255,255,255,0.35)', letterSpacing: 2,
              animation: 'blinkText 1.4s ease-in-out infinite',
            }}>{t('unitIntro.tapContinue')}</div>
          )}
        </div>
      </div>

      {/* Dots */}
      <div style={{
        position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8, zIndex: 2,
      }}>
        {intro.panels.map((_, i) => (
          <div key={i} style={{
            width: i === panelIdx ? 18 : 6, height: 6, borderRadius: 3,
            background: i === panelIdx ? theme.color : 'rgba(255,255,255,0.18)',
            transition: 'all 0.35s ease',
          }} />
        ))}
      </div>

      {/* Skip */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          markUnitIntroSeen(uid);
          const nextLesson = unit?.lessons.find(l =>
            !completed.some(c => c.unit_id === uid && c.lesson_id === l.id)
          ) || unit?.lessons[0];
          navigate(`/lesson/${uid}/${nextLesson.id}/learn`);
        }}
        style={{
          position: 'absolute', top: 56, right: 16, zIndex: 10,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 8, padding: '5px 12px', color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Press Start 2P', monospace", fontSize: 7, cursor: 'pointer', letterSpacing: 1,
        }}
      >{t('unitIntro.skip')}</button>

      <style>{`
        @keyframes emojiFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes glowPulse  { 0%,100%{opacity:.7;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.08)} }
        @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes blinkText   { 0%,100%{opacity:.6} 50%{opacity:.15} }
      `}</style>
    </div>
  );
}

function Stars() {
  const s = Array.from({ length: 40 }, (_, i) => ({
    id: i, x: ((i*137.5)%100), y: ((i*97.3+11)%100),
    size: 1+(i%3)*.5, dur: 2+(i%4), del: (i*.15)%3,
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
      <style>{`@keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.8} }`}</style>
    </div>
  );
}
