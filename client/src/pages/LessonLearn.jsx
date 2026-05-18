import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UNITS } from '../data/curriculum.js';
import { sounds } from '../utils/sounds.js';

const UNIT_COLORS = { 1:'#58CC02', 2:'#1CB0F6', 3:'#FF9600', 4:'#CE82FF', 5:'#FF4B4B' };
const UNIT_DARK   = { 1:'#2d6600', 2:'#005f8a', 3:'#7a4500', 4:'#6b3c8a', 5:'#8a1a1a' };
const ENEMY_POOL  = {
  1: ['🟢','🐛','🦇'], 2: ['🤖','👻','🎭'],
  3: ['🌀','🧌','🏴‍☠️'], 4: ['🧙','💀'], 5: ['🐲','🐉'],
};

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function LessonLearn() {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const uid = parseInt(unitId);
  const lid = parseInt(lessonId);

  const unit    = UNITS.find(u => u.id === uid);
  const lesson  = unit?.lessons.find(l => l.id === lid);
  const missions = lesson?.learnMissions || [];

  const color      = UNIT_COLORS[uid] || '#58CC02';
  const darkColor  = UNIT_DARK[uid]   || '#1a4000';
  const enemyPool  = ENEMY_POOL[uid]  || ['👾'];
  const enemySprite = enemyPool[(lid - 1) % enemyPool.length];

  const [missionIdx, setMissionIdx]   = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [bannerAnim, setBannerAnim]   = useState(true);
  const [done, setDone]               = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [flashGreen, setFlashGreen]   = useState(false);

  if (!lesson || missions.length === 0) {
    navigate(`/lesson/${uid}/${lid}`);
    return null;
  }

  const advance = () => {
    setFlashGreen(true);
    sounds.missionClear();
    setTimeout(() => setFlashGreen(false), 700);

    setTransitioning(true);
    setTimeout(() => {
      if (missionIdx + 1 >= missions.length) {
        setDone(true);
      } else {
        setMissionIdx(i => i + 1);
        setBannerAnim(false);
        setTimeout(() => setBannerAnim(true), 50);
      }
      setTransitioning(false);
    }, 450);
  };

  const triggerShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 400);
  };

  const currentMission = missions[missionIdx];
  const progress = (missionIdx / missions.length) * 100;

  const MISSION_META = {
    concept:     { label: '📖 INTEL BRIEFING',   sub: 'Study the codex'   },
    tap_correct: { label: '⚡ QUICK DRAW',        sub: 'Tap the right answer' },
    match:       { label: '🔗 COMBO LINK',        sub: 'Match all pairs'   },
    arrange:     { label: '📦 BUILD SEQUENCE',    sub: 'Order the code'    },
  };
  const meta = MISSION_META[currentMission?.type] || { label: '⚡ MISSION', sub: '' };

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, #06040f 0%, #0f0820 50%, #08051a 100%)`,
      fontFamily: "'Exo 2', sans-serif",
      position: 'relative', overflow: 'hidden',
      animation: screenShake ? 'screenShake 0.35s ease' : 'none',
    }}>

      {/* Realm particles */}
      <RealmParticles color={color} />
      <Stars />

      {/* Green flash overlay on mission clear */}
      {flashGreen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 80, pointerEvents: 'none',
          background: `${color}20`,
          animation: 'flashFade 0.7s ease-out forwards',
        }}>
          <StarBurst color={color} />
        </div>
      )}

      {/* Enemy silhouette — watching from the corner */}
      <div style={{
        position: 'absolute', top: 60, right: -8, fontSize: 64,
        opacity: 0.08, filter: 'grayscale(1) blur(1px)',
        pointerEvents: 'none', zIndex: 1,
        animation: 'enemyWatch 4s ease-in-out infinite',
        transform: 'scaleX(-1)',
      }}>{enemySprite}</div>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        padding: '14px 16px 10px', zIndex: 10, flexShrink: 0,
        borderBottom: `1px solid ${color}20`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <button
            onClick={() => { sounds.click(); navigate(`/lesson/${uid}/${lid}`); }}
            style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '5px 11px', color: 'rgba(255,255,255,0.5)',
              fontSize: 14, cursor: 'pointer', flexShrink: 0,
            }}>✕</button>

          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 7,
              color: color, letterSpacing: 1.5,
              textShadow: `0 0 10px ${color}`,
            }}>PRE-BATTLE TRAINING</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginTop: 2 }}>
              {lesson.icon} {lesson.title}
            </div>
          </div>

          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 9,
            color: 'rgba(255,255,255,0.3)',
          }}>{missionIdx + 1}/{missions.length}</div>
        </div>

        {/* Progress bar */}
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 8, overflow: 'hidden', border: `1px solid ${color}20` }}>
          <div style={{
            background: `linear-gradient(90deg, ${color}, #fff)`,
            height: '100%', width: `${progress}%`,
            borderRadius: 99, transition: 'width 0.5s cubic-bezier(.4,2,.6,1)',
            boxShadow: `0 0 10px ${color}`,
          }} />
        </div>
      </div>

      {/* ── MISSION BANNER ──────────────────────────────────────────────── */}
      {!done && (
        <div style={{
          margin: '12px 14px 6px',
          background: `linear-gradient(135deg, ${darkColor}80, ${color}15)`,
          border: `1px solid ${color}40`,
          borderRadius: 14, padding: '10px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 10, flexShrink: 0,
          animation: bannerAnim ? 'bannerSlide 0.35s cubic-bezier(.2,1.4,.4,1)' : 'none',
        }}>
          <div>
            <div style={{
              fontFamily: "'Press Start 2P', monospace", fontSize: 9,
              color, letterSpacing: 1,
              textShadow: `0 0 12px ${color}`,
            }}>{meta.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 3 }}>
              {meta.sub}
            </div>
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace", fontSize: 8,
            color: `${color}90`,
          }}>
            {'◆'.repeat(missionIdx + 1)}{'◇'.repeat(Math.max(0, missions.length - missionIdx - 1))}
          </div>
        </div>
      )}

      {/* ── MISSION CONTENT ─────────────────────────────────────────────── */}
      <div style={{
        flex: 1, padding: '8px 14px 20px', zIndex: 10, overflowY: 'auto',
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? 'translateY(10px)' : 'translateY(0)',
        transition: 'opacity 0.25s ease, transform 0.25s ease',
      }}>
        {done ? (
          <AllDoneScreen uid={uid} lid={lid} lesson={lesson} color={color} navigate={navigate} />
        ) : (
          <MissionRouter
            mission={currentMission} color={color} darkColor={darkColor}
            onAdvance={advance} onWrong={triggerShake}
          />
        )}
      </div>

      <style>{`
        @keyframes screenShake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-12px)} 40%{transform:translateX(12px)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)}
        }
        @keyframes flashFade { 0%{opacity:0} 20%{opacity:1} 100%{opacity:0} }
        @keyframes bannerSlide {
          0%{opacity:0;transform:translateX(-20px)} 100%{opacity:1;transform:translateX(0)}
        }
        @keyframes enemyWatch {
          0%,100%{transform:scaleX(-1) translateY(0) rotate(-2deg)}
          50%{transform:scaleX(-1) translateY(-8px) rotate(2deg)}
        }
        @keyframes starTwinkle { 0%,100%{opacity:0.1} 50%{opacity:0.6} }
        @keyframes realmFloat {
          0%{transform:translateY(0) scale(0.9);opacity:0}
          10%{opacity:0.7} 80%{opacity:0.3}
          100%{transform:translateY(-180px) scale(0.2);opacity:0}
        }
        @keyframes starBurst {
          0%{opacity:1;transform:translate(var(--sx),var(--sy)) scale(0)}
          60%{opacity:1;transform:translate(calc(var(--sx)*3),calc(var(--sy)*3)) scale(1)}
          100%{opacity:0;transform:translate(calc(var(--sx)*5),calc(var(--sy)*5)) scale(0.5)}
        }
        @keyframes conceptReveal {
          0%{opacity:0;transform:translateY(8px)} 100%{opacity:1;transform:translateY(0)}
        }
        @keyframes tapButtonPop {
          0%{transform:scale(1)} 30%{transform:scale(0.93)} 100%{transform:scale(1)}
        }
        @keyframes matchFlash {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
        @keyframes tileSlide {
          0%{opacity:0;transform:translateX(-14px)} 100%{opacity:1;transform:translateX(0)}
        }
        @keyframes gotItPulse {
          0%,100%{box-shadow:0 5px 0 var(--dark),0 0 20px var(--glow)}
          50%{box-shadow:0 5px 0 var(--dark),0 0 36px var(--glow)}
        }
        @keyframes readyPulse {
          0%,100%{box-shadow:0 6px 0 var(--dark),0 0 30px var(--glow)}
          50%{box-shadow:0 6px 0 var(--dark),0 0 50px var(--glow)}
        }
        @keyframes introPop {
          0%{opacity:0;transform:scale(0.4)} 70%{transform:scale(1.15)} 100%{opacity:1;transform:scale(1)}
        }
        @keyframes blinkText { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes correctBounce {
          0%{transform:scale(1)} 30%{transform:scale(1.08)} 60%{transform:scale(0.96)} 100%{transform:scale(1)}
        }
      `}</style>
    </div>
  );
}

