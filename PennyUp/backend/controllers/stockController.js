const yahooFinance = require('yahoo-finance2').default;
const User = require('../models/User')

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
    const user = await User.findById(firebaseUID);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cost = amount;

    if (user.accountBalance < cost) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    user.accountBalance -= cost;

    const Trade = new Trade({
      userId: user._id,
      stockSymbol,
      stockName,
      amount,
      purchasePrice,
    });

    await Trade.save();
    await user.save();

    res.status(200).json({ message: "Trade completed successfully", trade: newTrade, balance: user.accountBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}