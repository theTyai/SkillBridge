import { Request, Response } from 'express';
import { db } from '../lib/db.js';
import { AUDIT } from '../lib/audit.js';

// ── GET /api/v1/institutions/students ──
export const getInstitutionStudents = async (req: Request, res: Response) => {
  try {
    const institutionId = req.user!.institutionId;
    if (!institutionId) return res.status(403).json({ error: 'Tenant missing' });

    const students = await db.studentProfile.findMany({
      where: { institutionId },
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        department: { select: { name: true } },
        skills: { where: { verified: false }, include: { canonicalSkill: true } }
      },
      orderBy: { graduationYear: 'desc' }
    });

    res.json({ success: true, data: students });
  } catch (error) {
    console.error('[getInstitutionStudents]', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
};

// ── POST /api/v1/institutions/verify-skill ──
export const verifyStudentSkill = async (req: Request, res: Response) => {
  try {
    const institutionId = req.user!.institutionId;
    const actorId = req.user!.id;
    const { skillId, verified, note } = req.body;

    const skill = await db.studentSkill.findUnique({
      where: { id: skillId },
      include: { student: true }
    });

    if (!skill || skill.student.institutionId !== institutionId) {
      return res.status(404).json({ error: 'Skill not found in your institution' });
    }

    const updated = await db.studentSkill.update({
      where: { id: skillId },
      data: {
        verified,
        verifiedBy: actorId,
        assessedAt: new Date()
      }
    });

    await db.auditLog.create({
      data: {
        actorId,
        institutionId,
        action: AUDIT.SKILL_VERIFIED,
        entityType: 'StudentSkill',
        entityId: skill.id,
        metadata: { verified, note }
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[verifyStudentSkill]', error);
    res.status(500).json({ error: 'Failed to verify skill' });
  }
};
