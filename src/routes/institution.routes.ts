import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { requireRole, requireTenant } from '../middleware/rbac.js';
import { getInstitutionStudents, verifyStudentSkill } from '../controllers/institution.controller.js';

const router = Router();

router.use(requireAuth);
router.use(requireTenant());
router.use(requireRole(['INSTITUTION_ADMIN', 'ACADEMICIAN']));

router.get('/students', getInstitutionStudents);
router.post('/verify-skill', verifyStudentSkill);

export default router;
