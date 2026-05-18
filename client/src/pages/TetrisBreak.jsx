import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sounds } from '../utils/sounds.js';

const W = 10, H = 20, CELL = 26;
const GOLD  = '#facc15';
const GOLD2 = '#f59e0b';
const DARK  = '#92400e';
const BG    = 'linear-gradient(180deg, #1a0e00 0%, #2d1800 50%, #1a0e00 100%)';

const PIECES = {
  I: { cells: [[0,1],[1,1],[2,1],[3,1]], color: '#facc15' },
  O: { cells: [[0,0],[1,0],[0,1],[1,1]], color: '#fbbf24' },
  T: { cells: [[1,0],[0,1],[1,1],[2,1]], color: '#f97316' },
  S: { cells: [[1,0],[2,0],[0,1],[1,1]], color: '#fb923c' },
  Z: { cells: [[0,0],[1,0],[1,1],[2,1]], color: '#fdba74' },
  J: { cells: [[0,0],[0,1],[1,1],[2,1]], color: '#fcd34d' },
  L: { cells: [[2,0],[0,1],[1,1],[2,1]], color: '#fde68a' },
};
const PKS    = Object.keys(PIECES);
const SPEEDS = [800, 700, 580, 470, 370, 280, 200, 140, 100, 70];
const PTS    = [0, 100, 300, 500, 800];
const HEARTS_PER_LINES  = 5;
const MAX_SESSION_HEARTS = 3;

