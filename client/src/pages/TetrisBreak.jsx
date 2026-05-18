import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sounds } from '../utils/sounds.js';
import { HeroFigureSVG } from './Home.jsx';
import { useStory } from '../hooks/useStory.js';
import { CLASSES } from '../data/story.js';

const W = 10, H = 15, CELL = 30;
const GOLD  = '#facc15';
const GOLD2 = '#f59e0b';
const DARK  = '#92400e';
const BG    = 'linear-gradient(180deg, #0a0a1a 0%, #0f0f2a 50%, #0a0a1a 100%)';

// Classic Tetris colors
const PIECES = {
  I: { cells: [[0,1],[1,1],[2,1],[3,1]], color: '#00e5ff' },
  O: { cells: [[0,0],[1,0],[0,1],[1,1]], color: '#ffe600' },
  T: { cells: [[1,0],[0,1],[1,1],[2,1]], color: '#cc00ff' },
  S: { cells: [[1,0],[2,0],[0,1],[1,1]], color: '#00e676' },
  Z: { cells: [[0,0],[1,0],[1,1],[2,1]], color: '#ff1744' },
  J: { cells: [[0,0],[0,1],[1,1],[2,1]], color: '#2979ff' },
  L: { cells: [[2,0],[0,1],[1,1],[2,1]], color: '#ff6d00' },
};
const PKS    = Object.keys(PIECES);
const SPEEDS = [350, 270, 210, 160, 120, 90, 65, 45, 30, 20];
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
  const { getPlayer } = useStory();
  const player = getPlayer();
  const cls = CLASSES.find(c => c.id === player?.classId) || CLASSES[0];

  const [phase, setPhase] = useState('intro');
  const [introStep, setIntroStep] = useState(0);
  const [heartFlash, setHeartFlash] = useState(false);
  const [, redraw] = useState(0);
  const tick = () => redraw(n => n + 1);

  const g        = useRef({ board: emptyBoard(), cur: null, next: randPiece(), score: 0, lines: 0, level: 0, heartsEarned: 0, prevHeartThreshold: 0 });
  const tmr      = useRef(null);
  const speedTmr = useRef(null);

  // ── Intro sequence (short: ~2s total) ───────────────────────────────────
  useEffect(() => {
    if (phase !== 'intro') return;
    sounds.tetrisIntro();
    const t1 = setTimeout(() => setIntroStep(1), 400);
    const t2 = setTimeout(() => setIntroStep(2), 900);
    const t3 = setTimeout(() => setPhase('idle'), 1800);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [phase]);

  const skipIntro = () => { sounds.click(); setPhase('idle'); };

  // ── Game logic ──────────────────────────────────────────────────────────
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
      clearInterval(speedTmr.current);
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
    clearInterval(speedTmr.current);
    tmr.current = setInterval(gravity, SPEEDS[0]);
    speedTmr.current = setInterval(() => {
      const s = g.current;
      if (s.phase !== 'playing' || s.level >= 9) return;
      s.level++;
      clearInterval(tmr.current);
      tmr.current = setInterval(gravity, SPEEDS[s.level]);
      tick();
    }, 10000);
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
        sounds.select(); tick(); return;
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
    clearInterval(speedTmr.current);
    const earned = g.current.heartsEarned;
    if (earned > 0) { sounds.missionClear(); await postAddHearts(earned); }
    else sounds.click();
    navigate(returnTo);
  };

  const skipGame = () => {
    sounds.click();
    clearInterval(tmr.current);
    clearInterval(speedTmr.current);
    navigate(returnTo);
  };

  useEffect(() => {
    const onKey = e => {
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code)) e.preventDefault();
      if (phase === 'intro') { if (e.code === 'Space' || e.code === 'Enter') skipIntro(); return; }
      if (phase !== 'playing' && (e.code === 'Enter' || e.code === 'Space')) { startGame(); return; }
      switch (e.code) {
        case 'ArrowLeft':  moveLeft();  break;
        case 'ArrowRight': moveRight(); break;
        case 'ArrowDown':  moveDown();  break;
        case 'ArrowUp':    rotate();    break;
        case 'Space':      hardDrop();  break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); clearInterval(tmr.current); clearInterval(speedTmr.current); };
  }, [phase]);

  const s = g.current;

  // Display with ghost + active piece
  const display = s.board.map(r => [...r]);
  if (s.cur && phase === 'playing') {
    const gy = ghostY(s.cur, s.board);
    s.cur.cells.forEach(([cx, cy]) => {
      const ny = cy + gy;
      if (ny >= 0 && ny < H && !display[ny][cx + s.cur.x])
        display[ny][cx + s.cur.x] = s.cur.color + '30';
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

  // ── INTRO SCREEN ─────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div onClick={skipIntro} style={{
        minHeight: '100vh', background: BG,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 0,
        fontFamily: "'Press Start 2P', monospace",
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        userSelect: 'none',
      }}>
        {/* Colorful ambient rings */}
        {['#00e5ff','#cc00ff','#ff1744','#00e676'].map((c, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${20 + i * 15}%`, left: `${20 + i * 18}%`,
            width: 180 + i * 40, height: 180 + i * 40, borderRadius: '50%',
            border: `1px solid ${c}20`,
            pointerEvents: 'none',
            animation: `spin${i % 2 === 0 ? 'CW' : 'CCW'} ${6 + i * 2}s linear infinite`,
          }} />
        ))}

        {/* Py dragon */}
        <div style={{
          fontSize: 80, lineHeight: 1, marginBottom: 12,
          filter: 'drop-shadow(0 0 30px #cc00ff) drop-shadow(0 0 60px #00e5ff44)',
          animation: 'pyEntrance 0.5s cubic-bezier(.2,1.4,.4,1) forwards, pyFloat 2.5s ease-in-out 0.5s infinite',
          opacity: 0, position: 'relative', zIndex: 2,
        }}>🐉</div>

        <div style={{
          fontSize: 20, color: GOLD, letterSpacing: 3,
          textShadow: `0 0 20px ${GOLD}, 0 0 40px ${GOLD}66`,
          marginBottom: 4,
          animation: 'titleReveal 0.4s ease-out 0.2s both',
          position: 'relative', zIndex: 2,
        }}>BONUS GAME</div>

        <div style={{
          display: 'flex', gap: 4, marginBottom: 28,
          animation: 'titleReveal 0.4s ease-out 0.3s both',
          position: 'relative', zIndex: 2,
        }}>
          {['P','Y','T','H','O','R','I','A'].map((ch, i) => (
            <span key={i} style={{
              fontSize: 8, letterSpacing: 2,
              color: ['#00e5ff','#ffe600','#cc00ff','#00e676','#ff1744','#2979ff','#ff6d00','#00e5ff'][i],
              textShadow: `0 0 10px currentColor`,
            }}>{ch}</span>
          ))}
          <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.3)', marginLeft: 4 }}>TETRIS</span>
        </div>

        {/* Rules card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 18, padding: '16px 24px',
          textAlign: 'center', marginBottom: 24,
          maxWidth: 280, width: '85%',
          animation: introStep >= 1 ? 'slideUp 0.4s cubic-bezier(.2,1.4,.4,1) both' : 'none',
          opacity: introStep >= 1 ? 1 : 0,
          position: 'relative', zIndex: 2,
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
            {['#00e5ff','#ffe600','#cc00ff','#00e676','#ff1744','#2979ff','#ff6d00'].map((c, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: c, boxShadow: `0 0 6px ${c}` }} />
            ))}
          </div>
          <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, lineHeight: 2.2 }}>
            CLEAR {HEARTS_PER_LINES} LINES = ❤️<br />
            <span style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)' }}>MAX {MAX_SESSION_HEARTS} HEARTS PER GAME</span>
          </div>
        </div>

        {/* GO flash */}
        {introStep >= 2 && (
          <div style={{
            fontSize: 36, color: '#00e676',
            textShadow: '0 0 30px #00e676, 0 0 60px #00e67688',
            letterSpacing: 6,
            animation: 'countPop 0.5s cubic-bezier(.2,1.6,.4,1) both',
            position: 'relative', zIndex: 2,
          }}>GO!</div>
        )}

        <div style={{
          position: 'absolute', bottom: 24, right: 20,
          fontSize: 6, color: 'rgba(255,255,255,0.18)', letterSpacing: 1,
        }}>TAP TO SKIP</div>

        <style>{`
          @keyframes pyEntrance  { 0%{opacity:0;transform:translateY(-50px) scale(0.5)} 100%{opacity:1;transform:translateY(0) scale(1)} }
          @keyframes pyFloat     { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
          @keyframes titleReveal { 0%{opacity:0;transform:translateY(10px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes slideUp     { 0%{opacity:0;transform:translateY(20px)} 100%{opacity:1;transform:translateY(0)} }
          @keyframes countPop    { 0%{opacity:0;transform:scale(0.3)} 60%{transform:scale(1.2)} 100%{opacity:1;transform:scale(1)} }
          @keyframes spinCW      { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
          @keyframes spinCCW     { 0%{transform:rotate(0deg)} 100%{transform:rotate(-360deg)} }
        `}</style>
      </div>
    );
  }

  // ── GAME SCREEN ───────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: BG,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Press Start 2P', monospace",
      paddingTop: 10, paddingBottom: 24, userSelect: 'none',
      position: 'relative', overflow: 'hidden',
    }}>

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
        width: Math.min(boardW + 110, 390), marginBottom: 8, padding: '0 4px',
      }}>
        <div style={{ lineHeight: 1.8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {['P','Y','T'].map((ch, i) => (
              <span key={i} style={{ fontSize: 7, color: ['#00e5ff','#ffe600','#cc00ff'][i], textShadow: '0 0 8px currentColor' }}>{ch}</span>
            ))}
            {['H','O','R','I','A'].map((ch, i) => (
              <span key={i} style={{ fontSize: 7, color: ['#00e676','#ff1744','#2979ff','#ff6d00','#00e5ff'][i], textShadow: '0 0 8px currentColor' }}>{ch}</span>
            ))}
          </div>
          <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.3)', letterSpacing: 2 }}>BONUS GAME</div>
        </div>
        <button onClick={skipGame} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 8, padding: '8px 14px',
          color: 'rgba(255,255,255,0.5)', fontSize: 7,
          fontFamily: "'Press Start 2P', monospace", cursor: 'pointer', letterSpacing: 1,
        }}>SKIP ✕</button>
      </div>

      {/* Heart progress card */}
      <div style={{
        marginBottom: 8, borderRadius: 14, overflow: 'hidden',
        border: '1px solid rgba(239,68,68,0.3)',
        background: 'rgba(239,68,68,0.06)',
        width: Math.min(boardW + 110, 390) - 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
          <div style={{ fontSize: 7, color: 'rgba(239,100,100,0.9)', letterSpacing: 1, whiteSpace: 'nowrap' }}>
            CLEAR {HEARTS_PER_LINES} LINES
          </div>
          <div style={{ fontSize: 14, filter: 'drop-shadow(0 0 6px #ef4444)' }}>→ ❤️</div>
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {Array.from({ length: MAX_SESSION_HEARTS }, (_, i) => (
              <div key={i} style={{
                fontSize: 16,
                filter: i < s.heartsEarned ? 'drop-shadow(0 0 8px #ef4444)' : 'grayscale(1)',
                opacity: i < s.heartsEarned ? 1 : 0.2,
                transition: 'all 0.3s ease',
              }}>❤️</div>
            ))}
          </div>
        </div>
        {/* Line pip progress */}
        {phase === 'playing' && s.heartsEarned < MAX_SESSION_HEARTS && (
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 4, alignItems: 'center' }}>
            {Array.from({ length: HEARTS_PER_LINES }, (_, i) => {
              const filled = i < (s.lines % HEARTS_PER_LINES);
              return (
                <div key={i} style={{
                  flex: 1, height: 6, borderRadius: 3,
                  background: filled ? '#ef4444' : 'rgba(255,255,255,0.08)',
                  boxShadow: filled ? '0 0 6px #ef4444' : 'none',
                  transition: 'all 0.2s ease',
                }} />
              );
            })}
            <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.3)', marginLeft: 4, whiteSpace: 'nowrap' }}>
              {s.lines % HEARTS_PER_LINES}/{HEARTS_PER_LINES}
            </div>
          </div>
        )}
        {phase !== 'playing' && (
          <div style={{ padding: '0 14px 8px', display: 'flex', gap: 4 }}>
            {Array.from({ length: HEARTS_PER_LINES }, (_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }} />
            ))}
          </div>
        )}
      </div>

      {/* ── GAME AREA ──────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>

        {/* Board */}
        <div style={{
          width: boardW, height: boardH,
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: '0 0 40px rgba(100,100,255,0.15), inset 0 0 24px rgba(0,0,0,0.9)',
          background: '#05050f', position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}>
            {Array.from({ length: W-1 }, (_,i) => <line key={`v${i}`} x1={(i+1)*CELL} y1={0} x2={(i+1)*CELL} y2={boardH} stroke="white" strokeWidth={0.5} />)}
            {Array.from({ length: H-1 }, (_,i) => <line key={`h${i}`} x1={0} y1={(i+1)*CELL} x2={boardW} y2={(i+1)*CELL} stroke="white" strokeWidth={0.5} />)}
          </svg>

          {/* Cells */}
          {display.map((row, ri) => row.map((col, ci) => col ? (
            <div key={`${ri}-${ci}`} style={{
              position: 'absolute', left: ci*CELL+1, top: ri*CELL+1,
              width: CELL-2, height: CELL-2, borderRadius: 3,
              background: col.length > 7 ? col : `linear-gradient(135deg, ${col}ff, ${col}99)`,
              boxShadow: col.length <= 7 ? `0 0 10px ${col}88, inset 0 1px 0 rgba(255,255,255,0.35)` : 'none',
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
              position: 'absolute', inset: 0, background: 'rgba(5,5,15,0.95)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '0 16px',
            }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end' }}>
                <div style={{ fontSize: 40, animation: 'dragonFloat 2.5s ease-in-out infinite', filter: 'drop-shadow(0 0 20px #cc00ff)' }}>🐉</div>
                <div style={{ animation: 'dragonFloat 2.5s ease-in-out 0.8s infinite' }}>
                  <HeroFigureSVG cls={cls} size={48} />
                </div>
              </div>

              {/* How to earn hearts — the main message */}
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
                borderRadius: 14, padding: '12px 16px', width: '100%', textAlign: 'center',
              }}>
                <div style={{ fontSize: 7, color: '#f87171', letterSpacing: 1, marginBottom: 8 }}>HOW TO EARN HEARTS</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {Array.from({ length: HEARTS_PER_LINES }, (_, i) => (
                      <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: 'rgba(239,68,68,0.3)', border: '1px solid rgba(239,68,68,0.5)' }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>→</div>
                  <div style={{ fontSize: 22, filter: 'drop-shadow(0 0 8px #ef4444)' }}>❤️</div>
                </div>
                <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.35)', marginTop: 8, lineHeight: 2 }}>
                  CLEAR {HEARTS_PER_LINES} LINES = 1 HEART · MAX {MAX_SESSION_HEARTS}
                </div>
              </div>

              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.25)', textAlign: 'center', lineHeight: 2 }}>
                PIECES FALL AUTOMATICALLY<br/>
                USE BUTTONS BELOW TO MOVE
              </div>

              <button onClick={startGame} style={{
                background: 'linear-gradient(135deg, #00e5ff, #2979ff)',
                color: '#05050f', border: 'none', borderRadius: 12,
                padding: '14px 28px', fontSize: 9,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
                boxShadow: '0 4px 0 #1a1a5a, 0 0 24px #00e5ff55', letterSpacing: 1,
              }}>▶ START</button>
            </div>
          )}

          {/* Game over overlay */}
          {phase === 'over' && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(5,5,15,0.95)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
              animation: 'fadeIn 0.4s ease-out',
            }}>
              <div style={{ fontSize: 28 }}>🐉</div>
              <div style={{ fontSize: 9, color: '#ff1744', textShadow: '0 0 14px #ff1744', letterSpacing: 1 }}>GAME OVER</div>
              <div style={{ fontSize: 8, color: GOLD }}>{s.score.toLocaleString()} PTS</div>
              <div style={{ fontSize: 6, color: 'rgba(255,255,255,0.4)' }}>{s.lines} LINES · LV {s.level}</div>
              {s.heartsEarned > 0 && (
                <div style={{
                  fontSize: 7, color: '#f87171', textAlign: 'center', lineHeight: 2,
                  animation: 'heartPop 0.6s cubic-bezier(.2,1.6,.4,1) both',
                }}>+{s.heartsEarned} ❤️ EARNED!</div>
              )}
              <button onClick={startGame} style={{
                background: 'linear-gradient(135deg, #00e5ff, #2979ff)',
                color: '#05050f', border: 'none', borderRadius: 10,
                padding: '11px 18px', fontSize: 7,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
                boxShadow: '0 3px 0 #1a1a5a',
              }}>↺ RETRY</button>
              <button onClick={exitGame} style={{
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '11px 18px', fontSize: 7,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
              }}>⚔️ CONTINUE</button>
            </div>
          )}
        </div>

        {/* ── SIDE PANEL ──────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 88, flexShrink: 0 }}>
          <div style={{
            background: 'rgba(204,0,255,0.08)', border: '1px solid rgba(204,0,255,0.3)',
            borderRadius: 10, padding: '8px 4px', textAlign: 'center',
          }}>
            <div style={{
              fontSize: 28,
              animation: phase === 'playing' ? 'dragonWatch 2s ease-in-out infinite' : 'dragonFloat 2.5s ease-in-out infinite',
              display: 'inline-block', filter: 'drop-shadow(0 0 10px #cc00ff)',
            }}>🐉</div>
            <div style={{ fontSize: 5, color: 'rgba(204,0,255,0.8)', letterSpacing: 1, marginTop: 2 }}>PY</div>
          </div>

          <div style={{
            background: `${cls.color}12`, border: `1px solid ${cls.color}40`,
            borderRadius: 10, padding: '8px 4px', textAlign: 'center',
          }}>
            <div style={{
              display: 'flex', justifyContent: 'center',
              animation: phase === 'playing' ? 'gioPlay 2.5s ease-in-out infinite' : 'dragonFloat 2.5s ease-in-out infinite',
            }}>
              <HeroFigureSVG cls={cls} size={36} />
            </div>
            <div style={{ fontSize: 5, color: `${cls.color}cc`, letterSpacing: 1, marginTop: 2 }}>GIO</div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 4px' }}>
            <div style={{ fontSize: 5, color: 'rgba(255,255,255,0.3)', marginBottom: 5, letterSpacing: 1, textAlign: 'center' }}>NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${CELL * 0.65}px)`, gap: 1, justifyContent: 'center' }}>
              {nextGrid.map((row, ri) => row.map((col, ci) => (
                <div key={`n${ri}-${ci}`} style={{
                  width: CELL*0.65, height: CELL*0.65, borderRadius: 2,
                  background: col ? col : 'transparent',
                  boxShadow: col ? `0 0 6px ${col}` : 'none',
                }} />
              )))}
            </div>
          </div>

          {[['SCORE', s.score.toLocaleString(), '#ffe600'], ['LINES', s.lines, '#00e676'], ['LV', s.level, '#00e5ff']].map(([lbl, val, col]) => (
            <div key={lbl} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 7px' }}>
              <div style={{ fontSize: 5, color: `${col}66`, marginBottom: 3, letterSpacing: 1 }}>{lbl}</div>
              <div style={{ fontSize: 10, color: col, textShadow: `0 0 8px ${col}66`, wordBreak: 'break-all' }}>{val}</div>
            </div>
          ))}

          {phase === 'playing' && (
            <button onClick={exitGame} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8, padding: '9px 4px',
              color: 'rgba(255,255,255,0.4)', fontSize: 5,
              fontFamily: "'Press Start 2P', monospace",
              cursor: 'pointer', letterSpacing: 1, lineHeight: 1.8, textAlign: 'center',
            }}>⚔️{'\n'}QUEST</button>
          )}
        </div>
      </div>

      {/* ── MOBILE CONTROLS ─────────────────────────────────────────────
          [ ◀ ]  [ ↑ ROTATE ]  [ ▶ ]
          Pieces auto-drop — just steer and spin.
      */}
      <div style={{ marginTop: 12, display: 'flex', gap: 6, width: Math.min(boardW + 110, 390) - 8 }}>
        <button onPointerDown={e => { e.preventDefault(); moveLeft(); }}  style={ctrlBtn('#2979ff', null, 60)}>◀</button>
        <button onPointerDown={e => { e.preventDefault(); rotate(); }}    style={{ ...ctrlBtn('#cc00ff', null, 60), flex: 2, fontSize: 8 }}>↑ ROTATE</button>
        <button onPointerDown={e => { e.preventDefault(); moveRight(); }} style={ctrlBtn('#2979ff', null, 60)}>▶</button>
      </div>

      <style>{`
        @keyframes dragonFloat  { 0%,100%{transform:translateY(0) rotate(-2deg)} 50%{transform:translateY(-8px) rotate(2deg)} }
        @keyframes dragonWatch  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-4px) scale(1.05)} }
        @keyframes heartFlashBg { 0%{background:rgba(239,68,68,0)} 20%{background:rgba(239,68,68,0.14)} 100%{background:rgba(239,68,68,0)} }
        @keyframes heartPop     { 0%{opacity:0;transform:scale(0.2)} 40%{opacity:1;transform:scale(1.4)} 70%{transform:scale(0.9)} 100%{opacity:0;transform:scale(1.1)} }
        @keyframes fadeIn       { 0%{opacity:0} 100%{opacity:1} }
        @keyframes gioPlay      { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-5px) scale(1.04)} }
      `}</style>
    </div>
  );
}

function ctrlBtn(color, width = 58, height = 52) {
  return {
    background: `${color}18`,
    border: `2px solid ${color}66`,
    color,
    borderRadius: 12,
    ...(width !== null ? { width } : { flex: 1 }),
    height,
    fontSize: 14,
    fontFamily: "'Press Start 2P', monospace",
    cursor: 'pointer',
    boxShadow: `0 4px 0 ${color}33`,
    userSelect: 'none', WebkitUserSelect: 'none',
    touchAction: 'manipulation', flexShrink: 0,
  };
}
