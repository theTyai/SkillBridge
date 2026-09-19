import { Request, Response } from 'express';
import { db } from '../lib/db.js';
import { AUDIT } from '../lib/audit.js';

// Simple deterministic match engine
const calculateOpportunityMatch = (studentSkills: any[], requiredSkills: any[]) => {
  if (requiredSkills.length === 0) return { overallScore: 100, isEligible: true, missingSkills: [] };

  let matchedWeight = 0;
  let totalWeight = requiredSkills.length;
  let missingSkills: string[] = [];

  for (const reqSkill of requiredSkills) {
    const studentSkill = studentSkills.find(s => s.canonicalSkillId === reqSkill.canonicalSkillId);
    
    if (studentSkill) {
      if (studentSkill.proficiency >= reqSkill.requiredProficiency) {
        matchedWeight += 1;
      } else {
        matchedWeight += 0.5; // Partial match
        if (reqSkill.required) missingSkills.push(reqSkill.canonicalSkill.name);
      }
    } else {
      if (reqSkill.required) missingSkills.push(reqSkill.canonicalSkill.name);
    }
  }

  const score = Math.round((matchedWeight / totalWeight) * 100);
  const isEligible = missingSkills.length === 0 || score >= 60; // Basic threshold

  return { overallScore: score, isEligible, missingSkills };
};

// ── POST /api/v1/applications ──
export const submitApplication = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const { opportunityId, coverNote, answers } = req.body;

    const student = await db.studentProfile.findUnique({
      where: { userId },
      include: { skills: true, projects: { select: { id: true } } }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student profile not found. Please complete your profile first.' });
    }

    // An application is a trust-bearing action. Require a usable career record
    // plus at least one skill explicitly verified by the student's institution.
    const missingProfileFields = [
      !student.studentRollNo && 'student ID',
      !student.branch && 'branch',
      !student.degree && 'degree',
      !student.graduationYear && 'graduation year',
      !student.bio && 'professional summary',
      student.targetRoles.length === 0 && 'a target role',
      !student.resumeUrl && 'resume',
      student.projects.length === 0 && 'a project or portfolio evidence'
    ].filter(Boolean);
    if (missingProfileFields.length > 0) {
      return res.status(403).json({
        error: `Complete your profile before applying: add ${missingProfileFields.join(', ')}.`,
        code: 'PROFILE_INCOMPLETE'
      });
    }

    const hasInstitutionVerifiedSkill = student.skills.some(skill => skill.verified && Boolean(skill.verifiedBy));
    if (!hasInstitutionVerifiedSkill) {
      return res.status(403).json({
        error: 'Your profile must be verified by your institution before you can apply. Ask your placement cell to verify at least one submitted skill.',
        code: 'PROFILE_NOT_INSTITUTION_VERIFIED'
      });
    }

    const opportunity = await db.opportunity.findUnique({
      where: { id: opportunityId },
      include: { requiredSkills: { include: { canonicalSkill: true } } }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    if (opportunity.status !== 'PUBLISHED') {
      return res.status(400).json({ error: 'Opportunity is not open for applications' });
    }

    // Check if already applied
    const existing = await db.application.findUnique({
      where: {
        opportunityId_studentId: { opportunityId, studentId: student.id }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'You have already applied to this opportunity' });
    }

    // Calculate deterministic match score
    const match = calculateOpportunityMatch(student.skills, opportunity.requiredSkills);

    const application = await db.application.create({
      data: {
        opportunityId,
        studentId: student.id,
        coverNote,
        answers: answers || {},
        matchScore: match.overallScore,
        status: 'APPLIED',
        events: {
          create: {
            status: 'APPLIED',
            note: 'Application submitted',
            createdById: userId
          }
        }
      }
    });

    // Update applicant count
    await db.opportunity.update({
      where: { id: opportunityId },
      data: { applicantsCount: { increment: 1 } }
    });

    // Audit log
    await db.auditLog.create({
      data: {
        actorId: userId,
        action: AUDIT.APPLICATION_SUBMITTED,
        entityType: 'Application',
        entityId: application.id
      }
    });

    res.status(201).json({ success: true, data: application, matchDetails: match });
  } catch (error) {
    console.error('[submitApplication]', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
};

// ── GET /api/v1/applications/me ──
export const getMyApplications = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const student = await db.studentProfile.findUnique({ where: { userId } });
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const applications = await db.application.findMany({
      where: { studentId: student.id },
      include: {
        opportunity: {
          include: { organization: { select: { name: true, logoUrl: true } } }
        }
      },
      orderBy: { appliedAt: 'desc' }
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('[getMyApplications]', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

// ── GET /api/v1/applications/organization (RECRUITER) ──
export const getOrganizationApplications = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;
    if (!organizationId) {
      return res.status(403).json({ error: 'User is not associated with an organization' });
    }

    const applications = await db.application.findMany({
      where: {
        opportunity: { organizationId }
      },
      include: {
        opportunity: {
          select: { title: true, organization: { select: { name: true, logoUrl: true } } }
        },
        student: {
          include: { user: { select: { name: true, email: true, avatarUrl: true } } }
        },
        events: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { matchScore: 'desc' }
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('[getOrganizationApplications]', error);
    res.status(500).json({ error: 'Failed to fetch organization applications' });
  }
};

// ── GET /api/v1/applications/opportunity/:opportunityId (RECRUITER) ──
export const getOpportunityApplications = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;
    const { opportunityId } = req.params;

    const opportunity = await db.opportunity.findUnique({ where: { id: opportunityId } });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    if (opportunity.organizationId !== organizationId) {
      return res.status(403).json({ error: 'You do not have permission to view these applications' });
    }

    const applications = await db.application.findMany({
      where: { opportunityId },
      include: {
        student: {
          include: { user: { select: { name: true, email: true, avatarUrl: true } } }
        },
        events: { orderBy: { createdAt: 'desc' } }
      },
      orderBy: { matchScore: 'desc' } // ATS sorts by match score by default
    });

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error('[getOpportunityApplications]', error);
    res.status(500).json({ error: 'Failed to fetch applications for opportunity' });
  }
};

// ── PUT /api/v1/applications/:id/status (RECRUITER) ──
export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const organizationId = req.user!.organizationId;
    const { id } = req.params;
    const { status, note } = req.body;

    const application = await db.application.findUnique({
      where: { id },
      include: { opportunity: true }
    });

    if (!application) return res.status(404).json({ error: 'Application not found' });

    if (application.opportunity.organizationId !== organizationId) {
      return res.status(403).json({ error: 'You do not have permission to update this application' });
    }

    const updated = await db.application.update({
      where: { id },
      data: {
        status,
        events: {
          create: {
            status,
            note,
            createdById: userId
          }
        }
      }
    });

    await db.auditLog.create({
      data: {
        actorId: userId,
        action: AUDIT.APPLICATION_STATUS_CHANGED,
        entityType: 'Application',
        entityId: id,
        metadata: { newStatus: status }
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('[updateApplicationStatus]', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
};
