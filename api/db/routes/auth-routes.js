const express = require('express');
const passport = require('passport');
const { loginUser, logoutUser, userIsLogged } = require('../controllers/auth-controller.js');

const router = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/logout', logoutUser);
router.get('/isLogged', authenticate, userIsLogged);
router.post('/login', loginUser);

module.exports = router;
