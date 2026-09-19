/**
 * Audit action constants.
 *
 * Every meaningful user action in SkillBridge writes an AuditLog row.
 * This file is the single source of truth for all action strings.
 *
 * Usage:
 *   import { AUDIT } from '../lib/audit';
 *   await audit(req.user.id, AUDIT.APPLICATION_SUBMITTED, 'Application', app.id, { matchScore });
 */

export const AUDIT = {
  // ── Auth ───────────────────────────────────────────────
  USER_REGISTERED: 'USER_REGISTERED',
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_DEACTIVATED: 'USER_DEACTIVATED',

  // ── Profile ────────────────────────────────────────────
  PROFILE_UPDATED: 'PROFILE_UPDATED',
  SKILL_ADDED: 'SKILL_ADDED',
  SKILL_UPDATED: 'SKILL_UPDATED',
  SKILL_REMOVED: 'SKILL_REMOVED',
  PROJECT_ADDED: 'PROJECT_ADDED',
  PROJECT_UPDATED: 'PROJECT_UPDATED',
  PROJECT_DELETED: 'PROJECT_DELETED',

  // ── Applications ───────────────────────────────────────
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  APPLICATION_WITHDRAWN: 'APPLICATION_WITHDRAWN',
  APPLICATION_STATUS_CHANGED: 'APPLICATION_STATUS_CHANGED',

  // ── Certifications ─────────────────────────────────────
  CERTIFICATION_SUBMITTED: 'CERTIFICATION_SUBMITTED',
  CERTIFICATION_VERIFIED: 'CERTIFICATION_VERIFIED',
  CERTIFICATION_REJECTED: 'CERTIFICATION_REJECTED',

  // ── Opportunities ──────────────────────────────────────
  OPPORTUNITY_CREATED: 'OPPORTUNITY_CREATED',
  OPPORTUNITY_UPDATED: 'OPPORTUNITY_UPDATED',
  OPPORTUNITY_PUBLISHED: 'OPPORTUNITY_PUBLISHED',
  OPPORTUNITY_CLOSED: 'OPPORTUNITY_CLOSED',

  // ── Skills & Assessments ───────────────────────────────
  SKILL_VERIFIED: 'SKILL_VERIFIED',
  ASSESSMENT_ATTEMPTED: 'ASSESSMENT_ATTEMPTED',
  ASSESSMENT_PASSED: 'ASSESSMENT_PASSED',
  ASSESSMENT_FAILED: 'ASSESSMENT_FAILED',

  // ── Learning ───────────────────────────────────────────
  LEARNING_ENROLLED: 'LEARNING_ENROLLED',
  LEARNING_COMPLETED: 'LEARNING_COMPLETED',

  // ── Institution Admin ──────────────────────────────────
  TAXONOMY_SKILL_ADDED: 'TAXONOMY_SKILL_ADDED',
  TAXONOMY_SKILL_UPDATED: 'TAXONOMY_SKILL_UPDATED',

  // ── Collaboration ──────────────────────────────────────
  COLLABORATION_CREATED: 'COLLABORATION_CREATED',
  MILESTONE_COMPLETED: 'MILESTONE_COMPLETED',
} as const;

export type AuditAction = (typeof AUDIT)[keyof typeof AUDIT];
