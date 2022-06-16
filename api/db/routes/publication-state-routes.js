const express = require('express');
const {
    getAllPublicationState,
    getPublicationStateById
} = require('../controllers/publication-state-controller.js');

const router = express.Router();

router.get('/', getAllPublicationState);
router.get('/:id', getPublicationStateById);

module.exports = router;
