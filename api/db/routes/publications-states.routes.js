import express from 'express';
import {
    getAllPublicationState,
    getPublicationStateById
} from '../controllers/publications-states.controller.js';

const router = express.Router();

router.get('/', getAllPublicationState);
router.get('/:id', getPublicationStateById);

export default router;
