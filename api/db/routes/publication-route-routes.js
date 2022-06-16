const express = require('express');
const {
    getPublicationRouteById,
    getPublicationRoutes
} = require('../controllers/publication-route-controller.js');

const router = express.Router();

router.get('/', getPublicationRoutes);
router.get('/:id', getPublicationRouteById);

module.exports = router;