import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UNITS } from '../data/curriculum.js';
import { UNIT_INTROS } from '../data/story.js';
import { useProgress } from '../hooks/useProgress.js';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';

const REALMS = [
  { unitId: 1, name: 'Syntax Swamps',    emoji: '🌿', mapEmoji: '🏕️', desc: 'Where slimes corrupt the most basic Python. The First Fragment lies within.', bg: 'linear-gradient(135deg, #021a04, #032808)', color: '#58CC02', border: '#2D6A00', fog: '#011203' },
  { unitId: 2, name: 'Logic Labyrinth',  emoji: '🏛️', mapEmoji: '🗺️', desc: 'Golems made of logic patrol endless corridors of if-else chains. The Second Fragment waits.', bg: 'linear-gradient(135deg, #00101a, #001828)', color: '#1CB0F6', border: '#0099D7', fog: '#000a12' },
  { unitId: 3, name: 'Endless Forest',   emoji: '🌀', mapEmoji: '🌲', desc: 'Every path loops forever. The Loop Demon guards the Third Fragment deep within.', bg: 'linear-gradient(135deg, #1a0a00, #281400)', color: '#FF9600', border: '#CC7A00', fog: '#0f0600' },
  { unitId: 4, name: 'Void Tower',       emoji: '🏰', mapEmoji: '⚡', desc: 'Functions return nothing here. The Void Mage has stolen the power of creation itself.', bg: 'linear-gradient(135deg, #0d0020, #160035)', color: '#CE82FF', border: '#9B59B6', fog: '#080015' },
  { unitId: 5, name: "Dragon's Domain",  emoji: '🔥', mapEmoji: '🌋', desc: 'Lava rivers. Corrupted data. The Data Dragon — and the final Fragment — await you here.', bg: 'linear-gradient(135deg, #1a0000, #2a0000)', color: '#FF4B4B', border: '#D42C2C', fog: '#0d0000' },
];

