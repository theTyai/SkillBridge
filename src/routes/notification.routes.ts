import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getMyNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getMyNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
