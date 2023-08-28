import express from 'express';
import {
    createPublicationComment,
    getPublicationCommentsById,
    deletePublicationComment
} from '../controllers/publications-comments.controller.js';

const router = express.Router();

router.get('/:id', getPublicationCommentsById);
router.post('/', createPublicationComment);
router.delete('/', deletePublicationComment);

export default router;