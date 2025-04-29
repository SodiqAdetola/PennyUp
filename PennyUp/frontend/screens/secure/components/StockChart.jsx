import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const StockChart = ({ history, stock }) => {

  // Calculate exact min and max prices
  const prices = history.map(h => h.close);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);

  // Normalise the data to start from minPrice
  const chartData = history.map((entry) => ({
    value: entry.close - minPrice,
    actualValue: entry.close,
    date: new Date(entry.date),
    label: `${new Date(entry.date).getDate()} ${new Date(entry.date).toLocaleString('en-UK', { 
      month: 'short',
      year: 'numeric'
    })}`,
  }));

  // Calculate price changes between the two most recent points
  const priceChange = history.length > 1 
    ? history[history.length - 1].close - history[history.length - 2].close 
    : 0;
  const priceChangePercentage = history.length > 1
    ? ((priceChange / history[history.length - 2].close) * 100).toFixed(2)
    : 0;

  const isPositive = priceChange >= 0;
  const lineColor = isPositive ? '#34C759' : '#FF3B30';

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.priceText}>
          ${Number(stock.regularMarketPrice).toFixed(2)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={[styles.subheading]}>This Week: </Text>
        <Text style={[styles.changeText, { color: isPositive ? '#34C759' : '#ff4d4d' }]}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercentage}%)
        </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={340}
          height={150}
          spacing={80}
          initialSpacing={30}
          endSpacing={30}
          thickness={2}
          color={lineColor}
          maxValue={maxPrice - minPrice}
          onPointPress={(point) => setSelectedPoint(point)}
          enablePanGesture
          verticalLinesColor="rgba(255,255,255,0.1)"
          horizontalLinesColor="rgba(255,255,255,0.1)"
          xAxisColor="rgba(255,255,255,0.3)"
          yAxisColor="rgba(255,255,255,0.3)"
          yAxisTextStyle={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 10,
          }}
          xAxisLabelTextStyle={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: 10,
          }}
          dataPointsColor={lineColor}
          showXAxisLabel
          yAxisLabelSuffix=""
          yAxisTextNumberOfLines={1}
          noOfSections={4}
          scrollToEnd={true}
          scrollAnimation={false}
          formatYLabel={(value) => {
            if (value !== undefined && value !== null) {
              return `$${(Number(value) + minPrice).toFixed(1)}`;
            }
            return '';
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
  },
  headerContainer: {
    marginBottom: 20,
  },
  subheading: {
    color: '#8A9AAC',
    fontSize: 13,
  },
  chartContainer: {
    paddingBottom: 20,
  },
  priceText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },

});

export default StockChart;