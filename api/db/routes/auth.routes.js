import express from 'express';
import passport from 'passport';
import { loginUser, logoutUser, userIsLogged } from '../controllers/auth.controller.js';

const router = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/logout', logoutUser);
router.get('/is-logged', authenticate, userIsLogged);
router.post('/login', loginUser);

export default router;