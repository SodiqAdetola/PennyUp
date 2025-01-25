const express = require('express');
const { getStocks } = require('../controllers/stockController');

const router = express.Router();

router.get('/fetch', getStocks);

module.exports = router;
