import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../hooks/useProgress.js';
import { useStory } from '../hooks/useStory.js';
import { UNITS } from '../data/curriculum.js';
import { CLASSES, UNIT_INTROS } from '../data/story.js';
import { sounds } from '../utils/sounds.js';

export default function Home() {
  const { user, completed, loading } = useProgress();
  const { getPlayer, resetAll } = useStory();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  if (loading) return <LoadingScreen t={t} />;

  const player = getPlayer();
  const cls = CLASSES.find(c => c.id === player.classId) || CLASSES[0];

  const totalLessons = UNITS.reduce((s, u) => s + u.lessons.length, 0);
  const xpToNext  = 100 - (user.xp % 100);
  const xpPercent = ((user.xp % 100) / 100) * 100;

  // Current active realm
  let activeUnitId = 1;
  for (const unit of UNITS) {
    const allDone = unit.lessons.every(l => completed.some(c => c.unit_id === unit.id && c.lesson_id === l.id));
    if (!allDone) { activeUnitId = unit.id; break; }
    activeUnitId = unit.id + 1;
  }
  const allComplete = activeUnitId > UNITS.length;

  // Next incomplete lesson
  let nextUnit = null, nextLesson = null;
  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      if (!completed.some(c => c.unit_id === unit.id && c.lesson_id === lesson.id)) {
        nextUnit = unit; nextLesson = lesson; break;
      }
    }
    if (nextLesson) break;
  }

  const intro = UNIT_INTROS[activeUnitId];
  const fragmentName = intro?.fragmentName || 'The Final Victory';
  const realmNames = t('home.realmNames', { returnObjects: true });

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 90,
      background: 'linear-gradient(180deg, #040810 0%, #080e18 100%)',
      fontFamily: "'Exo 2', sans-serif",
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
      position: 'relative', overflow: 'hidden',
    }}>
      <HomeStars />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 20px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero header ──────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24,
          padding: '20px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontSize: 52, flexShrink: 0,
            animation: 'heroFloat 3s ease-in-out infinite',
            filter: `drop-shadow(0 0 14px ${cls.color}60)`,
          }}>{cls.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: cls.color, letterSpacing: 2, marginBottom: 4 }}>
              {cls.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 2 }}>
              {player.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                {t('home.stats.level')} {user.level}
              </span>
              <span style={{ fontSize: 12 }}>🔥 {user.streak} day streak</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 900, color: '#facc15', fontFamily: "'Press Start 2P', monospace", fontSize: 13 }}>
              {user.xp}
            </div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: "'Press Start 2P', monospace", letterSpacing: 1 }}>
              XP
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, padding: '14px 16px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
              {t('home.stats.level')} {user.level}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700 }}>
              {t('home.stats.xpToNext', { xp: xpToNext, level: user.level + 1 })}
            </span>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              background: 'linear-gradient(90deg, #58CC02, #facc15)',
              height: '100%', width: `${xpPercent}%`, borderRadius: 99,
              transition: 'width 0.8s cubic-bezier(.4,2,.6,1)',
              boxShadow: '0 0 10px rgba(88,204,2,0.6)',
            }} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { icon: '❤️', val: user.hearts, label: t('home.stats.hearts'), color: '#FF4B4B' },
            { icon: '💎', val: user.gems,   label: t('home.stats.gems'),   color: '#1CB0F6' },
            { icon: '⚔️', val: completed.length, label: t('home.stats.wins'), color: '#facc15' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16, padding: '12px 8px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontWeight: 900, color: s.color, fontFamily: "'Press Start 2P', monospace", fontSize: 12 }}>{s.val}</div>
              <div style={{ fontSize: 7, fontFamily: "'Press Start 2P', monospace", color: 'rgba(255,255,255,0.3)', letterSpacing: 1, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Active quest ─────────────────────────────────────────────── */}
        {!allComplete && nextUnit && nextLesson ? (
          <div style={{
            background: `linear-gradient(135deg, ${nextUnit.color}18, ${nextUnit.borderColor}10)`,
            border: `1px solid ${nextUnit.color}40`,
            borderRadius: 22, padding: '18px', marginBottom: 20,
            position: 'relative', overflow: 'hidden',
            boxShadow: `0 0 24px ${nextUnit.color}20`,
          }}>
            {/* Pulse border */}
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 22,
              border: `1px solid ${nextUnit.color}`,
              animation: 'questPulse 2s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: nextUnit.color, letterSpacing: 2, marginBottom: 6 }}>
              {t('home.activeQuest')}
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: 'white', marginBottom: 4 }}>
              {nextUnit.icon} {nextLesson.title}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontStyle: 'italic' }}>
              {realmNames[nextUnit.id - 1]} · {t('home.recoverFragment', { fragment: fragmentName })}
            </div>
            <div style={{ fontSize: 11, color: nextUnit.color, fontWeight: 700, marginBottom: 14 }}>
              +{nextLesson.xpReward} XP reward
            </div>
            <Link
              to={`/unit-intro/${nextUnit.id}`}
              onClick={() => sounds.click()}
              style={{
                display: 'inline-block',
                background: `linear-gradient(135deg, ${nextUnit.color}, ${nextUnit.borderColor})`,
                color: 'white', padding: '11px 22px', borderRadius: 12,
                fontFamily: "'Press Start 2P', monospace", fontSize: 9,
                textDecoration: 'none', letterSpacing: 1,
                boxShadow: `0 4px 0 ${nextUnit.borderColor}, 0 0 16px ${nextUnit.color}50`,
              }}
            >
              {t('home.enterBattle')}
            </Link>
          </div>
        ) : allComplete ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(88,204,2,0.1))',
            border: '1px solid rgba(250,204,21,0.3)',
            borderRadius: 22, padding: '20px', marginBottom: 20, textAlign: 'center',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#facc15', letterSpacing: 2, marginBottom: 8 }}>
              {t('home.allSaved')}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
              {t('home.allSavedMsg', { name: player.name })}
            </p>
          </div>
        ) : null}

        {/* Py's message */}
        <div style={{
          background: 'rgba(88,204,2,0.06)', border: '1px solid rgba(88,204,2,0.2)',
          borderRadius: 18, padding: '14px 16px', marginBottom: 20,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 28, flexShrink: 0, animation: 'heroFloat 4s ease-in-out infinite' }}>🐉</span>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#58CC02', letterSpacing: 1, marginBottom: 4 }}>
              {t('home.pySays')}
            </div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>
              {allComplete
                ? t('home.allSavedMsg', { name: player.name })
                : user.xp === 0
                  ? t('home.pyMessages.start', { name: player.name })
                  : user.streak >= 3
                    ? t('home.pyMessages.streak', { streak: user.streak })
                    : completed.length > 5
                      ? t('home.pyMessages.progressing', { name: player.name })
                      : t('home.pyMessages.default', { name: player.name })}
            </p>
          </div>
        </div>

        {/* Journey progress */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 18, padding: '16px', marginBottom: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 }}>
              {t('home.pythoriaTitle')}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#58CC02' }}>
              {completed.length}/{totalLessons} {t('home.battles')}
            </span>
          </div>
          {UNITS.map(unit => {
            const done = unit.lessons.filter(l => completed.some(c => c.unit_id === unit.id && c.lesson_id === l.id)).length;
            const pct  = (done / unit.lessons.length) * 100;
            return (
              <div key={unit.id} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 11, color: pct === 100 ? unit.color : 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
                    {unit.icon} {realmNames[unit.id - 1]}
                  </span>
                  <span style={{ fontSize: 10, color: unit.color, fontWeight: 800 }}>{Math.round(pct)}%</span>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    background: unit.color, height: '100%', width: `${pct}%`,
                    borderRadius: 99, transition: 'width 0.6s ease',
                    boxShadow: pct > 0 ? `0 0 6px ${unit.color}` : 'none',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Reset (dev) — small link */}
        <div style={{ textAlign: 'center' }}>
          <button onClick={() => { resetAll(); window.location.href = '/splash'; }} style={{
            background: 'none', color: 'rgba(255,255,255,0.1)', fontSize: 10,
            cursor: 'pointer', border: 'none', fontFamily: "'Exo 2', sans-serif",
          }}>
            {t('home.resetSave')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes heroFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes questPulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes homeStarTwinkle { 0%,100%{opacity:.06} 50%{opacity:.35} }
      `}</style>
    </div>
  );
}

function HomeStars() {
  const stars = Array.from({ length: 30 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3) % 100),
    size: 1 + (i % 2), dur: 3 + (i % 3), del: (i * 0.2) % 4,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          animation: `homeStarTwinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function LoadingScreen({ t }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100vh', gap: 16,
      background: '#040810', fontFamily: "'Exo 2', sans-serif",
    }}>
      <div style={{ fontSize: 56, animation: 'heroFloat 1.5s ease-in-out infinite' }}>🐉</div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#58CC02', letterSpacing: 2 }}>
        {t('home.loading')}
      </div>
      <style>{`@keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}
