const mongoose = require("mongoose");
const { type } = require("os");

const User = new mongoose.Schema({

    firebaseUID: {
        type: String,
        required: true,
        unique: true
    },

    broughtTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    }],

    soldTrades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trade',
    }],

    username: {
        type: String,
        required: true
    },

    accountBalance: {
        type: Number,
        default: 10000.00
    },

    favouriteStocks: [{
        type: String,
        required: false
    }],
})

module.exports = mongoose.model('User', User)