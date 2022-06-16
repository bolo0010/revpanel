const express = require('express');
const {
    getAllPublicationType,
    getPublicationTypeById
} = require('../controllers/publication-type-controller.js');

const router = express.Router();

router.get('/', getAllPublicationType);
router.get('/:id', getPublicationTypeById);

module.exports = router;