import { Router } from 'express';
import { parseResume, generateRoadmap, generateInterview } from '../controllers/ai.controller.js';

const router = Router();

router.post('/resume/parse', parseResume);
router.post('/roadmap', generateRoadmap);
router.post('/interview', generateInterview);

export default router;
