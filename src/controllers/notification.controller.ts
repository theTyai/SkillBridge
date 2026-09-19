import { Request, Response } from 'express';
import { db } from '../lib/db.js';

// ── GET /api/v1/notifications ──
export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { unreadOnly } = req.query;

    const where: any = { userId };
    if (unreadOnly === 'true') {
      where.read = false;
    }

    const notifications = await db.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('[getMyNotifications]', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// ── PUT /api/v1/notifications/:id/read ──
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const notification = await db.notification.findUnique({ where: { id } });
    if (!notification || notification.userId !== userId) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await db.notification.update({
      where: { id },
      data: { read: true, readAt: new Date() }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[markAsRead]', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

// ── PUT /api/v1/notifications/read-all ──
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true, readAt: new Date() }
    });

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('[markAllAsRead]', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};