function randPiece() {
  const k = PKS[Math.floor(Math.random() * PKS.length)];
  return { cells: PIECES[k].cells.map(c => [...c]), color: PIECES[k].color, x: 3, y: 0 };
}
function rotateCW(cells) {
  const mx = Math.max(...cells.map(([x]) => x));
  return cells.map(([x, y]) => [y, mx - x]);
}
function valid(cells, px, py, board) {
  return cells.every(([cx, cy]) => {
    const nx = cx + px, ny = cy + py;
    return nx >= 0 && nx < W && ny < H && (ny < 0 || !board[ny]?.[nx]);
  });
}
function mergeBoard(piece, board) {
  const b = board.map(r => [...r]);
  piece.cells.forEach(([cx, cy]) => {
    const ny = cy + piece.y;
    if (ny >= 0 && ny < H) b[ny][cx + piece.x] = piece.color;
  });
  return b;
}
function sweep(board) {
  const kept = board.filter(r => r.some(c => !c));
  const n = H - kept.length;
  return { board: [...Array.from({ length: n }, () => Array(W).fill(null)), ...kept], n };
}
function ghostY(piece, board) {
  let y = piece.y;
  while (valid(piece.cells, piece.x, y + 1, board)) y++;
  return y;
}
function emptyBoard() {
  return Array.from({ length: H }, () => Array(W).fill(null));
}
async function postAddHearts(amount) {
  try {
    await fetch('/api/progress/add-hearts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
  } catch {}
}

export default function TetrisBreak() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const returnTo  = location.state?.returnTo || '/learn';

  // phase: 'intro' → 'idle' → 'playing' → 'over'
  const [phase, setPhase] = useState('intro');
  const [introStep, setIntroStep] = useState(0); // 0=py appears, 1=rules, 2=countdown
  const [countdown, setCountdown] = useState(3);
  const [heartFlash, setHeartFlash] = useState(false);
  const [, redraw] = useState(0);
  const tick = () => redraw(n => n + 1);

  const g   = useRef({ board: emptyBoard(), cur: null, next: randPiece(), score: 0, lines: 0, level: 0, heartsEarned: 0, prevHeartThreshold: 0 });
  const tmr = useRef(null);

  // ── Intro sequence ────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'intro') return;
    sounds.tetrisIntro();

    // Step 0→1 after 1s
    const t1 = setTimeout(() => setIntroStep(1), 900);
    // Step 1→2 after 2.2s
    const t2 = setTimeout(() => setIntroStep(2), 2200);
    // Countdown 3→2→1→GO then idle
    const t3 = setTimeout(() => { sounds.click(); setCountdown(2); }, 3000);
    const t4 = setTimeout(() => { sounds.click(); setCountdown(1); }, 3700);
    const t5 = setTimeout(() => { sounds.select(); setCountdown(0); }, 4400);
    const t6 = setTimeout(() => setPhase('idle'), 5000);

    return () => [t1,t2,t3,t4,t5,t6].forEach(clearTimeout);
  }, [phase]);

  const skipIntro = () => {
    sounds.click();
    setPhase('idle');
  };

  // ── Game logic ────────────────────────────────────────────────────────────
  const flashHeart = () => {
    sounds.tetrisHeart();
    setHeartFlash(true);
    setTimeout(() => setHeartFlash(false), 1000);
  };

  const spawn = () => {
    const p = { ...g.current.next, x: 3, y: 0, cells: g.current.next.cells.map(c => [...c]) };
    g.current.cur  = p;
    g.current.next = randPiece();
    if (!valid(p.cells, p.x, p.y, g.current.board)) {
      g.current.phase = 'over';
      sounds.defeat();
      setPhase('over');
      clearInterval(tmr.current);
    }
  };

  const land = () => {
    const s = g.current;
    const merged = mergeBoard(s.cur, s.board);
    const { board: swept, n } = sweep(merged);
    s.board  = swept;
    s.lines += n;
    s.score += PTS[n] * (s.level + 1);

    if (n > 0) {
      if (n === 4) sounds.victory();
      else sounds.correct();

      const newThreshold = Math.floor(s.lines / HEARTS_PER_LINES);
      if (newThreshold > s.prevHeartThreshold && s.heartsEarned < MAX_SESSION_HEARTS) {
        s.heartsEarned = Math.min(MAX_SESSION_HEARTS, s.heartsEarned + (newThreshold - s.prevHeartThreshold));
        s.prevHeartThreshold = newThreshold;
        flashHeart();
      }
    } else {
      sounds.tetrisLand();
    }

    const lv = Math.min(9, Math.floor(s.lines / 10));
    if (lv > s.level) {
      s.level = lv;
      clearInterval(tmr.current);
      tmr.current = setInterval(gravity, SPEEDS[s.level]);
    }
    spawn();
  };

  const gravity = () => {
    const s = g.current;
    if (s.phase !== 'playing') return;
    if (!s.cur) { spawn(); tick(); return; }
    if (valid(s.cur.cells, s.cur.x, s.cur.y + 1, s.board)) s.cur.y++;
    else land();
    tick();
  };

  const startGame = () => {
    sounds.trainingReady();
    g.current = { board: emptyBoard(), cur: null, next: randPiece(), score: 0, lines: 0, level: 0, phase: 'playing', heartsEarned: 0, prevHeartThreshold: 0 };
    spawn();
    clearInterval(tmr.current);
    tmr.current = setInterval(gravity, SPEEDS[0]);
    setPhase('playing');
    tick();
  };

  const moveLeft  = () => { const s = g.current; if (phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x - 1, s.cur.y, s.board)) { s.cur.x--; sounds.click(); tick(); } };
  const moveRight = () => { const s = g.current; if (phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x + 1, s.cur.y, s.board)) { s.cur.x++; sounds.click(); tick(); } };
  const moveDown  = () => { const s = g.current; if (phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x, s.cur.y + 1, s.board)) { s.cur.y++; tick(); } else land(); };

  const rotate = () => {
    const s = g.current;
    if (phase !== 'playing' || !s.cur) return;
    const rot = rotateCW(s.cur.cells);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (valid(rot, s.cur.x + dx, s.cur.y, s.board)) {
        s.cur.cells = rot; s.cur.x += dx;
        sounds.select();
        tick(); return;
      }
    }
  };

  const hardDrop = () => {
    const s = g.current;
    if (phase !== 'playing' || !s.cur) return;
    sounds.projectile();
    s.cur.y = ghostY(s.cur, s.board);
    land(); tick();
  };

  const exitGame = async () => {
    clearInterval(tmr.current);
    const earned = g.current.heartsEarned;
    if (earned > 0) {
      sounds.missionClear();
      await postAddHearts(earned);
    } else {
      sounds.click();
    }
    navigate(returnTo);
  };

  const skipGame = () => {
    sounds.click();
    clearInterval(tmr.current);
    navigate(returnTo);
  };

  useEffect(() => {
    const onKey = e => {
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code)) e.preventDefault();
      if (phase === 'intro') { if (e.code === 'Space' || e.code === 'Enter') skipIntro(); return; }
      if (phase !== 'playing' && (e.code === 'Enter' || e.code === 'Space')) { startGame(); return; }
      switch (e.code) {
        case 'ArrowLeft':  moveLeft();   break;
        case 'ArrowRight': moveRight();  break;
        case 'ArrowDown':  moveDown();   break;
        case 'ArrowUp':    rotate();     break;
        case 'Space':      hardDrop();   break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearInterval(tmr.current); };
  }, [phase]);

  const s = g.current;

  // Build display with ghost + active piece
  const display = s.board.map(r => [...r]);
  if (s.cur && phase === 'playing') {
    const gy = ghostY(s.cur, s.board);
    s.cur.cells.forEach(([cx, cy]) => {
      const ny = cy + gy;
      if (ny >= 0 && ny < H && !display[ny][cx + s.cur.x])
        display[ny][cx + s.cur.x] = s.cur.color + '28';
    });
    s.cur.cells.forEach(([cx, cy]) => {
      const ny = cy + s.cur.y;
      if (ny >= 0 && ny < H) display[ny][cx + s.cur.x] = s.cur.color;
    });
  }

  const nextGrid = Array.from({ length: 4 }, () => Array(4).fill(null));
  if (s.next) s.next.cells.forEach(([cx, cy]) => { if (cy < 4 && cx < 4) nextGrid[cy][cx] = s.next.color; });

  const boardW = W * CELL;
  const boardH = H * CELL;
  const heartProgress = phase === 'playing' ? ((s.lines % HEARTS_PER_LINES) / HEARTS_PER_LINES) * 100 : 0;

  // ── INTRO SCREEN ───────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div
        onClick={skipIntro}
        style={{
          minHeight: '100vh', background: BG,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 0,
          fontFamily: "'Press Start 2P', monospace",
          position: 'relative', overflow: 'hidden', cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Ambient radial glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 420, height: 420, borderRadius: '50%',
          background: `radial-gradient(circle, ${GOLD}20 0%, transparent 70%)`,
          pointerEvents: 'none',
          animation: 'ambientPulse 2s ease-in-out infinite',
        }} />

        {/* Py dragon — slides in from above */}
        <div style={{
          fontSize: 96, lineHeight: 1, marginBottom: 16,
          filter: `drop-shadow(0 0 40px ${GOLD}cc)`,
          animation: 'pyEntrance 0.8s cubic-bezier(.2,1.4,.4,1) forwards, pyFloat 3s ease-in-out 0.8s infinite',
          opacity: 0,
          position: 'relative', zIndex: 2,
        }}>🐉</div>

        {/* Title */}
        <div style={{
          fontSize: 22, color: GOLD, letterSpacing: 4,
          textShadow: `0 0 30px ${GOLD}, 0 0 60px ${GOLD}66`,
          marginBottom: 6,
          animation: 'titleReveal 0.6s ease-out 0.5s both',
          position: 'relative', zIndex: 2,
        }}>BONUS GAME</div>

        <div style={{
          fontSize: 8, color: GOLD2, letterSpacing: 3, marginBottom: 36,
          animation: 'titleReveal 0.5s ease-out 0.8s both',
          position: 'relative', zIndex: 2,
        }}>PYTHORIA TETRIS</div>

        {/* Rules card */}
        <div style={{
          background: `rgba(250,204,21,0.07)`,
          border: `1px solid ${GOLD}40`,
          borderRadius: 18, padding: '18px 28px',
          textAlign: 'center', marginBottom: 32,
          maxWidth: 300, width: '85%',
          animation: introStep >= 1 ? 'slideUp 0.5s cubic-bezier(.2,1.4,.4,1) both' : 'none',
          opacity: introStep >= 1 ? 1 : 0,
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ fontSize: 7, color: GOLD, letterSpacing: 2, marginBottom: 14, lineHeight: 2 }}>
            CLEAR {HEARTS_PER_LINES} LINES
          </div>
          <div style={{ fontSize: 28, marginBottom: 14, filter: `drop-shadow(0 0 12px #ef4444)` }}>❤️</div>
          <div style={{ fontSize: 7, color: GOLD2, letterSpacing: 1, lineHeight: 2 }}>
            EARN 1 HEART<br />
            <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)' }}>MAX {MAX_SESSION_HEARTS} PER GAME</span>
          </div>
        </div>

        {/* Countdown or tap hint */}
        <div style={{
          position: 'relative', zIndex: 2,
          animation: introStep >= 2 ? 'slideUp 0.4s ease-out both' : 'none',
          opacity: introStep >= 2 ? 1 : 0,
          textAlign: 'center',
        }}>
          {introStep >= 2 && countdown > 0 ? (
            <div key={countdown} style={{
              fontSize: 64, color: GOLD,
              textShadow: `0 0 40px ${GOLD}, 0 0 80px ${GOLD}66`,
              animation: 'countPop 0.6s cubic-bezier(.2,1.6,.4,1) both',
            }}>{countdown}</div>
          ) : introStep >= 2 && countdown === 0 ? (
            <div style={{
              fontSize: 28, color: '#86efac',
              textShadow: '0 0 30px #86efac',
              letterSpacing: 4,
              animation: 'countPop 0.5s cubic-bezier(.2,1.6,.4,1) both',
            }}>GO!</div>
          ) : null}
        </div>

        {/* Skip hint */}
        <div style={{
          position: 'absolute', bottom: 28, right: 20,
          fontSize: 6, color: 'rgba(255,255,255,0.2)', letterSpacing: 1,
          animation: 'fadeIn 1s ease 1.5s both',
        }}>TAP TO SKIP</div>

        <style>{`
          @keyframes pyEntrance   { 0%{opacity:0;transform:translateY(-60px) scale(0.5)} 100%{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes pyFloat      { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
          @keyframes titleReveal  { 0%{opacity:0;transform:translateY(12px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes slideUp      { 0%{opacity:0;transform:translateY(24px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes countPop     { 0%{opacity:0;transform:scale(0.3)} 60%{transform:scale(1.2)} 100%{opacity:1;transform:scale(1)} }
          @keyframes fadeIn       { 0%{opacity:0} 100%{opacity:1} }
          @keyframes ambientPulse { 0%,100%{opacity:0.7;transform:translateX(-50%) scale(1)} 50%{opacity:1;transform:translateX(-50%) scale(1.1)} }
        `}</style>
      </div>
    );
  }

  // ── GAME SCREEN ────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: BG,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Press Start 2P', monospace",
      paddingTop: 10, paddingBottom: 24, userSelect: 'none',
      position: 'relative', overflow: 'hidden',
    }}>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
        width: 320, height: 320, borderRadius: '50%',
        background: `radial-gradient(circle, ${GOLD}15 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Heart earned flash overlay */}
      {heartFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, pointerEvents: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'heartFlashBg 1s ease-out forwards',
        }}>
          <div style={{
            fontSize: 88,
            filter: 'drop-shadow(0 0 40px #ef4444)',
            animation: 'heartPop 1s cubic-bezier(.2,1.6,.4,1) forwards',
          }}>❤️</div>
        </div>
      )}

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: Math.min(boardW + 110, 390), marginBottom: 10, padding: '0 4px',
      }}>
        <div style={{ lineHeight: 1.8 }}>
          <div style={{ fontSize: 7, color: GOLD, textShadow: `0 0 14px ${GOLD}88`, letterSpacing: 2 }}>🐉 PYTHORIA</div>
          <div style={{ fontSize: 7, color: GOLD2, textShadow: `0 0 10px ${GOLD2}66`, letterSpacing: 2 }}>BONUS GAME</div>
        </div>
        <button onClick={skipGame} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8, padding: '8px 14px',
          color: 'rgba(255,255,255,0.5)', fontSize: 7,
          fontFamily: "'Press Start 2P', monospace", cursor: 'pointer', letterSpacing: 1,
        }}>SKIP ✕</button>
      </div>

      {/* Hearts bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
        background: 'rgba(250,204,21,0.08)', border: `1px solid ${GOLD}30`,
        borderRadius: 12, padding: '8px 16px',
        width: Math.min(boardW + 110, 390) - 8,
      }}>
        <div style={{ fontSize: 8, color: GOLD, letterSpacing: 1 }}>HEARTS</div>
        <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
          {Array.from({ length: MAX_SESSION_HEARTS }, (_, i) => (
            <div key={i} style={{
              fontSize: 14,
              filter: i < s.heartsEarned ? 'drop-shadow(0 0 8px #ef4444)' : 'grayscale(1)',
              opacity: i < s.heartsEarned ? 1 : 0.3,
              transition: 'all 0.3s ease',
            }}>❤️</div>
          ))}
        </div>
        {phase === 'playing' && s.heartsEarned < MAX_SESSION_HEARTS && (
          <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)', marginLeft: 6 }}>
            {HEARTS_PER_LINES - (s.lines % HEARTS_PER_LINES)} more
          </div>
        )}
      </div>

      {/* ── GAME AREA ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>

        {/* Board */}
        <div style={{
          width: boardW, height: boardH,
          border: `2px solid ${GOLD}55`,
          boxShadow: `0 0 32px ${GOLD}22, inset 0 0 24px rgba(0,0,0,0.9)`,
          background: '#100800', position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
            {Array.from({ length: W-1 }, (_,i) => <line key={`v${i}`} x1={(i+1)*CELL} y1={0} x2={(i+1)*CELL} y2={boardH} stroke={GOLD} strokeWidth={0.5} />)}
            {Array.from({ length: H-1 }, (_,i) => <line key={`h${i}`} x1={0} y1={(i+1)*CELL} x2={boardW} y2={(i+1)*CELL} stroke={GOLD} strokeWidth={0.5} />)}
          </svg>

          {/* Cells */}
          {display.map((row, ri) => row.map((col, ci) => col ? (
            <div key={`${ri}-${ci}`} style={{
              position: 'absolute', left: ci*CELL+1, top: ri*CELL+1,
              width: CELL-2, height: CELL-2, borderRadius: 2,
              background: col.length > 7 ? col : `linear-gradient(135deg, ${col}ee, ${col}88)`,
              boxShadow: col.length <= 7 ? `0 0 8px ${col}55, inset 0 1px 0 rgba(255,255,255,0.3)` : 'none',
            }} />
          ) : null))}

          {/* Heart progress bar */}
          {phase === 'playing' && s.heartsEarned < MAX_SESSION_HEARTS && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.05)' }}>
              <div style={{
                height: '100%', width: `${heartProgress}%`,
                background: 'linear-gradient(90deg, #ef4444, #f97316)',
                boxShadow: '0 0 6px #ef4444', transition: 'width 0.3s ease',
              }} />
            </div>
          )}

          {/* Idle overlay */}
          {phase === 'idle' && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(16,8,0,0.92)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{ fontSize: 52, animation: 'dragonFloat 2.5s ease-in-out infinite', filter: `drop-shadow(0 0 20px ${GOLD})` }}>🐉</div>
              <div style={{ fontSize: 9, color: GOLD, textShadow: `0 0 16px ${GOLD}`, letterSpacing: 1, lineHeight: 1.8, textAlign: 'center' }}>
                CLEAR LINES<br/>
                <span style={{ fontSize: 7, color: GOLD2 }}>EARN ❤️ HEARTS!</span>
              </div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.8 }}>
                {HEARTS_PER_LINES} LINES = 1 ❤️<br/>
                <span style={{ fontSize: 6 }}>MAX {MAX_SESSION_HEARTS} PER GAME</span>
              </div>
              <button onClick={startGame} style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                color: '#1a0e00', border: 'none', borderRadius: 10,
                padding: '13px 22px', fontSize: 8,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
                boxShadow: `0 4px 0 ${DARK}, 0 0 24px ${GOLD}55`, letterSpacing: 1,
              }}>▶ START</button>
            </div>
          )}

          {/* Game over overlay */}
          {phase === 'over' && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(16,8,0,0.93)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              animation: 'fadeIn 0.4s ease-out',
            }}>
              <div style={{ fontSize: 28, filter: `drop-shadow(0 0 12px ${GOLD})` }}>🐉</div>
              <div style={{ fontSize: 9, color: GOLD, textShadow: `0 0 14px ${GOLD}`, letterSpacing: 1 }}>GAME OVER</div>
              <div style={{ fontSize: 8, color: GOLD2 }}>{s.score.toLocaleString()} PTS</div>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)' }}>{s.lines} LINES · LV {s.level}</div>
              {s.heartsEarned > 0 && (
                <div style={{
                  fontSize: 7, color: '#f87171', textAlign: 'center', lineHeight: 2,
                  animation: 'heartPop 0.6s cubic-bezier(.2,1.6,.4,1) both',
                }}>
                  +{s.heartsEarned} ❤️ EARNED!
                </div>
              )}
              <button onClick={startGame} style={{
                background: `linear-gradient(135deg, ${GOLD}, ${GOLD2})`,
                color: '#1a0e00', border: 'none', borderRadius: 10,
                padding: '11px 18px', fontSize: 7,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
                boxShadow: `0 3px 0 ${DARK}`,
              }}>↺ RETRY</button>
              <button onClick={exitGame} style={{
                background: 'rgba(255,255,255,0.08)', border: `1px solid ${GOLD}40`,
                color: GOLD, borderRadius: 10, padding: '11px 18px', fontSize: 7,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
              }}>⚔️ CONTINUE</button>
            </div>
          )}
        </div>

        {/* ── SIDE PANEL ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 88, flexShrink: 0 }}>
          <div style={{
            background: `linear-gradient(135deg, ${GOLD}18, ${GOLD2}08)`,
            border: `1px solid ${GOLD}40`, borderRadius: 10,
            padding: '8px 4px', textAlign: 'center',
          }}>
            <div style={{
              fontSize: 30,
              animation: phase === 'playing' ? 'dragonWatch 2s ease-in-out infinite' : 'dragonFloat 2.5s ease-in-out infinite',
              display: 'inline-block', filter: `drop-shadow(0 0 10px ${GOLD}80)`,
            }}>🐉</div>
            <div style={{ fontSize: 5, color: GOLD, letterSpacing: 1, marginTop: 3 }}>PY</div>
          </div>

          <div style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}25`, borderRadius: 8, padding: '8px 4px' }}>
            <div style={{ fontSize: 5, color: `${GOLD}66`, marginBottom: 5, letterSpacing: 1, textAlign: 'center' }}>NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${CELL * 0.65}px)`, gap: 1, justifyContent: 'center' }}>
              {nextGrid.map((row, ri) => row.map((col, ci) => (
                <div key={`n${ri}-${ci}`} style={{
                  width: CELL*0.65, height: CELL*0.65, borderRadius: 2,
                  background: col ? `${col}cc` : 'transparent',
                  boxShadow: col ? `0 0 4px ${col}66` : 'none',
                }} />
              )))}
            </div>
          </div>

          {[['SCORE', s.score.toLocaleString()], ['LINES', s.lines], ['LV', s.level]].map(([lbl, val]) => (
            <div key={lbl} style={{ background: `${GOLD}06`, border: `1px solid ${GOLD}20`, borderRadius: 8, padding: '7px 7px' }}>
              <div style={{ fontSize: 5, color: `${GOLD}55`, marginBottom: 3, letterSpacing: 1 }}>{lbl}</div>
              <div style={{ fontSize: 10, color: GOLD, textShadow: `0 0 8px ${GOLD}55`, wordBreak: 'break-all' }}>{val}</div>
            </div>
          ))}

          {phase === 'playing' && (
            <button onClick={exitGame} style={{
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${GOLD}30`,
              borderRadius: 8, padding: '9px 4px',
              color: `${GOLD}99`, fontSize: 5,
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer', letterSpacing: 1, lineHeight: 1.8, textAlign: 'center',
            }}>⚔️{'\n'}QUEST</button>
          )}
        </div>
      </div>

      {/* ── MOBILE CONTROLS ──────────────────────────────────────────── */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onPointerDown={e => { e.preventDefault(); rotate(); }}   style={ctrlBtn(GOLD)}>↻</button>
          <button onPointerDown={e => { e.preventDefault(); hardDrop(); }} style={ctrlBtn(GOLD2)}>⬇⬇</button>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onPointerDown={e => { e.preventDefault(); moveLeft(); }}  style={ctrlBtn(GOLD)}>◀</button>
          <button onPointerDown={e => { e.preventDefault(); moveDown(); }}  style={ctrlBtn(GOLD2)}>▼</button>
          <button onPointerDown={e => { e.preventDefault(); moveRight(); }} style={ctrlBtn(GOLD)}>▶</button>
        </div>
      </div>

      <style>{`
        @keyframes dragonFloat   { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
        @keyframes dragonWatch   { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.05)} }
        @keyframes heartFlashBg  { 0%{background:rgba(239,68,68,0)} 20%{background:rgba(239,68,68,0.14)} 100%{background:rgba(239,68,68,0)} }
        @keyframes heartPop      { 0%{opacity:0;transform:scale(0.2)} 40%{opacity:1;transform:scale(1.4)} 70%{transform:scale(0.9)} 100%{opacity:0;transform:scale(1.1)} }
        @keyframes fadeIn        { 0%{opacity:0} 100%{opacity:1} }
      `}</style>
    </div>
  );
}

function ctrlBtn(color) {
  return {
    background: `${color}18`, border: `2px solid ${color}55`,
    color, borderRadius: 10, padding: '14px 0', width: 58,
    fontSize: 13, fontFamily: "'Press Start 2P', monospace",
    cursor: 'pointer', boxShadow: `0 4px 0 ${color}33`,
    userSelect: 'none', WebkitUserSelect: 'none',
    touchAction: 'manipulation', flexShrink: 0,
  };
}
