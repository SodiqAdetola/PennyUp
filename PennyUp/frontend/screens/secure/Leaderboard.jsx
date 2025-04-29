import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, ActivityIndicator,StatusBar} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      setLeaderboard(response.data.leaderboard.slice(0, 30));
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
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  const renderItem = ({ item }) => (
    <LeaderboardItem item={item} formatDate={formatDate} />
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0B2038" />
      
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons name="trophy" size={28} color="#D4AF37" style={styles.headerIcon} />
        <Text style={[styles.white, styles.header]}>Leaderboard</Text>
      </View>
      
      {/* Subtitle Section */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Yearly Top 30 Revenue</Text>
        <Text style={styles.subscript}>(Resets Every New Year's)</Text>
      </View>
      
      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Content Section */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ECDC4" />
            <Text style={[styles.white, styles.loadingText]}>Loading leaderboard...</Text>
          </View>
        ) : leaderboard.length > 0 ? (
          <FlatList
            data={leaderboard}
            renderItem={renderItem}
            keyExtractor={item => item.userId.toString()}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="chart-line-variant" size={50} color="#4ECDC4" />
            <Text style={styles.emptyText}>No trades yet</Text>
            <Text style={styles.emptySubtext}>Be the first to make the leaderboard!</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B2038',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerIcon: {
    marginRight: 8,
  },
  subtitleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  contentContainer: {
    flex: 1,
  },
  white: {
    color: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#4ECDC4',
    fontSize: 16,
  },
  subscript: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  list: {
    width: '100%',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  }
});

export default Leaderboard;