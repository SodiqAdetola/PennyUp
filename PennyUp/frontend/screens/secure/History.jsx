import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { io } from 'socket.io-client'; 
import HistoryItem from './components/HistoryItem';
import SellModal from './components/SellModal';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const History = ({ navigation }) => {
  const [broughtTrades, setBroughtTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [socket, setSocket] = useState(null);

  const getBroughtTrades = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }
      const firebaseUID = user.uid;
      const userData = await axios.get(`${backendURL}/users/${firebaseUID}`);

      const stockIDs = userData.data.broughtTrades || [];

      if (stockIDs.length > 0) {
        const response = await axios.post(`${backendURL}/stocks/stock`, { stockIDs });
        
        // Save current prices from existing trades if available
        const currentPriceMap = {};
        broughtTrades.forEach(trade => {
          if (trade._id && trade.currentPrice) {
            currentPriceMap[trade._id] = trade.currentPrice;
          }
        });
        
        // Apply saved prices to new trade data
        const updatedTrades = response.data.map(trade => {
          if (currentPriceMap[trade._id]) {
            return {
              ...trade,
              currentPrice: currentPriceMap[trade._id]
            };
          }
          return trade;
        });
        
        setBroughtTrades(updatedTrades);
      } else {
        setBroughtTrades([]);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Could not fetch brought trades.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      getBroughtTrades();
    };

    fetchData();
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  // Set up socket connection
  useEffect(() => {
    const newSocket = io(backendURL);
    setSocket(newSocket);
    
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Listen for stock updates and update prices
  useEffect(() => {
    if (!socket || broughtTrades.length === 0) return;
    
    // Extract unique stock symbols from broughtTrades
    const stockSymbols = [...new Set(broughtTrades.map(trade => trade.stockSymbol))];
    
    // Emit event to fetch these specific stocks
    socket.emit('fetchStocks', stockSymbols);
    
    const handleStockUpdates = (data) => {
      if (!data || data.length === 0) return;
      
      // Update brought trades with current prices
      setBroughtTrades(prevTrades => 
        prevTrades.map(trade => {
          const stockUpdate = data.find(stock => stock.symbol === trade.stockSymbol);
          if (stockUpdate && stockUpdate.regularMarketPrice !== undefined) {
            return {
              ...trade,
              currentPrice: stockUpdate.regularMarketPrice
            };
          }
          console.log(trade);
          return trade;
        })
      );
    };
    
    socket.on('stockUpdates', handleStockUpdates);
    
    return () => {
      socket.off('stockUpdates', handleStockUpdates);
    };
  }, [socket, broughtTrades.length]);

  // Update prices in database when they change
  useEffect(() => {
    // Function to update prices in the database
    const updatePricesInDatabase = async () => {
      if (!broughtTrades.length) return;
      
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) return;
        
        // Map trades to just the data we need for the update
        const updatedTrades = broughtTrades.map(trade => ({
          tradeId: trade._id,
          currentPrice: trade.currentPrice
        }));
        
        // Call your backend to update prices in the database
        await axios.put(`${backendURL}/stocks/updatePrices`, {
          firebaseUID: user.uid,
          trades: updatedTrades
        });
        
        console.log('Successfully updated prices in database');
      } catch (error) {
        console.error('Error updating prices in database:', error);
      }
    };
    
    // Add debounce to prevent too many API calls
    // Only update after prices have been stable for 2 seconds
    const timer = setTimeout(updatePricesInDatabase, 2000);
    
    return () => clearTimeout(timer);
  }, [broughtTrades]);

  const handleSellPress = (stock) => {
    if (!stock) {
      console.error("Error: Attempted to sell a stock, but stock data is missing.");
      return;
    }
    console.log("Selling Stock:", stock);
    setSelectedStock(stock);
    setIsModalVisible(true);
  };

  const handleConfirmSell = async () => {
    if (!selectedStock) {
      console.error("Error: Attempted to sell a stock, but stock data is missing.");
      return;
    }
  
    try {
      const auth = getAuth();
      const user = auth.currentUser;
  
      const initialPurchaseAmount = selectedStock.amount;
      const stockProfitLossPercentage = (selectedStock.currentPrice - selectedStock.purchasePrice) / selectedStock.purchasePrice; 
      const personalProfitLoss = (initialPurchaseAmount * stockProfitLossPercentage);
  
      await axios.put(`${backendURL}/stocks/sell`, {
        firebaseUID: user.uid,
        tradeId: selectedStock._id,
        personalProfitLoss,
        initialPurchaseAmount
      });
  
      setBroughtTrades(broughtTrades.filter((trade) => trade._id !== selectedStock._id));
      setIsModalVisible(false);
      // Refresh the trades list
      getBroughtTrades(); 
    } catch (err) {
      console.error('Error selling stock:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Trade History</Text>

      <View style={styles.navContainer}>
        <Text onPress={() => {}} style={styles.broughtHeader}>Active Trades</Text>
        <Text onPress={() => navigation.push('Sold')} style={styles.soldHeader}>Sold Trades</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : broughtTrades.length === 0 ? (
        <Text style={styles.noTrades}>No brought trades.</Text>
      ) : (
        <View style={styles.stocksContainer}>
          <FlatList
            data={broughtTrades}
            renderItem={({ item }) => (
              <HistoryItem 
                trade={item} 
                handleSellPress={handleSellPress} 
              />
            )}
            keyExtractor={(item) => item._id}
          />
        </View>
      )}

      <SellModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        stock={selectedStock}
        onConfirm={handleConfirmSell}
      />
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B2038',
    alignItems: 'center',
  },
  stocksContainer: {
    marginTop: 50,
    marginBottom: 0,
    width: '95%',
    height: '80%',
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
  },
  noTrades: {
    color: 'white',
    fontSize: 18,
    marginTop: 80,
    textAlign: 'center',
  },
  navContainer: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#1C3A5B',
    width: '100%',
    padding: 10,
  },
  soldHeader: {
    color: 'white',
    fontSize: 16,
  },
  broughtHeader: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});