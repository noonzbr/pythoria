import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProgress } from '../hooks/useProgress.js';
import { useStory } from '../hooks/useStory.js';
import { UNITS } from '../data/curriculum.js';
import { CLASSES, UNIT_INTROS } from '../data/story.js';
import { sounds } from '../utils/sounds.js';
import { locIntro } from '../utils/loc.js';

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

// Realm positions on the 380×440 SVG map (px)
const REALMS = [
  { id: 1, x: 82,  y: 340, emoji: '🌿', color: '#58CC02', glow: '#58CC02', terrain: '#1a3a0a' },
  { id: 2, x: 252, y: 282, emoji: '🏛️', color: '#1CB0F6', glow: '#1CB0F6', terrain: '#051828' },
  { id: 3, x: 130, y: 205, emoji: '🌀', color: '#FF9600', glow: '#FF9600', terrain: '#2a1500' },
  { id: 4, x: 265, y: 120, emoji: '🏰', color: '#CE82FF', glow: '#CE82FF', terrain: '#180030' },
  { id: 5, x: 160, y:  48, emoji: '🔥', color: '#FF4B4B', glow: '#FF4B4B', terrain: '#300000' },
];

// SVG continent outline path
const CONTINENT = 'M60,420 L20,370 L8,300 L18,240 L10,180 L30,120 L55,70 L90,30 L140,12 L200,8 L255,18 L310,40 L345,80 L368,130 L372,190 L360,250 L348,310 L330,360 L310,400 L270,430 L200,440 L130,438 L80,430 Z';

// Winding path through the realms (drawn as SVG polyline)
const PATH_POINTS = [82,340, 115,315, 148,300, 195,292, 252,282, 225,255, 185,238, 155,220, 130,205, 145,175, 168,152, 198,138, 228,128, 255,120, 235,92, 210,72, 185,58, 160,48];

