import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const HistoryItem = ({ stock, trade, handleSellPress }) => {
  return (
    <View style={styles.stockItem}>
      <Text style={[styles.white, styles.stockName]}>{trade.stockName}</Text>
      <Text style={styles.white}>Purchase Amount: ${trade.amount}</Text>
      <Text style={styles.white}>Stock Price at Purchase: ${trade.purchasePrice}</Text>
      <Text style={styles.white}>Date & Time of Purchase: {trade.createdAt}</Text>
      
      
      <View style={styles.stockDetails}>

        <TouchableOpacity style={styles.sellButton} onPress={() => handleSellPress(stock)}>
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
    fontSize: 17 
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
});
