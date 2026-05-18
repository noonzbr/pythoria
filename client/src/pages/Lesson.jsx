import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UNITS } from '../data/curriculum.js';
import { UNIT_OUTROS, CLASSES } from '../data/story.js';
import { useProgress } from '../hooks/useProgress.js';
import { useStory } from '../hooks/useStory.js';
import { sounds } from '../utils/sounds.js';
import { locLesson } from '../utils/loc.js';
import { HeroFigureSVG } from './Home.jsx';

// ─── Enemy definitions ────────────────────────────────────────────────────────
const ENEMIES = {
  1: [
    {
      name: 'Syntax Slime', sprite: '🟢', hp: 100, color: '#4ade80', borderColor: '#16a34a',
      intro: ["I'll melt your code!", "Slimy syntax incoming!", "You call that Python?!"],
      taunt: ["Too slow!", "My slime grows stronger!", "Is that all?"],
      hit:   ["Ow! Lucky!", "My precious slime...", "You'll regret that!"],
      defeat:["I... dissolve...", "Noo, my slime!", "Well played, human..."],
    },
    {
      name: 'Bug Goblin', sprite: '🐛', hp: 100, color: '#a3e635', borderColor: '#4d7c0f',
      intro: ["Bugs everywhere! Hehehe!", "Your code is already broken!", "I live in your errors!"],
      taunt: ["Error 404: skill not found!", "Another bug for my collection!", "Crash! Crash! Crash!"],
      hit:   ["Ow! A feature, not a bug!", "You fixed THAT one?!", "Impossible!"],
      defeat:["Fixed... I've been... debugged...", "Nooo my glorious bugs!", "This isn't over!"],
    },
    {
      name: 'Error Bat', sprite: '🦇', hp: 120, color: '#86efac', borderColor: '#15803d',
      intro: ["IndentationError! MuaHaHa!", "I fly through your logic!", "Exceptions await you!"],
      taunt: ["Try-except THIS!", "Your traceback grows longer!", "Screeeech!"],
      hit:   ["Caught mid-flight!", "You... handled... my exception?!", "Shrieeeek!"],
      defeat:["Falling... out of scope...", "Caught and... handled...", "Back to the void..."],
    },
  ],
  2: [
    {
      name: 'Logic Golem', sprite: '🤖', hp: 130, color: '#7dd3fc', borderColor: '#0369a1',
      intro: ["CONDITION: DESTROY YOU.", "My if-chains are unbreakable.", "COMPUTING... your defeat."],
      taunt: ["FALSE. Try again.", "LOGICAL ERROR DETECTED.", "My circuits mock you."],
      hit:   ["DAMAGE... REGISTERED.", "Illogical...", "RECALCULATING..."],
      defeat:["SYSTEM... FAILURE...", "Logic... overridden...", "Shutting... down..."],
    },
    {
      name: 'If-Wraith', sprite: '👻', hp: 120, color: '#bae6fd', borderColor: '#0284c7',
      intro: ["If you fail... you join me!", "The elif chains bind you!", "Booooolean terror!"],
      taunt: ["Neither True... nor False... just pain!", "My conditions haunt you!", "Booooo!"],
      hit:   ["AAAH! You evaluated me!", "My condition... was False...", "Spooky pain!"],
      defeat:["I fade... into the else branch...", "Condition... evaluated...", "Boo... I'm gone..."],
    },
    {
      name: 'Else Specter', sprite: '🎭', hp: 140, color: '#93c5fd', borderColor: '#1d4ed8',
      intro: ["You think you know comparisons?", "I am every edge case!", ">=, <=, and your DOOM!"],
      taunt: ["Off by one! Classic.", "Your logic leaks!", "The edge cases multiply!"],
      hit:   ["An... edge case I missed!", "Impressive handling...", "How?! I had every case!"],
      defeat:["All cases... covered...", "My edges... smoothed...", "Well reasoned, warrior."],
    },
  ],
  3: [
    {
      name: 'Loop Demon', sprite: '🌀', hp: 150, color: '#fdba74', borderColor: '#c2410c',
      intro: ["FOR EVERY BREATH YOU TAKE I LOOP!", "Infinite power! Infinite loops!", "You'll repeat this forever!"],
      taunt: ["while True: SUFFER!", "Loop within loop within loop!", "You'll never break free!"],
      hit:   ["BREAK?! You used break?!", "My loop... disrupted...", "CONTINUE! I MUST CONTINUE!"],
      defeat:["Loop... terminated...", "I finally... break...", "The iteration ends..."],
    },
    {
      name: 'Infinite Orc', sprite: '🧌', hp: 140, color: '#fb923c', borderColor: '#9a3412',
      intro: ["UNGA BUNGA WHILE TRUE!", "Me loop. Me never stop.", "ORC SMASH YOUR RANGE!"],
      taunt: ["MORE ITERATIONS!", "ORC NOT STOP!", "SMASH. SMASH. SMASH."],
      hit:   ["OW! Bad hit!", "Me confused by break...", "ORC... SLOW DOWN?"],
      defeat:["Orc... stop now...", "Loop... over...", "...zzz"],
    },
    {
      name: 'Break Bandit', sprite: '🏴‍☠️', hp: 160, color: '#f97316', borderColor: '#7c2d12',
      intro: ["I break ALL your loops!", "Continue means nothing to me!", "Surrender your range()!"],
      taunt: ["Missed again, landlubber!", "Your loops be mine!", "YARR! Another wrong answer!"],
      hit:   ["Blast! A direct hit!", "Ye know yer loops well...", "By Davy Jones' loop!"],
      defeat:["I be... defeated...", "Sail... the void I shall...", "Fair loops, warrior. Fair loops."],
    },
  ],
  4: [
    {
      name: 'Void Mage', sprite: '🧙', hp: 160, color: '#c084fc', borderColor: '#7e22ce',
      intro: ["None. That is your return value.", "def defeat(): return pain", "Your functions return... void."],
      taunt: ["Undefined behavior!", "No return value for you!", "Your scope ends here!"],
      hit:   ["Unexpected... return value...", "You... defined that correctly?", "My void... shrinks..."],
      defeat:["Returning... None...", "Function... complete...", "Well defined, coder."],
    },
    {
      name: 'None Phantom', sprite: '💀', hp: 170, color: '#a855f7', borderColor: '#581c87',
      intro: ["I am None. I am nothing. I am everywhere.", "NoneType has no attribute 'mercy'.", "Beware the AttributeError!"],
      taunt: ["TypeError! MuaHaHa!", "Your variable is None!", "Cannot call method on None!"],
      hit:   ["You... handled None correctly?!", "Impossible... I am undetectable!", "My null... pierced..."],
      defeat:["I return... None...", "I was never here...", "None... prevails... not."],
    },
  ],
  5: [
    {
      name: 'Data Hydra', sprite: '🐲', hp: 180, color: '#f87171', borderColor: '#991b1b',
      intro: ["Cut one key, two more appear!", "My lists are infinite!", "APPEND. APPEND. APPEND."],
      taunt: ["IndexError out of BOUNDS!", "My dict grows larger!", "You missed a key!"],
      hit:   ["One head falls...", "You accessed me correctly?!", "My index... shrinks..."],
      defeat:["All heads... removed...", "My data... structured...", "Masterfully keyed."],
    },
    {
      name: 'DATA DRAGON', sprite: '🐉', hp: 220, color: '#ef4444', borderColor: '#7f1d1d', boss: true,
      intro: ["⚠️ I AM THE FINAL BOSS.", "All data flows through ME.", "You dare challenge the Data Dragon?! PERISH."],
      taunt: ["YOUR LISTS CRUMBLE!", "DICT OR DIE!", "FEEL THE WRATH OF O(N²)!"],
      hit:   ["IMPOSSIBLE! A correct answer?!", "My scales... chipped...", "You've read the docs?! CHEATER!"],
      defeat:["You have... mastered... the data...", "I bow to your... indexing...", "The dragon falls. Python is yours, warrior."],
    },
  ],
};

