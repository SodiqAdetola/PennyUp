import React, { useCallback, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const NewsItem = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expand/collapse of the news item
  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Open article in browser
  const openArticle = (url) => {
    if (!url) {
      Alert.alert('Error', 'No link available for this article');
      return;
    }
    
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown date';
    try {
      const date = new Date(timestamp * 1000);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.error('Date formatting error:', e);
      return 'Invalid date';
    }
  };

  return (
    <TouchableOpacity
      style={styles.newsItem}
      activeOpacity={0.8}
      onPress={handleToggleExpand}
    >
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail.resolutions[0].url }} style={styles.thumbnail} resizeMode="cover" />
      ) : (
        <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
          <AntDesign name="filetext1" size={24} color="#ccc" />
        </View>
      )}
      
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle}>{item.title || 'No title available'}</Text>
        <View style={styles.newsDetails}>
          <Text style={styles.newsSource}>{item.publisher || 'Unknown source'}</Text>
          {item.published && <Text style={styles.newsDate}>{formatDate(item.published)}</Text>}
        </View>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <TouchableOpacity style={styles.goToSiteButton} onPress={() => openArticle(item.link)}>
              <Text style={styles.goToSiteButtonText}>Go to site</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NewsItem;

const styles = StyleSheet.create({
  newsItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.1)',
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  placeholderThumbnail: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newsContent: {
    flex: 1
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B2038',
    marginBottom: 6,
    lineHeight: 22,
  },
  newsSource: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
  expandedSection: {
    marginTop: 10,
  },
  goToSiteButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#0B2038',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 10,
    marginLeft: 40,
  },
  goToSiteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
