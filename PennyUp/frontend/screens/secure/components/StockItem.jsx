import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Animated } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import StockChart from './StockChart';

const StockItem = ({ stock, isExpanded, toggleExpand, handleBuyPress, handleFavourite }) => {
  const priceChange = stock.regularMarketChange || 0;
  const isPriceUp = priceChange >= 0;
  
  return (
    <Animated.View style={styles.stockItem}>
      {/* Header with Stock Name and Favorite Button */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.stockSymbol}>{stock.symbol}</Text>
          <Text style={styles.stockName} numberOfLines={1}>{stock.longName}</Text>
        </View>
        
        <TouchableWithoutFeedback onPress={() => handleFavourite(stock)}>
          <View style={styles.favButton}>
            <FontAwesome name="bookmark" size={28} color={stock.favourite ? "#FFD700" : "white"}  />
          </View>
        </TouchableWithoutFeedback>
      </View>

      {/* Basic Price Information */}
      <View style={styles.priceContainer}>
        <View style={styles.priceWrapper}>
          <Text style={styles.priceLabel}>Current Price</Text>
          <Text style={styles.price}>${Number(stock.regularMarketPrice).toFixed(2)}</Text>
        </View>
        
        <View style={styles.changeWrapper}>
          <Text style={styles.changeLabel}>Today</Text>
          <View style={styles.changeRow}>
            <AntDesign 
              name={isPriceUp ? "caretup" : "caretdown"} 
              size={12} 
              color={isPriceUp ? "#34C759" : "#ff4d4d"} 
              style={styles.caret}
            />
            <Text style={[
              styles.change,
              isPriceUp ? styles.positiveChange : styles.negativeChange
            ]}>
              ${Math.abs(priceChange).toFixed(2)} ({Math.abs((priceChange / (stock.regularMarketPrice - priceChange)) * 100).toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>

      {/* Expanded Section with Chart and Details */}
      {isExpanded && (
        <View style={styles.expandedContent}>
          <View style={styles.divider} />
          
          {/* Stock Metrics */}
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Market Cap</Text>
              <Text style={styles.metricValue}>${formatNumber(stock.marketCap)}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>52W High</Text>
              <Text style={styles.metricValue}>${Number(stock.fiftyTwoWeekHigh || 0).toFixed(2)}</Text>
            </View>
            
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>52W Low</Text>
              <Text style={styles.metricValue}>${Number(stock.fiftyTwoWeekLow || 0).toFixed(2)}</Text>
            </View>
          </View>

          {/* EPS and PE Section */}
          <View style={styles.financialsContainer}>
            <View style={styles.financialColumn}>
              <Text style={styles.financialHeader}>Earnings Per Share</Text>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Current:</Text>
                <Text style={styles.financialValue}>${Number(stock.epsCurrentYear || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Forward:</Text>
                <Text style={styles.financialValue}>${Number(stock.epsForward || 0).toFixed(2)}</Text>
              </View>
            </View>
            
            <View style={styles.dividerVertical} />
            
            <View style={styles.financialColumn}>
              <Text style={styles.financialHeader}>Price to Earnings</Text>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Trailing:</Text>
                <Text style={styles.financialValue}>{Number(stock.trailingPE || 0).toFixed(2)}</Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Forward:</Text>
                <Text style={styles.financialValue}>{Number(stock.forwardPE || 0).toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Stock Chart */}
          {stock.history && (
            <View style={styles.chartContainer}>
              <StockChart history={stock.history} stock={stock} />
            </View>
          )}

          {/* Buy Button */}
          <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyPress(stock)}>
            <Text style={styles.buyText}>Buy</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toggle Expand Button */}
      <TouchableOpacity 
        onPress={toggleExpand} 
        style={styles.toggleButton}
        activeOpacity={0.7}
      >
        <MaterialIcons 
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={24} 
          color="#8A9AAC" 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Helper function to format large numbers
const formatNumber = (num) => {
  if (num >= 1000000000000) {
    return (num / 1000000000000).toFixed(2) + 'T';
  }
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(2) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  return num.toLocaleString();
};

const styles = StyleSheet.create({
  stockItem: { 
    backgroundColor: '#132d4a',
    borderRadius: 12,
    marginBottom: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  stockSymbol: {
    color: '#4ECDC4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stockName: { 
    fontSize: 14,
    color: 'white',
    opacity: 0.9,
    marginTop: 2,
  },
  favButton: {
    padding: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 10,    
  },
  priceWrapper: {
    flex: 1,
  },
  priceLabel: {
    color: '#8A9AAC',
    fontSize: 13,
    marginBottom: 2,
  },
  price: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  changeWrapper: {
    alignItems: 'flex-end',
  },
  changeLabel: {
    color: '#8A9AAC',
    fontSize: 13,
    marginBottom: 2,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caret: {
    marginRight: 4,
    paddingTop: 1,
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
  },
  positiveChange: {
    color: '#34C759',
  },
  negativeChange: {
    color: '#ff4d4d',
  },
  expandedContent: {
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 12,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 5,
  },
  metricCard: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  metricLabel: {
    color: '#8A9AAC',
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  financialsContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 5,
    marginBottom: 10,
  },
  financialColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  financialHeader: {
    color: '#4ECDC4',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  financialLabel: {
    color: '#8A9AAC',
    fontSize: 13,
  },
  financialValue: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  chartContainer: {
    marginVertical: 10,
    height: 200,
  },
  buyButton: {
    alignSelf: 'center',
    width: '35%',
    padding: 6, 
    backgroundColor: '#34C759', 
    borderRadius: 5,
    marginTop: 60,
    marginBottom: 20,
  },
  buyText: { 
    color: 'white', 
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleButton: { 
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 20,
    padding: 4,
    marginTop: 10,
    width: 100,
    alignItems: 'center',
  },
});

export default StockItem;