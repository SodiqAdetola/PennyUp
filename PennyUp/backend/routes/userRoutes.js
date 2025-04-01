const express = require('express');
const  { createUser, getUserByUID, getAllUsers, sellTrade, updateFavouriteStock } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser)

router.get('/', getAllUsers)

router.get('/:firebaseUID', getUserByUID)

router.put('/sellTrade', sellTrade);

router.put('/favouriteStock', updateFavouriteStock);



module.exports = router;