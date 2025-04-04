const express = require('express');
const { news } = require('../controllers/newsController');

const router = express.Router();

router.get('/', news);

module.exports = router;