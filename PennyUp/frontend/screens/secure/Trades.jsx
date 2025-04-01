import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TextInput, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import StockItem from './components/StockItem';
import BuyModal from './components/BuyModal';
import SocketService from './services/SocketService'; // Import the shared service

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

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
  const flatListRef = useRef(null);

  const getBalance = useCallback(async () => {
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
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getBalance();
      };
  
      fetchData();
    }, [getBalance])
  );
  
  useEffect(() => {
    getBalance();
    setIsLoading(true);
    setSocketError(null);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setSocketError('No authenticated user');
      return;
    }

    // Fetch user's favorite stocks
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`${backendURL}/users/${user.uid}`);
        return response.data.favouriteStocks || [];
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setSocketError('Could not fetch favorites');
        return [];
      }
    };

    const stockSymbols = [
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY',
      'AMGN', 'NFLX', 'BA', 'DIS', 'INTC', 'V', 'WMT',
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'DOGE-USD',
    ];

    // Request stock updates through the service
    SocketService.fetchStocks(stockSymbols);

    // Set up stock data listener
    const removeListener = SocketService.addListener(async (data) => {
      const validStocks = data.filter(stock =>
        stock &&
        stock.longName &&
        stock.regularMarketPrice !== undefined &&
        stock.marketCap !== undefined
      );

      if (validStocks.length === 0) {
        setSocketError('No valid stock data received');
        return;
      }

      const favouriteStocks = await fetchFavorites();
      const updatedStocks = validStocks.map(stock => ({
        ...stock,
        favourite: favouriteStocks.includes(stock.symbol),
      }));

      // Sort the stocks with favorites first
      const sortedStocks = updatedStocks.sort((a, b) => 
        (b.favourite === true) - (a.favourite === true)
      );

      setStocks(sortedStocks);
      setFilteredStocks(sortedStocks);
      setIsLoading(false);
    });

    return () => removeListener();
  }, []);

  const handleFavourite = async (stock) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert("Error", "User not authenticated.");
      return;
    }

    try {
      const response = await axios.put(`${backendURL}/users/favouriteStock`, {
        firebaseUID: user.uid,
        stockSymbol: stock.symbol,
      });

      const updatedFavourites = response.data.favouriteStocks;

      // Update the stock data with the new favorite status
      const updatedStocks = stocks.map(s => ({
        ...s,
        favourite: updatedFavourites.includes(s.symbol),
      }));

      // Sort stocks by favorite status
      const sortedStocks = [...updatedStocks].sort((a, b) => 
        (b.favourite === true) - (a.favourite === true)
      );

      setStocks(sortedStocks);
      setFilteredStocks(sortedStocks);

      // Scroll to top
      if (flatListRef.current) {
        try {
          flatListRef.current.scrollToIndex({
            animated: true,
            index: 0,
          });
        } catch (error) {
          console.error("Error scrolling to index:", error);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Could not update favourites.");
    }
  };

  useEffect(() => {
    const filtered = stocks.filter(stock =>
      stock.longName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.symbol?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedStocks = [...filtered].sort((a, b) => 
      (b.favourite === true) - (a.favourite === true)
    );

    setFilteredStocks(sortedStocks);
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
      const response = await axios.put(`${backendURL}/stocks/buy`, {
        firebaseUID: user.uid,
        stockSymbol: selectedStock.symbol,
        stockName: selectedStock.longName,
        amount,
        purchasePrice,
        currentPrice: purchasePrice,
      });
      
      if (response.status === 200) {
        setBalance(response.data.balance);
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
      handleFavourite={handleFavourite}
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
        ref={flatListRef}
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
          {error ? error : `$${balance !== null ? Number(balance).toFixed(2).toLocaleString() : 'Loading...'}`}
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
    fontSize: 50,
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
    borderWidth: 0.5,
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