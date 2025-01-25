const yahooFinance = require('yahoo-finance2').default;


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
