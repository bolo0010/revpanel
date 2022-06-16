const express = require('express');
const { getAllRole, getRoleById } = require('../controllers/role-controller.js');
const { canSeeRoles } = require('../../middlewares/check-role.js');

const router = express.Router();

router.get('/', canSeeRoles, getAllRole);
router.get('/:id', canSeeRoles, getRoleById);

module.exports = router;
