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

// Wide x-spread prevents label overlap: left=90, right=278, center=183
const REALMS = [
  { id: 1, x: 90,  y: 370, emoji: '🌿', color: '#58CC02', terrain: '#1a3a0a' },
  { id: 2, x: 278, y: 295, emoji: '🏛️', color: '#1CB0F6', terrain: '#051828' },
  { id: 3, x: 90,  y: 218, emoji: '🌀', color: '#FF9600', terrain: '#2a1500' },
  { id: 4, x: 278, y: 133, emoji: '🏰', color: '#CE82FF', terrain: '#180030' },
  { id: 5, x: 183, y: 53,  emoji: '🔥', color: '#FF4B4B', terrain: '#300000' },
];

const CONTINENT = 'M60,420 L20,370 L8,300 L18,240 L10,180 L30,120 L55,70 L90,30 L140,12 L200,8 L255,18 L310,40 L345,80 L368,130 L372,190 L360,250 L348,310 L330,360 L310,400 L270,430 L200,440 L130,438 L80,430 Z';

const ARC_R = 22;
const ARC_C = 2 * Math.PI * ARC_R;

function splitRealmName(name) {
  if (!name || name.length <= 13) return [name || '', null];
  const mid = Math.floor(name.length / 2);
  let sp = -1;
  for (let d = 0; d <= mid; d++) {
    if (mid - d >= 0 && name[mid - d] === ' ') { sp = mid - d; break; }
    if (mid + d < name.length && name[mid + d] === ' ') { sp = mid + d; break; }
  }
  if (sp === -1) return [name.slice(0, 13), name.slice(13)];
  return [name.slice(0, sp), name.slice(sp + 1)];
}

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
    const unit  = UNITS.find(u => u.id === uid);
    const total = unit?.lessons.length || 0;
    const done  = completed.filter(c => c.unit_id === uid).length;
    return { done, total, pct: total ? done / total : 0 };
  };

  const isUnitComplete  = (uid) => {
    const unit = UNITS.find(u => u.id === uid);
    return !!unit?.lessons.every(l => completed.some(c => c.unit_id === uid && c.lesson_id === l.id));
  };
  const isUnitUnlocked  = (uid) => uid === 1 || isUnitComplete(uid - 1);

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

  const activeRealm  = REALMS.find(r => r.id === Math.min(activeUnitId, 5)) || REALMS[4];
  const lActiveIntro = UNIT_INTROS[Math.min(activeUnitId, 5)]
    ? locIntro(Math.min(activeUnitId, 5), UNIT_INTROS[Math.min(activeUnitId, 5)])
    : null;

  const pathPairs = REALMS.slice(0, -1).map((r, i) => ({
    from: r, to: REALMS[i + 1], unlocked: isUnitComplete(i + 1),
  }));

  const selRealm    = REALMS.find(r => r.id === selected);
  const selIntro    = selRealm && UNIT_INTROS[selRealm.id] ? locIntro(selRealm.id, UNIT_INTROS[selRealm.id]) : null;
  const selUnlocked = selRealm ? isUnitUnlocked(selRealm.id) : false;
  const selComplete = selRealm ? isUnitComplete(selRealm.id) : false;
  const selProg     = selRealm ? realmProgress(selRealm.id) : null;

  const xpCurrent = user ? user.xp % 100 : 0;
  const completedRealms = UNITS.filter(u => isUnitComplete(u.id)).length;

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 90,
      background: 'linear-gradient(180deg, #040810 0%, #080e18 100%)',
      fontFamily: "'Exo 2', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      <MapStars />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '14px 16px 0', position: 'relative', zIndex: 1 }}>

        {/* ── Header with styled PYTHORIA logo ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, letterSpacing: 4, lineHeight: 1.3 }}>
              <span style={{ color: '#58CC02', textShadow: '0 0 14px #58CC0270' }}>PY</span>
              <span style={{ color: 'rgba(255,255,255,0.92)' }}>TH</span>
              <span style={{ color: '#1CB0F6', textShadow: '0 0 14px #1CB0F670' }}>OR</span>
              <span style={{ color: 'rgba(255,255,255,0.92)' }}>IA</span>
              <span style={{ fontSize: 11, marginLeft: 7 }}>🐉</span>
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.25)', letterSpacing: 3, marginTop: 3 }}>
              {t('map.subtitle')}
            </div>
          </div>
          <HeroAvatar cls={cls} size={38} />
        </div>

        {/* ── HUD strip ────────────────────────────────────────────────────── */}
        {user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0, marginBottom: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14, padding: '9px 14px',
          }}>
            {/* Hearts */}
            <div style={{ display: 'flex', gap: 3, alignItems: 'center', flexShrink: 0 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} style={{
                  fontSize: 11,
                  opacity: i < user.hearts ? 1 : 0.18,
                  filter: i < user.hearts ? 'drop-shadow(0 0 3px #FF4B4B)' : 'none',
                }}>❤️</div>
              ))}
            </div>

            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', height: 20, margin: '0 12px', flexShrink: 0 }} />

            {/* Level + XP bar */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: '#facc15' }}>
                  {t('home.stats.level')} {user.level}
                </span>
                <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: 'rgba(255,255,255,0.25)' }}>
                  {xpCurrent}/100 XP
                </span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #facc15, #f59e0b)',
                  height: '100%', borderRadius: 99,
                  width: `${xpCurrent}%`, transition: 'width 0.8s ease',
                }} />
              </div>
            </div>

            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', height: 20, margin: '0 12px', flexShrink: 0 }} />

            {/* Battle count */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#58CC02', lineHeight: 1 }}>
                {completed.length}<span style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)' }}>/{totalLessons}</span>
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: 'rgba(255,255,255,0.25)', marginTop: 3, letterSpacing: 1 }}>
                ⚔️ {t('map.battlesLabel')}
              </div>
            </div>
          </div>
        )}

        {/* ── Codex Fragment Meter ─────────────────────────────────────────── */}
        <div style={{
          marginBottom: 10, padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
              🐉 {t('map.codex')}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: 'rgba(255,255,255,0.22)' }}>
              {completedRealms}/5
            </div>
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {REALMS.map((realm) => {
              const done  = isUnitComplete(realm.id);
              const isAct = !allComplete && realm.id === Math.min(activeUnitId, 5);
              const unlk  = isUnitUnlocked(realm.id);
              return (
                <div key={realm.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: '100%', height: 7, borderRadius: 99,
                    background: done ? realm.color : isAct ? `${realm.color}35` : 'rgba(255,255,255,0.05)',
                    boxShadow: done ? `0 0 10px ${realm.color}70` : isAct ? `0 0 6px ${realm.color}40` : 'none',
                    transition: 'all 0.5s ease',
                    border: `1px solid ${done ? realm.color : unlk ? `${realm.color}30` : 'rgba(255,255,255,0.06)'}`,
                  }} />
                  <div style={{ fontSize: 7, opacity: done ? 1 : isAct ? 0.6 : 0.2 }}>{realm.emoji}</div>
                </div>
              );
            })}
          </div>
        </div>

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
              <radialGradient id="wg1" cx="90" cy="370" r="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1a4a08" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0a2004" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg2" cx="278" cy="295" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#051828" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020a14" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg3" cx="90" cy="218" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a1800" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#140c00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg4" cx="278" cy="133" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#200040" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0d0018" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="wg5" cx="183" cy="53" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#300000" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#180000" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="380" height="448" fill="url(#wocean)" />
            <path d={CONTINENT} fill="#0d1a08" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d={CONTINENT} fill="url(#wg1)" />
            <path d={CONTINENT} fill="url(#wg2)" />
            <path d={CONTINENT} fill="url(#wg3)" />
            <path d={CONTINENT} fill="url(#wg4)" />
            <path d={CONTINENT} fill="url(#wg5)" />

            {/* Terrain lines */}
            {['M40,380 Q100,350 160,360 Q220,370 280,345','M25,320 Q80,295 140,305 Q200,315 260,285 Q310,265 355,280',
              'M18,255 Q65,235 125,248 Q185,260 245,230 Q295,210 350,220','M22,190 Q70,172 130,185 Q188,198 248,168 Q300,148 355,162',
              'M32,130 Q82,112 140,125 Q196,138 255,108 Q308,88 358,102','M50,75 Q98,58 155,70 Q210,82 268,55 Q316,35 360,48',
            ].map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}

            {/* Mountain decorations near realm 4 */}
            <g opacity="0.4">
              {[[270,155],[255,163],[285,161],[262,148],[290,151]].map(([x,y],i) => (
                <polygon key={i} points={`${x},${y} ${x-6},${y+11} ${x+6},${y+11}`}
                  fill={`rgba(150,100,220,${0.2+i*0.06})`} stroke="rgba(180,130,255,0.3)" strokeWidth="0.5" />
              ))}
            </g>
            {/* Tree decorations near realm 3 */}
            <g opacity="0.45">
              {[[76,237],[90,241],[66,231],[103,228],[80,225]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={`rgba(80,120,20,${0.4+i*0.05})`} />
                  <line x1={x} y1={y+4} x2={x} y2={y+8} stroke="rgba(60,30,10,0.6)" strokeWidth="1.5" />
                </g>
              ))}
            </g>
            {/* Marsh decorations near realm 1 */}
            <g opacity="0.5">
              {[[68,392],[88,399],[72,408],[100,395]].map(([x,y],i) => (
                <ellipse key={i} cx={x} cy={y} rx={6+i} ry={3} fill="rgba(30,80,20,0.5)" />
              ))}
            </g>

            {/* Shore waves */}
            {['M2,200 Q15,195 28,200','M355,280 Q365,275 375,280','M2,300 Q12,295 22,300'].map((d,i)=>(
              <path key={i} d={d} fill="none" stroke="rgba(100,160,220,0.25)" strokeWidth="1.5" />
            ))}

            {/* Winding adventure path through all realms */}
            <polyline
              points="90,370 140,348 188,326 234,310 278,295 252,275 212,260 154,242 90,218 118,200 155,182 196,164 244,148 278,133 258,110 230,90 206,72 183,53"
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"
              strokeDasharray="6,5" strokeLinecap="round"
            />
            {/* Progress-colored segment lines between realms */}
            {pathPairs.map((seg, i) => (
              <line key={i}
                x1={REALMS[i].x} y1={REALMS[i].y} x2={REALMS[i+1].x} y2={REALMS[i+1].y}
                stroke={seg.unlocked ? REALMS[i].color : 'rgba(255,255,255,0.08)'}
                strokeWidth={seg.unlocked ? 2.5 : 1.5}
                strokeDasharray={seg.unlocked ? '5,4' : '4,6'}
                strokeLinecap="round" opacity={seg.unlocked ? 0.7 : 0.3}
              />
            ))}

            {/* Realm nodes */}
            {REALMS.map((r) => {
              const unlocked  = isUnitUnlocked(r.id);
              const complete  = isUnitComplete(r.id);
              const isActive  = unlocked && !complete;
              const isSel     = selected === r.id;
              const rName     = realmNames[r.id - 1] || '';
              const { done, total, pct } = realmProgress(r.id);
              const arcLen    = pct * ARC_C;
              const [l1, l2]  = splitRealmName(rName);
              const labelFill = complete ? r.color : unlocked ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.2)';
              const labelY    = r.y + 27;
              const dotsY     = labelY + (l2 ? 22 : 12);

              // Per-lesson dots for this realm
              const unit = UNITS.find(u => u.id === r.id);
              const lessonDots = unit ? unit.lessons.map((l, idx) => {
                const isDone = completed.some(c => c.unit_id === r.id && c.lesson_id === l.id);
                const isNext = !isDone && idx === done;
                const n = unit.lessons.length;
                const spacing = Math.min(9, 60 / Math.max(n, 1));
                const startX = r.x - ((n - 1) * spacing) / 2;
                return (
                  <circle key={l.id}
                    cx={startX + idx * spacing} cy={dotsY}
                    r={3}
                    fill={isDone ? r.color : 'rgba(255,255,255,0.07)'}
                    stroke={isDone ? 'none' : isNext ? `${r.color}90` : `rgba(255,255,255,0.15)`}
                    strokeWidth={isDone ? 0 : 0.8}
                    opacity={unlocked ? (isDone ? 1 : 0.7) : 0.25}
                  />
                );
              }) : [];

              return (
                <g key={r.id} style={{ cursor: unlocked ? 'pointer' : 'default' }}
                  onClick={() => { if (!unlocked) return; sounds.select(); setSelected(isSel ? null : r.id); }}>

                  {/* Glow halo */}
                  {(isActive || complete || isSel) && (
                    <circle cx={r.x} cy={r.y} r={isSel ? 28 : 23}
                      fill={r.color} opacity={isSel ? 0.28 : isActive ? 0.18 : 0.1} />
                  )}
                  {/* Pulsing ring for active realm */}
                  {isActive && !isSel && (
                    <circle cx={r.x} cy={r.y} r={26}
                      fill="none" stroke={r.color} strokeWidth={1.5}
                      opacity={0.6}
                      style={{ animation: 'activeRingPulse 2s ease-in-out infinite' }}
                    />
                  )}

                  {/* Progress arc track */}
                  {unlocked && (
                    <circle cx={r.x} cy={r.y} r={ARC_R}
                      fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={2.5} />
                  )}
                  {/* Progress arc fill */}
                  {unlocked && done > 0 && (
                    <circle cx={r.x} cy={r.y} r={ARC_R}
                      fill="none" stroke={r.color} strokeWidth={2.5}
                      strokeDasharray={`${arcLen} ${ARC_C - arcLen}`}
                      strokeLinecap="round"
                      opacity={complete ? 0.9 : 0.65}
                      transform={`rotate(-90, ${r.x}, ${r.y})`}
                    />
                  )}

                  {/* Realm circle */}
                  <circle cx={r.x} cy={r.y} r={16}
                    fill={complete ? r.color : unlocked ? `${r.color}30` : '#0d0d18'}
                    stroke={isSel ? 'white' : complete ? r.color : unlocked ? `${r.color}80` : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isSel ? 2.5 : isActive ? 2.5 : 1.5}
                    opacity={unlocked ? 1 : 0.4}
                  />
                  <text x={r.x} y={r.y+6} textAnchor="middle" fontSize={unlocked ? 16 : 13}
                    opacity={unlocked ? 1 : 0.3} style={{ userSelect: 'none' }}>
                    {complete ? '✅' : unlocked ? r.emoji : '🔒'}
                  </text>

                  {/* Realm name — each column has distinct x, guaranteed no overlap */}
                  <text x={r.x} y={labelY} textAnchor="middle"
                    fontSize="6" fontFamily="'Press Start 2P', monospace"
                    fill={labelFill} style={{ userSelect: 'none' }}>
                    <tspan x={r.x}>{l1}</tspan>
                    {l2 && <tspan x={r.x} dy="10">{l2}</tspan>}
                  </text>

                  {/* Per-lesson mission bullets */}
                  {lessonDots}

                  {/* NOW badge on active realm */}
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

            {/* Gio (player character) on active realm */}
            {!allComplete && (
              <g style={{ animation: 'heroMapFloat 2.5s ease-in-out infinite' }}>
                <ellipse cx={activeRealm.x} cy={activeRealm.y - 32} rx={13} ry={4}
                  fill={cls.color} opacity={0.18} />
                <MapHeroFigure x={activeRealm.x} y={activeRealm.y - 58} color={cls.color} scale={1.4} />
                <rect x={activeRealm.x - 14} y={activeRealm.y - 88} width={28} height={11} rx={3}
                  fill={cls.color} opacity={0.9} />
                <text x={activeRealm.x} y={activeRealm.y - 80} textAnchor="middle"
                  fontSize="5.5" fontFamily="'Press Start 2P', monospace" fill="#000"
                  style={{ userSelect: 'none' }}>{player.name || 'GIO'}</text>
              </g>
            )}
            {allComplete && (
              <text x="190" y="228" textAnchor="middle" fontSize="40" style={{ userSelect: 'none' }}>🏆</text>
            )}

            {/* Compass */}
            <text x="360" y="430" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace"
              fill="rgba(255,255,255,0.25)" style={{ userSelect: 'none' }}>N</text>
            <text x="375" y="445" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace"
              fill="rgba(255,255,255,0.15)" style={{ userSelect: 'none' }}>E</text>
            <text x="345" y="445" textAnchor="middle" fontSize="6" fontFamily="'Press Start 2P', monospace"
              fill="rgba(255,255,255,0.15)" style={{ userSelect: 'none' }}>W</text>
          </svg>

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

        {/* ── Active Quest CTA ─────────────────────────────────────────────── */}
        {!allComplete && activeUnitId <= UNITS.length && !selected && (
          <div style={{
            background: `linear-gradient(135deg, ${activeRealm.terrain}f0, ${activeRealm.color}18)`,
            border: `1px solid ${activeRealm.color}50`,
            borderRadius: 20, padding: '14px 16px', marginBottom: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 20,
              border: `1px solid ${activeRealm.color}60`,
              animation: 'ctaBorder 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                fontSize: 28, flexShrink: 0,
                filter: `drop-shadow(0 0 10px ${activeRealm.color}80)`,
                animation: 'iconFloat 3s ease-in-out infinite',
              }}>{activeRealm.emoji}</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: activeRealm.color, letterSpacing: 2, marginBottom: 3 }}>
                  {t('home.activeQuest')}
                </div>
                <div style={{ fontSize: 15, fontWeight: 900, color: 'white', marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {realmNames[activeUnitId - 1]}
                </div>
                {lActiveIntro && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                    {t('home.recoverFragment', { fragment: lActiveIntro.fragmentName })}
                  </div>
                )}
              </div>

              <div style={{ flexShrink: 0, animation: 'heroMapFloat 2.5s ease-in-out infinite' }}>
                <HeroAvatar cls={cls} size={42} animate={false} />
              </div>

              {(() => { const { done, total } = realmProgress(activeUnitId); return (
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: activeRealm.color }}>
                    {done}<span style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)' }}>/{total}</span>
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>
                    {t('map.lessons')}
                  </div>
                </div>
              ); })()}
            </div>

            <button
              onClick={() => enterRealm(activeUnitId)}
              style={{
                width: '100%', padding: '14px',
                background: `linear-gradient(135deg, ${activeRealm.color}, ${activeRealm.color}cc)`,
                color: 'white', borderRadius: 14, border: 'none',
                fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5,
                boxShadow: `0 5px 0 ${activeRealm.color}55, 0 0 20px ${activeRealm.color}35`,
                cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s',
              }}
              onMouseDown={e => { e.currentTarget.style.transform='translateY(2px)'; e.currentTarget.style.boxShadow=`0 3px 0 ${activeRealm.color}55, 0 0 16px ${activeRealm.color}35`; }}
              onMouseUp={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=`0 5px 0 ${activeRealm.color}55, 0 0 20px ${activeRealm.color}35`; }}
            >
              {t('home.enterBattle')}
            </button>
          </div>
        )}

        {/* ── Selected realm detail panel ───────────────────────────────────── */}
        {selRealm && (
          <div style={{
            background: `linear-gradient(135deg, ${selRealm.terrain}ee, ${selRealm.color}12)`,
            border: `1px solid ${selRealm.color}40`,
            borderRadius: 20, padding: '14px 16px', marginBottom: 12,
            animation: 'panelIn 0.2s ease-out',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: selUnlocked && selProg ? 10 : 0 }}>
              <span style={{ fontSize: 24, filter: `drop-shadow(0 0 8px ${selRealm.color}80)` }}>
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

            {selUnlocked && selProg && (() => {
              const selUnit = UNITS.find(u => u.id === selRealm.id);
              return (
                <div style={{ marginBottom: 12 }}>
                  {/* Per-lesson progress tiles in panel */}
                  {selUnit && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
                      {selUnit.lessons.map((l, idx) => {
                        const isDone = completed.some(c => c.unit_id === selRealm.id && c.lesson_id === l.id);
                        const isNext = !isDone && idx === selProg.done;
                        return (
                          <div key={l.id} style={{
                            width: 34, height: 34, borderRadius: 9,
                            background: isDone ? `${selRealm.color}25` : isNext ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                            border: `1.5px solid ${isDone ? selRealm.color : isNext ? `${selRealm.color}60` : 'rgba(255,255,255,0.1)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: isDone ? 14 : 8,
                            fontFamily: "'Press Start 2P', monospace",
                            color: isDone ? selRealm.color : isNext ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                            boxShadow: isDone ? `0 0 6px ${selRealm.color}50` : 'none',
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                          }}>
                            {isDone ? '✓' : l.id}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Progress bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.35)' }}>
                      {selProg.done}/{selProg.total} {t('map.lessons')}
                    </div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: selRealm.color }}>
                      {Math.round(selProg.pct * 100)}%
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 99, height: 5, overflow: 'hidden' }}>
                    <div style={{
                      background: `linear-gradient(90deg, ${selRealm.color}, ${selRealm.color}cc)`,
                      height: '100%', borderRadius: 99,
                      width: `${selProg.pct * 100}%`, transition: 'width 0.6s ease',
                      boxShadow: selProg.done > 0 ? `0 0 6px ${selRealm.color}80` : 'none',
                    }} />
                  </div>
                </div>
              );
            })()}

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
        @keyframes heroMapFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes activeRingPulse { 0%,100%{r:26;opacity:0.6} 50%{r:30;opacity:0.15} }
        @keyframes panelIn         { 0%{opacity:0;transform:translateY(-6px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes mapStarTwinkle  { 0%,100%{opacity:.05} 50%{opacity:.28} }
        @keyframes ctaBorder       { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes iconFloat       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
      `}</style>
    </div>
  );
}

function MapHeroFigure({ x, y, color, scale = 1 }) {
  const s = (22 / 20) * scale;
  return (
    <g transform={`translate(${x - 10 * s}, ${y - 20 * s}) scale(${s})`}>
      <ellipse cx="10" cy="40" rx="7" ry="2.5" fill="rgba(0,0,0,0.4)" />
      <path d="M4,18 Q2,28 3,38 Q10,42 17,38 Q18,28 16,18 Z" fill={color} opacity="0.85" />
      <path d="M6,20 Q5,30 6,37 Q10,40 14,37 Q15,30 14,20 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M4,18 Q5,8 10,6 Q15,8 16,18 Q13,14 10,14 Q7,14 4,18 Z" fill={color} opacity="0.95" />
      {/* Warm face */}
      <circle cx="10" cy="15.2" r="3.8" fill="#FFDAB3" />
      {/* Blush */}
      <ellipse cx="7.2" cy="16.3" rx="1.0" ry="0.6" fill="rgba(255,140,130,0.4)" />
      <ellipse cx="12.8" cy="16.3" rx="1.0" ry="0.6" fill="rgba(255,140,130,0.4)" />
      {/* Eyebrows */}
      <path d="M7.2,12.9 Q8.2,12.3 9.1,12.8" fill="none" stroke="rgba(100,60,20,0.75)" strokeWidth="0.42" strokeLinecap="round" />
      <path d="M10.9,12.8 Q11.8,12.3 12.8,12.9" fill="none" stroke="rgba(100,60,20,0.75)" strokeWidth="0.42" strokeLinecap="round" />
      {/* Left eye */}
      <circle cx="8.3" cy="14.6" r="1.2" fill="white" />
      <circle cx="8.3" cy="14.6" r="0.82" fill="#6B8FCC" />
      <circle cx="8.3" cy="14.6" r="0.5" fill="#1A1040" />
      <circle cx="8.65" cy="14.15" r="0.28" fill="white" />
      {/* Right eye */}
      <circle cx="11.7" cy="14.6" r="1.2" fill="white" />
      <circle cx="11.7" cy="14.6" r="0.82" fill="#6B8FCC" />
      <circle cx="11.7" cy="14.6" r="0.5" fill="#1A1040" />
      <circle cx="12.05" cy="14.15" r="0.28" fill="white" />
      {/* Smile */}
      <path d="M8.5,17.2 Q10,18.5 11.5,17.2" fill="none" stroke="rgba(170,75,55,0.85)" strokeWidth="0.48" strokeLinecap="round" />
      <path d="M9.1,17.5 Q10,18.1 10.9,17.5 Q10,17.85 9.1,17.5 Z" fill="rgba(255,255,255,0.9)" />
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