// ─── Background effects ────────────────────────────────────────────────────────
function RealmParticles({ color }) {
  const p = Array.from({ length: 14 }, (_, i) => ({
    id: i, x: (i * 19 + 5) % 90 + 5,
    size: 2 + (i % 4), dur: 3.5 + (i % 5),
    delay: -(i * 0.7) % 6, opacity: 0.1 + (i % 4) * 0.06,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {p.map(x => (
        <div key={x.id} style={{
          position: 'absolute', left: `${x.x}%`, bottom: '-6px',
          width: x.size, height: x.size, borderRadius: '50%',
          background: color, opacity: x.opacity,
          boxShadow: `0 0 ${x.size * 3}px ${color}`,
          animation: `realmFloat ${x.dur}s ${x.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

function Stars() {
  const s = Array.from({ length: 20 }, (_, i) => ({
    id: i, x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100,
    size: 1 + (i % 2), delay: (i * 0.4) % 3, dur: 2 + (i % 3),
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {s.map(x => (
        <div key={x.id} style={{
          position: 'absolute', left: `${x.x}%`, top: `${x.y}%`,
          width: x.size, height: x.size, background: 'white', borderRadius: '50%',
          animation: `starTwinkle ${x.dur}s ${x.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

function StarBurst({ color }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    return {
      id: i, delay: i * 30,
      sx: Math.cos(angle) * 20 + 'px',
      sy: Math.sin(angle) * 20 + 'px',
      color: i % 3 === 0 ? '#facc15' : i % 3 === 1 ? color : '#fff',
    };
  });
  return (
    <div style={{ position: 'absolute', top: '40%', left: '50%', pointerEvents: 'none' }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', width: 8, height: 8, borderRadius: '50%',
          background: s.color, boxShadow: `0 0 10px ${s.color}`,
          '--sx': s.sx, '--sy': s.sy,
          animation: `starBurst 0.65s ${s.delay}ms cubic-bezier(.2,1,.4,1) forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── Mission router ────────────────────────────────────────────────────────────
function MissionRouter({ mission, color, darkColor, onAdvance, onWrong }) {
  if (!mission) return null;
  switch (mission.type) {
    case 'concept':     return <ConceptCard  mission={mission} color={color} darkColor={darkColor} onAdvance={onAdvance} />;
    case 'tap_correct': return <TapCorrect   mission={mission} color={color} onAdvance={onAdvance} onWrong={onWrong} />;
    case 'match':       return <MatchPairs   mission={mission} color={color} onAdvance={onAdvance} onWrong={onWrong} />;
    case 'arrange':     return <ArrangeCode  mission={mission} color={color} onAdvance={onAdvance} onWrong={onWrong} />;
    default:            return null;
  }
}

// ─── Concept Card ──────────────────────────────────────────────────────────────
function ConceptCard({ mission, color, darkColor, onAdvance }) {
  const [revealed, setRevealed] = useState('');
  const [textDone, setTextDone] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    sounds.prologuePanel();
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setRevealed(mission.text.slice(0, i));
      if (i % 5 === 0) sounds.typeClick();
      if (i >= mission.text.length) { clearInterval(intervalRef.current); setTextDone(true); }
    }, 22);
    return () => clearInterval(intervalRef.current);
  }, [mission.text]);

  const handleGotIt = () => {
    if (!textDone) {
      clearInterval(intervalRef.current);
      setRevealed(mission.text);
      setTextDone(true);
      return;
    }
    sounds.missionClear();
    onAdvance();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'conceptReveal 0.3s ease-out' }}>

      {/* Py tutor avatar + title */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: `linear-gradient(135deg, ${darkColor}60, ${color}12)`,
        border: `1px solid ${color}40`,
        borderRadius: 16, padding: '12px 16px',
        boxShadow: `0 0 20px ${color}10 inset`,
      }}>
        <div style={{ fontSize: 40, animation: 'enemyWatch 3s ease-in-out infinite', display: 'inline-block' }}>🐍</div>
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color, letterSpacing: 1 }}>PY TEACHES</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginTop: 3 }}>{mission.title}</div>
        </div>
      </div>

      {/* Typewriter explanation */}
      <div style={{
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14, padding: '14px 16px',
        fontSize: 14, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, minHeight: 64,
        cursor: textDone ? 'default' : 'pointer',
      }} onClick={() => { if (!textDone) { clearInterval(intervalRef.current); setRevealed(mission.text); setTextDone(true); } }}>
        {revealed}
        {!textDone && <span style={{ opacity: 0.6, animation: 'blinkText 0.6s ease-in-out infinite' }}>▌</span>}
      </div>

      {/* Code block */}
      {mission.code && (
        <div style={{
          background: '#050510', border: `1px solid ${color}25`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: `0 0 16px ${color}08 inset`,
        }}>
          <div style={{
            padding: '7px 14px', background: 'rgba(255,255,255,0.03)',
            borderBottom: `1px solid ${color}20`,
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
            ))}
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginLeft: 6, fontFamily: 'monospace' }}>python</span>
          </div>
          <pre style={{
            margin: 0, padding: '12px 16px',
            fontFamily: "'Courier New', monospace", fontSize: 13, lineHeight: 1.7,
            color: '#a5f3fc', overflowX: 'auto',
          }}>{mission.code}</pre>
          {mission.output && (
            <div style={{
              padding: '9px 16px', borderTop: `1px solid ${color}15`,
              background: 'rgba(0,0,0,0.4)',
            }}>
              <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', marginBottom: 4, letterSpacing: 2 }}>OUTPUT</div>
              <div style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: '#86efac' }}>{mission.output}</div>
            </div>
          )}
        </div>
      )}

      {/* GOT IT button */}
      <button onClick={handleGotIt} style={{
        marginTop: 4, padding: '15px',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: 'white', borderRadius: 14, width: '100%', border: 'none',
        fontFamily: "'Press Start 2P', monospace", fontSize: 10, letterSpacing: 1.5,
        '--dark': `${color}88`, '--glow': `${color}50`,
        boxShadow: `0 5px 0 ${color}88, 0 0 24px ${color}40`,
        cursor: 'pointer',
        animation: textDone ? 'gotItPulse 1.8s ease-in-out infinite' : 'none',
      }}>
        {textDone ? 'GOT IT! →' : 'SKIP →'}
      </button>
    </div>
  );
}

// ─── Tap Correct ───────────────────────────────────────────────────────────────
function TapCorrect({ mission, color, onAdvance, onWrong }) {
  const [selected, setSelected] = useState(null);
  const [wrongIdx, setWrongIdx] = useState(null);

  useEffect(() => { sounds.intro(); }, []);

  const pick = (idx) => {
    if (selected !== null) return;
    sounds.learnTap();
    if (idx === mission.correct) {
      setSelected(idx);
      sounds.missionClear();
      setTimeout(onAdvance, 700);
    } else {
      setWrongIdx(idx);
      sounds.wrong();
      onWrong();
      setTimeout(() => setWrongIdx(null), 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6 }}>
        {mission.question}
      </div>

      {mission.code && (
        <pre style={{
          background: '#050510', border: `1px solid ${color}25`,
          borderRadius: 12, padding: '11px 14px',
          fontFamily: "'Courier New', monospace", fontSize: 12,
          color: '#a5f3fc', margin: 0, overflowX: 'auto', lineHeight: 1.7,
        }}>{mission.code}</pre>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: mission.options.length <= 2 ? '1fr' : '1fr 1fr',
        gap: 10,
      }}>
        {mission.options.map((opt, i) => {
          const isCorrect = selected === i;
          const isWrong   = wrongIdx === i;
          let bg     = 'rgba(255,255,255,0.05)';
          let border = 'rgba(255,255,255,0.12)';
          let color2 = 'rgba(255,255,255,0.82)';
          let anim   = 'none';
          if (isCorrect) { bg = `${color}20`; border = color; color2 = color; anim = 'correctBounce 0.4s ease'; }
          if (isWrong)   { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color2 = '#fca5a5'; anim = 'screenShake 0.35s ease'; }

          return (
            <button key={i} onClick={() => pick(i)} style={{
              padding: '14px 12px', borderRadius: 14, textAlign: 'left',
              background: bg, border: `2px solid ${border}`, color: color2,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              animation: anim, transition: 'background 0.15s, border-color 0.15s',
              minHeight: 56, lineHeight: 1.35,
              boxShadow: isCorrect ? `0 0 20px ${color}50` : isWrong ? '0 0 16px rgba(239,68,68,0.4)' : 'none',
            }}>
              <span style={{ fontSize: 8, opacity: 0.4, fontFamily: "'Press Start 2P'", display: 'block', marginBottom: 4 }}>
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Match Pairs ───────────────────────────────────────────────────────────────
function MatchPairs({ mission, color, onAdvance, onWrong }) {
  const [leftSel,  setLeftSel]  = useState(null);
  const [matched,  setMatched]  = useState([]);
  const [wrongVal, setWrongVal] = useState(null);
  const [rightOpts] = useState(() => [...mission.pairs].map(p => p.right).sort(() => Math.random() - 0.5));

  useEffect(() => { sounds.intro(); }, []);

  const pickLeft = (i) => {
    if (matched.includes(i)) return;
    sounds.learnTap();
    setLeftSel(i);
  };

  const pickRight = (val) => {
    if (leftSel === null) return;
    const expected = mission.pairs[leftSel].right;
    if (val === expected) {
      sounds.matchPing();
      const next = [...matched, leftSel];
      setMatched(next);
      setLeftSel(null);
      if (next.length === mission.pairs.length) {
        sounds.missionClear();
        setTimeout(onAdvance, 600);
      }
    } else {
      sounds.wrong();
      onWrong();
      setWrongVal(val);
      setTimeout(() => { setWrongVal(null); setLeftSel(null); }, 500);
    }
  };

  const matchedRights = matched.map(i => mission.pairs[i].right);
  const matchCount = matched.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>
        {mission.question}
      </div>

      {/* Match counter */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'Press Start 2P', monospace", fontSize: 8,
        color: matchCount > 0 ? color : 'rgba(255,255,255,0.25)',
      }}>
        {mission.pairs.map((_, i) => (
          <div key={i} style={{
            width: 10, height: 10, borderRadius: '50%',
            background: i < matchCount ? color : 'rgba(255,255,255,0.12)',
            boxShadow: i < matchCount ? `0 0 8px ${color}` : 'none',
            transition: 'all 0.2s ease',
          }} />
        ))}
        <span style={{ marginLeft: 4 }}>{matchCount}/{mission.pairs.length} linked</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        {/* Left column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontFamily: "'Press Start 2P'", letterSpacing: 1, marginBottom: 2 }}>CONCEPT</div>
          {mission.pairs.map((pair, i) => {
            const done = matched.includes(i);
            const sel  = leftSel === i;
            return (
              <button key={i} onClick={() => pickLeft(i)} style={{
                padding: '11px 12px', borderRadius: 12, textAlign: 'center',
                background: done ? `${color}18` : sel ? `${color}28` : 'rgba(255,255,255,0.05)',
                border: `2px solid ${done ? `${color}70` : sel ? color : 'rgba(255,255,255,0.1)'}`,
                color: done ? color : sel ? 'white' : 'rgba(255,255,255,0.75)',
                fontSize: 12, fontWeight: 700, cursor: done ? 'default' : 'pointer',
                opacity: done ? 0.5 : 1,
                boxShadow: sel ? `0 0 16px ${color}50` : done ? `0 0 8px ${color}30` : 'none',
                transition: 'all 0.15s', lineHeight: 1.4,
                animation: done ? 'matchFlash 0.3s ease' : 'none',
              }}>{pair.left}</button>
            );
          })}
        </div>

        {/* Connector area */}
        <div style={{ width: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
          {mission.pairs.map((_, i) => (
            <div key={i} style={{
              width: 2, height: 40, borderRadius: 1,
              background: matched.includes(i) ? color : 'rgba(255,255,255,0.08)',
              boxShadow: matched.includes(i) ? `0 0 6px ${color}` : 'none',
              transition: 'background 0.3s, box-shadow 0.3s',
            }} />
          ))}
        </div>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontFamily: "'Press Start 2P'", letterSpacing: 1, marginBottom: 2 }}>VALUE</div>
          {rightOpts.map((val, i) => {
            const done  = matchedRights.includes(val);
            const wrong = wrongVal === val;
            return (
              <button key={i} onClick={() => pickRight(val)} style={{
                padding: '11px 12px', borderRadius: 12, textAlign: 'center',
                background: done ? 'rgba(74,222,128,0.12)' : wrong ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
                border: `2px solid ${done ? 'rgba(74,222,128,0.5)' : wrong ? '#ef4444' : 'rgba(255,255,255,0.1)'}`,
                color: done ? '#86efac' : wrong ? '#fca5a5' : 'rgba(255,255,255,0.75)',
                fontSize: 12, fontWeight: 700, cursor: done ? 'default' : 'pointer',
                opacity: done ? 0.5 : 1,
                boxShadow: done ? '0 0 8px rgba(74,222,128,0.3)' : wrong ? '0 0 12px rgba(239,68,68,0.4)' : 'none',
                animation: wrong ? 'screenShake 0.35s ease' : done ? 'matchFlash 0.3s ease' : 'none',
                transition: 'all 0.15s', lineHeight: 1.4,
              }}>{val}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Arrange Code ──────────────────────────────────────────────────────────────
function ArrangeCode({ mission, color, onAdvance, onWrong }) {
  const [bank,     setBank]     = useState(() => [...mission.lines].sort(() => Math.random() - 0.5));
  const [arranged, setArranged] = useState([]);
  const [shake,    setShake]    = useState(false);
  const [correct,  setCorrect]  = useState(false);

  useEffect(() => { sounds.intro(); }, []);

  const addLine = (line) => {
    sounds.codePlace();
    const next = [...arranged, line];
    setArranged(next);
    setBank(b => b.filter(l => l !== line));

    if (next.length === mission.lines.length) {
      if (next.join('|') === mission.lines.join('|')) {
        setCorrect(true);
        sounds.missionClear();
        setTimeout(onAdvance, 700);
      } else {
        setShake(true);
        sounds.wrong();
        onWrong();
        setTimeout(() => {
          setShake(false);
          setBank([...mission.lines].sort(() => Math.random() - 0.5));
          setArranged([]);
        }, 550);
      }
    }
  };

  const removeLine = (line) => {
    if (correct) return;
    sounds.learnTap();
    setArranged(a => a.filter(l => l !== line));
    setBank(b => [...b, line]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.88)', lineHeight: 1.5 }}>
        {mission.question}
      </div>

      {/* Drop zone — code editor look */}
      <div style={{
        background: '#050510',
        border: `2px solid ${arranged.length > 0 ? (correct ? '#4ade80' : `${color}60`) : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 14, overflow: 'hidden', minHeight: 90,
        boxShadow: correct ? '0 0 20px rgba(74,222,128,0.3)' : shake ? '0 0 20px rgba(239,68,68,0.4)' : `0 0 14px ${color}08 inset`,
        animation: shake ? 'screenShake 0.35s ease' : 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        {/* Editor top bar */}
        <div style={{
          padding: '6px 12px', background: 'rgba(255,255,255,0.03)',
          borderBottom: `1px solid ${color}15`,
          display: 'flex', gap: 6, alignItems: 'center',
        }}>
          {['#FF5F57','#FEBC2E','#28C840'].map((c, i) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', marginLeft: 4, fontFamily: 'monospace', letterSpacing: 2 }}>YOUR CODE</span>
          {arranged.length > 0 && (
            <span style={{ marginLeft: 'auto', fontSize: 8, color: `${color}80`, fontFamily: "'Press Start 2P'" }}>
              {arranged.length}/{mission.lines.length}
            </span>
          )}
        </div>

        {arranged.length === 0 ? (
          <div style={{
            padding: '16px', fontSize: 11, color: 'rgba(255,255,255,0.18)',
            textAlign: 'center', fontStyle: 'italic', fontFamily: 'monospace',
          }}>
            {'// tap lines below to build →'}
          </div>
        ) : (
          <div style={{ padding: '10px 14px' }}>
            {arranged.map((line, i) => (
              <div key={i} onClick={() => removeLine(line)} style={{
                fontFamily: "'Courier New', monospace", fontSize: 13,
                color: correct ? '#86efac' : '#a5f3fc', lineHeight: 1.7,
                cursor: correct ? 'default' : 'pointer',
                padding: '1px 0',
                animation: `tileSlide 0.2s ${i * 40}ms ease-out both`,
              }}>
                <span style={{ color: `${color}50`, marginRight: 8, fontSize: 10 }}>{i + 1}</span>
                {line}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code tile bank */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.25)', fontFamily: "'Press Start 2P'", letterSpacing: 1 }}>
          TAP TO ADD →
        </div>
        {bank.map((line, i) => (
          <button key={i} onClick={() => addLine(line)} style={{
            padding: '11px 14px', borderRadius: 12, textAlign: 'left',
            background: 'rgba(255,255,255,0.06)',
            border: `1px solid ${color}30`,
            color: 'rgba(255,255,255,0.82)',
            fontFamily: "'Courier New', monospace", fontSize: 13,
            cursor: 'pointer',
            boxShadow: `0 2px 0 ${color}20`,
            transition: 'transform 0.1s, box-shadow 0.1s',
            animation: `tileSlide 0.25s ${i * 50}ms ease-out both`,
          }}>
            {line}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── All Done ──────────────────────────────────────────────────────────────────
function AllDoneScreen({ uid, lid, lesson, color, navigate }) {
  const [particles] = useState(() =>
    Array.from({ length: 32 }, (_, i) => {
      const angle = (i / 32) * Math.PI * 2;
      const dist  = 80 + (i % 4) * 30;
      return {
        id: i,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        color: i % 4 === 0 ? '#facc15' : i % 4 === 1 ? color : i % 4 === 2 ? '#fff' : '#f97316',
        delay: (i % 6) * 50,
        size: 4 + (i % 4) * 2,
      };
    })
  );

  useEffect(() => {
    setTimeout(() => sounds.trainingReady(), 200);
  }, []);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', flex: 1, gap: 20, textAlign: 'center',
      padding: '20px', position: 'relative',
    }}>
      {/* Particle burst */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
            background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
            animation: `starBurst 0.8s ${p.delay}ms cubic-bezier(.2,1,.4,1) both`,
          }} />
        ))}
      </div>

      <div style={{
        fontSize: 80, position: 'relative', zIndex: 2,
        animation: 'introPop 0.7s cubic-bezier(.2,1.6,.4,1)',
        filter: `drop-shadow(0 0 28px ${color}) drop-shadow(0 0 10px white)`,
      }}>⚔️</div>

      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 'clamp(11px, 3.5vw, 16px)',
        color, letterSpacing: 2, lineHeight: 1.8,
        textShadow: `0 0 20px ${color}`,
        position: 'relative', zIndex: 2,
        animation: 'introPop 0.5s ease-out 0.2s both',
      }}>
        TRAINING<br />COMPLETE!
      </div>

      <div style={{
        fontSize: 13, color: 'rgba(255,255,255,0.5)', maxWidth: 300, lineHeight: 1.75,
        position: 'relative', zIndex: 2,
        animation: 'conceptReveal 0.4s ease-out 0.4s both',
      }}>
        You've learned the concepts —<br />now destroy the enemy in battle!
      </div>

      <button
        onClick={() => { sounds.click(); navigate(`/lesson/${uid}/${lid}`); }}
        style={{
          padding: '17px 40px',
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          color: 'white', borderRadius: 18, border: 'none',
          fontFamily: "'Press Start 2P', monospace",
          fontSize: 12, letterSpacing: 1.5,
          '--dark': `${color}88`, '--glow': `${color}60`,
          boxShadow: `0 6px 0 ${color}88, 0 0 36px ${color}50`,
          cursor: 'pointer', position: 'relative', zIndex: 2,
          animation: 'readyPulse 2s ease-in-out infinite, introPop 0.5s ease-out 0.5s both',
        }}
      >⚔️ ENTER BATTLE</button>
    </div>
  );
}
