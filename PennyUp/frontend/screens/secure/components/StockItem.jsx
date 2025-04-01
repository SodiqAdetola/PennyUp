import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StockChart from './StockChart';

const StockItem = ({ stock, isExpanded, toggleExpand, handleBuyPress, handleFavourite }) => {
  return (
    <View style={styles.stockItem}>

      <View style={styles.headerRow}>
        <Text style={[styles.white, styles.stockName]}>{stock.longName}</Text>
        <TouchableOpacity onPress={() => handleFavourite(stock)} style={styles.favButton}>
          <MaterialIcons 
            name={"bookmark"} 
            size={24} 
            color={stock.favourite ? "gold" : "white"} 
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.white}>Price: ${Number(stock.regularMarketPrice).toFixed(2)}</Text>
      <Text style={styles.white}>Market Cap: ${stock.marketCap}</Text>

      {isExpanded && stock.history && (
        <View style={styles.chartContainer}>
          <StockChart history={stock.history} stock={stock} />
          <TouchableOpacity 
            style={styles.buyButton} 
            onPress={() => handleBuyPress(stock)}
          >
            <Text style={styles.buyText}>Buy</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={toggleExpand} style={styles.toggleButton}>
        <MaterialIcons 
          name={isExpanded ? "expand-less" : "expand-more"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
};
export default StockItem;

const styles = StyleSheet.create({
  stockItem: { 
    backgroundColor: '#1C3A5B', 
    padding: 10, marginBottom: 10, 
    borderRadius: 10 
},
headerRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
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
  buyButton: {
    alignSelf: 'center',
    width: '100%',
    margin: 20, 
    padding: 10, 
    backgroundColor: '#4CAF50', 
    borderRadius: 5 
},
  buyText: { 
    color: 'white', 
    textAlign: 'center' 
},
});
