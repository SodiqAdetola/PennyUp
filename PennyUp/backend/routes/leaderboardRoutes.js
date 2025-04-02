const express = require('express');
const { leaderboard } = require('../controllers/leaderboardController');

const router = express.Router();

router.get('/', leaderboard);

module.exports = router;


