const mongoose = require("mongoose");
const { type } = require("os");

const User = new mongoose.Schema({

    firebaseUID: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true
    },

    accountBalance: {
        type: Number,
        default: 1000.00
    },

    broughtTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    }],

    soldTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    }],
    favouriteStocks: [{
        type: String
    }],
})

module.exports = mongoose.model('User', User)