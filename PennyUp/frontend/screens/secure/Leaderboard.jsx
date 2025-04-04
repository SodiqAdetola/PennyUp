import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import LeaderboardItem from './components/LeaderboardItem';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
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
    <LeaderboardItem item={item} formatDate={formatDate} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.white, styles.header]}>Leaderboard</Text>
      <Text style={styles.subtitle}>Weekly Revenue</Text>
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  }
});

export default Leaderboard;