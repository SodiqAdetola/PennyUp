import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const LeaderboardItem = ({ item, formatDate }) => {
  const isProfit = item.bestTrade.profit > 0;
  
  return (
    <View style={styles.rankingItem}>
      {/* Header with rank and username */}
      <View style={styles.headerRow}>
        <View style={styles.userInfoContainer}>
          <View style={[
            styles.rankContainer,
            item.rank === 1 ? styles.rankGold : 
            item.rank === 2 ? styles.rankSilver : 
            item.rank === 3 ? styles.rankBronze : 
            styles.rankDefault
          ]}>
            <Text style={styles.rankText}>{item.rank}</Text>
          </View>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        
        <View style={styles.totalProfitContainer}>
          <Text style={styles.totalProfitLabel}>Total Profit</Text>
          <Text style={[
            styles.totalProfit,
            item.totalProfit > 0 ? {color:'#4ECDC4'} : styles.profitNegative
          ]}>
            ${Math.abs(item.totalProfit).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.hr}></View>
      
      {/* Best trade section */}
      <View style={styles.bestTradeContainer}>
        <Text style={styles.sectionHeader}>Best Trade</Text>
        
        <View style={styles.stockHeader}>
          <Text style={styles.stockName}>{item.bestTrade.stockName}</Text>
          <Text style={styles.symbolText}>({item.bestTrade.stockSymbol})</Text>
        </View>
        
        <View style={styles.profitLossContainer}>
          <Text style={[
            styles.tradeProfitAmount,
            isProfit ? styles.profitPositive : styles.profitNegative
          ]}>
            ${Math.abs(item.bestTrade.profit).toFixed(2)}
          </Text>
          
          <View>
            <Text style={[styles.percentageText, { color: isProfit ? '#34C759' : '#ff4d4d' }]}>
              {isProfit ? '+' : '-'}
              {((Math.abs(item.bestTrade.profit) / item.bestTrade.amount) * 100).toFixed(2)}%
            </Text>
          </View>
        </View>
                
        {/* Trade details */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>${item.bestTrade.amount}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Purchase Price:</Text>
              <Text style={styles.value}>${item.bestTrade.purchasePrice || "-"}</Text>
            </View>
          </View>
          
          <View style={styles.dateInfoRow}>
            <View style={styles.dateInfoItem}>
              <Text style={styles.label}>Date Bought:</Text>
              <Text style={styles.value}>{formatDate(item.bestTrade.createdAt)}</Text>
            </View>
            <View style={styles.dateInfoItem}>
              <Text style={styles.label}>Date Sold:</Text>
              <Text style={styles.value}>{formatDate(item.bestTrade.soldAt)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.hr}></View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rankingItem: {
    backgroundColor: '#132d4a',
    borderRadius: 10,
    marginBottom: 12,
    marginHorizontal: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  bestTradeContainer: {
    backgroundColor: 'rgba(0,0,0,0.1)',

  },
  rankGold: {
    backgroundColor: '#D4AF37',
    shadowColor: '#FFD700',
  },
  rankSilver: {
    backgroundColor: '#C0C0C0',
    shadowColor: '#C0C0C0',
  },
  rankBronze: {
    backgroundColor: '#CD7F32',
    shadowColor: '#CD7F32',
  },
  rankDefault: {
    backgroundColor: '#57636D',
  },
  rankText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FFFFFF',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  totalProfitContainer: {
    alignItems: 'flex-end',
  },
  totalProfitLabel: {
    color: '#8A9AAC',
    fontSize: 13,
    marginBottom: 2,
  },
  totalProfit: {
    fontSize: 18,
    fontWeight: 'bold',
    
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },

  sectionHeader: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 3,
    
  },
  stockHeader: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    marginBottom: 8,
    alignSelf: 'center',
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 1,
 },

  stockName: {
    color: '#8A9AAC',
    fontSize: 15,
    fontWeight: 'bold',
  },

  symbolContainer: {
    backgroundColor: '#0F1F30',
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  symbolText: {
    color: '#8A9AAC',
    fontWeight: '600',
    fontSize: 14,
  },
  profitLossContainer: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tradeProfitAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  percentageText: {
    fontWeight: '600',
    fontSize: 14,
  },
  infoContainer: {
    marginTop: 4,
  },

  infoRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 3,
    marginBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  infoItem: {
    flexDirection: 'row',
    gap: 3,
    },

  dateInfoRow: {
    padding: 3,
    marginBottom: 3,
    paddingLeft: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  }, 
  dateInfoItem: {
    flexDirection: 'row',
    gap: 3, 
  },

  label: {
    color: '#8A9AAC',
    fontSize: 14,
    marginBottom: 2,
  },

  value: {
    color: 'white',
    fontSize: 14,
  },
  profitPositive: {
    color: '#34C759',
  },
  profitNegative: {
    color: '#ff4d4d',
  },
});

export default LeaderboardItem;