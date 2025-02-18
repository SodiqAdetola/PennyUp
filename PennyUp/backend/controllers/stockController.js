const yahooFinance = require('yahoo-finance2').default;
const User = require('../models/User')
const Trade = require('../models/Trade');

exports.getStocks = async (req, res) => {
  const { symbols } = req.query;
  const symbolList = symbols ? symbols.split(',') : [];
  try {
    const stockData = await Promise.all(
      symbolList.map((symbol) => yahooFinance.quote(symbol))
    );
    res.status(200).json(stockData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching stock data' });
  }
};

exports.buyStock = async (req, res) => {
  const { firebaseUID, stockSymbol, stockName, amount, purchasePrice } = req.body;

  try {
    const newTrade = new Trade({
      userId: user._id,
      stockSymbol,
      stockName,
      amount,
      purchasePrice,
    });

    await newTrade.save();

    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const cost = amount;
    if (user.accountBalance < cost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }
    user.accountBalance -= cost;
    user.broughtTrades.push(newTrade._id);

    await user.save();

    res.status(200).json({ message: "Trade completed successfully", trade: newTrade, balance: user.accountBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

exports.getUserStocks =  async (req ,res) => {
  const { stockIDs } = req.body;

  try {
    const trades = await Trade.find({ '_id': { $in: stockIDs } }); // Find trades by IDs
    res.status(200).json(trades);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching trades' });
  }

}