const PY_LINES = {
  correct: ["Nice one! ⚔️", "That's the way!", "Combo building! 🔥", "You're on fire!", "Critical hit!"],
  wrong:   ["Don't give up!", "You got this!", "Try again!", "Shake it off!", "Every mistake teaches!"],
  combo:   ["UNSTOPPABLE!", "LEGENDARY!", "GODLIKE!", "BEYOND GODLIKE!", "OMEGA COMBO!"],
  low_hp:  ["Hang in there!", "Use a hint!", "Stay focused!", "Almost got it!"],
};

const CLASS_SPRITES = ['⚔️', '🔮', '🐍', '🗡️', '🌊', '🛡️'];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

export default function Lesson() {
  const { unitId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, completeLesson } = useProgress();
  const { getPlayer } = useStory();

  const unit     = UNITS.find(u => u.id === parseInt(unitId));
  const lesson   = unit?.lessons.find(l => l.id === parseInt(lessonId));
  const enemyPool = ENEMIES[parseInt(unitId)] || ENEMIES[1];
  const enemyDef  = enemyPool[(parseInt(lessonId) - 1) % enemyPool.length];
  const exercises  = lesson?.exercises || [];
  const dmgPerHit  = Math.floor(enemyDef.hp / exercises.length);

  const player = getPlayer();
  const cls = CLASSES.find(c => c.id === player?.classId) || CLASSES[0];
  const playerSprite = CLASS_SPRITES[(player?.class || 0) % CLASS_SPRITES.length];

  const [introPhase, setIntroPhase]     = useState(true);
  const [step, setStep]                 = useState(0);
  const [phase, setPhase]               = useState('question');
  const [selected, setSelected]         = useState(null);
  const [fillValue, setFillValue]       = useState('');
  const [playerHp, setPlayerHp]         = useState(100);
  const [enemyHp, setEnemyHp]           = useState(enemyDef.hp);
  const [floatDmg, setFloatDmg]         = useState(null);
  const [shakeEnemy, setShakeEnemy]     = useState(false);
  const [shakePlayer, setShakePlayer]   = useState(false);
  const [screenShake, setScreenShake]   = useState(false);
  const [flashColor, setFlashColor]     = useState(null);
  const [particles, setParticles]       = useState([]);
  const [projectile, setProjectile]     = useState(null);
  const [dialogue, setDialogue]         = useState({ who: 'enemy', text: pick(enemyDef.intro), visible: true });
  const [hint, setHint]                 = useState('');
  const [loadingHint, setLoadingHint]   = useState(false);
  const [xpEarned, setXpEarned]         = useState(0);
  const [heartsLost, setHeartsLost]     = useState(0);
  const [combo, setCombo]               = useState(0);
  const [showCombo, setShowCombo]       = useState(false);
  const [muted, setMuted]               = useState(false);
  const [btnPressed, setBtnPressed]     = useState(false);
  const [enemyHitFlash, setEnemyHitFlash] = useState(false);
  const particleId = useRef(0);

  const playerMaxHp = 100;
  const playerHpPct = (playerHp / playerMaxHp) * 100;
  const enemyHpPct  = Math.max(0, (enemyHp / enemyDef.hp) * 100);

  useEffect(() => {
    sounds.intro();
    const t = setTimeout(() => setIntroPhase(false), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!dialogue.visible) return;
    const t = setTimeout(() => setDialogue(d => ({ ...d, visible: false })), 2800);
    return () => clearTimeout(t);
  }, [dialogue]);

  useEffect(() => {
    if (phase === 'victory') completeLesson(unit.id, lesson.id, xpEarned, heartsLost);
  }, [phase]);

  if (!unit || !lesson) { navigate('/learn'); return null; }

  const exercise = exercises[step];

  const burstParticles = (count, color) => {
    const newP = Array.from({ length: count }, (_, i) => ({
      id: particleId.current++, color,
      angle: (i / count) * 360,
      dist: 40 + Math.random() * 40,
    }));
    setParticles(p => [...p, ...newP]);
    setTimeout(() => setParticles(p => p.filter(x => !newP.includes(x))), 700);
  };

  const triggerFlash = (color) => {
    setFlashColor(color);
    setTimeout(() => setFlashColor(null), 320);
  };

  const fireProjectile = (dir, color) => {
    sounds.projectile();
    setProjectile({ dir, color, id: Date.now() });
    setTimeout(() => setProjectile(null), 480);
  };

  const checkAnswer = () => {
    if (phase !== 'question') return;
    setBtnPressed(true);
    setTimeout(() => setBtnPressed(false), 150);
    sounds.attack();

    let correct = false;
    if (exercise.type === 'multiple_choice' || exercise.type === 'output_predict') {
      correct = selected === exercise.correct;
    } else {
      const n = s => s.replace(/\s+/g, ' ').trim().toLowerCase();
      correct = n(fillValue) === n(exercise.answer);
    }

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const dmg = dmgPerHit + (newCombo >= 3 ? newCombo * 4 : 0);

      if (newCombo >= 3) {
        setShowCombo(true);
        sounds.combo();
        setTimeout(() => setShowCombo(false), 1600);
        setDialogue({ who: 'py', text: pick(PY_LINES.combo), visible: true });
      } else {
        sounds.correct();
        setDialogue({ who: 'py', text: pick(PY_LINES.correct), visible: true });
      }

      triggerFlash('green');
      setPhase('player-attack');
      fireProjectile('ltr', newCombo >= 3 ? '#ff6b00' : '#facc15');

      setTimeout(() => {
        burstParticles(12, '#facc15');
        setShakeEnemy(true);
        setEnemyHitFlash(true);
        setFloatDmg({ value: dmg, side: 'enemy' });
        const newHp = Math.max(0, enemyHp - dmg);
        setEnemyHp(newHp);
        setTimeout(() => {
          setShakeEnemy(false);
          setEnemyHitFlash(false);
          setFloatDmg(null);
          setXpEarned(p => p + Math.floor(lesson.xpReward / exercises.length));
          if (newHp <= 0) {
            sounds.victory();
            setDialogue({ who: 'enemy', text: pick(enemyDef.defeat), visible: true });
            setTimeout(() => setPhase('victory'), 1200);
          } else {
            setDialogue({ who: 'enemy', text: pick(enemyDef.hit), visible: true });
            setPhase('correct');
          }
        }, 650);
      }, 380);

    } else {
      setCombo(0);
      const dmg = 20 + Math.floor(Math.random() * 15);
      sounds.wrong();
      setDialogue({ who: 'enemy', text: pick(enemyDef.taunt), visible: true });
      triggerFlash('red');
      setPhase('enemy-attack');
      fireProjectile('rtl', '#ef4444');

      setTimeout(() => {
        setShakePlayer(true);
        setScreenShake(true);
        setFloatDmg({ value: dmg, side: 'player' });
        const newHp = Math.max(0, playerHp - dmg);
        setPlayerHp(newHp);
        setHeartsLost(h => h + 1);
        sounds.hit();
        setTimeout(() => {
          setShakePlayer(false);
          setScreenShake(false);
          setFloatDmg(null);
          if (newHp <= 0) {
            sounds.defeat();
            setPhase('defeat');
          } else {
            if (newHp < 30) setDialogue({ who: 'py', text: pick(PY_LINES.low_hp), visible: true });
            else setDialogue({ who: 'py', text: pick(PY_LINES.wrong), visible: true });
            setPhase('wrong');
          }
        }, 650);
      }, 380);
    }
  };

  const nextStep = () => {
    setPhase('question');
    setSelected(null);
    setFillValue('');
    setHint('');
    setDialogue({ who: 'enemy', text: pick(enemyDef.taunt), visible: false });
    if (step + 1 >= exercises.length) {
      sounds.victory();
      setPhase('victory');
      completeLesson(unit.id, lesson.id, xpEarned, heartsLost);
    } else {
      setStep(s => s + 1);
    }
  };

  const getHint = async () => {
    setLoadingHint(true);
    try {
      const res = await fetch('/api/ai/hint', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: exercise.question,
          userAnswer: exercise.type === 'multiple_choice' ? exercise.options?.[selected] : fillValue,
          correctAnswer: exercise.type === 'multiple_choice' ? exercise.options?.[exercise.correct] : exercise.answer,
          exerciseType: exercise.type,
        })
      });
      const data = await res.json();
      setHint(data.hint);
    } catch {
      setHint("Strike true, warrior! Read carefully one more time. 🐉");
    }
    setLoadingHint(false);
  };

  if (phase === 'victory') return <VictoryScreen unit={unit} lesson={lesson} xpEarned={xpEarned} combo={combo} enemy={enemyDef} navigate={navigate} />;
  if (phase === 'defeat')  return <DefeatScreen  unit={unit} lesson={lesson} enemy={enemyDef} navigate={navigate} />;

  const progress  = (step / exercises.length) * 100;
  const canAttack = selected !== null || fillValue.trim();
  const comboScale = Math.min(1 + combo * 0.12, 2.0);

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      background: `linear-gradient(180deg, #06040f 0%, #110820 40%, #0d0d22 100%)`,
      position: 'relative', overflow: 'hidden',
      fontFamily: "'Exo 2', sans-serif",
      animation: screenShake ? 'screenShake 0.4s ease' : 'none',
    }}>

      <Stars />
      <RealmParticles color={unit.color} />
      {introPhase && <IntroOverlay unit={unit} enemy={enemyDef} lesson={lesson} />}

      {/* Screen flash */}
      {flashColor && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 60, pointerEvents: 'none',
          background: flashColor === 'green' ? 'rgba(74,222,128,0.18)' : 'rgba(239,68,68,0.3)',
          animation: 'fadeFlash 0.32s ease-out forwards',
        }} />
      )}

      {/* Mute */}
      <button onClick={() => { const m = sounds.toggleMute(); setMuted(m); }} style={{
        position: 'absolute', top: 14, right: 14, zIndex: 20,
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 8, padding: '4px 9px', color: 'rgba(255,255,255,0.55)',
        fontSize: 15, cursor: 'pointer',
      }}>{muted ? '🔇' : '🔊'}</button>

      {/* ── TOP PROGRESS BAR ─────────────────────────────────────────────── */}
      <div style={{ padding: '14px 16px 6px', display: 'flex', alignItems: 'center', gap: 10, zIndex: 10 }}>
        <button onClick={() => navigate('/learn')} style={{
          background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', fontSize: 16,
          padding: '5px 11px', borderRadius: 8, fontWeight: 900,
          border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', flexShrink: 0,
        }}>✕</button>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.08)', borderRadius: 99, height: 12, overflow: 'hidden', border: `1px solid ${unit.color}30` }}>
          <div style={{
            background: `linear-gradient(90deg, ${unit.color}, #fff)`,
            height: '100%', width: `${progress}%`, borderRadius: 99,
            transition: 'width 0.5s cubic-bezier(.4,2,.6,1)',
            boxShadow: `0 0 12px ${unit.color}`,
          }} />
        </div>
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 700, minWidth: 34, textAlign: 'right', fontFamily: "'Press Start 2P', monospace" }}>
          {step + 1}/{exercises.length}
        </span>
      </div>

      {/* ── CHUNKY HP BARS ────────────────────────────────────────────────── */}
      <div style={{ padding: '2px 16px 8px', display: 'flex', flexDirection: 'column', gap: 5, zIndex: 10 }}>
        {/* Player HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ minWidth: 20, display: 'flex', justifyContent: 'center' }}>
            <HeroFigureSVG cls={cls} size={16} />
          </div>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 99, height: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
            <div style={{
              background: playerHpPct > 50 ? 'linear-gradient(90deg,#22c55e,#4ade80)' : playerHpPct > 25 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#dc2626,#f87171)',
              height: '100%', width: `${playerHpPct}%`, borderRadius: 99,
              transition: 'width 0.4s ease, background 0.3s',
              boxShadow: playerHpPct < 25 ? '0 0 8px #ef4444' : '0 0 6px rgba(74,222,128,0.5)',
              animation: playerHpPct < 25 ? 'hpPulse 0.7s ease-in-out infinite' : 'none',
            }} />
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'Press Start 2P'", minWidth: 24, textAlign: 'right' }}>{playerHp}</span>
        </div>
        {/* Enemy HP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, minWidth: 20, textAlign: 'center' }}>{enemyDef.sprite}</span>
          <div style={{ flex: 1, background: 'rgba(0,0,0,0.5)', borderRadius: 99, height: 14, overflow: 'hidden', border: `1px solid ${enemyDef.color}30`, position: 'relative' }}>
            <div style={{
              background: enemyHpPct > 50 ? `linear-gradient(90deg,${enemyDef.borderColor},${enemyDef.color})` : enemyHpPct > 25 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#991b1b,#ef4444)',
              height: '100%', width: `${enemyHpPct}%`, borderRadius: 99,
              transition: 'width 0.45s ease',
              boxShadow: `0 0 8px ${enemyDef.color}80`,
              animation: enemyHpPct < 25 ? 'hpPulse 0.7s ease-in-out infinite' : 'none',
            }} />
          </div>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontFamily: "'Press Start 2P'", minWidth: 24, textAlign: 'right' }}>{Math.max(0, Math.round(enemyHp))}</span>
        </div>
      </div>

      {/* ── ARCADE BATTLE ARENA ───────────────────────────────────────────── */}
      <div style={{
        margin: '2px 12px', height: 200,
        background: `linear-gradient(180deg, ${unit.color}08 0%, rgba(0,0,0,0.3) 100%)`,
        border: `1px solid ${unit.color}25`,
        borderRadius: 20, position: 'relative', overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Combo burst overlay */}
        {showCombo && (
          <div style={{
            position: 'absolute', top: '40%', left: '50%',
            transform: `translate(-50%,-50%) scale(${comboScale})`,
            fontFamily: "'Press Start 2P', monospace", fontSize: 17,
            color: combo >= 5 ? '#ff4400' : '#facc15',
            zIndex: 30, whiteSpace: 'nowrap',
            textShadow: `0 0 20px ${combo >= 5 ? '#ff4400' : '#facc15'}, 0 0 40px ${combo >= 5 ? '#ff4400' : '#facc15'}80`,
            animation: 'comboPop 1.5s ease-out forwards',
            letterSpacing: 2,
          }}>
            {combo >= 5 ? '⚡' : '🔥'} {combo}x COMBO {combo >= 5 ? '⚡' : ''}
          </div>
        )}

        {/* Projectile */}
        {projectile && (
          <div key={projectile.id} style={{
            position: 'absolute',
            top: '45%', left: projectile.dir === 'ltr' ? '18%' : '78%',
            width: 18, height: 18, borderRadius: '50%',
            background: projectile.color,
            boxShadow: `0 0 20px ${projectile.color}, 0 0 40px ${projectile.color}80`,
            zIndex: 25, pointerEvents: 'none',
            animation: projectile.dir === 'ltr' ? 'projLTR 0.45s cubic-bezier(.2,1.2,.8,1) forwards' : 'projRTL 0.45s cubic-bezier(.2,1.2,.8,1) forwards',
          }} />
        )}

        {/* Player sprite — Gio */}
        <div style={{
          position: 'absolute', left: '8%', bottom: '10%',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-block',
            animation: shakePlayer
              ? 'shakeAnim 0.4s ease'
              : phase === 'player-attack'
                ? 'playerLunge 0.4s ease'
                : 'playerFloat 3s ease-in-out infinite',
            filter: shakePlayer
              ? 'brightness(0.3) sepia(1) hue-rotate(-30deg)'
              : 'none',
          }}>
            <HeroFigureSVG cls={cls} size={56} />
          </div>

          {/* Player float damage */}
          {floatDmg?.side === 'player' && (
            <div style={{
              position: 'absolute', top: -22, left: '50%',
              color: '#f87171', fontWeight: 900, fontSize: 20,
              fontFamily: "'Press Start 2P', monospace",
              animation: 'floatUp 0.8s ease-out forwards',
              pointerEvents: 'none', whiteSpace: 'nowrap',
              textShadow: '0 0 10px rgba(239,68,68,0.9)',
            }}>-{floatDmg.value}</div>
          )}
        </div>

        {/* Enemy sprite + particles */}
        <div style={{
          position: 'absolute', right: '8%', bottom: '15%',
          textAlign: 'center',
        }}>
          {/* Hit particles */}
          {particles.map(p => (
            <div key={p.id} style={{
              position: 'absolute', top: '30%', left: '50%', width: 7, height: 7,
              background: p.color, borderRadius: '50%', pointerEvents: 'none',
              boxShadow: `0 0 8px ${p.color}`,
              animation: 'particleBurst 0.7s ease-out forwards',
              '--angle': `${p.angle}deg`, '--dist': `${p.dist}px`,
            }} />
          ))}

          <div style={{
            fontSize: enemyDef.boss ? 80 : 64, lineHeight: 1, display: 'inline-block',
            animation: shakeEnemy
              ? 'shakeAnim 0.4s ease'
              : phase === 'enemy-attack'
                ? 'enemyLunge 0.4s ease'
                : 'enemyFloat 2.4s ease-in-out infinite',
            filter: enemyHitFlash
              ? 'brightness(8) saturate(0) contrast(2)'
              : shakeEnemy
                ? 'brightness(0.3) sepia(1) saturate(3)'
                : `drop-shadow(0 0 18px ${enemyDef.color}90) drop-shadow(0 4px 8px rgba(0,0,0,0.5))`,
            transition: 'filter 0.08s',
          }}>{enemyDef.sprite}</div>

          {/* Boss crown aura */}
          {enemyDef.boss && (
            <div style={{
              position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
              fontSize: 18, animation: 'bossAura 1.5s ease-in-out infinite',
              filter: `drop-shadow(0 0 8px ${enemyDef.color})`,
            }}>👑</div>
          )}

          {/* Enemy float damage */}
          {floatDmg?.side === 'enemy' && (
            <div style={{
              position: 'absolute', top: -28, left: '50%',
              color: '#facc15', fontWeight: 900, fontSize: 24,
              fontFamily: "'Press Start 2P', monospace",
              animation: 'floatUp 0.8s ease-out forwards',
              pointerEvents: 'none', whiteSpace: 'nowrap',
              textShadow: '0 0 14px rgba(250,204,21,0.95)',
            }}>-{floatDmg.value}</div>
          )}
        </div>

        {/* Enemy name plate */}
        <div style={{
          position: 'absolute', top: 8, right: 10,
          fontFamily: "'Press Start 2P', monospace", fontSize: 7,
          color: enemyDef.boss ? '#fca5a5' : enemyDef.color,
          textShadow: `0 0 8px ${enemyDef.color}`,
          letterSpacing: 0.5,
        }}>
          {enemyDef.boss ? '👑 BOSS' : ''} {enemyDef.name}
        </div>

        {/* Phase status strip */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '4px 14px', fontSize: 10, fontWeight: 700, fontFamily: "'Press Start 2P', monospace",
          letterSpacing: 0.5,
          background: 'rgba(0,0,0,0.55)',
          color: phase === 'correct' ? '#4ade80' : phase === 'wrong' || phase === 'enemy-attack' ? '#f87171' : `${unit.color}cc`,
          textAlign: 'center',
        }}>
          {phase === 'question'      && `⚔️  ${enemyDef.name} awaits...`}
          {phase === 'player-attack' && `⚡  CRITICAL HIT! ${combo >= 3 ? `${combo}x COMBO!` : ''}`}
          {phase === 'enemy-attack'  && `💥  ${enemyDef.name} ATTACKS!`}
          {phase === 'correct'       && `✅  CORRECT! ${combo >= 2 ? `${combo}x STREAK!` : 'NICE!'}`}
          {phase === 'wrong'         && `❌  WRONG! TAKE DAMAGE!`}
        </div>
      </div>

      {/* Dialogue bubble */}
      <div style={{ padding: '4px 14px', minHeight: 44, zIndex: 10 }}>
        <DialogueBubble dialogue={dialogue} enemyColor={enemyDef.color} playerSprite={playerSprite} />
      </div>

      {/* ── ARCADE CABINET QUESTION PANEL ────────────────────────────────── */}
      <div style={{
        flex: 1, margin: '0 10px 12px',
        background: 'rgba(6,4,18,0.96)',
        border: `2px solid ${unit.color}60`,
        borderRadius: 18,
        boxShadow: `0 0 30px ${unit.color}20 inset, 0 0 20px ${unit.color}15`,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden', position: 'relative',
      }}>

        {/* Cabinet top neon strip */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${unit.color}, ${unit.color}, transparent)`,
          opacity: 0.8,
        }} />

        {/* Scrollable content area */}
        <div style={{ flex: 1, padding: '12px 14px 0', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* Question type badge */}
          <span style={{
            display: 'inline-block', fontSize: 9, fontWeight: 700,
            color: unit.color, textTransform: 'uppercase', letterSpacing: 2,
            fontFamily: "'Press Start 2P', monospace",
            textShadow: `0 0 10px ${unit.color}`,
          }}>
            {t(`battle.types.${exercise.type}`)}
          </span>

          {/* Question */}
          <h2 style={{ fontSize: 14, fontWeight: 800, color: 'white', lineHeight: 1.5, whiteSpace: 'pre-wrap', margin: 0 }}>
            {exercise.question}
          </h2>

          {/* Code block */}
          {exercise.code && (
            <pre style={{
              background: '#050510', color: '#c9d1d9', borderRadius: 12, padding: '10px 13px',
              fontSize: 12, fontFamily: '"Courier New", monospace',
              border: `1px solid ${unit.color}30`, overflowX: 'auto', lineHeight: 1.65,
              boxShadow: `0 0 15px rgba(0,0,0,0.8), 0 0 8px ${unit.color}10 inset`,
              margin: 0,
            }}>{exercise.code}</pre>
          )}

          {/* ── Multiple choice — 2x2 arcade grid ────────────────────────── */}
          {(exercise.type === 'multiple_choice' || exercise.type === 'output_predict') && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: exercise.options.length <= 2 ? '1fr' : '1fr 1fr',
              gap: 8,
            }}>
              {exercise.options.map((opt, i) => {
                const isSelected = selected === i;
                const revealed = phase !== 'question' && phase !== 'player-attack' && phase !== 'enemy-attack';
                let bg     = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.1)';
                let color  = 'rgba(255,255,255,0.82)';
                let glow   = 'none';
                let scale  = 'scale(1)';
                if (!revealed && isSelected) {
                  bg = `${unit.color}22`; border = unit.color;
                  glow = `0 0 18px ${unit.color}60`; scale = 'scale(1.03)';
                }
                if (revealed) {
                  if (i === exercise.correct) { bg = 'rgba(74,222,128,0.15)'; border = '#4ade80'; color = '#86efac'; glow = '0 0 14px rgba(74,222,128,0.4)'; }
                  else if (isSelected) { bg = 'rgba(239,68,68,0.15)'; border = '#ef4444'; color = '#fca5a5'; }
                }
                return (
                  <button key={i}
                    onClick={() => { if (phase === 'question') { sounds.select(); setSelected(i); } }}
                    style={{
                      background: bg, border: `2px solid ${border}`, borderRadius: 12,
                      padding: '11px 12px', textAlign: 'left', fontWeight: 700,
                      fontSize: 13, color, boxShadow: glow,
                      transform: scale, transition: 'all 0.15s cubic-bezier(.4,2,.6,1)',
                      cursor: phase === 'question' ? 'pointer' : 'default',
                      fontFamily: "'Exo 2', sans-serif", lineHeight: 1.35,
                      minHeight: 50,
                    }}
                  >
                    <span style={{ fontSize: 9, opacity: 0.45, fontFamily: "'Press Start 2P'", display: 'block', marginBottom: 3 }}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Fill / Fix input ──────────────────────────────────────────── */}
          {(exercise.type === 'fill_blank' || exercise.type === 'fix_bug') && (
            <div>
              {exercise.type === 'fix_bug' ? (
                <textarea rows={4} value={fillValue}
                  onChange={e => phase === 'question' && setFillValue(e.target.value)}
                  disabled={phase !== 'question'}
                  style={{
                    width: '100%', padding: '11px 13px', borderRadius: 12,
                    border: `2px solid ${phase === 'correct' ? '#4ade80' : phase === 'wrong' ? '#ef4444' : `${unit.color}40`}`,
                    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 13,
                    fontFamily: '"Courier New", monospace', resize: 'none', outline: 'none',
                    fontWeight: 600, lineHeight: 1.6, boxSizing: 'border-box',
                    boxShadow: phase === 'correct' ? '0 0 10px rgba(74,222,128,0.3)' : 'none',
                  }}
                  placeholder={t('battle.placeholders.fix')}
                />
              ) : (
                <input value={fillValue}
                  onChange={e => phase === 'question' && setFillValue(e.target.value)}
                  disabled={phase !== 'question'}
                  onKeyDown={e => e.key === 'Enter' && canAttack && phase === 'question' && checkAnswer()}
                  style={{
                    width: '100%', padding: '13px 15px', borderRadius: 12,
                    border: `2px solid ${phase === 'correct' ? '#4ade80' : phase === 'wrong' ? '#ef4444' : `${unit.color}40`}`,
                    background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: 15,
                    fontFamily: '"Courier New", monospace', outline: 'none',
                    fontWeight: 700, boxSizing: 'border-box',
                    boxShadow: phase === 'correct' ? '0 0 10px rgba(74,222,128,0.3)' : 'none',
                  }}
                  placeholder={t('battle.placeholders.fill')}
                />
              )}
              {exercise.hint && phase === 'wrong' && (
                <p style={{ color: '#fb923c', fontSize: 12, fontWeight: 700, marginTop: 6 }}>💡 {exercise.hint}</p>
              )}
            </div>
          )}

          {/* Hint */}
          {(phase === 'question' || phase === 'wrong') && (
            <button onClick={() => { sounds.click(); getHint(); }} disabled={loadingHint} style={{
              background: 'transparent', border: '1px solid rgba(250,204,21,0.3)',
              borderRadius: 10, color: '#fde68a', padding: '7px 14px',
              fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 6, cursor: 'pointer', fontFamily: "'Exo 2', sans-serif",
            }}>
              {loadingHint ? t('battle.hintLoading') : t('battle.hintBtn')}
            </button>
          )}
          {hint && (
            <div style={{
              background: 'rgba(250,204,21,0.07)', border: '1px solid rgba(250,204,21,0.28)',
              borderRadius: 12, padding: 12, fontSize: 13, fontWeight: 600, color: '#fde68a',
            }}>
              🐉 <strong>Py:</strong> {hint}
            </div>
          )}

          {/* Explanation */}
          {(phase === 'correct' || phase === 'wrong') && exercise.explanation && (
            <div style={{
              background: phase === 'correct' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${phase === 'correct' ? 'rgba(74,222,128,0.32)' : 'rgba(239,68,68,0.32)'}`,
              borderRadius: 12, padding: '11px 13px', fontSize: 13, fontWeight: 600,
              color: phase === 'correct' ? '#86efac' : '#fca5a5',
              animation: 'slideUp 0.3s ease-out',
            }}>
              {phase === 'correct' ? '✅' : '📖'} {exercise.explanation}
            </div>
          )}
        </div>

        {/* ── Attack / Next button ─────────────────────────────────────── */}
        <div style={{ padding: '10px 14px 16px', flexShrink: 0 }}>
          {phase === 'question' ? (
            <button onClick={checkAnswer} disabled={!canAttack} style={{
              width: '100%', padding: '16px',
              background: canAttack
                ? `linear-gradient(135deg, ${unit.color} 0%, ${unit.borderColor} 100%)`
                : 'rgba(255,255,255,0.06)',
              color: canAttack ? '#fff' : 'rgba(255,255,255,0.2)',
              borderRadius: 14, fontSize: 14, fontWeight: 900,
              border: canAttack ? `1px solid ${unit.color}` : '1px solid rgba(255,255,255,0.1)',
              boxShadow: canAttack ? `0 5px 0 ${unit.borderColor}, 0 0 28px ${unit.color}50` : 'none',
              transform: btnPressed ? 'scale(0.97) translateY(4px)' : 'scale(1)',
              transition: 'all 0.1s',
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: 1.5,
              animation: canAttack ? 'btnPulse 1.6s ease-in-out infinite' : 'none',
              cursor: canAttack ? 'pointer' : 'not-allowed',
            }}>
              {t('battle.attackBtn')}
            </button>
          ) : (phase === 'correct' || phase === 'wrong') ? (
            <button onClick={nextStep} style={{
              width: '100%', padding: '16px',
              background: phase === 'correct'
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #f87171, #dc2626)',
              color: 'white', borderRadius: 14, fontSize: 13, fontWeight: 900,
              border: 'none',
              boxShadow: phase === 'correct'
                ? '0 5px 0 #14532d, 0 0 24px rgba(74,222,128,0.4)'
                : '0 5px 0 #7f1d1d, 0 0 16px rgba(239,68,68,0.3)',
              fontFamily: "'Press Start 2P', monospace",
              letterSpacing: 1.5, cursor: 'pointer',
              animation: 'slideUp 0.25s ease-out',
            }}>
              {phase === 'correct' ? t('battle.nextBtn') : t('battle.continueBtn')}
            </button>
          ) : null}
        </div>

        {/* Cabinet bottom neon strip */}
        <div style={{
          height: 3,
          background: `linear-gradient(90deg, transparent, ${unit.color}, ${unit.color}, transparent)`,
          opacity: 0.5,
        }} />
      </div>

      <style>{`
        @keyframes shakeAnim {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px)} 40%{transform:translateX(10px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
        }
        @keyframes screenShake {
          0%,100%{transform:translateX(0)} 15%{transform:translateX(-14px)} 30%{transform:translateX(14px)} 45%{transform:translateX(-10px)} 65%{transform:translateX(10px)} 80%{transform:translateX(-5px)}
        }
        @keyframes floatUp {
          0%{opacity:1;transform:translate(-50%,0) scale(1.4)} 100%{opacity:0;transform:translate(-50%,-52px) scale(0.8)}
        }
        @keyframes enemyFloat {
          0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)}
        }
        @keyframes playerFloat {
          0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-5px) scale(1.04)}
        }
        @keyframes playerLunge {
          0%{transform:translateX(0)} 40%{transform:translateX(40px) scale(1.15)} 100%{transform:translateX(0)}
        }
        @keyframes enemyLunge {
          0%{transform:translateX(0)} 40%{transform:translateX(-36px) scale(1.1)} 100%{transform:translateX(0)}
        }
        @keyframes projLTR {
          0%{transform:translateX(0);opacity:1}
          100%{transform:translateX(260px);opacity:0.2}
        }
        @keyframes projRTL {
          0%{transform:translateX(0);opacity:1}
          100%{transform:translateX(-260px);opacity:0.2}
        }
        @keyframes fadeFlash {
          0%{opacity:1} 100%{opacity:0}
        }
        @keyframes comboPop {
          0%{opacity:0;transform:translate(-50%,-50%) scale(0.3)} 20%{opacity:1;transform:translate(-50%,-50%) scale(1.3)} 75%{opacity:1;transform:translate(-50%,-50%) scale(1.1)} 100%{opacity:0;transform:translate(-50%,-50%) scale(0.9)}
        }
        @keyframes particleBurst {
          0%{opacity:1;transform:translate(0,0) scale(1.2)}
          100%{opacity:0;transform:translate(calc(cos(var(--angle)) * var(--dist)), calc(sin(var(--angle)) * var(--dist))) scale(0)}
        }
        @keyframes hpPulse {
          0%,100%{opacity:1} 50%{opacity:0.4}
        }
        @keyframes btnPulse {
          0%,100%{box-shadow:0 5px 0 ${unit.borderColor}, 0 0 20px ${unit.color}40}
          50%{box-shadow:0 5px 0 ${unit.borderColor}, 0 0 36px ${unit.color}70}
        }
        @keyframes slideUp {
          0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)}
        }
        @keyframes starTwinkle {
          0%,100%{opacity:0.15} 50%{opacity:0.75}
        }
        @keyframes realmFloat {
          0%{transform:translateY(0) scale(0.9);opacity:0}
          10%{opacity:0.8}
          80%{opacity:0.4}
          100%{transform:translateY(-180px) scale(0.3);opacity:0}
        }
        @keyframes bossAura {
          0%,100%{transform:translateX(-50%) scale(1);opacity:0.8} 50%{transform:translateX(-50%) scale(1.2);opacity:1}
        }
        @keyframes introSlide {
          0%{opacity:0;transform:translateY(-20px)} 100%{opacity:1;transform:translateY(0)}
        }
        @keyframes introPop {
          0%{opacity:0;transform:scale(0.4)} 70%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)}
        }
        @keyframes dialoguePop {
          0%{opacity:0;transform:translateY(5px) scale(0.96)} 100%{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes blinkCursor {
          0%,100%{opacity:1} 50%{opacity:0}
        }
        @keyframes blinkText {
          0%,100%{opacity:0.5} 50%{opacity:1}
        }
        @keyframes glowPulse {
          0%,100%{opacity:.5;transform:translateX(-50%) scale(1)} 50%{opacity:.9;transform:translateX(-50%) scale(1.12)}
        }
        @keyframes particleOut {
          0%{transform:translate(0,0) scale(1);opacity:1}
          100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}
        }
        @keyframes ringOut {
          0%{transform:scale(0);opacity:1}
          100%{transform:scale(18);opacity:0}
        }
      `}</style>
    </div>
  );
}

