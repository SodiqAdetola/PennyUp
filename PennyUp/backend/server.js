const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { initialiseSocketIO } = require('./socketIO');
const userRoutes = require('./routes/userRoutes');
const stockRoutes = require('./routes/stockRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error));

// Firebase Admin Initialization
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Routes
app.get('/', (req, res) => res.send('PennyUp Backend!'));
app.use('/users', userRoutes);
app.use('/stocks', stockRoutes);
app.use('/leaderboard', leaderboardRoutes);

// Socket.IO Initialization
initialiseSocketIO(server);

// Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});