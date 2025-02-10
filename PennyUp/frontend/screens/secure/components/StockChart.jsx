import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const StockChart = ({ history }) => {
  return (
    <View style={styles.chartContainer}>
      <LineChart
        data={{
          labels: history.map((entry, index) =>
            index % 12 === 0 ? new Date(entry.date).toLocaleDateString('en-UK', { 
              year: 'numeric', 
              month: 'short' 
            }) : ''
          ),
          datasets: [
            {
              data: history.map((entry) => entry.close),
              strokeWidth: 1,
              color: () => 'white',
            },
          ],
        }}
        width={380}
        height={200}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#0B2038',
          backgroundGradientFrom: '#0B2038',
          backgroundGradientTo: '#0B2038',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForDots: {
            r: 0,
          },
        }}
      />
    </View>
  );
};

export default StockChart;

const styles = StyleSheet.create({
  chartContainer: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
});