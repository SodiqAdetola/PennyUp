const express = require('express');
const { getStocks, buyStock } = require('../controllers/stockController');

const router = express.Router();

router.get('/fetch', getStocks);

router.post('/buy', buyStock)

module.exports = router;
