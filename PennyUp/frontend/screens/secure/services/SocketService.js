
import { io } from 'socket.io-client';

let socket = null;

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';


let stockDataCache = {};
let listeners = [];
// Initialise socket connection
const initialiseSocket = () => {
  if (!socket) {
    socket = io(backendURL);
    
    // Set up listener for stock updates
    socket.on('stockUpdates', (data) => {
      // Update cache with the latest data
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
  return socket || initialiseSocket();
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
  return () => {
    listeners = listeners.filter(fn => fn !== listenerFn);
  };
};

// function to notify all listeners of updates
const notifyListeners = () => {
  const stockData = Object.values(stockDataCache);
  listeners.forEach(listener => listener(stockData));
};

// function to clean up socket connection
const disconnect = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    stockDataCache = {};
    listeners = [];
  }
};

// function to get current price of a specific stock
const getStockPrice = (symbol) => {
  return stockDataCache[symbol]?.regularMarketPrice;
};

// function to get all current stock data
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