const express = require('express');
const { getStocks, buyStock, getUserStocks } = require('../controllers/stockController');

const router = express.Router();

router.get('/fetch', getStocks);

router.post('/buy', buyStock);

router.post('/stock', getUserStocks)

module.exports = router;
