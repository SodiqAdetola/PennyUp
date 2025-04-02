import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import StockChart from './StockChart';

const StockItem = ({ stock, isExpanded, toggleExpand, handleBuyPress, handleFavourite }) => {
  return (
    <View style={styles.stockItem}>

      <View style={styles.headerRow}>
        <Text style={[styles.white, styles.stockName]}>{stock.longName}</Text>
        <TouchableWithoutFeedback onPress={() => handleFavourite(stock)} style={styles.favButton}>
          <MaterialIcons 
            name={"bookmark"} 
            size={35} 
            color={stock.favourite ? "gold" : "white"} 
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.infoContainer}>

        <View style={styles.info}>
        <Text style={styles.label}>Price: </Text>
        <Text style={styles.white}> ${Number(stock.regularMarketPrice).toFixed(2)}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.label}>Market Cap: </Text>
          <Text style={styles.white}> ${Number(stock.marketCap).toLocaleString()}</Text>
        </View>
      </View>

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
    marginTop: 10,
    padding: 10,
    paddingLeft: 80,
    paddingRight: 80,
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
  paddingLeft: 16,
  paddingRight: 16,
  width: '100%',
},

});