// ─── Realm ambient particles ───────────────────────────────────────────────────
function RealmParticles({ color }) {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i, x: (i * 19 + 5) % 90 + 5,
    size: 2 + (i % 5), dur: 3.5 + (i % 5),
    delay: -(i * 0.6) % 6, opacity: 0.12 + (i % 4) * 0.07,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, bottom: '-8px',
          width: p.size, height: p.size, borderRadius: '50%',
          background: color, opacity: p.opacity,
          boxShadow: `0 0 ${p.size * 3}px ${color}`,
          animation: `realmFloat ${p.dur}s ${p.delay}s linear infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Starfield ─────────────────────────────────────────────────────────────────
function Stars() {
  const stars = Array.from({ length: 24 }, (_, i) => ({
    id: i, x: (i * 37 + 11) % 100, y: (i * 53 + 7) % 100,
    size: 1 + (i % 3), delay: (i * 0.3) % 3, dur: 2 + (i % 3),
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          animation: `starTwinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
        }} />
      ))}
    </div>
  );
}

// ─── Dialogue bubble ───────────────────────────────────────────────────────────
function DialogueBubble({ dialogue, enemyColor, playerSprite }) {
  if (!dialogue.visible) return null;
  const isPy = dialogue.who === 'py';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 8,
      justifyContent: isPy ? 'flex-start' : 'flex-end',
      animation: 'dialoguePop 0.25s ease-out',
    }}>
      {isPy && <span style={{ fontSize: 20, flexShrink: 0 }}>{playerSprite}</span>}
      <div style={{
        background: isPy ? 'rgba(74,222,128,0.1)' : `${enemyColor}14`,
        border: `1px solid ${isPy ? 'rgba(74,222,128,0.3)' : `${enemyColor}45`}`,
        borderRadius: isPy ? '4px 13px 13px 13px' : '13px 4px 13px 13px',
        padding: '6px 11px', maxWidth: '78%',
        fontSize: 11, fontWeight: 700,
        color: isPy ? '#86efac' : 'rgba(255,255,255,0.82)',
        fontStyle: 'italic',
      }}>
        "{dialogue.text}"
      </div>
      {!isPy && <span style={{ fontSize: 20, flexShrink: 0 }}>⚔️</span>}
    </div>
  );
}

