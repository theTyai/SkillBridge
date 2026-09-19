import { Request, Response } from 'express';
import { db } from '../lib/db.js';

// ── GET /api/v1/opportunities ──
export const getOpportunities = async (req: Request, res: Response) => {
  try {
    const { status, type, workMode, organizationId } = req.query;

    const where: any = {
      // By default, only show published opportunities unless queried otherwise
      status: status ? String(status) : 'PUBLISHED',
    };

    if (type) where.type = String(type);
    if (workMode) where.workMode = String(workMode);
    if (organizationId) where.organizationId = String(organizationId);

    const opportunities = await db.opportunity.findMany({
      where,
      include: {
        organization: { select: { id: true, name: true, logoUrl: true, sector: true } },
        role: { select: { id: true, name: true, category: true } },
        requiredSkills: { include: { canonicalSkill: { select: { id: true, name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ success: true, data: opportunities });
  } catch (error) {
    console.error('[getOpportunities]', error);
    res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
};

// ── GET /api/v1/opportunities/:id ──
export const getOpportunityById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const opportunity = await db.opportunity.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true, logoUrl: true, sector: true, website: true, size: true } },
        role: true,
        requiredSkills: { include: { canonicalSkill: true } }
      }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    res.json({ success: true, data: opportunity });
  } catch (error) {
    console.error('[getOpportunityById]', error);
    res.status(500).json({ error: 'Failed to fetch opportunity' });
  }
};

// ── POST /api/v1/opportunities (RECRUITER) ──
export const createOpportunity = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const organizationId = req.user!.organizationId;

    if (!organizationId) {
      return res.status(403).json({ error: 'You must belong to an organization to create opportunities' });
    }

    const { title, type, description, location, workMode, deadline, stipendOrSalary, openings, requiredSkills } = req.body;

    const opportunity = await db.opportunity.create({
      data: {
        organizationId,
        title,
        type,
        description,
        location,
        workMode,
        deadline: new Date(deadline),
        stipendOrSalary,
        openings: openings || 1,
        status: 'PUBLISHED', // or DRAFT based on flow
        publishedAt: new Date(),
        requiredSkills: {
          create: requiredSkills?.map((rs: any) => ({
            canonicalSkillId: rs.canonicalSkillId,
            requiredProficiency: rs.requiredProficiency,
            required: rs.required !== false
          })) || []
        }
      }
    });

    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    console.error('[createOpportunity]', error);
    res.status(500).json({ error: 'Failed to create opportunity' });
  }
};

// ── PUT /api/v1/opportunities/:id (RECRUITER) ──
export const updateOpportunity = async (req: Request, res: Response) => {
  try {
    const organizationId = req.user!.organizationId;
    const { id } = req.params;
    const updateData = req.body;

    const existing = await db.opportunity.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: 'Opportunity not found' });
    if (existing.organizationId !== organizationId) {
      return res.status(403).json({ error: 'You do not have permission to update this opportunity' });
    }

    // Clean restricted fields
    delete updateData.id;
    delete updateData.organizationId;
    delete updateData.createdAt;

    const opportunity = await db.opportunity.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: opportunity });
  } catch (error) {
    console.error('[updateOpportunity]', error);
    res.status(500).json({ error: 'Failed to update opportunity' });
  }
};

