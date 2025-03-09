import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const screenWidth = Dimensions.get('window').width;

const StockChart = ({ history }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

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
      month: 'short'
    })}\n${new Date(entry.date).getFullYear()}`,
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
          ${history[history.length - 1]?.close.toFixed(2)}
        </Text>
        <Text style={[styles.changeText, { color: isPositive ? '#34C759' : '#FF3B30' }]}>
          {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercentage}%)
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={screenWidth - 60}
          height={200}
          spacing={40}
          initialSpacing={40}
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
          hideDataPoints
          curved
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
          renderTooltip={(point) => (
            <View style={styles.tooltip}>
              <Text style={styles.tooltipText}>
                ${point.actualValue.toFixed(2)}
              </Text>
              <Text style={styles.tooltipDate}>
                {point.date.toLocaleDateString('en-UK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  chartContainer: {
    paddingBottom: 40,
  },
  priceText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 16,
    marginTop: 5,
  },
  tooltip: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  tooltipText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  tooltipDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});

export default StockChart;