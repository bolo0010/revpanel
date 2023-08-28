import express from 'express';
import { getTerms, updateTerms } from '../controllers/terms.controller.js';

const router = express.Router();

router.get('/', getTerms);
router.patch('/', updateTerms);

export default router;