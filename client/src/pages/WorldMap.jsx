import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UNITS } from '../data/curriculum.js';
import { UNIT_INTROS, CLASSES } from '../data/story.js';
import { useProgress } from '../hooks/useProgress.js';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';
import { locIntro } from '../utils/loc.js';
import { HeroAvatar } from './Home.jsx';

const REALMS = [
  { id: 1, x: 82,  y: 340, emoji: '🌿', color: '#58CC02', terrain: '#1a3a0a' },
  { id: 2, x: 252, y: 282, emoji: '🏛️', color: '#1CB0F6', terrain: '#051828' },
  { id: 3, x: 130, y: 205, emoji: '🌀', color: '#FF9600', terrain: '#2a1500' },
  { id: 4, x: 265, y: 120, emoji: '🏰', color: '#CE82FF', terrain: '#180030' },
  { id: 5, x: 160, y:  48, emoji: '🔥', color: '#FF4B4B', terrain: '#300000' },
];

const CONTINENT = 'M60,420 L20,370 L8,300 L18,240 L10,180 L30,120 L55,70 L90,30 L140,12 L200,8 L255,18 L310,40 L345,80 L368,130 L372,190 L360,250 L348,310 L330,360 L310,400 L270,430 L200,440 L130,438 L80,430 Z';

const ARC_R = 22;
const ARC_C = 2 * Math.PI * ARC_R;

