const mongoose = require("mongoose");

const Trade = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  stockSymbol: {
    type: String,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  purchasePrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  broughtState: {
    type: Boolean,
    default: true,
  },
  profit: {
    type: Number,
    required: false,
  }
});

module.exports = mongoose.model("Trade", Trade);