export default function WorldMap() {
  const navigate = useNavigate();
  const { completed } = useProgress();
  const { getPlayer, hasSeenUnitIntro } = useStory();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const player = getPlayer();

  const isUnitComplete = (unitId) => {
    const unit = UNITS.find(u => u.id === unitId);
    return unit?.lessons.every(l => completed.some(c => c.unit_id === unitId && c.lesson_id === l.id));
  };

  const isUnitUnlocked = (unitId) => {
    if (unitId === 1) return true;
    return isUnitComplete(unitId - 1);
  };

  const getUnitProgress = (unitId) => {
    const unit = UNITS.find(u => u.id === unitId);
    if (!unit) return { done: 0, total: 0 };
    const done = unit.lessons.filter(l => completed.some(c => c.unit_id === unitId && c.lesson_id === l.id)).length;
    return { done, total: unit.lessons.length };
  };

  const enterRealm = (realm) => {
    sounds.click();
    if (!isUnitUnlocked(realm.unitId)) return;
    const unit = UNITS.find(u => u.id === realm.unitId);
    // Find first incomplete lesson
    const nextLesson = unit.lessons.find(l => !completed.some(c => c.unit_id === realm.unitId && c.lesson_id === l.id));
    if (!nextLesson) {
      // All done, go to first lesson for review (skip learn phase on replay)
      navigate(`/lesson/${realm.unitId}/1`);
      return;
    }
    // Show unit intro if first time entering
    if (!hasSeenUnitIntro(realm.unitId)) {
      navigate(`/unit-intro/${realm.unitId}`);
    } else {
      navigate(`/lesson/${realm.unitId}/${nextLesson.id}/learn`);
    }
  };

  const selectedRealm = REALMS.find(r => r.unitId === selected);

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 100,
      background: 'linear-gradient(180deg, #040810 0%, #080e18 50%, #040810 100%)',
      fontFamily: "'Exo 2', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <MapStars />

      {/* Header */}
      <div style={{ padding: '24px 20px 16px', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 6 }}>
          {t('map.subtitle')}
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white', margin: 0 }}>{t('map.title')}</h1>
        {player.name && (
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 600, margin: '4px 0 0' }}>
            {REALMS.find(r => !isUnitComplete(r.unitId) && isUnitUnlocked(r.unitId))
              ? `Recover the Fragment of ${UNIT_INTROS[REALMS.find(r => !isUnitComplete(r.unitId) && isUnitUnlocked(r.unitId))?.unitId]?.fragmentName || '...'}`
              : 'All fragments recovered — the Codex awakens!'}
          </p>
        )}
      </div>

      {/* Realm path */}
      <div style={{ padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {REALMS.map((realm, idx) => {
          const unlocked = isUnitUnlocked(realm.unitId);
          const complete = isUnitComplete(realm.unitId);
          const prog     = getUnitProgress(realm.unitId);
          const isActive = unlocked && !complete;
          const isSel    = selected === realm.unitId;

          return (
            <div key={realm.unitId}>
              {/* Connector line */}
              {idx > 0 && (
                <div style={{
                  height: 32, width: 2, margin: '0 auto',
                  background: isUnitComplete(realm.unitId - 1)
                    ? `linear-gradient(180deg, ${REALMS[idx-1].color}, ${realm.color})`
                    : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.6s ease',
                  position: 'relative', left: '-20px',
                }}>
                  {isUnitComplete(realm.unitId - 1) && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%,-50%)',
                      fontSize: 10, color: 'rgba(255,255,255,0.5)',
                    }}>▼</div>
                  )}
                </div>
              )}

              {/* Realm card */}
              <div
                onClick={() => {
                  if (!unlocked) return;
                  sounds.select();
                  setSelected(isSel ? null : realm.unitId);
                }}
                style={{
                  background: complete
                    ? `${realm.bg}, rgba(0,0,0,0.3)`
                    : unlocked
                      ? realm.bg
                      : 'linear-gradient(135deg, #0a0a0a, #111)',
                  border: `2px solid ${complete ? realm.color : unlocked ? `${realm.color}60` : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 20, padding: '16px',
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  opacity: unlocked ? 1 : 0.45,
                  boxShadow: isActive ? `0 0 24px ${realm.color}40` : complete ? `0 0 12px ${realm.color}25` : 'none',
                  transform: isSel ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.25s cubic-bezier(.4,2,.6,1)',
                  position: 'relative', overflow: 'hidden',
                  marginBottom: 0,
                }}
              >
                {/* Active pulse border */}
                {isActive && (
                  <div style={{
                    position: 'absolute', inset: -2, borderRadius: 22,
                    border: `2px solid ${realm.color}`,
                    animation: 'realmPulse 2s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Realm icon */}
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                    background: unlocked ? `${realm.color}20` : 'rgba(255,255,255,0.04)',
                    border: `2px solid ${unlocked ? `${realm.color}50` : 'rgba(255,255,255,0.08)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28,
                    filter: unlocked ? `drop-shadow(0 0 8px ${realm.color}60)` : 'grayscale(1)',
                    animation: isActive ? 'realmIconFloat 3s ease-in-out infinite' : 'none',
                  }}>
                    {complete ? '✅' : unlocked ? realm.emoji : '🔒'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 9, letterSpacing: 1,
                        color: complete ? realm.color : unlocked ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
                      }}>
                        {realm.name}
                      </span>
                      {complete && <span style={{ fontSize: 10, color: realm.color, fontWeight: 900 }}>{t('map.clearedLabel')}</span>}
                      {isActive && (
                        <span style={{
                          fontSize: 9, fontWeight: 900, color: 'white',
                          background: realm.color, borderRadius: 6,
                          padding: '2px 8px',
                          fontFamily: "'Press Start 2P', monospace",
                        }}>{t('map.nowLabel')}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, fontStyle: 'italic', lineHeight: 1.4 }}>
                      {unlocked ? realm.desc : t('map.lockedMsg')}
                    </div>
                    {/* Progress bar */}
                    {unlocked && (
                      <div>
                        <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                          <div style={{
                            background: `linear-gradient(90deg, ${realm.color}, ${realm.border})`,
                            height: '100%', borderRadius: 99,
                            width: `${prog.total ? (prog.done / prog.total) * 100 : 0}%`,
                            transition: 'width 0.6s ease',
                            boxShadow: `0 0 6px ${realm.color}`,
                          }} />
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginTop: 3 }}>
                          {prog.done}/{prog.total} {t('map.lessons')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded panel */}
                {isSel && unlocked && (
                  <div style={{
                    marginTop: 14, paddingTop: 14,
                    borderTop: `1px solid ${realm.color}30`,
                    animation: 'expandIn 0.2s ease-out',
                  }}>
                    <LessonList unitId={realm.unitId} realm={realm} completed={completed} navigate={navigate} hasSeenUnitIntro={hasSeenUnitIntro} />
                    <button
                      onClick={(e) => { e.stopPropagation(); enterRealm(realm); }}
                      style={{
                        marginTop: 12, width: '100%', padding: '13px',
                        background: `linear-gradient(135deg, ${realm.color}, ${realm.border})`,
                        color: 'white', borderRadius: 14,
                        fontFamily: "'Press Start 2P', monospace",
                        fontSize: 10, letterSpacing: 1,
                        boxShadow: `0 4px 0 ${realm.border}, 0 0 20px ${realm.color}50`,
                        cursor: 'pointer',
                      }}
                    >
                      {complete ? t('map.replayBtn') : !hasSeenUnitIntro(realm.unitId) ? t('map.enterBtn') : t('map.continueBtn')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* All complete banner */}
        {REALMS.every(r => isUnitComplete(r.unitId)) && (
          <div style={{
            marginTop: 24, padding: '20px',
            background: 'linear-gradient(135deg, rgba(88,204,2,0.1), rgba(250,204,21,0.1))',
            border: '2px solid rgba(250,204,21,0.4)',
            borderRadius: 20, textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#facc15', letterSpacing: 2, marginBottom: 8 }}>
              {t('map.allSaved')}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontStyle: 'italic', margin: 0 }}>
              {t('map.allSavedMsg')}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes realmPulse { 0%,100%{opacity:0.6;transform:scale(1)} 50%{opacity:1;transform:scale(1.002)} }
        @keyframes realmIconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes expandIn { 0%{opacity:0;transform:translateY(-6px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes mapTwinkle { 0%,100%{opacity:.08} 50%{opacity:.4} }
      `}</style>
    </div>
  );
}

function LessonList({ unitId, realm, completed, navigate, hasSeenUnitIntro }) {
  const unit = UNITS.find(u => u.id === unitId);
  if (!unit) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {unit.lessons.map((lesson, i) => {
        const done = completed.some(c => c.unit_id === unitId && c.lesson_id === lesson.id);
        const prevDone = i === 0 || completed.some(c => c.unit_id === unitId && c.lesson_id === unit.lessons[i-1].id);
        const locked = !prevDone;
        return (
          <div
            key={lesson.id}
            onClick={(e) => {
              e.stopPropagation();
              if (locked) return;
              sounds.select();
              if (!hasSeenUnitIntro(unitId)) {
                navigate(`/unit-intro/${unitId}`);
              } else {
                navigate(`/lesson/${unitId}/${lesson.id}/learn`);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 12,
              background: done ? `${realm.color}15` : locked ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${done ? `${realm.color}40` : 'rgba(255,255,255,0.07)'}`,
              cursor: locked ? 'not-allowed' : 'pointer',
              opacity: locked ? 0.4 : 1,
            }}
          >
            <span style={{ fontSize: 16 }}>{done ? '✅' : locked ? '🔒' : lesson.icon}</span>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: done ? realm.color : 'rgba(255,255,255,0.75)' }}>
                {lesson.title}
              </span>
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>
                +{lesson.xpReward} XP
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MapStars() {
  const stars = Array.from({ length: 35 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3) % 100),
    size: 1 + (i % 2), dur: 3 + (i % 3), del: (i * 0.2) % 4,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          animation: `mapTwinkle ${s.dur}s ${s.del}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}
