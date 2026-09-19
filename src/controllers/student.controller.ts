import { Request, Response } from 'express';
import { db } from '../lib/db.js';
import { AUDIT } from '../lib/audit.js';

// ── GET /api/v1/students/institutions ──
// Public, intentionally minimal directory used only during first-run onboarding.
export const getInstitutionDirectory = async (_req: Request, res: Response) => {
  try {
    const institutions = await db.institution.findMany({
      where: { isActive: true },
      select: { id: true, name: true, city: true },
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: institutions });
  } catch (error) {
    console.error('[getInstitutionDirectory]', error);
    res.status(500).json({ error: 'Failed to load institutions' });
  }
};

// ── GET /api/v1/students/me ──
export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const profile = await db.studentProfile.findUnique({
      where: { userId },
      include: {
        skills: { include: { canonicalSkill: true } },
        projects: { orderBy: { sortOrder: 'asc' } },
        certifications: { orderBy: { issueDate: 'desc' } },
        experiences: { orderBy: { startDate: 'desc' } },
        consent: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('[getMyProfile]', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// ── POST /api/v1/students/me ──
export const createProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      institutionId,
      departmentId,
      studentRollNo,
      branch,
      degree,
      graduationYear,
      cgpa,
      bio,
      targetRoles,
      githubUrl,
      linkedinUrl
    } = req.body;

    // Check if profile already exists
    const existing = await db.studentProfile.findUnique({ where: { userId } });
    if (existing) {
      return res.status(400).json({ error: 'Profile already exists. Use PUT to update.' });
    }

    // Generate a unique portfolio slug
    const nameSlug = req.user!.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);
    const portfolioSlug = `${nameSlug}-${uniqueSuffix}`;

    const profile = await db.studentProfile.create({
      data: {
        userId,
        institutionId,
        departmentId,
        studentRollNo,
        branch,
        degree,
        graduationYear: parseInt(graduationYear),
        cgpa: parseFloat(cgpa),
        bio,
        targetRoles: targetRoles || [],
        portfolioSlug,
        githubUrl,
        linkedinUrl,
        consent: {
          create: {
            profileVisible: true,
            resumeVisible: false,
            discoverable: true,
            shareWithInstitution: true,
            shareContactInfo: false,
            allowApplicationData: true
          }
        }
      },
      include: { consent: true }
    });

    // Audit Log
    await db.auditLog.create({
      data: {
        actorId: userId,
        institutionId,
        action: AUDIT.PROFILE_UPDATED,
        entityType: 'StudentProfile',
        entityId: profile.id,
      }
    });

    res.status(201).json({ success: true, data: profile });
  } catch (error) {
    console.error('[createProfile]', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
};

// ── PUT /api/v1/students/me ──
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const updateData = req.body;

    const existing = await db.studentProfile.findUnique({ where: { userId } });
    if (!existing) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Don't allow updating sensitive fields directly through this endpoint
    delete updateData.id;
    delete updateData.userId;
    delete updateData.institutionId;

    const profile = await db.studentProfile.update({
      where: { userId },
      data: updateData
    });

    await db.auditLog.create({
      data: {
        actorId: userId,
        institutionId: existing.institutionId,
        action: AUDIT.PROFILE_UPDATED,
        entityType: 'StudentProfile',
        entityId: profile.id,
      }
    });

    res.json({ success: true, data: profile });
  } catch (error) {
    console.error('[updateProfile]', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// ── GET /api/v1/students/portfolio/:slug ──
export const getPublicPortfolio = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const profile = await db.studentProfile.findUnique({
      where: { portfolioSlug: slug },
      include: {
        user: { select: { name: true, avatarUrl: true, headline: true } },
        institution: { select: { name: true, logoUrl: true } },
        skills: { 
          where: { verified: true }, // Only show verified skills publicly by default
          include: { canonicalSkill: true } 
        },
        projects: { where: { featured: true }, orderBy: { sortOrder: 'asc' } },
        certifications: { where: { verificationStatus: 'VERIFIED' }, orderBy: { issueDate: 'desc' } },
        experiences: { orderBy: { startDate: 'desc' } },
        consent: true
      }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    if (!profile.consent?.profileVisible) {
      return res.status(403).json({ error: 'This portfolio is set to private' });
    }

    // Strip out contact info if not allowed
    if (!profile.consent.shareContactInfo) {
      // We didn't query email anyway, but just to be safe
    }

    // Strip consent object before sending
    const { consent, ...publicProfile } = profile;

    res.json({ success: true, data: publicProfile });
  } catch (error) {
    console.error('[getPublicPortfolio]', error);
    res.status(500).json({ error: 'Failed to fetch public portfolio' });
  }
};

// ── POST /api/v1/students/me/skills ──
export const addSkill = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { canonicalSkillId, proficiency, source } = req.body;

    const profile = await db.studentProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    // Determine level from proficiency
    let level = 'Beginner';
    if (proficiency >= 85) level = 'Expert';
    else if (proficiency >= 60) level = 'Intermediate';

    const skill = await db.studentSkill.create({
      data: {
        studentId: profile.id,
        canonicalSkillId,
        proficiency,
        level,
        source: source || 'SELF_REPORTED'
      }
    });

    await db.auditLog.create({
      data: { actorId: userId, action: AUDIT.SKILL_ADDED, entityType: 'StudentSkill', entityId: skill.id }
    });

    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    console.error('[addSkill]', error);
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

// ── POST /api/v1/students/me/projects ──
export const addProject = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { title, description, technologies, githubRepo, liveDemo, imageUrl, featured } = req.body;

    const profile = await db.studentProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const project = await db.studentProject.create({
      data: {
        studentId: profile.id,
        title,
        description,
        technologies,
        githubRepo,
        liveDemo,
        imageUrl,
        featured: featured || false
      }
    });

    await db.auditLog.create({
      data: { actorId: userId, action: AUDIT.PROJECT_ADDED, entityType: 'StudentProject', entityId: project.id }
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error('[addProject]', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
};