// ─── Particle burst for unit outro ────────────────────────────────────────────
function OutroBurst({ color }) {
  const palette = [color, '#facc15', '#ffffff', '#58CC02', '#CE82FF', '#1CB0F6'];
  const particles = Array.from({ length: 48 }, (_, i) => {
    const angle = (i / 48) * 360;
    const dist  = 90 + (i % 5) * 30;
    return {
      id: i, size: 4 + (i % 4) * 2,
      color: palette[i % palette.length],
      delay: (i % 7) * 28,
      tx: Math.cos(angle * Math.PI / 180) * dist,
      ty: Math.sin(angle * Math.PI / 180) * dist,
    };
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      pointerEvents: 'none',
    }}>
      {[0, 100, 220].map((d, i) => (
        <div key={i} style={{
          position: 'absolute', width: 16, height: 16, borderRadius: '50%',
          border: `3px solid ${palette[i]}`,
          animation: `ringOut 1.1s ${d}ms cubic-bezier(0,.5,.5,1) forwards`,
        }} />
      ))}
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          '--tx': `${p.tx}px`, '--ty': `${p.ty}px`,
          animation: `particleOut 1s ${p.delay}ms cubic-bezier(.2,1,.4,1) forwards`,
        }} />
      ))}
    </div>
  );
}

