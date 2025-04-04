import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';
import NewsItem from './NewsItem';

const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const News = () => {
  const [news, setNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  // Function to fetch news from backend
  const fetchNews = async (query = 'stock market') => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${backendURL}/news${`?query=${query}`}`);

      if (response.status === 200) {
        setNews(response.data);
        setLastUpdated(new Date());
      } else {
        setError(response.data?.message || 'Failed to fetch news');
      }
      setLoading(false);
    } catch (err) {
      let errorMessage = 'Unable to load news at this time';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNews(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    fetchNews();
  };

  return (
    <View style={styles.sectionContainer}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search financial news..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <AntDesign name="close" size={20} color="#666" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <AntDesign name="search1" size={20} color="#0B2038" />
          </TouchableOpacity>
        )}
      </View>

      {lastUpdated && (
        <Text style={styles.lastUpdated}>Last updated: {lastUpdated.toLocaleTimeString()}</Text>
      )}

      <ScrollView style={styles.sectionContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0B2038" style={styles.loader} />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchNews(searchQuery)} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : news.length === 0 ? (
          <Text style={styles.noResultsText}>No news found{searchQuery ? ` for "${searchQuery}"` : ''}</Text>
        ) : (
          news.map((item, index) => (
            <NewsItem key={`${item.uuid || index}`} item={item} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  clearButton: {
    padding: 10,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
    marginBottom: 8,
  },
  sectionContent: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    marginBottom: 15,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0B2038',
    borderRadius: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});
