import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getUploadUrl } from '../controllers/storage.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/upload-url', getUploadUrl);

export default router;
