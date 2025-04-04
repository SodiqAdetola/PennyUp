import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;
const backendURL = 'https://pennyup-backend-a50ab81d5ff6.herokuapp.com';

const ProfitChart = () => {
  const [profitData, setProfitData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);
  const [recentChange, setRecentChange] = useState(0);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const fetchProfitData = async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        setError('User not authenticated.');
        setIsLoading(false);
        return;
      }

      const firebaseUID = user.uid;
      const userData = await axios.get(`${backendURL}/users/${firebaseUID}`);
      
      const stockIDs = userData.data.soldTrades || [];
      
      if (stockIDs.length === 0) {
        setProfitData([]);
        setTotalProfit(0);
        setRecentChange(0);
        setIsLoading(false);
        return;
      }

      const tradesResponse = await axios.post(`${backendURL}/stocks/stock`, { stockIDs });
      const soldTrades = tradesResponse.data;
      
      // Sort trades by soldAt date
      const sortedTrades = [...soldTrades].sort((a, b) => new Date(a.soldAt) - new Date(b.soldAt));
      
      // Create cumulative profit data for each sale
      let runningTotal = 0;
      const chartData = sortedTrades.map(trade => {
        const saleDate = new Date(trade.soldAt);
        runningTotal += trade.profit;
        
        return {
          date: saleDate,
          profit: runningTotal,
          value: runningTotal, // For chart
          actualValue: runningTotal, // For tooltip
          tradeProfit: trade.profit, // Individual trade profit
          stockSymbol: trade.symbol || 'Unknown',
          label: `${saleDate.getDate()} ${saleDate.toLocaleString('en-UK', { 
            month: 'short',
            year: 'numeric'
          })}`,
        };
      });
      
      setProfitData(chartData);
      
      // Set total profit (final cumulative value)
      setTotalProfit(runningTotal);
      
      // Calculate most recent trade profit
      if (sortedTrades.length > 0) {
        setRecentChange(sortedTrades[sortedTrades.length - 1].profit);
      }
      
    } catch (err) {
      console.error('Error fetching profit data:', err);
      setError('Could not fetch profit data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // If there's no data, show an empty state
  if (profitData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No profit data available yet.</Text>
      </View>
    );
  }

  // Calculate max and min profit for chart scaling
  const profits = profitData.map(item => item.profit);
  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);
  
  // Add a small buffer (10%) above max and below min for better visualization
  let maxValue = maxProfit * 1.1;
  let minValue = minProfit * 1.1;
  
  // If we have negative values, ensure the buffer makes them "more negative"
  if (minValue < 0) {
    minValue = minProfit * 1.1;
  }
  
  // If all values are very close to zero, ensure we have some visible range
  if (Math.abs(maxValue - minValue) < 1) {
    maxValue = Math.max(1, maxValue);
    minValue = Math.min(-1, minValue);
  }
  
  // Create custom y-axis labels that account for the full range
  const noOfSections = 5; // 5 divisions on y-axis
  const yAxisLabelTexts = [];
  const valueRange = maxValue - minValue;
  
  for (let i = 0; i <= noOfSections; i++) {
    const value = minValue + (valueRange / noOfSections) * i;
    // Format to 1 decimal place if small value, otherwise round to integer
    const formattedValue = Math.abs(value) < 10 ? value.toFixed(2) : Math.round(value);
    yAxisLabelTexts.push(formattedValue.toString());
  }
  
  const isPositive = totalProfit >= 0;
  const isRecentPositive = recentChange >= 0;
  const lineColor = isPositive ? '#34C759' : '#FF3B30';

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profit Overview</Text>
          <Text style={[styles.priceText]}>
            ${totalProfit.toFixed(2)}
          </Text>
          <Text style={[styles.changeText, { color: isRecentPositive ? '#34C759' : '#FF3B30' }]}>
            {isRecentPositive ? '+$' : '-$'}{Math.abs(recentChange).toFixed(2)} (last trade)
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={profitData}
            width={screenWidth - 50}
            height={120}
            spacing={60}
            initialSpacing={30}
            endSpacing={50}
            color={lineColor}
            maxValue={maxValue}
            minValue={minValue}
            dataPointsColor={lineColor}
            verticalLinesColor="rgba(255,255,255,0.1)"
            horizontalLinesColor="rgba(255,255,255,0.1)"
            xAxisColor="rgba(255,255,255,0.3)"
            yAxisColor="rgba(255,255,255,0.3)"
            yAxisTextStyle={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 9,
            }}
            xAxisLabelTextStyle={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 8,
              width: 50,
              textAlign: 'center',
            }}
            showXAxisLabel
            yAxisLabelSuffix=""
            yAxisTextNumberOfLines={1}
            noOfSections={noOfSections}
            scrollToEnd={true}
            scrollAnimation={false}
            rulesType="solid"
            rulesColor="rgba(255,255,255,0.1)"
            yAxisLabelTexts={yAxisLabelTexts}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162C46',
    paddingLeft: 10,
    paddingTop: 5,
  },
  headerContainer: {
    marginBottom: 15,
  },
  title: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  changeText: {
    fontSize: 14,
    marginTop: 2,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    paddingLeft: 10,
    paddingTop: 5,
  },
  errorContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    paddingLeft: 10,
    paddingTop: 5,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  emptyContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    paddingLeft: 10,
    paddingTop: 5,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ProfitChart;