export default function Home() {
  const { user, completed, loading } = useProgress();
  const { getPlayer, resetAll, hasSeenUnitIntro } = useStory();
  const navigate   = useNavigate();
  const { t }      = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  if (loading) return <LoadingScreen t={t} />;

  const player     = getPlayer();
  const cls        = CLASSES.find(c => c.id === player.classId) || CLASSES[0];
  const xpPercent  = ((user.xp % 100) / 100) * 100;
  const realmNames = t('home.realmNames', { returnObjects: true });

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

  const activeRealm   = REALMS.find(r => r.id === Math.min(activeUnitId, 5)) || REALMS[4];
  const lActiveIntro  = UNIT_INTROS[Math.min(activeUnitId, 5)]
    ? locIntro(Math.min(activeUnitId, 5), UNIT_INTROS[Math.min(activeUnitId, 5)])
    : null;

  // Path points up to current active realm (draw only unlocked segments)
  const pathPairs = [];
  for (let i = 0; i < REALMS.length - 1; i++) {
    pathPairs.push({ from: REALMS[i], to: REALMS[i + 1], unlocked: isUnitComplete(i + 1) });
  }

  return (
    <div style={{
      minHeight: '100vh', paddingBottom: 90,
      background: 'linear-gradient(180deg, #040810 0%, #080e18 100%)',
      fontFamily: "'Exo 2', sans-serif",
      opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
      position: 'relative', overflow: 'hidden',
    }}>
      <HomeStars />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 16px', position: 'relative', zIndex: 1 }}>

        {/* ── Hero Header ──────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18,
          padding: '12px 14px', marginBottom: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <HeroAvatar cls={cls} size={44} animate />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5.5, color: cls.color, letterSpacing: 2, marginBottom: 2 }}>
              {cls.name.toUpperCase()}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'white', marginBottom: 4 }}>{player.name}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 99, height: 6, overflow: 'hidden' }}>
                <div style={{
                  background: 'linear-gradient(90deg, #58CC02, #facc15)',
                  height: '100%', width: `${xpPercent}%`, borderRadius: 99,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <span style={{ fontSize: 8, color: '#facc15', fontFamily: "'Press Start 2P', monospace", flexShrink: 0 }}>
                Lv{user.level}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flexShrink: 0, alignItems: 'flex-end' }}>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>❤️ <b style={{ color: '#FF4B4B' }}>{user.hearts}</b></span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>💎 <b style={{ color: '#1CB0F6' }}>{user.gems}</b></span>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>🔥 {user.streak}d</span>
          </div>
        </div>

        {/* ── Map Title ─────────────────────────────────────────────────────── */}
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 13, color: 'rgba(255,255,255,0.85)', letterSpacing: 4 }}>
            {t('map.title').toUpperCase()}
          </div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'rgba(255,255,255,0.25)', letterSpacing: 3, marginTop: 3 }}>
            {t('map.subtitle')}
          </div>
        </div>

        {/* ── RPG World Map ─────────────────────────────────────────────────── */}
        <div style={{
          position: 'relative', borderRadius: 20,
          border: '2px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.7), inset 0 0 80px rgba(0,0,30,0.5)',
          background: '#020510',
          marginBottom: 14,
        }}>
          <svg
            viewBox="0 0 380 448"
            width="100%"
            style={{ display: 'block' }}
          >
            {/* Ocean background */}
            <defs>
              <radialGradient id="ocean" cx="50%" cy="60%" r="70%">
                <stop offset="0%" stopColor="#051428" />
                <stop offset="100%" stopColor="#020810" />
              </radialGradient>
              {/* Terrain zone gradients per realm */}
              <radialGradient id="g1" cx="82" cy="340" r="90" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1a4a08" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0a2004" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g2" cx="252" cy="282" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#051828" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#020a14" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g3" cx="130" cy="205" r="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2a1800" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#140c00" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g4" cx="265" cy="120" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#200040" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0d0018" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="g5" cx="160" cy="48" r="75" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#300000" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#180000" stopOpacity="0" />
              </radialGradient>
              <filter id="fog">
                <feGaussianBlur stdDeviation="6" />
              </filter>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Ocean */}
            <rect width="380" height="448" fill="url(#ocean)" />

            {/* Continent landmass */}
            <path d={CONTINENT} fill="#0d1a08" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Terrain color zones */}
            <path d={CONTINENT} fill="url(#g1)" />
            <path d={CONTINENT} fill="url(#g2)" />
            <path d={CONTINENT} fill="url(#g3)" />
            <path d={CONTINENT} fill="url(#g4)" />
            <path d={CONTINENT} fill="url(#g5)" />

            {/* Topographic texture lines */}
            {[
              'M40,380 Q100,350 160,360 Q220,370 280,345 Q320,330 350,350',
              'M25,320 Q80,295 140,305 Q200,315 260,285 Q310,265 355,280',
              'M18,255 Q65,235 125,248 Q185,260 245,230 Q295,210 350,220',
              'M22,190 Q70,172 130,185 Q188,198 248,168 Q300,148 355,162',
              'M32,130 Q82,112 140,125 Q196,138 255,108 Q308,88 358,102',
              'M50,75 Q98,58 155,70 Q210,82 268,55 Q316,35 360,48',
            ].map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
            ))}

            {/* Mountain ranges near void tower */}
            <g opacity="0.4">
              {[[270,142],[255,150],[285,148],[262,135],[290,138]].map(([x,y],i) => (
                <polygon key={i} points={`${x},${y} ${x-6},${y+11} ${x+6},${y+11}`}
                  fill={`rgba(150,100,220,${0.2 + i*0.06})`} stroke="rgba(180,130,255,0.3)" strokeWidth="0.5" />
              ))}
            </g>

            {/* Forest trees near Endless Forest */}
            <g opacity="0.45">
              {[[118,224],[132,228],[108,218],[145,215],[122,212],[138,220]].map(([x,y],i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill={`rgba(80,120,20,${0.4+i*0.05})`} />
                  <line x1={x} y1={y+4} x2={x} y2={y+8} stroke="rgba(60,30,10,0.6)" strokeWidth="1.5" />
                </g>
              ))}
            </g>

            {/* Swamp puddles near Syntax Swamps */}
            <g opacity="0.5">
              {[[70,355],[90,362],[75,370],[100,358],[65,345]].map(([x,y],i) => (
                <ellipse key={i} cx={x} cy={y} rx={6+i} ry={3} fill="rgba(30,80,20,0.5)" />
              ))}
            </g>

            {/* Ocean waves */}
            {[
              'M2,200 Q15,195 28,200', 'M355,280 Q365,275 375,280',
              'M2,300 Q12,295 22,300', 'M358,150 Q368,145 378,150',
              'M5,100 Q16,95 27,100',
            ].map((d, i) => (
              <path key={i} d={d} fill="none" stroke="rgba(100,160,220,0.25)" strokeWidth="1.5" />
            ))}

            {/* ── PATH between realms ── */}
            {/* Full faded background path */}
            <polyline
              points={PATH_POINTS.join(',')}
              fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3"
              strokeDasharray="6,5" strokeLinecap="round"
            />
            {/* Lit path segments for unlocked realms */}
            {pathPairs.map((seg, i) => (
              <line key={i}
                x1={REALMS[i].x} y1={REALMS[i].y}
                x2={REALMS[i+1].x} y2={REALMS[i+1].y}
                stroke={seg.unlocked ? REALMS[i].color : 'rgba(255,255,255,0.08)'}
                strokeWidth={seg.unlocked ? 2.5 : 1.5}
                strokeDasharray={seg.unlocked ? '5,4' : '4,6'}
                strokeLinecap="round"
                opacity={seg.unlocked ? 0.7 : 0.3}
              />
            ))}

            {/* ── REALM MARKERS ── */}
            {REALMS.map((r) => {
              const unlocked = isUnitUnlocked(r.id);
              const complete = isUnitComplete(r.id);
              const isActive = unlocked && !complete;
              const rName    = realmNames[r.id - 1] || '';

              return (
                <g key={r.id}
                  style={{ cursor: unlocked ? 'pointer' : 'default' }}
                  onClick={() => unlocked && enterRealm(r.id)}
                >
                  {/* Glow halo for active/complete */}
                  {(isActive || complete) && (
                    <circle cx={r.x} cy={r.y} r={22}
                      fill={r.color} opacity={isActive ? 0.2 : 0.1}
                      style={isActive ? { animation: 'mapPulse 2s ease-in-out infinite' } : {}}
                    />
                  )}

                  {/* Marker base circle */}
                  <circle cx={r.x} cy={r.y} r={16}
                    fill={complete ? r.color : unlocked ? `${r.color}30` : '#0d0d18'}
                    stroke={complete ? r.color : unlocked ? `${r.color}80` : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    opacity={unlocked ? 1 : 0.4}
                  />

                  {/* Realm emoji (rendered as foreignObject for emoji support) */}
                  <text x={r.x} y={r.y + 6} textAnchor="middle" fontSize={unlocked ? 16 : 13}
                    opacity={unlocked ? 1 : 0.3}
                    style={{ userSelect: 'none' }}
                  >
                    {complete ? '✅' : unlocked ? r.emoji : '🔒'}
                  </text>

                  {/* Realm name label — split into 2 lines if long */}
                  {(() => {
                    const [l1, l2] = splitRealmName(rName);
                    const fill = complete ? r.color : unlocked ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)';
                    const y1 = l2 ? r.y + 26 : r.y + 30;
                    return (
                      <text x={r.x} y={y1} textAnchor="middle"
                        fontSize="6" fontFamily="'Press Start 2P', monospace"
                        fill={fill} style={{ userSelect: 'none' }}>
                        <tspan x={r.x}>{l1}</tspan>
                        {l2 && <tspan x={r.x} dy="10">{l2}</tspan>}
                      </text>
                    );
                  })()}

                  {/* NOW badge */}
                  {isActive && (
                    <g>
                      <rect x={r.x - 14} y={r.y - 33} width={28} height={12} rx={3}
                        fill={r.color} />
                      <text x={r.x} y={r.y - 24} textAnchor="middle"
                        fontSize="6" fontFamily="'Press Start 2P', monospace" fill="#000"
                        style={{ userSelect: 'none' }}
                      >{t('map.nowLabel')}</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* ── HERO on active realm ── */}
            {!allComplete && (
              <g style={{ animation: 'heroMapFloat 2.5s ease-in-out infinite' }}>
                <HeroSVGFigure
                  x={activeRealm.x}
                  y={activeRealm.y - 44}
                  color={cls.color}
                  size={22}
                />
              </g>
            )}

            {/* ── COMPLETION glow if all done ── */}
            {allComplete && (
              <>
                <circle cx="190" cy="224" r="160" fill="rgba(250,204,21,0.04)" />
                <text x="190" y="228" textAnchor="middle" fontSize="40" style={{ userSelect: 'none' }}>🏆</text>
              </>
            )}

            {/* Map border vignette */}
            <rect width="380" height="448" fill="none"
              stroke="rgba(255,255,255,0.04)" strokeWidth="12" />
          </svg>

          {/* Compass rose */}
          <div style={{
            position: 'absolute', bottom: 12, right: 12,
            width: 36, height: 36, opacity: 0.35,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 0,
          }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: 'white', lineHeight: 1 }}>N</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: 'white' }}>W</div>
              <div style={{ width: 18, height: 18, position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.4)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', top: 1, left: '50%', transform: 'translateX(-50%)', width: 1, height: 8, background: 'rgba(255,100,100,0.7)' }} />
                <div style={{ position: 'absolute', bottom: 1, left: '50%', transform: 'translateX(-50%)', width: 1, height: 8, background: 'rgba(255,255,255,0.4)' }} />
              </div>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: 'white' }}>E</div>
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 5, color: 'white', lineHeight: 1 }}>S</div>
          </div>
        </div>

        {/* ── Active Quest CTA ──────────────────────────────────────────────── */}
        {!allComplete && activeUnitId <= UNITS.length ? (
          <div style={{
            background: `linear-gradient(135deg, ${activeRealm.terrain}ee, ${activeRealm.color}15)`,
            border: `1px solid ${activeRealm.color}40`,
            borderRadius: 20, padding: '14px 16px', marginBottom: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: -1, borderRadius: 20,
              border: `1px solid ${activeRealm.color}50`,
              animation: 'ctaBorder 2.5s ease-in-out infinite',
              pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                fontSize: 28, flexShrink: 0,
                filter: `drop-shadow(0 0 8px ${activeRealm.color}80)`,
                animation: 'iconFloat 3s ease-in-out infinite',
              }}>{activeRealm.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: activeRealm.color, letterSpacing: 2, marginBottom: 3 }}>
                  {t('home.activeQuest')}
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'white', marginBottom: 2 }}>
                  {realmNames[activeUnitId - 1]}
                </div>
                {lActiveIntro && (
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                    {t('home.recoverFragment', { fragment: lActiveIntro.fragmentName })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => enterRealm(activeUnitId)}
              style={{
                width: '100%', padding: '13px', marginTop: 12,
                background: `linear-gradient(135deg, ${activeRealm.color}, ${activeRealm.color}cc)`,
                color: 'white', borderRadius: 14, border: 'none',
                fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5,
                boxShadow: `0 5px 0 ${activeRealm.color}55, 0 0 20px ${activeRealm.color}35`,
                cursor: 'pointer',
              }}
            >
              {t('home.enterBattle')}
            </button>
          </div>
        ) : allComplete ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(250,204,21,0.1), rgba(88,204,2,0.08))',
            border: '1px solid rgba(250,204,21,0.3)',
            borderRadius: 20, padding: '22px', marginBottom: 12, textAlign: 'center',
          }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🏆</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#facc15', letterSpacing: 2 }}>
              {t('home.allSaved')}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 8, fontStyle: 'italic' }}>
              {t('home.allSavedMsg', { name: player.name })}
            </div>
          </div>
        ) : null}

        {/* ── Py Says ──────────────────────────────────────────────────────── */}
        <div style={{
          background: 'rgba(88,204,2,0.04)', border: '1px solid rgba(88,204,2,0.14)',
          borderRadius: 16, padding: '12px 14px',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 22, flexShrink: 0, animation: 'iconFloat 4s ease-in-out infinite' }}>🐉</span>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: '#58CC02', letterSpacing: 1, marginBottom: 3 }}>
              {t('home.pySays')}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', lineHeight: 1.65, margin: 0 }}>
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

        {/* Reset */}
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button onClick={() => { resetAll(); window.location.href = '/splash'; }} style={{
            background: 'none', color: 'rgba(255,255,255,0.07)', fontSize: 10,
            cursor: 'pointer', border: 'none', fontFamily: "'Exo 2', sans-serif",
          }}>
            {t('home.resetSave')}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes iconFloat     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes ctaBorder     { 0%,100%{opacity:0.35} 50%{opacity:0.85} }
        @keyframes mapPulse      { 0%,100%{r:22;opacity:0.18} 50%{r:28;opacity:0.1} }
        @keyframes heroMapFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes homeStarTwinkle { 0%,100%{opacity:.05} 50%{opacity:.28} }
      `}</style>
    </div>
  );
}

// ── Unisex hooded hero SVG figure ────────────────────────────────────────────
function HeroSVGFigure({ x, y, color, size = 20 }) {
  const s = size / 20;
  return (
    <g transform={`translate(${x - 10 * s}, ${y - 20 * s}) scale(${s})`}>
      <ellipse cx="10" cy="40" rx="7" ry="2.5" fill="rgba(0,0,0,0.4)" />
      <path d="M4,18 Q2,28 3,38 Q10,42 17,38 Q18,28 16,18 Z" fill={color} opacity="0.88" />
      <path d="M6.5,19 Q5.5,29 6,37 Q10,40 14,37 Q14.5,29 13.5,19 Z" fill="rgba(0,0,0,0.15)" />
      <rect x="7.5" y="28" width="5" height="3.5" rx="1" fill="rgba(0,0,0,0.2)" />
      <path d="M4,18 Q5,8 10,6 Q15,8 16,18 Q13,14 10,14 Q7,14 4,18 Z" fill={color} opacity="0.96" />
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
      {/* Gold glasses */}
      <circle cx="8.3" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
      <circle cx="11.7" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="9.6" y1="14.6" x2="10.4" y2="14.6" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="7.0" y1="14.6" x2="6.3" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="13.0" y1="14.6" x2="13.7" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
      {/* Smile */}
      <path d="M8.5,17.2 Q10,18.5 11.5,17.2" fill="none" stroke="rgba(170,75,55,0.85)" strokeWidth="0.48" strokeLinecap="round" />
      <path d="M9.1,17.5 Q10,18.1 10.9,17.5 Q10,17.85 9.1,17.5 Z" fill="rgba(255,255,255,0.9)" />
      <line x1="16" y1="20" x2="19" y2="35" stroke={color} strokeWidth="1.2" opacity="0.6" />
      <circle cx="19" cy="35" r="1.2" fill={color} opacity="0.8" />
      <path d="M5,20 Q6,30 7,36" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    </g>
  );
}

// ── Standalone hero SVG (reusable in Profile, headers, etc.) ─────────────────
export function HeroFigureSVG({ cls, size = 80, animate = false }) {
  const color = cls?.color || '#58CC02';
  return (
    <svg
      width={size} height={size * 1.3}
      viewBox="1 5 18 36"
      style={{
        filter: `drop-shadow(0 0 ${size / 6}px ${color}99)`,
        animation: animate ? 'iconFloat 3s ease-in-out infinite' : 'none',
        overflow: 'visible',
      }}
    >
      <ellipse cx="10" cy="40" rx="6" ry="2" fill="rgba(0,0,0,0.35)" />
      <path d="M4,18 Q2,28 3,38 Q10,42 17,38 Q18,28 16,18 Z" fill={color} opacity="0.88" />
      <path d="M6,20 Q5,30 6,37 Q10,40 14,37 Q15,30 14,20 Z" fill="rgba(0,0,0,0.22)" />
      <path d="M4,18 Q5,8 10,6 Q15,8 16,18 Q13,14 10,14 Q7,14 4,18 Z" fill={color} opacity="0.96" />
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
      {/* Gold glasses */}
      <circle cx="8.3" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
      <circle cx="11.7" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="9.6" y1="14.6" x2="10.4" y2="14.6" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="7.0" y1="14.6" x2="6.3" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
      <line x1="13.0" y1="14.6" x2="13.7" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
      {/* Smile */}
      <path d="M8.5,17.2 Q10,18.5 11.5,17.2" fill="none" stroke="rgba(170,75,55,0.85)" strokeWidth="0.48" strokeLinecap="round" />
      <path d="M9.1,17.5 Q10,18.1 10.9,17.5 Q10,17.85 9.1,17.5 Z" fill="rgba(255,255,255,0.9)" />
      <line x1="16" y1="20" x2="19" y2="34" stroke={color} strokeWidth="1.1" opacity="0.65" />
      <circle cx="19" cy="34" r="1.1" fill={color} opacity="0.8" />
      <path d="M5,20 Q6,30 7,36" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9" />
    </svg>
  );
}

// ── Hero avatar for header (circular frame with character inside) ─────────────
export function HeroAvatar({ cls, size = 44, animate = false }) {
  const color = cls?.color || '#58CC02';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: `radial-gradient(circle at 40% 30%, ${color}22, rgba(0,0,0,0.7))`,
      border: `2px solid ${color}70`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
      boxShadow: `0 0 14px ${color}50`,
      animation: animate ? 'iconFloat 3s ease-in-out infinite' : 'none',
      position: 'relative',
    }}>
      <svg
        width={size * 0.72} height={size * 0.9}
        viewBox="2 6 16 34"
        style={{ filter: `drop-shadow(0 0 ${size / 8}px ${color}cc)` }}
      >
        <path d="M4,18 Q2,28 3,38 Q10,42 17,38 Q18,28 16,18 Z" fill={color} opacity="0.9" />
        <path d="M6,20 Q5,30 6,37 Q10,40 14,37 Q15,30 14,20 Z" fill="rgba(0,0,0,0.2)" />
        <path d="M4,18 Q5,8 10,6 Q15,8 16,18 Q13,14 10,14 Q7,14 4,18 Z" fill={color} opacity="0.96" />
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
        {/* Gold glasses */}
        <circle cx="8.3" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
        <circle cx="11.7" cy="14.6" r="1.3" fill="none" stroke="#E8C020" strokeWidth="0.36" />
        <line x1="9.6" y1="14.6" x2="10.4" y2="14.6" stroke="#E8C020" strokeWidth="0.36" />
        <line x1="7.0" y1="14.6" x2="6.3" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
        <line x1="13.0" y1="14.6" x2="13.7" y2="14.95" stroke="#E8C020" strokeWidth="0.36" />
        {/* Smile */}
        <path d="M8.5,17.2 Q10,18.5 11.5,17.2" fill="none" stroke="rgba(170,75,55,0.85)" strokeWidth="0.48" strokeLinecap="round" />
        <path d="M9.1,17.5 Q10,18.1 10.9,17.5 Q10,17.85 9.1,17.5 Z" fill="rgba(255,255,255,0.9)" />
      </svg>
    </div>
  );
}

function HomeStars() {
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
          animation: `homeStarTwinkle ${x.dur}s ${x.del}s ease-in-out infinite`,
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
      <div style={{ fontSize: 56, animation: 'iconFloat 1.5s ease-in-out infinite' }}>🐉</div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: '#58CC02', letterSpacing: 2 }}>
        {t('home.loading')}
      </div>
      <style>{`@keyframes iconFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
    </div>
  );
}
