const express = require('express');
const {
    createPublicationComment,
    getPublicationCommentsById,
    deletePublicationComment
} = require('../controllers/publication-comment-controller.js');

const router = express.Router();

router.get('/:id', getPublicationCommentsById);
router.post('/', createPublicationComment);
router.delete('/', deletePublicationComment);

module.exports = router;