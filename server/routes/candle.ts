import { Router } from 'express';
import { sqliteDb } from '../database/connection.js';
import { authenticateJWT } from './users.js';

const router = Router();

// Get all candle lighting times for user
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const rows = sqliteDb.prepare('SELECT * FROM candle_lit_times WHERE user_id = ? ORDER BY lit_at DESC').all(userId);
  res.json(rows);
});

// Save a new candle lighting time
router.post('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { lit_at } = req.body;
  sqliteDb.prepare('INSERT INTO candle_lit_times (user_id, lit_at) VALUES (?, ?)').run(userId, lit_at);
  res.json({ success: true });
});

export default router;
