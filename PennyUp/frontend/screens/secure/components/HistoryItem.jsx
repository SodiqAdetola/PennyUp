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


      <Text style={styles.white}>Purchase Amount: ${trade.amount}</Text>
      <Text style={styles.white}>Stock Purchase Price: ${Number(trade.purchasePrice).toFixed(2)}</Text>
      <Text style={styles.white}>Stock Current Price: ${Number(trade.currentPrice).toFixed(2)}</Text>
      <Text style={styles.white}>Date & Time of Purchase: {new Date(trade.createdAt).toLocaleString()}</Text>
      
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
    backgroundColor: '#1C3A5B', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 10, 
    width: '100%',
  },
  white: { 
    color: 'white' 
  },
  stockName: { 
    fontSize: 17,
    fontWeight: 'bold',
  },
  profitLoss: { 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', 
    marginVertical: 5,
  },
  toggleButton: { 
    alignSelf: 'center', 
    marginTop: 10 
  },
  sellButton: {
    alignSelf: 'center',
    width: '100%',
    margin: 20, 
    padding: 10, 
    backgroundColor: '#F44336', 
    borderRadius: 5 
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
});
