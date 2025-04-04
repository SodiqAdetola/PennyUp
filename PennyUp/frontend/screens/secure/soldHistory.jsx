import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import SoldHistoryItem from './components/SoldHistoryItem';
import ProfitChart from './components/ProfitChart'; 

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const SoldHistory = ({ navigation }) => {
  const [soldTrades, setSoldTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSoldTrades = async () => {
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

      const stockIDs = userData.data.soldTrades || [];

      if (stockIDs.length > 0) {
        const response = await axios.post(`${backendURL}/stocks/stock`, { stockIDs });

        const sortedTrades = response.data.sort((a, b) => 
          new Date(b.soldAt) - new Date(a.soldAt)
        );
        setSoldTrades(sortedTrades);
      } else {
        setSoldTrades([]);
      }
    } catch (err) {
      console.error('Error fetching sold trades:', err);
      setError('Could not fetch sold trades.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      getSoldTrades();
    };

    fetchData();
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Trade History</Text>
      
      <View style={styles.navContainer}>
        <Text onPress={() => navigation.pop()} style={styles.broughtHeader}>Active Trades</Text>
        <Text onPress={() => {}} style={styles.soldHeader}>Sold Trades</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="white" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : soldTrades.length === 0 ? (
        <Text style={styles.noTrades}>No sold trades.</Text>
      ) : (
        <View style={styles.contentContainer}>
          {/* Add the profit chart above the trades list */}
          <ProfitChart />
          
          <View style={styles.stocksContainer}>
            <FlatList
              data={soldTrades}
              renderItem={({ item }) => (
                <SoldHistoryItem trade={item} />
              )}
              keyExtractor={(item) => item._id}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SoldHistory;

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
  contentContainer: {
    width: '100%',
    flex: 1,
    paddingTop: 10,
  },
  stocksContainer: {
    marginTop: 10,
    marginBottom: 0,
    width: '95%',
    flex: 1,
    alignSelf: 'center',
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
    fontWeight: '700',
  },
  broughtHeader: {
    color: 'white',
    fontSize: 16,
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
});