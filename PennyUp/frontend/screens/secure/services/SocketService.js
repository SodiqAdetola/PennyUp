import { io } from 'socket.io-client';

// Singleton socket instance
let socket = null;
let stockDataCache = {};
let listeners = [];

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

// Initialise socket connection
const initializeSocket = () => {
  if (!socket) {
    socket = io(backendURL);
    
    // Set up the listener for stock updates
    socket.on('stockUpdates', (data) => {
      // Update our cache with the latest data
      data.forEach(stock => {
        if (stock && stock.symbol) {
          stockDataCache[stock.symbol] = stock;
        }
      });
      
      // Notify all listeners of the update
      notifyListeners();
    });
    
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  
  return socket;
};

// Get the socket instance
const getSocket = () => {
  return socket || initializeSocket();
};

// Request updates for specific stock symbols
const fetchStocks = (symbols) => {
  getSocket().emit('fetchStocks', symbols);
};

// Add a listener function to be called when stock data updates
const addListener = (listenerFn) => {
  listeners.push(listenerFn);
  
  // Immediately call with current data if available
  if (Object.keys(stockDataCache).length > 0) {
    listenerFn(Object.values(stockDataCache));
  }
  
  // Return a function to remove this listener
  return () => {
    listeners = listeners.filter(fn => fn !== listenerFn);
  };
};

// Notify all listeners of updates
const notifyListeners = () => {
  const stockData = Object.values(stockDataCache);
  listeners.forEach(listener => listener(stockData));
};

// Clean up the socket connection
const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    stockDataCache = {};
    listeners = [];
  }
};

// Get the current price of a specific stock
const getStockPrice = (symbol) => {
  return stockDataCache[symbol]?.regularMarketPrice;
};

// Get all current stock data
const getAllStockData = () => {
  return Object.values(stockDataCache);
};

export default {
  getSocket,
  fetchStocks,
  addListener,
  disconnect,
  getStockPrice,
  getAllStockData
};