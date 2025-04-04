import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import HistoryItem from './components/HistoryItem';
import SellModal from './components/SellModal';
import SocketService from './services/SocketService';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const History = ({ navigation }) => {
  const [broughtTrades, setBroughtTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const getBroughtTrades = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }
      
      const userData = await axios.get(`${backendURL}/users/${user.uid}`);
      const stockIDs = userData.data.broughtTrades || [];

      if (stockIDs.length > 0) {
        const response = await axios.post(`${backendURL}/stocks/stock`, { stockIDs });
        
        // Apply current prices from socket service
        const updatedTrades = response.data.map(trade => {
          const currentPrice = SocketService.getStockPrice(trade.stockSymbol);
          return {
            ...trade,
            currentPrice: currentPrice !== undefined ? currentPrice : trade.currentPrice
          };
        });
        const sortedTrades = updatedTrades.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Update 'soldAt' if necessary
        
        setBroughtTrades(sortedTrades);
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
    getBroughtTrades();
    const unsubscribe = navigation.addListener('focus', getBroughtTrades);
    return unsubscribe;
  }, [navigation]);

  // Listen for stock updates using the shared service
  useEffect(() => {
    if (broughtTrades.length === 0) return;
    
    // Request updates for our owned stocks
    const stockSymbols = [...new Set(broughtTrades.map(trade => trade.stockSymbol))];
    SocketService.fetchStocks(stockSymbols);
    
    // Set up listener for price updates
    const removeListener = SocketService.addListener(() => {
      // Update trades with latest prices from the shared cache
      setBroughtTrades(prevTrades => 
        prevTrades.map(trade => {
          const currentPrice = SocketService.getStockPrice(trade.stockSymbol);
          if (currentPrice !== undefined) {
            return {
              ...trade,
              currentPrice
            };
          }
          return trade;
        })
      );
    });
    
    return () => removeListener();
  }, [broughtTrades.length]);

  // Update prices in database when they change
  useEffect(() => {
    if (!broughtTrades.length) return;
    
    const updatePricesInDatabase = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        
        const updatedTrades = broughtTrades.map(trade => ({
          tradeId: trade._id,
          currentPrice: trade.currentPrice
        }));
        
        await axios.put(`${backendURL}/stocks/updatePrices`, {
          firebaseUID: user.uid,
          trades: updatedTrades
        });
      } catch (error) {
        console.error('Error updating prices in database:', error);
      }
    };
    
    // Debounce database updates to prevent excess API calls
    const timer = setTimeout(updatePricesInDatabase, 2000);
    return () => clearTimeout(timer);
  }, [broughtTrades]);

  const handleSellPress = (stock) => {
    if (!stock) {
      console.error("Error: Attempted to sell a stock, but stock data is missing.");
      return;
    }
    setSelectedStock(stock);
    setIsModalVisible(true);
  };

  const handleConfirmSell = async () => {
    if (!selectedStock) return;
  
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
        initialPurchaseAmount,
        soldAt: new Date(),
      });
  
      setBroughtTrades(broughtTrades.filter((trade) => trade._id !== selectedStock._id));
      setIsModalVisible(false);
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
    marginTop: 20,
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
    fontWeight: '700',
  },
});