import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sounds } from '../utils/sounds.js';

const W = 10, H = 20, CELL = 26;

const PIECES = {
  I: { cells: [[0,1],[1,1],[2,1],[3,1]], color: '#00e5ff' },
  O: { cells: [[0,0],[1,0],[0,1],[1,1]], color: '#ffea00' },
  T: { cells: [[1,0],[0,1],[1,1],[2,1]], color: '#aa00ff' },
  S: { cells: [[1,0],[2,0],[0,1],[1,1]], color: '#00e676' },
  Z: { cells: [[0,0],[1,0],[1,1],[2,1]], color: '#ff1744' },
  J: { cells: [[0,0],[0,1],[1,1],[2,1]], color: '#2979ff' },
  L: { cells: [[2,0],[0,1],[1,1],[2,1]], color: '#ff9100' },
};
const PKS = Object.keys(PIECES);
const SPEEDS = [800, 700, 580, 470, 370, 280, 200, 140, 100, 70];
const PTS    = [0, 100, 300, 500, 800];

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

export default function TetrisBreak() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const returnTo  = location.state?.returnTo || '/learn';

  const g   = useRef({ board: emptyBoard(), cur: null, next: randPiece(), score: 0, lines: 0, level: 0, phase: 'idle' });
  const tmr = useRef(null);
  const [, redraw] = useState(0);
  const tick = () => redraw(n => n + 1);

  const spawn = () => {
    const p = { ...g.current.next, x: 3, y: 0, cells: g.current.next.cells.map(c => [...c]) };
    g.current.cur  = p;
    g.current.next = randPiece();
    if (!valid(p.cells, p.x, p.y, g.current.board)) {
      g.current.phase = 'over';
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
    if (n > 0) { sounds.correct?.(); if (n === 4) sounds.victory?.(); }
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
    g.current = { board: emptyBoard(), cur: null, next: randPiece(), score: 0, lines: 0, level: 0, phase: 'playing' };
    spawn();
    clearInterval(tmr.current);
    tmr.current = setInterval(gravity, SPEEDS[0]);
    tick();
  };

  const moveLeft  = () => { const s = g.current; if (s.phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x - 1, s.cur.y, s.board)) { s.cur.x--; tick(); } };
  const moveRight = () => { const s = g.current; if (s.phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x + 1, s.cur.y, s.board)) { s.cur.x++; tick(); } };
  const moveDown  = () => { const s = g.current; if (s.phase !== 'playing' || !s.cur) return; if (valid(s.cur.cells, s.cur.x, s.cur.y + 1, s.board)) { s.cur.y++; tick(); } else land(); };

  const rotate = () => {
    const s = g.current;
    if (s.phase !== 'playing' || !s.cur) return;
    const rot = rotateCW(s.cur.cells);
    for (const dx of [0, -1, 1, -2, 2]) {
      if (valid(rot, s.cur.x + dx, s.cur.y, s.board)) {
        s.cur.cells = rot;
        s.cur.x += dx;
        sounds.click?.();
        tick();
        return;
      }
    }
  };

  const hardDrop = () => {
    const s = g.current;
    if (s.phase !== 'playing' || !s.cur) return;
    s.cur.y = ghostY(s.cur, s.board);
    land();
    tick();
  };

  useEffect(() => {
    const onKey = e => {
      if (['ArrowLeft','ArrowRight','ArrowDown','ArrowUp','Space'].includes(e.code)) e.preventDefault();
      const s = g.current;
      if (s.phase !== 'playing' && (e.code === 'Enter' || e.code === 'Space')) { startGame(); return; }
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
  }, []);

  const s = g.current;

  // Build display with ghost + active piece
  const display = s.board.map(r => [...r]);
  if (s.cur) {
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

  // Next piece preview (4×4)
  const nextGrid = Array.from({ length: 4 }, () => Array(4).fill(null));
  if (s.next) s.next.cells.forEach(([cx, cy]) => { if (cy < 4 && cx < 4) nextGrid[cy][cx] = s.next.color; });

  const boardW = W * CELL, boardH = H * CELL;

  const exitGame = () => { clearInterval(tmr.current); navigate(returnTo); };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #06000f 0%, #0a0520 60%, #06000f 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      fontFamily: "'Press Start 2P', monospace",
      paddingTop: 10, paddingBottom: 20, userSelect: 'none',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: Math.min(boardW + 100, 380), marginBottom: 10, padding: '0 4px' }}>
        <div style={{ lineHeight: 1.6 }}>
          <span style={{ fontSize: 8, color: '#aa00ff', textShadow: '0 0 14px #aa00ff88', letterSpacing: 2 }}>PYTHORIA</span><br />
          <span style={{ fontSize: 8, color: '#00e5ff', textShadow: '0 0 14px #00e5ff88', letterSpacing: 2 }}>TETRIS</span>
        </div>
        <button onClick={exitGame} style={{
          background: 'linear-gradient(135deg, #facc15, #f97316)',
          color: '#000', border: 'none', borderRadius: 8,
          padding: '8px 12px', fontSize: 7, letterSpacing: 1,
          fontFamily: "'Press Start 2P', monospace",
          cursor: 'pointer', boxShadow: '0 3px 0 #a06000',
        }}>⚔️ QUEST</button>
      </div>

      {/* Game area */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>

        {/* Board */}
        <div style={{
          width: boardW, height: boardH,
          border: '2px solid #aa00ff66',
          boxShadow: '0 0 28px #aa00ff33, inset 0 0 24px rgba(0,0,0,0.9)',
          background: '#020008', position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {/* Grid lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }}>
            {Array.from({ length: W - 1 }, (_, i) => <line key={`v${i}`} x1={(i+1)*CELL} y1={0} x2={(i+1)*CELL} y2={boardH} stroke="#8888ff" strokeWidth={0.5} />)}
            {Array.from({ length: H - 1 }, (_, i) => <line key={`h${i}`} x1={0} y1={(i+1)*CELL} x2={boardW} y2={(i+1)*CELL} stroke="#8888ff" strokeWidth={0.5} />)}
          </svg>

          {/* Cells */}
          {display.map((row, ri) => row.map((col, ci) => col ? (
            <div key={`${ri}-${ci}`} style={{
              position: 'absolute', left: ci * CELL + 1, top: ri * CELL + 1,
              width: CELL - 2, height: CELL - 2, borderRadius: 2,
              background: col.length > 7
                ? `${col}` // ghost (already has alpha)
                : `linear-gradient(135deg, ${col}ee, ${col}99)`,
              boxShadow: col.length <= 7 ? `0 0 6px ${col}66, inset 0 1px 0 rgba(255,255,255,0.25)` : 'none',
            }} />
          ) : null))}

          {/* Idle overlay */}
          {s.phase === 'idle' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,0,15,0.88)', gap: 20 }}>
              <div style={{ fontSize: 16, filter: 'drop-shadow(0 0 12px #aa00ff)' }}>🎮</div>
              <div style={{ fontSize: 8, color: '#aa00ff', textShadow: '0 0 14px #aa00ff', animation: 'blinkAnim 1.2s step-end infinite', letterSpacing: 1 }}>TAP TO PLAY</div>
              <button onClick={startGame} style={{
                background: 'linear-gradient(135deg, #aa00ff, #6600cc)', color: '#fff',
                border: 'none', borderRadius: 10, padding: '14px 22px', fontSize: 8,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer',
                boxShadow: '0 4px 0 #440088, 0 0 20px #aa00ff55', letterSpacing: 1,
              }}>START GAME</button>
            </div>
          )}

          {/* Game over overlay */}
          {s.phase === 'over' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,0,15,0.9)', gap: 14 }}>
              <div style={{ fontSize: 10, color: '#ff1744', textShadow: '0 0 18px #ff1744', letterSpacing: 1 }}>GAME OVER</div>
              <div style={{ fontSize: 8, color: '#facc15', textShadow: '0 0 10px #facc1566' }}>{s.score.toLocaleString()} PTS</div>
              <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)' }}>{s.lines} LINES · LV {s.level}</div>
              <button onClick={startGame} style={{
                background: 'linear-gradient(135deg, #aa00ff, #6600cc)', color: '#fff',
                border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 8,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer', boxShadow: '0 3px 0 #440088',
              }}>RETRY</button>
              <button onClick={exitGame} style={{
                background: 'linear-gradient(135deg, #facc15, #f97316)', color: '#000',
                border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 8,
                fontFamily: "'Press Start 2P', monospace", cursor: 'pointer', boxShadow: '0 3px 0 #a06000',
              }}>⚔️ CONTINUE</button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 86, flexShrink: 0 }}>

          {/* Next piece */}
          <div style={{ background: 'rgba(170,0,255,0.08)', border: '1px solid #aa00ff33', borderRadius: 8, padding: '8px 6px' }}>
            <div style={{ fontSize: 5, color: '#aa00ff77', marginBottom: 6, letterSpacing: 1, textAlign: 'center' }}>NEXT</div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(4, ${CELL * 0.68}px)`, gap: 1, justifyContent: 'center' }}>
              {nextGrid.map((row, ri) => row.map((col, ci) => (
                <div key={`n${ri}-${ci}`} style={{
                  width: CELL * 0.68, height: CELL * 0.68, borderRadius: 2,
                  background: col ? `${col}cc` : 'transparent',
                  boxShadow: col ? `0 0 4px ${col}66` : 'none',
                }} />
              )))}
            </div>
          </div>

          {/* Stats */}
          {[['SCORE', s.score.toLocaleString()], ['LINES', s.lines], ['LEVEL', s.level]].map(([lbl, val]) => (
            <div key={lbl} style={{ background: 'rgba(0,229,255,0.05)', border: '1px solid #00e5ff22', borderRadius: 8, padding: '8px 8px' }}>
              <div style={{ fontSize: 5, color: '#00e5ff55', marginBottom: 4, letterSpacing: 1 }}>{lbl}</div>
              <div style={{ fontSize: 10, color: '#00e5ff', textShadow: '0 0 8px #00e5ff66', wordBreak: 'break-all' }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile controls */}
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onPointerDown={e => { e.preventDefault(); rotate(); }}   style={ctrlBtn('#aa00ff')}>↻</button>
          <button onPointerDown={e => { e.preventDefault(); hardDrop(); }} style={ctrlBtn('#facc15')}>⬇⬇</button>
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button onPointerDown={e => { e.preventDefault(); moveLeft(); }}  style={ctrlBtn('#2979ff')}>◀</button>
          <button onPointerDown={e => { e.preventDefault(); moveDown(); }}  style={ctrlBtn('#00e676')}>▼</button>
          <button onPointerDown={e => { e.preventDefault(); moveRight(); }} style={ctrlBtn('#2979ff')}>▶</button>
        </div>
      </div>

      <style>{`
        @keyframes blinkAnim { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
    </div>
  );
}
