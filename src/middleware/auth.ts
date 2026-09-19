import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';
import { db } from '../lib/db.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Verify token with Supabase (this validates signature, expiration, etc.)
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({ error: 'Invalid or expired token', details: error?.message });
    }

    // 2. Look up the user in our local database
    const localUser = await db.user.findUnique({
      where: { supabaseAuthId: supabaseUser.id },
      select: {
        id: true,
        supabaseAuthId: true,
        email: true,
        name: true,
        avatarUrl: true,
        role: true,
        institutionId: true,
        organizationId: true,
        isActive: true
      }
    });

    if (!localUser) {
      // The user exists in Supabase but hasn't synced to our DB yet
      return res.status(401).json({ 
        error: 'User not synced', 
        message: 'Please call /api/v1/auth/sync first to initialize your profile' 
      });
    }

    if (!localUser.isActive) {
      return res.status(403).json({ error: 'Account deactivated' });
    }

    // 3. Attach user to request
    req.user = localUser;
    
    next();
  } catch (error) {
    console.error('[Auth Middleware Error]', error);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
};
