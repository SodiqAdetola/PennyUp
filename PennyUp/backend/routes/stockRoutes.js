const express = require('express');
const { getStocks, buyStock, getUserStocks, sellStock, updatePrices} = require('../controllers/stockController');

const router = express.Router();

router.get('/fetch', getStocks);

router.put('/buy', buyStock);

router.post('/stock', getUserStocks);

router.put('/sell', sellStock);

router.put('/updatePrices', updatePrices);


module.exports = router;
