import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole, requireTenant } from '../middleware/rbac.js';
import { 
  submitApplication, 
  getMyApplications,
  getOrganizationApplications,
  getOpportunityApplications,
  updateApplicationStatus
} from '../controllers/application.controller.js';

const router = Router();

router.use(requireAuth);

// Student routes
router.post('/', requireRole(['STUDENT']), submitApplication);
router.get('/me', requireRole(['STUDENT']), getMyApplications);

// Industry routes
router.get('/organization', requireRole(['INDUSTRY']), requireTenant(), getOrganizationApplications);
router.get('/opportunity/:opportunityId', requireRole(['INDUSTRY']), requireTenant(), getOpportunityApplications);
router.put('/:id/status', requireRole(['INDUSTRY']), requireTenant(), updateApplicationStatus);

export default router;