// ─── Battle intro overlay ──────────────────────────────────────────────────────
function IntroOverlay({ unit, enemy, lesson }) {
  const lLesson = locLesson(unit.id, lesson);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'linear-gradient(180deg, #000010, #1a0030)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 14,
      animation: 'fadeFlash 0.3s ease-out 1.9s forwards',
    }}>
      <div style={{ fontSize: 72, animation: 'introPop 0.5s ease-out forwards' }}>
        {enemy.sprite}
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace", fontSize: 11,
        color: '#fca5a5', letterSpacing: 3,
        animation: 'introSlide 0.4s ease-out 0.2s both',
        textShadow: '0 0 20px rgba(252,165,165,0.8)',
      }}>
        {enemy.boss ? '⚠️  BOSS BATTLE' : '⚔️  BATTLE START'}
      </div>
      <div style={{
        fontFamily: "'Press Start 2P', monospace", fontSize: 18,
        color: enemy.color, textAlign: 'center', padding: '0 24px',
        textShadow: `0 0 28px ${enemy.color}`,
        animation: 'introSlide 0.4s ease-out 0.35s both',
      }}>
        {enemy.name}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.45)', fontSize: 11, fontWeight: 700,
        animation: 'introSlide 0.4s ease-out 0.5s both',
      }}>
        {lLesson.title}
      </div>
    </div>
  );
}

