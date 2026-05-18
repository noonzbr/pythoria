import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'data.json');

const DEFAULT_DATA = {
  user: {
    id: 1,
    username: 'Coder',
    xp: 0,
    level: 1,
    streak: 0,
    hearts: 5,
    gems: 500,
    last_active: new Date().toISOString().split('T')[0],
  },
  progress: [],   // { unit_id, lesson_id, xp_earned, completed_at }
  achievements: [],
};

function load() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    }
  } catch {}
  return structuredClone(DEFAULT_DATA);
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const db = {
  getUser: () => load().user,

  getCompleted: () => load().progress,

  completeLesson: ({ unitId, lessonId, xpEarned, heartsLost }) => {
    const data = load();
    const existing = data.progress.find(p => p.unit_id === unitId && p.lesson_id === lessonId);
    if (!existing) {
      data.progress.push({ unit_id: unitId, lesson_id: lessonId, xp_earned: xpEarned, completed_at: new Date().toISOString() });
    }

    const u = data.user;
    u.xp += xpEarned;
    u.level = Math.floor(u.xp / 100) + 1;
    u.hearts = Math.max(0, u.hearts - heartsLost);

    const today = new Date().toISOString().split('T')[0];
    if (u.last_active !== today) {
      u.streak += 1;
      u.last_active = today;
    }

    save(data);
    return data.user;
  },

  restoreHearts: () => {
    const data = load();
    if (data.user.gems < 350) return { success: false, message: 'Not enough gems' };
    data.user.hearts = 5;
    data.user.gems -= 350;
    save(data);
    return { success: true, user: data.user };
  },

  updateUsername: (username) => {
    const data = load();
    data.user.username = username.trim();
    save(data);
    return true;
  },
};

export default db;
