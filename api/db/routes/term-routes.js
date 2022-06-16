const express = require('express');
const { getTerms, updateTerms } = require('../controllers/term-controller.js');

const router = express.Router();

router.get('/', getTerms);
router.patch('/', updateTerms);

module.exports = router;