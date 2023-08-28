import express from 'express';
import {
    getPublicationById,
    deletePublication,
    updatePublication,
    createPublication,
    getAllPublicationForPanel,
    getPublicationsForWebsite,
    archivePublication,
    updateStateOfPublication
} from '../controllers/publications.controller.js';
import passport from 'passport';

const router = express.Router();
const authenticate = passport.authenticate('jwt', { session: false });

router.get('/public/:route', getPublicationsForWebsite);
router.get('/', authenticate, getAllPublicationForPanel);
router.get('/:id', authenticate, getPublicationById);
router.post('/', authenticate, createPublication);
router.patch('/state/:id', authenticate, updateStateOfPublication);
router.patch('/archive/:id', authenticate, archivePublication);
router.patch('/:id', authenticate, updatePublication);
router.delete('/', authenticate, deletePublication);

export default router;