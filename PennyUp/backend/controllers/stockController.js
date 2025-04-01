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

  const user = await User.findOne({ firebaseUID });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  
  try {
    const newTrade = new Trade({
      userId: user._id,
      stockSymbol,
      stockName,
      amount,
      purchasePrice,
      currentPrice: purchasePrice,
    });

    await newTrade.save();

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
    res.status(500).json({ error: "Internal server error", error });
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



exports.sellStock = async (req, res) => {
    try {
        const { firebaseUID, tradeId, personalProfitLoss, initialPurchaseAmount, soldAt } = req.body;

        const user = await User.findOne({ firebaseUID });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const trade = await Trade.findById(tradeId);
        if (!trade) {
            return res.status(404).json({ message: "Trade not found" });
        }

        trade.profit = personalProfitLoss; //update profit on schema
        trade.soldAt = soldAt; // Update the sold date

        // Calculate the updated balance
        const updatedBalance = user.accountBalance + personalProfitLoss + initialPurchaseAmount;
        trade.broughtState = false; // Mark as sold
        
        // Move trade to soldTrades and remove from broughtTrades
        user.soldTrades.push(trade);
        user.broughtTrades = user.broughtTrades.filter(t => t.toString() !== tradeId);

        user.accountBalance = updatedBalance;

        await user.save();
        await trade.save();

        res.status(200).json({ message: "Stock sold successfully", updatedBalance, soldTrade: trade });
    } catch (err) {
        console.error('Error selling stock:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updatePrices = async (req, res) => {
  const { firebaseUID, trades } = req.body;

  try {
    //Find user
    const user = await User.findOne({ firebaseUID });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update prices for each trade
    for (const trade of trades) {
      await Trade.findByIdAndUpdate(trade.tradeId, { currentPrice: trade.currentPrice });
    }

    res.status(200).json({ message: "Prices updated successfully" });
  } catch (error) {
    console.error("Error updating trade prices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

