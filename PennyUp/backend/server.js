const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const yahooFinance = require('yahoo-finance2').default;

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to mongoDB'))
  .catch((error) => console.log(error));

// Firebase admin initialization
var admin = require('firebase-admin');
var serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Test server route
app.get('/', (req, res) => {
  res.send(`You have reached PennyUp Backend!`);
});

// API routes
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);





// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for the client fetchStocks request for stock symbols
  socket.on('fetchStocks', async (symbols) => {
    console.log('Requested symbols:', symbols);

    // Function to fetch stock data
    const fetchStockData = async (symbols) => {
      try {
        const stockData = await Promise.all(
          symbols.map(async (symbol) => {
            try {
              return await yahooFinance.quote(symbol);
            } catch (err) {
              console.error(`Failed to fetch data for ${symbol}:`, err);
              return { symbol, error: 'Data unavailable' };
            }
          })
        );
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
    }, 60000); 

  });
});






// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});