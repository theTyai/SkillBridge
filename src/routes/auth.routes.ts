import { Router } from 'express';
import { syncUser, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// /api/v1/auth/sync
router.post('/sync', syncUser);

// /api/v1/auth/me
router.get('/me', requireAuth, getMe);

export default router;
