import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CLASSES } from '../data/story.js';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';

export default function CharacterCreate() {
  const navigate = useNavigate();
  const { savePlayer } = useStory();
  const { t } = useTranslation();
  const classes = t('charCreate.classes', { returnObjects: true });

  const [step, setStep]           = useState('name');
  const [name, setName]           = useState('');
  const [selectedClass, setClass] = useState(null);
  const [pyLine, setPyLine]       = useState('');
  const [pyVisible, setPyVisible] = useState(false);
  const [visible, setVisible]     = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200);
    return () => clearTimeout(t);
  }, []);

  // Py speaks when class is selected
  useEffect(() => {
    if (!selectedClass) return;
    setPyVisible(false);
    const idx = CLASSES.findIndex(c => c.id === selectedClass);
    const line = classes[idx]?.pyLine || '';
    const timer = setTimeout(() => {
      setPyLine(line);
      setPyVisible(true);
    }, 400);
    return () => clearTimeout(timer);
  }, [selectedClass]);

  const goToClass = () => {
    if (!name.trim() || name.trim().length < 2) return;
    sounds.correct();
    setStep('class');
  };

  const goToConfirm = () => {
    if (!selectedClass) return;
    sounds.correct();
    setStep('confirm');
  };

  const beginQuest = () => {
    sounds.victory();
    savePlayer(name.trim(), selectedClass);
    setTimeout(() => navigate('/'), 400);
  };

  const clsIdx = CLASSES.findIndex(c => c.id === selectedClass);
  const cls = CLASSES.find(c => c.id === selectedClass);
  const clsI18n = clsIdx >= 0 ? classes[clsIdx] : null;

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, #0d1a08 0%, #080e04 50%, #020402 100%)',
      padding: '24px 20px',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.5s ease',
      fontFamily: "'Exo 2', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <PrologueStars />

      <div style={{ zIndex: 1, width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* Py header — always visible */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: 64, marginBottom: 6,
            animation: 'pyFloat 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 20px rgba(88,204,2,0.5))',
            display: 'inline-block',
          }}>🐉</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: '#58CC02', letterSpacing: 2 }}>
            {t('charCreate.pyLabel')}
          </div>
        </div>

        {/* ── Step: Name ─────────────────────────────────────────────────── */}
        {step === 'name' && (
          <StepCard key="name">
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontStyle: 'italic', lineHeight: 1.7, textAlign: 'center', marginBottom: 24 }}>
              {t('charCreate.questionName')}
            </p>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && goToClass()}
              maxLength={20}
              placeholder={t('charCreate.namePlaceholder')}
              style={{
                width: '100%', padding: '14px 18px', borderRadius: 14,
                background: 'rgba(255,255,255,0.07)',
                border: '2px solid rgba(88,204,2,0.4)',
                color: 'white', fontSize: 18, fontWeight: 700,
                fontFamily: "'Exo 2', sans-serif",
                outline: 'none', textAlign: 'center',
                boxSizing: 'border-box',
                boxShadow: name.trim().length >= 2 ? '0 0 16px rgba(88,204,2,0.25)' : 'none',
                transition: 'box-shadow 0.3s',
              }}
            />
            <button
              onClick={goToClass}
              disabled={name.trim().length < 2}
              style={{
                marginTop: 16, width: '100%', padding: '14px',
                background: name.trim().length >= 2
                  ? 'linear-gradient(135deg, #58CC02, #45A800)'
                  : 'rgba(255,255,255,0.07)',
                color: name.trim().length >= 2 ? 'white' : 'rgba(255,255,255,0.25)',
                borderRadius: 14, fontFamily: "'Press Start 2P', monospace",
                fontSize: 11, letterSpacing: 1,
                boxShadow: name.trim().length >= 2 ? '0 4px 0 #2D6A00, 0 0 20px rgba(88,204,2,0.3)' : 'none',
                cursor: name.trim().length >= 2 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {t('charCreate.nameButton')}
            </button>
          </StepCard>
        )}

        {/* ── Step: Class ─────────────────────────────────────────────────── */}
        {step === 'class' && (
          <StepCard key="class">
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.7, textAlign: 'center', marginBottom: 20 }}
              dangerouslySetInnerHTML={{ __html: t('charCreate.questionClass', { name }).replace(name, `<strong style="color:#facc15;font-style:normal">${name}</strong>`) }}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {CLASSES.map((c, i) => {
                const ci = classes[i] || {};
                return (
                  <button
                    key={c.id}
                    onClick={() => { sounds.select(); setClass(c.id); }}
                    style={{
                      background: selectedClass === c.id ? `${c.color}18` : 'rgba(255,255,255,0.05)',
                      border: `2px solid ${selectedClass === c.id ? c.color : 'rgba(255,255,255,0.12)'}`,
                      borderRadius: 14, padding: '14px 16px',
                      display: 'flex', alignItems: 'center', gap: 14,
                      cursor: 'pointer', textAlign: 'left',
                      boxShadow: selectedClass === c.id ? `0 0 16px ${c.color}40` : 'none',
                      transform: selectedClass === c.id ? 'scale(1.02)' : 'scale(1)',
                      transition: 'all 0.2s cubic-bezier(.4,2,.6,1)',
                    }}
                  >
                    <span style={{ fontSize: 32, flexShrink: 0 }}>{c.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: selectedClass === c.id ? c.color : 'white' }}>
                        {ci.name || c.name}
                      </div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', marginTop: 2 }}>
                        "{ci.tagline || c.tagline}"
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                        {ci.desc || c.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Py reaction bubble */}
            <div style={{
              marginTop: 16,
              opacity: pyVisible && selectedClass ? 1 : 0,
              transform: pyVisible && selectedClass ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              background: 'rgba(88,204,2,0.08)',
              border: '1px solid rgba(88,204,2,0.25)',
              borderRadius: 14, padding: '12px 16px',
              fontSize: 13, fontStyle: 'italic', color: '#86efac', lineHeight: 1.6,
            }}>
              🐉 {pyLine}
            </div>

            <button
              onClick={goToConfirm}
              disabled={!selectedClass}
              style={{
                marginTop: 16, width: '100%', padding: '14px',
                background: selectedClass ? `linear-gradient(135deg, ${cls?.color || '#58CC02'}, #333)` : 'rgba(255,255,255,0.07)',
                color: selectedClass ? 'white' : 'rgba(255,255,255,0.25)',
                borderRadius: 14, fontFamily: "'Press Start 2P', monospace",
                fontSize: 11, letterSpacing: 1,
                boxShadow: selectedClass ? `0 4px 0 rgba(0,0,0,0.4), 0 0 20px ${cls?.color || '#58CC02'}40` : 'none',
                cursor: selectedClass ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {t('charCreate.classButton')}
            </button>
          </StepCard>
        )}

        {/* ── Step: Confirm ───────────────────────────────────────────────── */}
        {step === 'confirm' && cls && (
          <StepCard key="confirm">
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{cls.emoji}</div>
              <div style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 11,
                color: cls.color, letterSpacing: 2, marginBottom: 4,
              }}>
                {name}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
                {clsI18n?.name || cls.name}
              </div>
            </div>

            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, padding: '16px', marginBottom: 20,
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, fontStyle: 'italic', lineHeight: 1.75, textAlign: 'center', margin: 0, whiteSpace: 'pre-line' }}>
                {t('charCreate.confirmText', { name })}
              </p>
            </div>

            <button
              onClick={beginQuest}
              style={{
                width: '100%', padding: '16px',
                background: `linear-gradient(135deg, #58CC02, #45A800)`,
                color: 'white', borderRadius: 14,
                fontFamily: "'Press Start 2P', monospace",
                fontSize: 12, letterSpacing: 2,
                boxShadow: '0 5px 0 #2D6A00, 0 0 30px rgba(88,204,2,0.4)',
                cursor: 'pointer',
                animation: 'btnPulse 1.5s ease-in-out infinite',
              }}
            >
              {t('charCreate.beginButton')}
            </button>

            <button
              onClick={() => { sounds.click(); setStep('class'); }}
              style={{
                marginTop: 10, width: '100%', padding: '10px',
                background: 'transparent', color: 'rgba(255,255,255,0.3)',
                borderRadius: 12, fontSize: 11, fontFamily: "'Exo 2', sans-serif",
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer',
              }}
            >
              {t('charCreate.changeClass')}
            </button>
          </StepCard>
        )}
      </div>

      <style>{`
        @keyframes pyFloat { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-8px) rotate(3deg)} }
        @keyframes btnPulse { 0%,100%{box-shadow:0 5px 0 #2D6A00,0 0 20px rgba(88,204,2,0.3)} 50%{box-shadow:0 5px 0 #2D6A00,0 0 36px rgba(88,204,2,0.6)} }
        @keyframes twinkle { 0%,100%{opacity:.1} 50%{opacity:.85} }
        @keyframes cardIn { 0%{opacity:0;transform:translateY(16px)} 100%{opacity:1;transform:translateY(0)} }
      `}</style>
    </div>
  );
}

function StepCard({ children }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 22, padding: '24px 20px',
      animation: 'cardIn 0.4s ease-out',
    }}>
      {children}
    </div>
  );
}

function PrologueStars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3 + 11) % 100),
    size: 1 + (i % 3) * 0.5, dur: 2 + (i % 4), del: (i * 0.15) % 3,
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
    </div>
  );
}
