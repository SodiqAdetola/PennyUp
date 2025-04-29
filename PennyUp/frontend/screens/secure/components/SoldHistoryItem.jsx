import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';


const SoldHistoryItem = ({ trade }) => {
  // Calculate profit or loss percentage
  const profitLoss = trade.currentPrice - trade.purchasePrice;
  const profitLossPercentage = ((profitLoss / trade.purchasePrice) * 100).toFixed(2); 
  const isProfit = profitLoss > 0;
  const profitLossColor = isProfit ? '#34C759' : '#ff4d4d';
  const profitLossText = `${isProfit ? '+' : ''}${profitLossPercentage}%`; 

  const profit = Number(trade.profit).toFixed(2); 

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

  console.log("Profit: ", profit);
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
          ${profit}
        </Text>
        <View style={[styles.percentageContainer, { backgroundColor: isProfit ? 'rgba(78, 205, 196, 0.1)' : 'rgba(255, 107, 107, 0.1)' }]}>
          <AntDesign name={isProfit ? "caretup" : "caretdown"} size={12} color={profitLossColor} style={styles.caret} />
          <Text style={[styles.percentageText, { color: profitLossColor }]}>
            {profitLossText}
          </Text>
        </View>
      </View>

      <View style={styles.hr}></View>

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
          <Text style={styles.white}> {formatDate(trade.createdAt)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Date & Time Sold:</Text>
          <Text style={styles.white}> {formatDate(trade.soldAt)}</Text>
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
    borderWidth: 0.5,
    borderColor: 'grey',
  },
  white: { 
    color: 'white' 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  stockName: { 
    fontSize: 17,
    fontWeight: 'bold',
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
  white: { 
    color: 'white' 
  },
  label: { 
    color: '#8A9AAC', 
    fontSize: 14,
    marginBottom: 2,
  },
  infoContainer: {
    marginBottom: 5,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
  },
});
