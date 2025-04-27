const yahooFinance = require('yahoo-finance2').default;

exports.news = async (req, res) => {
  try {
    const query = req.query.query || 'stock market';
    let searchResults = await yahooFinance.search(query, { newsCount: 20 });
    let newsItems = searchResults.news || [];

    res.status(200).json(newsItems);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.message,
    });
  }
};

