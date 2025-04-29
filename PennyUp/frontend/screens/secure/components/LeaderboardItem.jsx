import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LeaderboardItem = ({ item, formatDate }) => {
  const isProfit = item.bestTrade.profit > 0;
  const profitPercentage = ((Math.abs(item.bestTrade.profit) / item.bestTrade.amount) * 100).toFixed(2);
  
  return (
    <View style={styles.rankingItem}>
      {/* Top row with rank, username and total profit */}
      <View style={styles.headerRow}>
        <View style={styles.userInfoContainer}>
          <Text style={[
            styles.rankText,
            item.rank === 1 ? styles.rankGold : 
            item.rank === 2 ? styles.rankSilver : 
            item.rank === 3 ? styles.rankBronze : 
            styles.rankDefault
          ]}>
            {item.rank}
          </Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        
        <Text style={[
          styles.totalProfit,
          item.totalProfit >= 0 ? {color:'#4ECDC4'} : styles.profitNegative
        ]}>
          {item.totalProfit >= 0 ? '+' : '-'}${Math.abs(item.totalProfit).toFixed(2)}
        </Text>
      </View>


      <View style={styles.hr}></View>
      
      {/* Best trade section */}
      <View style={styles.bestTradeSection}>
        <View style={styles.bestTradeHeader}>
          <Text style={styles.bestTradeLabel}>Best Trade</Text>
          <View style={styles.stockInfo}>
            <Text style={styles.stockName}>{item.bestTrade.stockName}</Text>
            <Text style={styles.symbolText}>{item.bestTrade.stockSymbol}</Text>
          </View>
        </View>
        
        {/* Profit amount and percentage */}
        <View style={styles.profitRow}>
          <View style={styles.profitAmountContainer}>
            <AntDesign 
              name={isProfit ? "caretup" : "caretdown"} 
              size={10} 
              color={isProfit ? '#34C759' : '#FF6B6B'} 
              style={styles.profitIcon} 
            />
            <Text style={[
              styles.tradeProfitAmount,
              isProfit ? styles.profitPositive : styles.profitNegative
            ]}>
              ${Math.abs(item.bestTrade.profit).toFixed(2)}
            </Text>
          </View>
          <Text style={[
            styles.percentageText,
            isProfit ? styles.profitPositive : styles.profitNegative
          ]}>
            {isProfit ? '+' : '-'}{profitPercentage}%
          </Text>
        </View>
                
        {/* Trade details */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Invested Amount:</Text>
            <Text style={styles.detailValue}>${item.bestTrade.amount}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Entry Price:</Text>
            <Text style={styles.detailValue}>${item.bestTrade.purchasePrice || "-"}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date Bought:</Text>
            <Text style={styles.detailValue}>{formatDate(item.bestTrade.createdAt)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date Sold:</Text>
            <Text style={styles.detailValue}>{formatDate(item.bestTrade.soldAt)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Card container
  rankingItem: {
    backgroundColor: '#132d4a',
    borderRadius: 12,
    marginBottom: 10,
    marginHorizontal: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  
  // Header section
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    overflow: 'hidden',
    textAlign: 'center',
  },
  rankGold: {
    color: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  rankSilver: {
    color: 'silver',
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
  },
  rankBronze: {
    color: '#CD7F32',
    backgroundColor: 'rgba(205, 127, 50, 0.1)',
  },
  rankDefault: {
    color: 'white',
    backgroundColor: 'rgba(138, 154, 172, 0.1)',
  },
  username: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  totalProfit: {
    fontSize: 18,
    fontWeight: '600',
  },
  

  hr: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 8,
  },
  
  // Best trade section

  bestTradeHeader: {
    marginBottom: 8,
  },
  bestTradeLabel: {
    fontSize: 17,
    color: '#8A9AAC',
    marginBottom: 4,
    width: '25%',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stockName: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  symbolText: {
    color: '#8A9AAC',
    fontSize: 14,
    fontWeight: '400',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  
  // Profit
  profitRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginVertical: 0,
  },
  profitAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profitIcon: {
    marginRight: 3,
  },
  tradeProfitAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  
  // Trade details grid
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
    
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    width: '50%',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },

  detailLabel: {
    color: '#8A9AAC',
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left',
  },
  detailValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '400',
  },
  
  profitPositive: {
    color: '#34C759',
  },
  profitNegative: {
    color: '#FF6B6B',
  },
});

export default LeaderboardItem;