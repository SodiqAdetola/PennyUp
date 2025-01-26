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
          return await Promise.all(
            symbols.map(async (symbol) => {
              try {
                return await yahooFinance.quote(symbol);
              } catch (err) {
                console.error(`Failed to fetch data for ${symbol}:`, err);
                return { symbol, error: 'Data unavailable' };
              }
            })
          );
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
      }, 60000);

      socket.on('disconnect', () => {
        clearInterval(interval);
        console.log('A user disconnected');
      });
    });
  });
}

module.exports = { initialiseSocketIO };