const express = require('express');
const {
    getPublicationById,
    deletePublication,
    updatePublication,
    createPublication,
    getAllPublicationForPanel,
    getPublicationsForWebsite
} = require('../controllers/publication-controller.js');
const passport = require('passport');

const router = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/public/:route', getPublicationsForWebsite);
router.get('/', authenticate, getAllPublicationForPanel);
router.get('/:id', authenticate, getPublicationById);
router.post('/', authenticate, createPublication);
router.patch('/:id', authenticate, updatePublication);
router.delete('/', authenticate, deletePublication);

module.exports = router;