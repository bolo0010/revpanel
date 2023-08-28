import express from 'express';
import {
    getPublicationRouteById,
    getPublicationRoutes
} from '../controllers/publications-routes.controller.js';

const router = express.Router();

router.get('/', getPublicationRoutes);
router.get('/:id', getPublicationRouteById);

export default router;