// ─── Victory screen ────────────────────────────────────────────────────────────
function VictoryScreen({ unit, lesson, xpEarned, combo, enemy, navigate }) {
  const { getPlayer, markOutroSeen, hasSeenOutro } = useStory();
  const { completed } = useProgress();
  const { t } = useTranslation();

  const allLessonsDone = unit.lessons.every(l =>
    l.id === lesson.id || completed.some(c => c.unit_id === unit.id && c.lesson_id === l.id)
  );
  const isUnitClear = allLessonsDone && !hasSeenOutro(unit.id);
  const outro = UNIT_OUTROS[unit.id];

  const [showOutro, setShowOutro]   = useState(isUnitClear);
  const [outroDone, setOutroDone]   = useState(false);
  const [outroText, setOutroText]   = useState('');
  const [showBurst, setShowBurst]   = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isUnitClear) {
      setTimeout(() => sounds.fragmentGet(), 300);
      setTimeout(() => setShowBurst(true), 500);
      setTimeout(() => setShowBurst(false), 2200);
    } else {
      sounds.victory();
    }
  }, []);

  useEffect(() => {
    if (!showOutro || !outro) return;
    let i = 0;
    intervalRef.current = setInterval(() => {
      i++;
      setOutroText(outro.text.slice(0, i));
      if (i % 4 === 0 && outro.text[i - 1] !== ' ') sounds.typeClick();
      if (i >= outro.text.length) { clearInterval(intervalRef.current); setOutroDone(true); }
    }, 28);
    return () => clearInterval(intervalRef.current);
  }, [showOutro]);

  const dismissOutro = () => {
    if (!outroDone) {
      clearInterval(intervalRef.current);
      setOutroText(outro.text);
      setOutroDone(true);
      return;
    }
    markOutroSeen(unit.id);
    if (unit.id === 5) {
      sounds.epicBoom();
      navigate('/epilogue');
    } else {
      setShowOutro(false);
    }
  };

  const outroColor = outro?.color || unit.color;

  if (showOutro && outro) {
    return (
      <div onClick={dismissOutro} style={{
        maxWidth: 480, margin: '0 auto', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 28, textAlign: 'center', cursor: 'pointer',
        background: `linear-gradient(180deg, #050510 0%, ${outroColor}12 50%, #050510 100%)`,
        fontFamily: "'Exo 2', sans-serif", position: 'relative', overflow: 'hidden',
      }}>
        <Stars />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: `radial-gradient(circle, ${outroColor}30 0%, transparent 70%)`,
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          pointerEvents: 'none', animation: 'glowPulse 3s ease-in-out infinite',
        }} />
        {showBurst && <OutroBurst color={outroColor} />}
        <div style={{
          fontSize: 72, marginBottom: 12,
          animation: 'introPop 0.6s cubic-bezier(.2,1.6,.4,1)',
          filter: `drop-shadow(0 0 28px ${outroColor}) drop-shadow(0 0 8px white)`,
          position: 'relative', zIndex: 2,
        }}>{outro.emoji}</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace", fontSize: 10,
          color: outroColor, letterSpacing: 2, marginBottom: 20,
          textShadow: `0 0 16px ${outroColor}`, position: 'relative', zIndex: 2,
        }}>{outro.title}</div>
        <div style={{
          background: 'rgba(0,0,0,0.4)', border: `1px solid ${outroColor}35`,
          borderRadius: 20, padding: '20px 24px', marginBottom: 24, maxWidth: 380,
          fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.9,
          whiteSpace: 'pre-wrap', textAlign: 'left', minHeight: 120,
          fontStyle: 'italic', position: 'relative', zIndex: 2,
          boxShadow: `0 0 40px ${outroColor}10 inset`,
        }}>
          {outroText}
          {!outroDone && <span style={{ animation: 'blinkCursor 0.7s ease-in-out infinite' }}>▌</span>}
        </div>
        <div style={{
          opacity: outroDone ? 1 : 0, transition: 'opacity 0.4s ease',
          fontFamily: "'Press Start 2P', monospace", fontSize: 9,
          color: unit.id === 5 ? outroColor : 'rgba(255,255,255,0.35)',
          letterSpacing: 2, zIndex: 2,
          animation: outroDone ? 'blinkText 1.3s ease-in-out infinite' : 'none',
          textShadow: unit.id === 5 ? `0 0 10px ${outroColor}` : 'none',
        }}>
          {unit.id === 5 ? '⚔️ THE FINAL RECKONING →' : t('victory.tapContinue')}
        </div>
        <style>{`
          @keyframes glowPulse { 0%,100%{opacity:.6;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.1)} }
          @keyframes particleOut { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
          @keyframes ringOut { 0%{transform:scale(0);opacity:1} 100%{transform:scale(18);opacity:0} }
          @keyframes blinkCursor { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes blinkText { 0%,100%{opacity:0.5} 50%{opacity:1} }
          @keyframes starTwinkle { 0%,100%{opacity:0.15} 50%{opacity:0.75} }
          @keyframes introPop { 0%{opacity:0;transform:scale(0.4)} 70%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)} }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 28, textAlign: 'center',
      background: 'linear-gradient(180deg, #0a0a1a, #0d2010, #0a0a1a)',
      fontFamily: "'Exo 2', sans-serif",
    }}>
      <Stars />
      <div style={{ fontSize: 72, marginBottom: 6, animation: 'introPop 0.5s ease-out' }}>🏆</div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#facc15', marginBottom: 6, letterSpacing: 1 }}>
        {t('victory.title')}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 24, fontSize: 13 }}>
        {enemy.name} {t('victory.defeated')}
      </p>
      <div style={{
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 22, padding: '22px 28px', marginBottom: 24, width: '100%',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {[
          { val: `+${xpEarned}`, label: t('victory.xpEarned'),     color: '#facc15' },
          { val: combo,          label: t('victory.maxCombo'),      color: '#f97316' },
          { val: enemy.sprite,   label: t('victory.defeatedLabel'), color: enemy.color },
        ].map(({ val, label, color }) => (
          <div key={label}>
            <div style={{ fontSize: 30, fontWeight: 900, color, fontFamily: "'Press Start 2P', monospace" }}>{val}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700, marginTop: 4, fontFamily: "'Press Start 2P', monospace" }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button onClick={() => { sounds.click(); navigate('/tetris', { state: { returnTo: '/learn' } }); }} style={{
          padding: '15px', borderRadius: 16, fontWeight: 900, fontSize: 12,
          background: `linear-gradient(135deg, ${unit.color}, ${unit.borderColor})`,
          color: 'white', boxShadow: `0 5px 0 ${unit.borderColor}, 0 0 24px ${unit.color}55`,
          fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, cursor: 'pointer',
          border: 'none',
        }}>{t('victory.nextBattle')}</button>
        <button onClick={() => { sounds.click(); navigate('/'); }} style={{
          padding: '12px', borderRadius: 16, fontWeight: 700, fontSize: 12,
          background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
        }}>{t('victory.returnCamp')}</button>
      </div>
      <style>{`
        @keyframes introPop { 0%{opacity:0;transform:scale(0.4)} 70%{transform:scale(1.18)} 100%{opacity:1;transform:scale(1)} }
        @keyframes starTwinkle { 0%,100%{opacity:0.15} 50%{opacity:0.75} }
      `}</style>
    </div>
  );
}

// ─── Defeat screen ─────────────────────────────────────────────────────────────
function DefeatScreen({ unit, lesson, enemy, navigate }) {
  const { t } = useTranslation();
  useEffect(() => { sounds.defeat(); }, []);
  return (
    <div style={{
      maxWidth: 480, margin: '0 auto', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: 28, textAlign: 'center',
      background: 'linear-gradient(180deg, #1a0000, #3d0000, #1a0000)',
      fontFamily: "'Exo 2', sans-serif",
    }}>
      <Stars />
      <div style={{ fontSize: 72, marginBottom: 6 }}>💀</div>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 14, color: '#f87171', marginBottom: 6, letterSpacing: 1 }}>
        {t('defeat.title')}
      </div>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 700, marginBottom: 24, fontSize: 13 }}>
        {t('defeat.msg')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <button onClick={() => { sounds.click(); navigate(`/lesson/${unit.id}/${lesson.id}`); }} style={{
          padding: '15px', borderRadius: 16, fontWeight: 900, fontSize: 12,
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white', boxShadow: '0 5px 0 #7f1d1d',
          fontFamily: "'Press Start 2P', monospace", letterSpacing: 1, cursor: 'pointer', border: 'none',
        }}>{t('defeat.retry')}</button>
        <button onClick={() => { sounds.click(); navigate('/learn'); }} style={{
          padding: '12px', borderRadius: 16, fontWeight: 700, fontSize: 12,
          background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer',
        }}>{t('defeat.retreat')}</button>
      </div>
      <style>{`
        @keyframes starTwinkle { 0%,100%{opacity:0.15} 50%{opacity:0.75} }
      `}</style>
    </div>
  );
}
