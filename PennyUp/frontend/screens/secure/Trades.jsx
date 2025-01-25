import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import io from 'socket.io-client';
import axios from 'axios';
const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com'
const socket = io(backendURL);

const Trades = () => {
  const [stocks, setStocks] = useState([]);
  const [balance, setBalance] = useState(null);


  useEffect ( () => {
      getBalance();
    }, [])

    const getBalance = async () => {
      const user = FIREBASE_AUTH.currentUser;
      console.log('Current user:', user)
      const firebaseUID = user.uid;
      console.log('Firebase UID:', firebaseUID)
    
      if (!firebaseUID) {
        console.error('No firebase UID')
        return;
      }
      try {
        const response = await axios.get(`${backendURL}/users/${firebaseUID}`)
        console.log('User data: ', response.data)
        if (response.data) {
          setBalance(response.data.accountBalance)
          console.log(response.data.accountBalance)
        } else {
          console.error('No data received')
        }
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    }


  useEffect(() => {
    const stockSymbols = [
      // Top Stocks
      'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'SPY', 'AMGN', 'NFLX', 'BA', 'DIS', 'INTC', 'V', 'WMT',
      
      // Top Cryptocurrencies
      'BTC-USD', 'ETH-USD', 'BNB-USD', 'XRP-USD', 'DOGE-USD',
      
    ];
    socket.emit('fetchStocks', stockSymbols);

    //listen for real-time stock updates
    socket.on('stockUpdates', (data) => {
      setStocks(data); // Update the stock list
    });
    return () => {
      socket.disconnect();
    };
  }, []);



  // each stock item
  const renderStockItem = ({ item }) => (
    <View style={styles.stockItem}>
      <Text style={[styles.white, styles.stockName]}>{item.longName}</Text>
      <Text style={styles.white}>Price: ${item.regularMarketPrice}</Text>
      <Text style={styles.white}>Market Cap: ${item.marketCap}</Text>
    </View>
  );


  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Live Stock Prices</Text>
      <View style={styles.balanceContainer}>
        <Text style={[styles.balance, styles.white, ]}>${balance}</Text>
      </View>
      <View style={styles.stocksContainer}>
        <FlatList data={stocks} renderItem={renderStockItem} keyExtractor={(item) => item.symbol} />
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
    marginBottom: 10,
  },

  balanceContainer: {
    height: '30%',
  },

  stocksContainer: {
    width: '95%',
    height: '65%',
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
    fontSize: 20,

  }
});
