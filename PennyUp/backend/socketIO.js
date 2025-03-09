const { Server } = require('socket.io');
const yahooFinance = require('yahoo-finance2').default;

function initialiseSocketIO(server) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('fetchStocks', async (symbols) => {
      
      const fetchStockData = async (symbols) => {
        try {
          const stockDataPromises = symbols.map(async (symbol) => {
            try {
              const quote = await yahooFinance.quote(symbol);
              const history = await yahooFinance.historical(symbol, {
                period1: '2024-06-30',
                interval: '1wk',
              });

              // Log data for each stock
              console.log(`Fetched data for ${symbol}:`, quote, history);

              return {
                symbol,
                longName: quote.longName,
                regularMarketPrice: quote.regularMarketPrice,
                marketCap: quote.marketCap,
                history,
              };
            } catch (err) {
              console.error(`Failed to fetch data for ${symbol}:`, err);
              return { symbol, error: 'Data unavailable' };
            }
          });

          const stockData = await Promise.all(stockDataPromises);
          console.log("All stock data fetched:", stockData);
          return stockData;
        } catch (error) {
          console.error('Error fetching stock data:', error);
          return [{ error: 'Failed to fetch stock data' }];
        }
      };

      const initialData = await fetchStockData(symbols);
      socket.emit('stockUpdates', initialData);

      const interval = setInterval(async () => {
        const updatedData = await fetchStockData(symbols);
        socket.emit('stockUpdates', updatedData);
      }, 1200000);

      socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('A user disconnected');
      });
    });
  });
}

module.exports = { initialiseSocketIO };
