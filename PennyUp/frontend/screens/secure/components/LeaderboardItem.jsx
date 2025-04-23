import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const LeaderboardItem = ({ item, formatDate }) => {
  return (
    <View style={styles.rankingItem}>
      <View style={styles.infoContainer}>
        <View style={styles.userInfoContainer}>
          {/* User info and total profit */}
          <View   style={[styles.rankContainer,
    item.rank === 1
      ? styles.rankGold
      : item.rank === 2
      ? styles.rankSilver
      : item.rank === 3
      ? styles.rankBronze
      : styles.rankDefault,
  ]}>
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
      <View style={styles.shinyEffect} />
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
    borderRadius: 15,
    marginBottom: 12,
    marginHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: '#4ECDC4',
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
    width: 25,
    height: 25,
    borderRadius: '50%',
    backgroundColor: '#dba50f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    marginLeft: 8,   
  },
  rankGold: {
    backgroundColor: '#E5B43A', 
  },
  rankSilver: {
    backgroundColor: '#9EAFB9', 
  },
  rankBronze: {
    backgroundColor: '#BF816A', 
  },
  rankDefault: {
    backgroundColor: '#57636D', 
  },  
  rank: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  profit: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    marginRight: 8,
    textAlign: 'right',
  },
  bestTradeContainer: {
    backgroundColor: '#0F1F30',
    marginBottom: 12,
    borderBottomWidth: 0.3,
    borderTopWidth: 0.3,
    borderColor: '#4ECDC4',
    padding: 8,
    width: '100%',
    overflow: 'hidden',
  },
  shinyEffect: {
    position: 'absolute',
    top: 0,
    left: 80,
    width: '120%',
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ rotate: '-50deg' }], 
    opacity: 0.5,
  },
  bestTradeHeader: {
    color: '#8A9AAC',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  stockInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
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