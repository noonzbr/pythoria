let ctx = null;
let muted = false;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, type, duration, vol = 0.25, delay = 0) {
  if (muted) return;
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime + delay);
    gain.gain.setValueAtTime(vol, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    osc.start(c.currentTime + delay);
    osc.stop(c.currentTime + delay + duration + 0.05);
  } catch {}
}

function noise(duration, vol = 0.15, delay = 0) {
  if (muted) return;
  try {
    const c = getCtx();
    const bufSize = c.sampleRate * duration;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource();
    src.buffer = buf;
    const gain = c.createGain();
    src.connect(gain);
    gain.connect(c.destination);
    gain.gain.setValueAtTime(vol, c.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);
    src.start(c.currentTime + delay);
  } catch {}
}

export const sounds = {
  click:   () => { tone(800, 'sine', 0.05, 0.15); },
  select:  () => { tone(440, 'square', 0.08, 0.12); tone(550, 'square', 0.08, 0.08, 0.06); },

  // Villain / dramatic
  bugLord: () => {
    tone(55,  'sawtooth', 0.6, 0.28);
    tone(60,  'sawtooth', 0.5, 0.22, 0.08);
    tone(110, 'sawtooth', 0.3, 0.15, 0.3);
    noise(0.25, 0.18);
    tone(220, 'square', 0.15, 0.08, 0.5);
  },
  glitch: () => {
    [400,200,600,150,800].forEach((f,i) => tone(f, 'square', 0.04, 0.18, i * 0.035));
    noise(0.12, 0.12);
  },
  fragmentGet: () => {
    // Crystalline ascending chime — triumphant fragment recovery
    [523, 659, 784, 1047, 1319].forEach((f, i) => {
      tone(f, 'sine', 0.4, 0.28, i * 0.09);
      tone(f * 2, 'sine', 0.12, 0.1, i * 0.09 + 0.05);
    });
    tone(1047, 'triangle', 0.6, 0.18, 0.5);
  },
  epicBoom: () => {
    tone(60,  'sawtooth', 0.5, 0.35);
    tone(80,  'sawtooth', 0.4, 0.28, 0.05);
    tone(120, 'triangle', 0.25, 0.2, 0.15);
    noise(0.3, 0.25);
  },
  restoration: () => {
    // Warm, healing chord resolution
    [261, 330, 392, 523].forEach((f, i) => tone(f, 'sine', 1.2, 0.15, i * 0.12));
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'triangle', 0.8, 0.1, 0.5 + i * 0.14));
    tone(1047, 'sine', 1.0, 0.2, 1.1);
  },
  epiloguePanel: () => {
    tone(440, 'triangle', 0.45, 0.14);
    tone(554, 'triangle', 0.35, 0.12, 0.12);
    tone(659, 'triangle', 0.3, 0.10, 0.26);
    noise(0.1, 0.04, 0.05);
  },

  // Language selection screen
  langPick: () => {
    tone(660,  'sine', 0.14, 0.18);
    tone(880,  'sine', 0.10, 0.12, 0.09);
    tone(1100, 'sine', 0.06, 0.08, 0.18);
  },
  langConfirm: () => {
    tone(330, 'square', 0.12, 0.22);
    tone(415, 'square', 0.12, 0.22, 0.10);
    tone(523, 'square', 0.14, 0.26, 0.20);
    tone(659, 'square', 0.18, 0.26, 0.32);
    tone(784, 'square', 0.28, 0.32, 0.46);
    tone(165, 'triangle', 0.08, 0.10);
    tone(523, 'triangle', 0.08, 0.14, 0.46);
  },

  // Prologue / story screens
  prologuePanel: () => {
    noise(0.18, 0.06);
    tone(220, 'triangle', 0.35, 0.10, 0.04);
    tone(330, 'triangle', 0.28, 0.08, 0.18);
    tone(440, 'triangle', 0.22, 0.06, 0.32);
  },
  typeClick: () => {
    tone(900 + Math.random() * 300, 'sine', 0.012, 0.035);
  },
  prologueFinal: () => {
    // Dramatic low boom + rising shimmer for the last panel
    tone(80,  'sawtooth', 0.4, 0.22);
    tone(160, 'sawtooth', 0.3, 0.16, 0.15);
    tone(440, 'triangle', 0.3, 0.10, 0.35);
    tone(660, 'triangle', 0.2, 0.08, 0.55);
    tone(880, 'triangle', 0.15, 0.06, 0.75);
    noise(0.12, 0.10);
  },
  // Battle projectile whoosh
  projectile: () => {
    tone(900, 'sine', 0.04, 0.18);
    tone(600, 'sine', 0.06, 0.14, 0.03);
    noise(0.05, 0.07, 0.01);
  },

  // Learn phase interactions
  learnTap:     () => { tone(550, 'square', 0.06, 0.12); tone(700, 'square', 0.04, 0.08, 0.05); },
  matchPing:    () => { tone(880, 'sine', 0.10, 0.18); tone(1108, 'sine', 0.08, 0.12, 0.07); },
  codePlace:    () => { tone(440, 'square', 0.04, 0.12); noise(0.035, 0.06); },
  missionClear: () => {
    [523, 659, 784].forEach((f, i) => tone(f, 'square', 0.13, 0.22, i * 0.07));
    tone(1047, 'sine', 0.22, 0.28, 0.23);
    noise(0.08, 0.06, 0.05);
  },
  trainingReady: () => {
    tone(330, 'sawtooth', 0.08, 0.18);
    tone(440, 'sawtooth', 0.12, 0.2, 0.1);
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'square', 0.15, 0.24, 0.2 + i * 0.09));
    noise(0.15, 0.1, 0.12);
  },

  attack:  () => { noise(0.08, 0.2); tone(200, 'sawtooth', 0.15, 0.2); },
  correct: () => {
    tone(523, 'square', 0.1, 0.2);
    tone(659, 'square', 0.1, 0.2, 0.1);
    tone(784, 'square', 0.18, 0.2, 0.2);
  },
  wrong: () => {
    tone(300, 'sawtooth', 0.08, 0.2);
    tone(200, 'sawtooth', 0.12, 0.2, 0.08);
    tone(150, 'sawtooth', 0.18, 0.15, 0.18);
  },
  hit:    () => { noise(0.1, 0.25); tone(150, 'sawtooth', 0.12, 0.15); },
  combo:  () => {
    [523,659,784,1047].forEach((f,i) => tone(f, 'square', 0.12, 0.22, i * 0.08));
  },
  victory: () => {
    const melody = [523,659,784,659,784,1047];
    melody.forEach((f,i) => tone(f, 'square', 0.18, 0.25, i * 0.1));
    melody.forEach((f,i) => tone(f/2, 'triangle', 0.18, 0.1, i * 0.1));
  },
  defeat: () => {
    [400,350,300,250,200].forEach((f,i) => tone(f, 'sawtooth', 0.2, 0.18, i * 0.12));
  },
  intro: () => {
    tone(220, 'sawtooth', 0.08, 0.15);
    tone(440, 'sawtooth', 0.12, 0.2, 0.1);
    tone(330, 'square', 0.25, 0.25, 0.25);
  },
  // Tetris-specific
  tetrisIntro: () => {
    // Epic gold fanfare — bonus game entrance
    tone(165, 'sawtooth', 0.12, 0.20);
    tone(220, 'sawtooth', 0.14, 0.22, 0.10);
    tone(330, 'square',   0.18, 0.26, 0.22);
    tone(440, 'square',   0.20, 0.28, 0.36);
    tone(550, 'square',   0.22, 0.30, 0.52);
    tone(660, 'square',   0.28, 0.34, 0.70);
    tone(880, 'sine',     0.50, 0.32, 0.90);
    noise(0.18, 0.14, 0.04);
    noise(0.12, 0.10, 0.92);
  },
  tetrisLand: () => {
    // Low thud when a piece settles
    tone(120, 'triangle', 0.08, 0.28);
    noise(0.05, 0.18);
    tone(80,  'sawtooth', 0.06, 0.18, 0.02);
  },
  tetrisHeart: () => {
    // Warm pulse when a heart is earned
    tone(523, 'sine',     0.20, 0.30);
    tone(659, 'sine',     0.18, 0.26, 0.12);
    tone(784, 'sine',     0.28, 0.32, 0.26);
    tone(1047,'triangle', 0.45, 0.28, 0.44);
    tone(784, 'sine',     0.20, 0.18, 0.72);
    noise(0.06, 0.08, 0.05);
  },

  // Hero appearance — triumphant ascending fanfare when Gio appears
  heroAppears: () => {
    [261, 330, 392, 523, 659, 784, 1047].forEach((f, i) =>
      tone(f, 'sine', 0.45, 0.20, i * 0.07)
    );
    tone(1047, 'triangle', 0.9, 0.28, 0.52);
    tone(784,  'sine',     0.5, 0.18, 0.75);
    noise(0.08, 0.07, 0.08);
  },

  // Py calls the hero — ancient, warm, mystical chord
  pyCallsHero: () => {
    tone(165, 'triangle', 0.7, 0.14);
    tone(220, 'triangle', 0.6, 0.16, 0.18);
    tone(330, 'triangle', 0.55, 0.18, 0.40);
    tone(440, 'sine',     0.45, 0.20, 0.66);
    tone(554, 'sine',     0.35, 0.16, 0.90);
    tone(330, 'sine',     0.30, 0.12, 1.20);
    noise(0.07, 0.04, 0.12);
  },

  // Quest begins — epic low boom then rising fanfare
  questBegins: () => {
    noise(0.18, 0.28);
    tone(60,  'sawtooth', 0.25, 0.30);
    tone(80,  'sawtooth', 0.22, 0.24, 0.08);
    [261, 329, 392].forEach((f, i) => tone(f, 'sawtooth', 0.22, 0.22, 0.18 + i * 0.10));
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 'square', 0.28, 0.30, 0.52 + i * 0.10));
    tone(1047, 'sine', 0.55, 0.35, 0.96);
    noise(0.10, 0.12, 0.50);
  },

  // Codex shatters — glitch burst + low boom
  codexShatter: () => {
    [400,200,600,150,800,100,900].forEach((f, i) => tone(f, 'square', 0.05, 0.22, i * 0.03));
    noise(0.20, 0.30);
    tone(60, 'sawtooth', 0.5, 0.32, 0.05);
    tone(80, 'sawtooth', 0.4, 0.26, 0.12);
  },

  toggleMute: () => { muted = !muted; return muted; },
  isMuted: () => muted,
};
