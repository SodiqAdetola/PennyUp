import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TextInput, ActivityIndicator } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

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

    // Initialize stock symbols in frontend
    const stockSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY',
      'AMGN', 'NFLX', 'BA', 'DIS', 'INTC', 'V', 'WMT',
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'DOGE-USD',
    ];

    // fetch stocks using stock symbol
    socket.emit('fetchStocks', stockSymbols);

    const handleStockUpdates = (data) => {
      // Validate data before setting
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

  const renderStockItem = ({ item }) => (
    <View style={styles.stockItem}>
      <Text style={[styles.white, styles.stockName]}>{item.longName}</Text>
      <Text style={styles.white}>Price: ${item.regularMarketPrice}</Text>
      <Text style={styles.white}>Market Cap: ${item.marketCap}</Text>
    </View>
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
        ListEmptyComponent={
          <Text style={styles.white}>No stocks found</Text>
        }
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

      <View style={styles.stocksContainer}>
        {renderContent()}
      </View>
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
  stockItem: {
    backgroundColor: '#1C3A5B',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '100%',
  },
  white: {
    color: 'white',
  },
  stockName: {
    fontSize: 17,
  },
  balance: {
    font: 'inter',
    fontSize: '65',
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