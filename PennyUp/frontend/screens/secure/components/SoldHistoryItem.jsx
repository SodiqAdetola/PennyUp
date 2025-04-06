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

      <View style={styles.infoContainer}>

        <View style={styles.info}>
          <Text style={styles.label}>Purchase Amount: </Text>
            <Text style={styles.white}> ${trade.amount}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Purchase Price: </Text>
          <Text style={styles.white}>${trade.purchasePrice}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Sold Price:</Text>
          <Text style={styles.white}> ${Number(trade.currentPrice).toFixed(2)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Date & Time of Purchase:</Text>
          <Text style={styles.white}> {new Date(trade.createdAt).toLocaleString()}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Date & Time Sold:</Text>
          <Text style={styles.white}> {new Date(trade.soldAt).toLocaleString()}</Text>
        </View>

      </View>
      
    </View>
  );
};

export default SoldHistoryItem;

const styles = StyleSheet.create({
  stockItem: { 
    backgroundColor: '#132d4a', 
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