export default function WorldMap() {
  const navigate  = useNavigate();
  const { user, completed } = useProgress();
  const { getPlayer, hasSeenUnitIntro } = useStory();
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);

  const player = getPlayer();
  const cls    = CLASSES.find(c => c.id === player.classId) || CLASSES[0];
  const realmNames = t('home.realmNames', { returnObjects: true });

  const totalLessons = UNITS.reduce((sum, u) => sum + u.lessons.length, 0);

  const realmProgress = (uid) => {
    const unit = UNITS.find(u => u.id === uid);
    const total = unit?.lessons.length || 0;
    const done  = completed.filter(c => c.unit_id === uid).length;
    return { done, total, pct: total ? done / total : 0 };
  };

  const isUnitComplete = (uid) => {
    const unit = UNITS.find(u => u.id === uid);
    return !!unit?.lessons.every(l => completed.some(c => c.unit_id === uid && c.lesson_id === l.id));
  };
  const isUnitUnlocked = (uid) => uid === 1 || isUnitComplete(uid - 1);

  let activeUnitId = 1;
  for (const unit of UNITS) {
    if (!isUnitComplete(unit.id)) { activeUnitId = unit.id; break; }
    activeUnitId = unit.id + 1;
  }
  const allComplete = activeUnitId > UNITS.length;

  const enterRealm = (uid) => {
    sounds.click();
    const unit = UNITS.find(u => u.id === uid);
    const next = unit.lessons.find(l => !completed.some(c => c.unit_id === uid && c.lesson_id === l.id));
    if (!next) { navigate(`/lesson/${uid}/1`); return; }
    navigate(hasSeenUnitIntro(uid) ? `/lesson/${uid}/${next.id}/learn` : `/unit-intro/${uid}`);
  };

  const activeRealm = REALMS.find(r => r.id === Math.min(activeUnitId, 5)) || REALMS[4];

  const pathPairs = REALMS.slice(0, -1).map((r, i) => ({
    from: r, to: REALMS[i + 1], unlocked: isUnitComplete(i + 1),
  }));

  const selRealm    = REALMS.find(r => r.id === selected);
  const selIntro    = selRealm && UNIT_INTROS[selRealm.id] ? locIntro(selRealm.id, UNIT_INTROS[selRealm.id]) : null;
  const selUnlocked = selRealm ? isUnitUnlocked(selRealm.id) : false;
  const selComplete = selRealm ? isUnitComplete(selRealm.id) : false;
  const selProg     = selRealm ? realmProgress(selRealm.id) : null;

  const xpCurrent = user ? user.xp % 100 : 0;
  const totalDone  = completed.length;

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 90,
      background: 'linear-gradient(180deg, #040810 0%, #080e18 100%)',
      fontFamily: "'Exo 2', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <MapStars />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '14px 16px', position: 'relative', zIndex: 1 }}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: 'rgba(255,255,255,0.85)', letterSpacing: 4 }}>
              {t('map.title').toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.25)', letterSpacing: 3, marginTop: 3 }}>
              {t('map.subtitle')}
            </div>
          </div>
          <HeroAvatar cls={cls} size={38} />
        </div>

        {/* ── Stats Strip ──────────────────────────────────────────────────── */}
        {user && (
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>

            {/* Hearts */}
            <div style={{
              flex: 1, background: 'rgba(255,75,75,0.08)',
              border: '1px solid rgba(255,75,75,0.18)',
              borderRadius: 12, padding: '8px 10px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,75,75,0.6)', letterSpacing: 1, marginBottom: 6 }}>
                {t('home.stats.hearts')}
              </div>
              <div style={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: i < user.hearts ? '#FF4B4B' : 'rgba(255,255,255,0.1)',
                    boxShadow: i < user.hearts ? '0 0 5px #FF4B4B88' : 'none',
                    transition: 'all 0.3s',
                  }} />
                ))}
              </div>
            </div>

            {/* Level + XP */}
            <div style={{
              flex: 1.7, background: 'rgba(250,204,21,0.07)',
              border: '1px solid rgba(250,204,21,0.18)',
              borderRadius: 12, padding: '8px 12px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#facc15', letterSpacing: 1 }}>
                  {t('home.stats.level')} {user.level}
                </div>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: 'rgba(255,255,255,0.25)' }}>
                  {xpCurrent}/100
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #facc15, #f59e0b)',
                  height: '100%', borderRadius: 99,
                  width: `${xpCurrent}%`, transition: 'width 0.8s ease',
                }} />
              </div>
            </div>

            {/* Battles progress */}
            <div style={{
              flex: 1, background: 'rgba(88,204,2,0.07)',
              border: '1px solid rgba(88,204,2,0.18)',
              borderRadius: 12, padding: '8px 10px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(88,204,2,0.6)', letterSpacing: 1, marginBottom: 4 }}>
                {t('map.battlesLabel')}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: '#58CC02', lineHeight: 1 }}>
                {totalDone}
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                /{totalLessons}
              </div>
            </div>
          </div>
        )}

        {/* ── RPG World Map SVG ─────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', borderRadius: 20,
          border: '2px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 0 80px rgba(0,0,30,0.5)',
          background: '#020510',
          marginBottom: 12,
        }}>
          <svg viewBox="0 0 380 448" width="100%" style={{ display: 'block' }}>
            <defs>
              <radialGradient id="wocean" cx="50%" cy="60%" r="70%">
                <stop offset="0%" stopColor="#051428" />
                <stop offset="100%" stopColor="#020810" />
              </radialGradient>
              <radialGradient id="wg1" cx="82" cy="340" r="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1a4a08" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0a2004" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg2" cx="252" cy="282" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#051828" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020a14" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg3" cx="130" cy="205" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a1800" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#140c00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg4" cx="265" cy="120" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#200040" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0d0018" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg5" cx="160" cy="48" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#300000" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#180000" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ocean + continent */}
            <rect width="380" height="448" fill="url(#wocean)" />
            <path d={CONTINENT} fill="#0d1a08" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d={CONTINENT} fill="url(#wg1)" />
            <path d={CONTINENT} fill="url(#wg2)" />
            <path d={CONTINENT} fill="url(#wg3)" />
            <path d={CONTINENT} fill="url(#wg4)" />
            <path d={CONTINENT} fill="url(#wg5)" />

            {/* Topo lines */}
            {['M40,380 Q100,350 160,360 Q220,370 280,345','M25,320 Q80,295 140,305 Q200,315 260,285 Q310,265 355,280',
              'M18,255 Q65,235 125,248 Q185,260 245,230 Q295,210 350,220','M22,190 Q70,172 130,185 Q188,198 248,168 Q300,148 355,162',
              'M32,130 Q82,112 140,125 Q196,138 255,108 Q308,88 358,102','M50,75 Q98,58 155,70 Q210,82 268,55 Q316,35 360,48',
            ].map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}

            {/* Terrain details */}
            <g opacity="0.4">
              {[[270,142],[255,150],[285,148],[262,135],[290,138]].map(([x,y],i) => (
                <polygon key={i} points={`${x},${y} ${x-6},${y+11} ${x+6},${y+11}`}
                  fill={`rgba(150,100,220,${0.2+i*0.06})`} stroke="rgba(180,130,255,0.3)" strokeWidth="0.5" />
              ))}
            </g>
            <g opacity="0.45">
              {[[118,224],[132,228],[108,218],[145,215],[122,212]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={`rgba(80,120,20,${0.4+i*0.05})`} />
                  <line x1={x} y1={y+4} x2={x} y2={y+8} stroke="rgba(60,30,10,0.6)" strokeWidth="1.5" />
                </g>
              ))}
            </g>
            <g opacity="0.5">
              {[[70,355],[90,362],[75,370],[100,358]].map(([x,y],i) => (
                <ellipse key={i} cx={x} cy={y} rx={6+i} ry={3} fill="rgba(30,80,20,0.5)" />
              ))}
            </g>

            {/* Ocean waves */}
            {['M2,200 Q15,195 28,200','M355,280 Q365,275 375,280','M2,300 Q12,295 22,300'].map((d,i)=>(
              <path key={i} d={d} fill="none" stroke="rgba(100,160,220,0.25)" strokeWidth="1.5" />
            ))}

            {/* Paths between realms */}
            <polyline
              points="82,340, 115,315, 148,300, 195,292, 252,282, 225,255, 185,238, 155,220, 130,205, 145,175, 168,152, 198,138, 228,128, 255,120, 235,92, 210,72, 185,58, 160,48"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"
              strokeDasharray="6,5" strokeLinecap="round"
            />
            {pathPairs.map((seg, i) => (
              <line key={i}
                x1={REALMS[i].x} y1={REALMS[i].y} x2={REALMS[i+1].x} y2={REALMS[i+1].y}
                stroke={seg.unlocked ? REALMS[i].color : 'rgba(255,255,255,0.08)'}
                strokeWidth={seg.unlocked ? 2.5 : 1.5}
                strokeDasharray={seg.unlocked ? '5,4' : '4,6'}
                strokeLinecap="round" opacity={seg.unlocked ? 0.7 : 0.3}
              />
            ))}

            {/* Realm markers */}
            {REALMS.map((r) => {
              const unlocked = isUnitUnlocked(r.id);
              const complete = isUnitComplete(r.id);
              const isActive = unlocked && !complete;
              const isSel    = selected === r.id;
              const rName    = realmNames[r.id - 1] || '';
              const { done, total, pct } = realmProgress(r.id);
              const arcLen   = pct * ARC_C;

              return (
                <g key={r.id} style={{ cursor: unlocked ? 'pointer' : 'default' }}
                  onClick={() => { if (!unlocked) return; sounds.select(); setSelected(isSel ? null : r.id); }}>

                  {/* Outer glow */}
                  {(isActive || complete || isSel) && (
                    <circle cx={r.x} cy={r.y} r={isSel ? 28 : 23}
                      fill={r.color} opacity={isSel ? 0.28 : isActive ? 0.18 : 0.1} />
                  )}

                  {/* Progress arc track (background ring) */}
                  {unlocked && (
                    <circle cx={r.x} cy={r.y} r={ARC_R}
                      fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2.5} />
                  )}

                  {/* Progress arc fill */}
                  {unlocked && done > 0 && (
                    <circle cx={r.x} cy={r.y} r={ARC_R}
                      fill="none"
                      stroke={complete ? r.color : r.color}
                      strokeWidth={2.5}
                      strokeDasharray={`${arcLen} ${ARC_C - arcLen}`}
                      strokeLinecap="round"
                      opacity={complete ? 0.9 : 0.65}
                      transform={`rotate(-90, ${r.x}, ${r.y})`}
                    />
                  )}

                  {/* Main circle */}
                  <circle cx={r.x} cy={r.y} r={16}
                    fill={complete ? r.color : unlocked ? `${r.color}30` : '#0d0d18'}
                    stroke={isSel ? 'white' : complete ? r.color : unlocked ? `${r.color}80` : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isSel ? 2.5 : isActive ? 2.5 : 1.5}
                    opacity={unlocked ? 1 : 0.4}
                  />

                  {/* Icon */}
                  <text x={r.x} y={r.y+6} textAnchor="middle" fontSize={unlocked ? 16 : 13}
                    opacity={unlocked ? 1 : 0.3} style={{ userSelect: 'none' }}>
                    {complete ? '✅' : unlocked ? r.emoji : '🔒'}
                  </text>

                  {/* Realm name */}
                  <text x={r.x} y={r.y+31} textAnchor="middle"
                    fontSize="7" fontFamily="'Press Start 2P', monospace"
                    fill={complete ? r.color : unlocked ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.2)'}
                    style={{ userSelect: 'none' }}>
                    {rName.length > 14 ? rName.slice(0,13)+'…' : rName}
                  </text>

                  {/* Lesson progress fraction (unlocked realms only) */}
                  {unlocked && (
                    <text x={r.x} y={r.y+42} textAnchor="middle"
                      fontSize="5.5" fontFamily="'Press Start 2P', monospace"
                      fill={done > 0 ? r.color : 'rgba(255,255,255,0.2)'}
                      opacity={done > 0 ? 0.8 : 0.5}
                      style={{ userSelect: 'none' }}>
                      {done}/{total}
                    </text>
                  )}

                  {/* NOW badge */}
                  {isActive && !isSel && (
                    <g>
                      <rect x={r.x-14} y={r.y-35} width={28} height={12} rx={3} fill={r.color} />
                      <text x={r.x} y={r.y-26} textAnchor="middle"
                        fontSize="6" fontFamily="'Press Start 2P', monospace" fill="#000"
                        style={{ userSelect: 'none' }}>{t('map.nowLabel')}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Hero on active realm */}
            {!allComplete && (
              <g style={{ animation: 'heroMapFloat 2.5s ease-in-out infinite' }}>
                <MapHeroFigure x={activeRealm.x} y={activeRealm.y - 46} color={cls.color} />
              </g>
            )}

            {allComplete && (
              <text x="190" y="228" textAnchor="middle" fontSize="40" style={{ userSelect: 'none' }}>🏆</text>
            )}

            <text x="360" y="430" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace"
              fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>N</text>
          </svg>

          {/* Tap hint */}
          {!selected && (
            <div style={{
              position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
              fontFamily: "'Press Start 2P', monospace", fontSize: 5.5,
              color: 'rgba(255,255,255,0.2)', letterSpacing: 1, whiteSpace: 'nowrap',
            }}>
              {t('map.tapHint')}
            </div>
          )}
        </div>

        {/* ── Selected realm info panel ─────────────────────────────────────── */}
        {selRealm && (
          <div style={{
            background: `linear-gradient(135deg, ${selRealm.terrain}ee, ${selRealm.color}12)`,
            border: `1px solid ${selRealm.color}40`,
            borderRadius: 20, padding: '14px 16px', marginBottom: 12,
            animation: 'panelIn 0.2s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 26, filter: `drop-shadow(0 0 8px ${selRealm.color}80)` }}>
                {selComplete ? '✅' : selUnlocked ? selRealm.emoji : '🔒'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: selRealm.color, letterSpacing: 1.5, marginBottom: 3 }}>
                  {realmNames[selRealm.id - 1]}
                </div>
                {selIntro && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
                    {t('home.recoverFragment', { fragment: selIntro.fragmentName })}
                  </div>
                )}
              </div>
              {selComplete && (
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: selRealm.color }}>
                  {t('map.clearedLabel')}
                </span>
              )}
            </div>

            {/* Lesson progress bar */}
            {selUnlocked && selProg && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.35)' }}>
                    {selProg.done}/{selProg.total} {t('map.lessons')}
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: selRealm.color, opacity: 0.8 }}>
                    {Math.round(selProg.pct * 100)}%
                  </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                  <div style={{
                    background: `linear-gradient(90deg, ${selRealm.color}, ${selRealm.color}cc)`,
                    height: '100%', borderRadius: 99,
                    width: `${selProg.pct * 100}%`,
                    transition: 'width 0.6s ease',
                    boxShadow: selProg.done > 0 ? `0 0 6px ${selRealm.color}80` : 'none',
                  }} />
                </div>
              </div>
            )}

            {selUnlocked ? (
              <button
                onClick={() => enterRealm(selRealm.id)}
                style={{
                  width: '100%', padding: '12px',
                  background: `linear-gradient(135deg, ${selRealm.color}, ${selRealm.color}cc)`,
                  color: 'white', borderRadius: 14, border: 'none',
                  fontFamily: "'Press Start 2P', monospace", fontSize: 9, letterSpacing: 1.2,
                  boxShadow: `0 4px 0 ${selRealm.color}55, 0 0 18px ${selRealm.color}30`,
                  cursor: 'pointer',
                }}
              >
                {selComplete ? t('map.replayBtn') : !hasSeenUnitIntro(selRealm.id) ? t('map.enterBtn') : t('map.continueBtn')}
              </button>
            ) : (
              <div style={{
                fontFamily: "'Press Start 2P', monospace", fontSize: 6,
                color: 'rgba(255,255,255,0.25)', textAlign: 'center', padding: '8px 0',
              }}>
                {t('map.lockedMsg')}
              </div>
            )}
          </div>
        )}

        {/* ── All complete banner ───────────────────────────────────────────── */}
        {allComplete && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(88,204,2,0.08))',
            border: '1px solid rgba(250,204,21,0.3)',
            borderRadius: 20, padding: '20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#facc15', letterSpacing: 2 }}>
              {t('map.allSaved')}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, fontStyle: 'italic', margin: '8px 0 0' }}>
              {t('map.allSavedMsg')}
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes heroMapFloat   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes panelIn        { 0%{opacity:0;transform:translateY(-6px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes mapStarTwinkle { 0%,100%{opacity:.05} 50%{opacity:.28} }
      `}</style>
    </div>
  );
}

function MapHeroFigure({ x, y, color }) {
  const s = 22 / 20;
  return (
    <g transform={`translate(${x - 10 * s}, ${y - 20 * s}) scale(${s})`}>
      <ellipse cx="10" cy="40" rx="7" ry="2.5" fill="rgba(0,0,0,0.4)" />
      <path d="M4,18 Q2,28 3,38 Q10,42 17,38 Q18,28 16,18 Z" fill={color} opacity="0.85" />
      <path d="M6,20 Q5,30 6,37 Q10,40 14,37 Q15,30 14,20 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M4,18 Q5,8 10,6 Q15,8 16,18 Q13,14 10,14 Q7,14 4,18 Z" fill={color} opacity="0.95" />
      <ellipse cx="10" cy="15" rx="4" ry="4" fill="rgba(0,0,0,0.55)" />
      <circle cx="8.5" cy="14.5" r="0.9" fill="white" opacity="0.8" />
      <circle cx="11.5" cy="14.5" r="0.9" fill="white" opacity="0.8" />
      <line x1="16" y1="20" x2="19" y2="35" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <circle cx="19" cy="35" r="1.2" fill={color} opacity="0.8" />
      <path d="M5,20 Q6,30 7,36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </g>
  );
}

function MapStars() {
  const s = Array.from({ length: 32 }, (_, i) => ({
    id: i, x: ((i * 137.5) % 100), y: ((i * 97.3) % 100),
    size: 1 + (i % 2), dur: 3 + (i % 3), del: (i * 0.2) % 4,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {s.map(x => (
        <div key={x.id} style={{
          position: 'absolute', left: `${x.x}%`, top: `${x.y}%`,
          width: x.size, height: x.size, background: 'white', borderRadius: '50%',
          animation: `mapStarTwinkle ${x.dur}s ${x.del}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}
