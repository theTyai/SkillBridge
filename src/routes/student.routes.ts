import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/rbac.js';
import { 
  getMyProfile, 
  getInstitutionDirectory,
  createProfile, 
  updateProfile, 
  getPublicPortfolio,
  addSkill,
  addProject
} from '../controllers/student.controller.js';

const router = Router();

// Public route
router.get('/portfolio/:slug', getPublicPortfolio);
router.get('/institutions', getInstitutionDirectory);

// Protected routes (Student only)
router.use(requireAuth);
router.use(requireRole(['STUDENT']));

router.get('/me', getMyProfile);
router.post('/me', createProfile);
router.put('/me', updateProfile);

router.post('/me/skills', addSkill);
router.post('/me/projects', addProject);

export default router;
