import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LeaderboardItem = ({ item, formatDate }) => {
  return (
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
};

const styles = StyleSheet.create({
  rankingItem: {
    backgroundColor: '#132d4a',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 10
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
  white: {
    color: 'white',
  },
});

export default LeaderboardItem;