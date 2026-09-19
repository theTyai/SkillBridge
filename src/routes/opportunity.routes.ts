import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole, requireTenant } from '../middleware/rbac.js';
import { 
  getOpportunities, 
  getOpportunityById,
  createOpportunity,
  updateOpportunity
} from '../controllers/opportunity.controller.js';

const router = Router();

// Publicly readable opportunities
router.get('/', getOpportunities);
router.get('/:id', getOpportunityById);

// Protected routes (Industry)
router.post('/', requireAuth, requireRole(['RECRUITER']), requireTenant(), createOpportunity);
router.put('/:id', requireAuth, requireRole(['RECRUITER']), requireTenant(), updateOpportunity);

export default router;
