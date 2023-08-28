import express from 'express';
import {
    getAllPublicationType,
    getPublicationTypeById
} from '../controllers/publications-types.controller.js';

const router = express.Router();

router.get('/', getAllPublicationType);
router.get('/:id', getPublicationTypeById);

export default router;