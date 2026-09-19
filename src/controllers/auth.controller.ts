import { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { db } from '../lib/db.js';
import { UserRole } from '@prisma/client';

export const syncUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);

    if (error || !supabaseUser) {
      return res.status(401).json({ error: 'Invalid token', details: error?.message });
    }

    const { email, user_metadata } = supabaseUser;

    if (!email) {
      return res.status(400).json({ error: 'Email is required from auth provider' });
    }

    // Determine role (default to STUDENT if not provided)
    const role: UserRole = user_metadata?.role || 'STUDENT';
    const name: string = user_metadata?.full_name || email.split('@')[0];
    const avatarUrl: string | undefined = user_metadata?.avatar_url;

    // Check if user already exists
    let localUser = await db.user.findUnique({
      where: { supabaseAuthId: supabaseUser.id }
    });

    if (!localUser) {
      // Create new user in our DB
      localUser = await db.user.create({
        data: {
          supabaseAuthId: supabaseUser.id,
          email,
          name,
          role,
          avatarUrl,
          lastLoginAt: new Date()
        }
      });
    } else {
      // Update last login
      localUser = await db.user.update({
        where: { id: localUser.id },
        data: { lastLoginAt: new Date() }
      });
    }

    res.json({
      message: 'User synced successfully',
      user: {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        role: localUser.role,
        institutionId: localUser.institutionId,
        organizationId: localUser.organizationId,
      }
    });

  } catch (error) {
    console.error('[Auth Sync Error]', error);
    res.status(500).json({ error: 'Internal server error during user sync' });
  }
};

// ── GET /api/v1/auth/me ──
export const getMe = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    
    // Fetch some basic profile info based on role
    let profileData = null;
    if (user.role === 'STUDENT') {
      const student = await db.studentProfile.findUnique({ where: { userId: user.id } });
      if (student) {
        profileData = { name: user.name, avatarUrl: user.avatarUrl, portfolioSlug: student.portfolioSlug };
      }
    } else if (user.role === 'ACADEMICIAN') {
      const faculty = await db.facultyProfile.findUnique({ where: { userId: user.id } });
      if (faculty) profileData = { name: user.name, avatarUrl: user.avatarUrl, designation: faculty.designation };
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        institutionId: user.institutionId,
        organizationId: user.organizationId,
        profile: profileData || { name: user.name, avatarUrl: user.avatarUrl }
      }
    });
  } catch (error) {
    console.error('[getMe Error]', error);
    res.status(500).json({ error: 'Internal server error fetching me' });
  }
};

