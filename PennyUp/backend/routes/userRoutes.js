const express = require('express');
const  { createUser, getUserByUID, getAllUsers, updateFavouriteStock, updateUser, resetAccount, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.post('/', createUser)
router.get('/', getAllUsers)
router.get('/:firebaseUID', getUserByUID)
router.put('/favouriteStock', updateFavouriteStock);

//settings routes
router.put('/update', updateUser);
router.put('/resetAccount', resetAccount);
router.delete('/:firebaseUID', deleteUser);

module.exports = router;