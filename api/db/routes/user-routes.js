const express = require('express');
const {
    getUserById,
    getAllUsers,
    updateUser,
    createUser,
    updateUserById,
    updateAllUsers, getUserBirthdayOfToday
} = require('../controllers/user-controller.js');
const { canModifyAndSeeUsers } = require('../../middlewares/check-role.js');

const router = express.Router();

router.get('/', canModifyAndSeeUsers, getAllUsers);
router.get('/birthday', getUserBirthdayOfToday);
router.get('/:id', canModifyAndSeeUsers, getUserById);
router.post('/', canModifyAndSeeUsers, createUser);
router.patch('/', updateUser);
router.patch('/all', canModifyAndSeeUsers, updateAllUsers);
router.patch('/:id', canModifyAndSeeUsers, updateUserById);

module.exports = router;
