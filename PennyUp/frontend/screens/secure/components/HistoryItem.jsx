import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const HistoryItem = ({ trade, handleSellPress }) => {
  // Calculate profit or loss percentage
  const profitLoss = trade.currentPrice - trade.purchasePrice;
  const profitLossPercentage = ((profitLoss / trade.purchasePrice) * 100).toFixed(2); 
  const isProfit = profitLoss > 0;
  const profitLossColor = isProfit ? '#34C759' : 'red';
  const profitLossText = `${isProfit ? '+' : ''}${profitLossPercentage}%`;
  
  const initialPurchaseAmount = trade.amount;
  const stockProfitLossPercentage = (trade.currentPrice - trade.purchasePrice) / trade.purchasePrice; 
  const personalProfitLoss = (initialPurchaseAmount * stockProfitLossPercentage);

  return ( 
    <View style={styles.stockItem}>
      <Text style={[styles.white, styles.stockName]}>{trade.stockName}</Text>

      <View style={styles.profitLossContainer}> 
      <Text style={[styles.profitLoss, { color: profitLossColor }]}>
        ${personalProfitLoss.toFixed(2)}
      </Text>
      <Text style={[styles.profitLoss, { color: profitLossColor }]}>
        {profitLossText}
      </Text>
      </View>

      <View style={styles.infoContainer}>

        <View style={styles.info}>
          <Text style={styles.label} >Purchase Amount: </Text>
          <Text style={styles.white}> ${trade.amount} </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Stock Purchase Price: </Text>
          <Text style={styles.white}>${Number(trade.purchasePrice).toFixed(2)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Stock Current Price: </Text>
          <Text style={styles.white}>${Number(trade.currentPrice).toFixed(2)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Date & Time of Purchase: </Text>
          <Text style={styles.white}>{new Date(trade.createdAt).toLocaleString()}</Text>
        </View>

      </View>

      <View style={styles.stockDetails}>
        <TouchableOpacity style={styles.sellButton} onPress={() => handleSellPress(trade)}>
            <Text style={styles.sellText}>Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  stockItem: { 
    backgroundColor: '#132d4a', 
    marginBottom: 10, 
    borderRadius: 10, 
    width: '100%',
  },
  stockName: { 
    fontSize: 17,
    fontWeight: 'bold',
    padding: 10,
  },
  profitLoss: { 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginVertical: 5,
  },
  sellButton: {
    alignSelf: 'center',
    width: '40%',
    padding: 10, 
    backgroundColor: '#F44336', 
    borderRadius: 5,
    marginBottom: 20,
  },
  sellText: { 
    color: 'white', 
    textAlign: 'center' 
  },
  stockDetails: {
    marginTop: 10,
    alignItems: 'center',
  },
  profitLossContainer: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 5,
  },
  info: {
    flexDirection: 'row',
    color: '#C5D0DC',
  },
  white: { 
    color: 'white' 
  },
  label: { 
    color: '#8A9AAC', 
  },
  infoContainer: {
    marginBottom: 12,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
  },
});
