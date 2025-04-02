import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback( async () => {
    try {
      setLoading(true);
      // Replace with your API endpoint
      const response = await axios.get(`${backendURL}/leaderboard`);
      setLeaderboard(response.data.leaderboard);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchLeaderboard();
    }, [fetchLeaderboard])
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.rankingItem}>

      <View style={styles.infoContainer}>

      <View style={styles.userInfoContainer}>
        {/* User info and total profit */}
        <View style={styles.rankContainer}>
          <Text style={[styles.white, styles.rank]}>{item.rank}</Text>
        </View>
        <Text style={[styles.white, styles.username]}>{item.username}</Text>
      </View>

      <Text style={[styles.white, styles.profit]}>
        ${item.totalProfit.toFixed(2)}
      </Text>

      </View>

      
        
        {/* Best trade section */}
        <View style={styles.bestTradeContainer}>
          <Text style={styles.bestTradeHeader}>Best Trade</Text>
          
          {/* Stock info */}
          <View style={styles.stockInfoRow}>
            <Text style={styles.stockSymbol}>{item.bestTrade.stockSymbol}</Text>
            <Text style={styles.stockName}>{item.bestTrade.stockName}</Text>
          </View>
          
          {/* Purchase price */}
          <View style={styles.stockInfoRow}>
            <Text style={styles.label}>Amount Brought: </Text>
            <Text style={styles.value}>${item.bestTrade.amount}</Text>
          </View>

          {/*trade dates*/}
          <View style={styles.dateInfoRow}>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Date Brought:</Text>
              <Text style={styles.value}>{formatDate(item.bestTrade.createdAt)}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Text style={styles.label}>Date Sold:</Text>
              <Text style={styles.value}>{formatDate(item.bestTrade.soldAt)}</Text>
            </View>

          </View>
          
          {/* Profit */}
          <View style={styles.tradeProfit}>
            <Text style={[
              styles.bestTradeProfit, 
              item.bestTrade.profit > 0 ? styles.profitPositive : styles.profitNegative
            ]}>
              ${item.bestTrade.profit.toFixed(2)}
            </Text>
          </View>
        </View>
      
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.white, styles.header]}>Leaderboard</Text>
      <Text style={styles.subtitle}>Weekly Profits</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
        </View>
      ) : leaderboard.length > 0 ? (
        <FlatList
          data={leaderboard}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId.toString()}
          style={styles.list}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No trades this week</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#0B2038',
    alignItems: 'center',
  },
  white: {
    color: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    color: '#4ECDC4',
    fontSize: 16,
    marginBottom: 20,
  },
  list: {
    width: '100%',
  },
  rankingItem: {
    backgroundColor: '#162C46',
    borderRadius: 10,
    marginBottom: 12,
    padding: 16,
   
  },
  infoContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },  
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4ECDC4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  rank: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: '500',
  },
  profit: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 12,
    textAlign: 'right',
  },
  bestTradeContainer: {
    backgroundColor: '#0F1F30',
    borderRadius: 8,
    padding: 12,
    width: '100%',
  },
  bestTradeHeader: {
    color: '#8A9AAC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stockInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stockSymbol: {
    color: 'white',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stockName: {
    color: '#C5D0DC',
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
  },
  label: {
    color: '#8A9AAC',
    marginRight: 4,
  },
  value: {
    color: 'white',
  },
  tradeProfit: {
    alignItems: 'flex-end',
  },
  bestTradeProfit: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  profitPositive: {
    color: '#4ECDC4',
  },
  profitNegative: {
    color: '#FF6B6B',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});