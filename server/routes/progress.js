import express from 'express';
import db from '../db/database.js';

const router = express.Router();

router.get('/user', (req, res) => {
  const user = db.getUser();
  const completed = db.getCompleted();
  res.json({ user, completed });
});

router.post('/complete-lesson', (req, res) => {
  const { unitId, lessonId, xpEarned, heartsLost } = req.body;
  const updatedUser = db.completeLesson({ unitId, lessonId, xpEarned, heartsLost });
  res.json({ success: true, user: updatedUser, xpEarned });
});

router.post('/restore-hearts', (req, res) => {
  const result = db.restoreHearts();
  res.json(result);
});

router.post('/update-username', (req, res) => {
  const { username } = req.body;
  if (!username || username.trim().length < 2) return res.json({ success: false });
  db.updateUsername(username);
  res.json({ success: true });
});

export default router;
