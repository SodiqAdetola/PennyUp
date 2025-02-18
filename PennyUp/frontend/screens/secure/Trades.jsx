import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import StockItem from './components/StockItem';
import BuyModal from './components/BuyModal';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';
const socket = io(backendURL);

const Trades = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const [expandedStocks, setExpandedStocks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);

  const getBalance = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError('No authenticated user');
      return;
    }

    try {
      const response = await axios.get(`${backendURL}/users/${user.uid}`);
      setBalance(response.data.accountBalance || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Could not fetch balance');
    }
  };

  useEffect(() => {
    getBalance();
    setIsLoading(true);
    setSocketError(null);

    const stockSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY',
      'AMGN', 'NFLX', 'BA', 'DIS', 'INTC', 'V', 'WMT',
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'DOGE-USD',
    ];

    socket.emit('fetchStocks', stockSymbols);

    const handleStockUpdates = (data) => {
      const validStocks = data.filter(stock =>
        stock &&
        stock.longName &&
        stock.regularMarketPrice !== undefined &&
        stock.marketCap !== undefined
      );

      if (validStocks.length === 0) {
        setSocketError('No valid stock data received');
      }

      setStocks(validStocks);
      setFilteredStocks(validStocks);
      setIsLoading(false);
    };

    const handleError = (error) => {
      console.error('Socket connection error:', error);
      setSocketError('Failed to fetch stock data');
      setIsLoading(false);
    };

    socket.on('stockUpdates', handleStockUpdates);
    socket.on('connect_error', handleError);

    return () => {
      socket.off('stockUpdates', handleStockUpdates);
      socket.off('connect_error', handleError);
    };
  }, []);

  useEffect(() => {
    const filtered = stocks.filter(stock =>
      stock.longName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredStocks(filtered);
  }, [searchQuery, stocks]);

  const toggleExpandStock = (symbol) => {
    setExpandedStocks((prev) =>
      prev.includes(symbol) ? prev.filter((item) => item !== symbol) : [...prev, symbol]
    );
  };

  const handleBuyPress = (stock) => {
    setSelectedStock(stock);
    setIsModalVisible(true);
  };

  const handleConfirmPurchase = async (amount) => {
    if (amount > balance) {
      Alert.alert('Insufficient Balance', 'You do not have enough funds to complete this purchase.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Authentication Error', 'Please log in again.');
      return;
    }

    try {
      const purchasePrice = selectedStock.regularMarketPrice;
      const response = await axios.post(`${backendURL}/stocks/buy`, {
        firebaseUID: user.uid,
        stockSymbol: selectedStock.symbol,
        stockName: selectedStock.longName,
        amount,
        purchasePrice,
      });
      if (response.status === 200) {
        setBalance(response.data.balance); // Update balance after successful purchase
        setIsModalVisible(false);
        Alert.alert('Success', `You have purchased $${amount} worth of ${selectedStock.longName}`);
        
      }
    } catch (error) {
      console.error('Purchase error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data.error || 'Something went wrong.');
    }
  };

  const renderStockItem = ({ item }) => (
    <StockItem
      stock={item}
      isExpanded={expandedStocks.includes(item.symbol)}
      toggleExpand={() => toggleExpandStock(item.symbol)}
      handleBuyPress={handleBuyPress}
    />
  );

  const renderContent = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color="white" style={styles.loader} />;
    }
    
    if (socketError) {
      return <Text style={styles.errorText}>{socketError}</Text>;
    }

    return (
      <FlatList
        data={filteredStocks}
        renderItem={renderStockItem}
        keyExtractor={(item) => item.symbol}
        ListEmptyComponent={<Text style={styles.white}>No stocks found</Text>}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Live Stock Prices</Text>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, styles.white]}>
          {error ? error : `$${balance !== null ? balance.toFixed(2) : 'Loading...'}`}
        </Text>
      </View>
      <TextInput
        style={styles.searchBar}
        placeholder="Search stocks..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.stocksContainer}>{renderContent()}</View>

      <BuyModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onConfirm={handleConfirmPurchase}
        stock={selectedStock}
      />
    </SafeAreaView>
  );
};

export default Trades;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B2038',
    alignItems: 'center',
  },
  header: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  balanceContainer: {
    height: '20%',
    display: 'flex',
    justifyContent: 'center',
  },
  stocksContainer: {
    width: '95%',
    height: '70%',
  },
  white: {
    color: 'white',
  },
  balance: {
    fontSize: 65,
    fontWeight: '100',
    textAlign: 'center',
    color: 'white',
  },
  searchBar: {
    width: '80%',
    height: 40,
    backgroundColor: '#1C3A5B',
    color: 'white',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth:0.5,
    borderColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
