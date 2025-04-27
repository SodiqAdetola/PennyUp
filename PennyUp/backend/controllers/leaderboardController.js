const User = require('../models/User')
const Trade = require('../models/Trade');

exports.leaderboard =  async (req, res) => {
    try {
      // Financial year: Calendar year (Jan 1st to Dec 31st)
      const today = new Date();
      const start = new Date(today.getFullYear(), 0, 1);
      const end = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
  
      // Find all trades that were sold during the year
      const Trades = await Trade.find({
        soldAt: { $gte: start, $lte: end },
        broughtState: false
      });
      
      // Group trades by userId and calculate total profit
      const userProfits = {};
      const userBestTrades = {};
      
      Trades.forEach(trade => {
        const userId = trade.userId.toString();
        // Add to total profit
        if (!userProfits[userId]) {
          userProfits[userId] = 0;
        }
        userProfits[userId] += trade.profit || 0;
        
        // Track best trade (highest profit)
        if (!userBestTrades[userId] || (trade.profit > userBestTrades[userId].profit)) {
          userBestTrades[userId] = {
            stockSymbol: trade.stockSymbol,
            stockName: trade.stockName,
            profit: trade.profit,
            purchasePrice: trade.purchasePrice,
            createdAt: trade.createdAt,
            soldAt: trade.soldAt,
            amount: trade.amount,    
          };
        }
      });
      
      // Get user details and create leaderboard array
      const userIds = Object.keys(userProfits);
      const users = await User.find({ _id: { $in: userIds } });
      
      const leaderboard = users.map(user => ({
        userId: user._id,
        username: user.username,
        totalProfit: userProfits[user._id.toString()],
        bestTrade: userBestTrades[user._id.toString()]
      }));
      
      // Sort by profit (descending)
      leaderboard.sort((a, b) => b.totalProfit - a.totalProfit);
      
      // Add rank to each entry
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });
      
      return res.json({ leaderboard });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };