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
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [totalProfit, setTotalProfit] = useState(0);
  const [recentChange, setRecentChange] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfitData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfitData();
    setRefreshing(false);
  };

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
            month: 'short'
          })}\n${saleDate.getFullYear()}`,
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

  if (profitData.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>No profit data available yet.</Text>
        <Text style={styles.noDataSubText}>Sell stocks with profit to see your progress.</Text>
      </View>
    );
  }

  // Calculate max profit for chart scaling
  const profits = profitData.map(item => item.profit);
  const maxProfit = Math.max(...profits);
  
  // Add a small buffer (10%) above the max profit for better visualization
  const maxValue = Math.max(maxProfit * 1.1, 1); // Ensure at least 1 as max if profits are very small
  
  // Create custom y-axis labels
  const noOfSections = 5; // 5 divisions on y-axis
  const yAxisLabelTexts = [];
  
  for (let i = 0; i <= noOfSections; i++) {
    const value = (maxValue / noOfSections) * i;
    // Format to 1 decimal place if small value, otherwise round to integer
    const formattedValue = value < 10 ? value.toFixed(2) : Math.round(value);
    yAxisLabelTexts.push(formattedValue.toString());
  }
  
  const isPositive = totalProfit >= 0;
  const isRecentPositive = recentChange >= 0;
  const lineColor = isPositive ? '#34C759' : '#FF3B30';

  return (
    <View 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ECDC4" />
      }
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Profit Overview</Text>
          <Text style={[styles.priceText]}>
            ${totalProfit.toFixed(2)}
          </Text>
          <Text style={[styles.changeText, { color: isRecentPositive ? '#34C759' : '#FF3B30' }]}>
            {isRecentPositive ? '+' : ''}{recentChange.toFixed(2)} (last trade)
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={profitData}
            width={screenWidth}
            height={120}
            spacing={40}
            initialSpacing={20}
            color={lineColor}
            maxValue={maxValue}
            minValue={0}
            dataPointsColor={lineColor}
            dataPointsRadius={4}
            onPointPress={(point) => setSelectedPoint(point)}
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
            scrollAnimation={true}
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
    marginTop: 15,
    backgroundColor: '#162C46',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 10,
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
  chartContainer: {
    paddingBottom: 10,
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
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    borderRadius: 12,
    margin: 10,
  },
  errorContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    borderRadius: 12,
    margin: 10,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
  noDataContainer: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#162C46',
    borderRadius: 12,
    margin: 10,
  },
  noDataText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '500',
  },
  noDataSubText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 13,
  },
});

export default ProfitChart;