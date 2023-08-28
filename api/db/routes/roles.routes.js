import express from 'express';
import { getAllRole, getRoleById } from '../controllers/roles.controller.js';
import { canSeeRoles } from '../../middlewares/check-role.js';

const router = express.Router();

router.get('/', canSeeRoles, getAllRole);
router.get('/:id', canSeeRoles, getRoleById);

export default router;
