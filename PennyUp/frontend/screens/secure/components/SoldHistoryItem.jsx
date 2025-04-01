import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SoldHistoryItem = ({ trade }) => {
  // Calculate profit or loss percentage
  const profitLoss = trade.currentPrice - trade.purchasePrice;
  const profitLossPercentage = ((profitLoss / trade.purchasePrice) * 100).toFixed(2); 
  const isProfit = profitLoss > 0;
  const profitLossColor = isProfit ? '#34C759' : 'red';
  const profitLossText = `${isProfit ? '+' : ''}${profitLossPercentage}%`; 

  const profit = Number(trade.profit).toFixed(2); 

  console.log("Profit: ", profit);
  return ( 
    <View style={styles.stockItem}>
      <Text style={[styles.white, styles.stockName]}>{trade.stockName}</Text>

      <View style={styles.profitLossContainer}> 
      <Text style={[styles.profitLoss, { color: profitLossColor }]}>
        ${profit}
      </Text>
      <Text style={[styles.profitLoss, { color: profitLossColor }]}>
        {profitLossText}
      </Text>
      </View>

      <Text style={styles.white}>Purchase Amount: ${trade.amount}</Text>
      <Text style={styles.white}>Purchase Price: ${trade.purchasePrice}</Text>
      <Text style={styles.white}>Sold Price: ${trade.currentPrice}</Text>
      <Text style={styles.white}>Date & Time of Purchase: {trade.createdAt}</Text>
      
    </View>
  );
};

export default SoldHistoryItem;

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
