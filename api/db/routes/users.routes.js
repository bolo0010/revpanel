import express from 'express';
import {
    getUserById,
    getAllUsers,
    updateUser,
    createUser,
    updateUserById,
    updateAllUsers, getUserBirthday, getCurrentUser
} from '../controllers/users.controller.js';
import { canModifyAndSeeUsers } from '../../middlewares/check-role.js';

const router = express.Router();

router.get('/', canModifyAndSeeUsers, getAllUsers);
router.get('/current', getCurrentUser);
router.get('/birthday', getUserBirthday);
router.get('/:id', canModifyAndSeeUsers, getUserById);
router.post('/', canModifyAndSeeUsers, createUser);
router.patch('/', updateUser);
router.patch('/all', canModifyAndSeeUsers, updateAllUsers);
router.patch('/:id', canModifyAndSeeUsers, updateUserById);

export default router;
