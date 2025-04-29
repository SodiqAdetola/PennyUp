import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const HistoryItem = ({ trade, handleSellPress }) => {
  // Calculate profit or loss percentage
  const profitLoss = trade.currentPrice - trade.purchasePrice;
  const profitLossPercentage = ((profitLoss / trade.purchasePrice) * 100).toFixed(2); 
  const isProfit = profitLoss > 0;
  const profitLossColor = isProfit ? '#34C759' : '#ff4d4d';
  const profitLossText = `${isProfit ? '+' : ''}${profitLossPercentage}%`;
  
  const initialPurchaseAmount = trade.amount;
  const stockProfitLossPercentage = (trade.currentPrice - trade.purchasePrice) / trade.purchasePrice; 
  const personalProfitLoss = (initialPurchaseAmount * stockProfitLossPercentage);

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

  return ( 
    <View style={styles.stockItem}>
      <View style={styles.headerRow}>
        <Text style={[styles.white, styles.stockName]}>{trade.stockName}</Text>
        <View style={styles.symbolContainer}>
          <Text style={styles.symbolText}>{trade.symbol || trade.stockSymbol}</Text>
        </View>
      </View>

      <View style={styles.profitLossContainer}> 
        <Text style={[styles.profitLoss, { color: profitLossColor }]}>
          ${personalProfitLoss.toFixed(2)}
        </Text>
        <View style={[styles.percentageContainer, { backgroundColor: isProfit ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)' }]}>
          <AntDesign name={isProfit ? "caretup" : "caretdown"} size={12} color={profitLossColor} style={styles.caret} />
          <Text style={[styles.percentageText, { color: profitLossColor }]}>
            {profitLossText}
          </Text>
        </View>
      </View>

      <View style={styles.hr} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.info}>
            <Text style={styles.label}>Investment Amount: </Text>
            <Text style={styles.value}>${trade.amount}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.label}>Entry Price: </Text>
            <Text style={styles.value}>${Number(trade.purchasePrice).toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.info}>
            <Text style={styles.label}>Current Price: </Text>
            <Text style={styles.value}>${Number(trade.currentPrice).toFixed(2)}</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.label}>Date & Time Bought: </Text>
            <Text style={styles.value}>{formatDate(trade.createdAt)}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.sellButton} onPress={() => handleSellPress(trade)}>
        <Text style={styles.sellText}>Sell</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  stockItem: { 
    backgroundColor: '#132d4a', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 10, 
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stockName: { 
    fontSize: 18,
    fontWeight: 'bold',
  },
  symbolContainer: {
    backgroundColor: '#0F1F30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  symbolText: {
    color: '#8A9AAC',
    fontWeight: '600',
    fontSize: 14,
  },
  profitLossContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 5,
  },
  profitLoss: { 
    fontSize: 20,
    fontWeight: 'bold',
  },
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  caret: {
    marginRight: 5,
    paddingTop: 1,
  },
  percentageText: {
    fontWeight: '600',
    fontSize: 15,
  },
  hr: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
  },
  info: {
    flexDirection: 'row',
  },
  label: { 
    color: '#8A9AAC',
    fontSize: 14,
    marginBottom: 1,
  },
  value: {
    color: 'white',
    fontSize: 14,

  },
  infoContainer: {
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
  },
  sellButton: {
    alignSelf: 'center',
    width: '30%',
    padding: 6, 
    backgroundColor: '#ff4d4d', 
    borderRadius: 5,
    marginTop: 8,
  },
  sellText: { 
    color: 'white', 
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  white: { 
    color: 'white' 
  },
});