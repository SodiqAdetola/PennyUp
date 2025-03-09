import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import HistoryItem from './components/HistoryItem';  // Import the new HistoryItem component
import SellModal from './components/SellModal';  // Import the new SellModal component

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';


const History = ( {navigation} ) => {
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

      const firebaseUID = user.uid;
      const userData = await axios.get(`${backendURL}/users/${firebaseUID}`);

      const stockIDs = userData.data.broughtTrades || [];  

      if (stockIDs.length > 0) {
        const response = await axios.post(`${backendURL}/stocks/stock`, { stockIDs });
        setBroughtTrades(response.data);
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
    const interval = setInterval(() => {
      getBroughtTrades(); 
    }); 
  

    return () => clearInterval(interval);
  }, []);


  const handleSellPress = (stock) => {
    setSelectedStock(stock);
    setIsModalVisible(true);
  };

  const handleConfirmSell = () => {
    setIsModalVisible(false);
  }

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
        <Text style={styles.noTrades}>No trades Brought.</Text>
      ) : (
        <View style={[styles.stocksContainer]}>
        <FlatList
          data={broughtTrades}
          renderItem={({ item }) => <HistoryItem trade={item} handleSellPress={handleSellPress}/>}
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
    marginTop: '50',
    marginBottom: '0',
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
    marginTop: '50',
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

}
  
});