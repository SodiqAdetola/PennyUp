import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

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
      
      const sortedTrades = [...soldTrades].sort((a, b) => new Date(a.soldAt) - new Date(b.soldAt));
      
      let runningTotal = 0;
      const chartData = sortedTrades.map(trade => {
        const saleDate = new Date(trade.soldAt);
        runningTotal += trade.profit;
        
        return {
          date: saleDate,
          profit: runningTotal,
          value: runningTotal,
          tradeProfit: trade.profit,
          stockSymbol: trade.symbol || 'Unknown',
          label: `${saleDate.getDate()} ${saleDate.toLocaleString('en-UK', { 
            month: 'short',
            year: 'numeric'
          })}\n${saleDate.getFullYear()}`,
        };
      });
      
      setProfitData(chartData);
      setTotalProfit(runningTotal);
      
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
        <ActivityIndicator size="large" color="white" />
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

  // Calculate min and max profits 
  const profits = profitData.map(item => item.profit);
  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);

  // Normalise data to start from minProfit
  const normalizedData = profitData.map(item => ({
    ...item,
    value: item.profit - minProfit,
    actualValue: item.profit
  }));

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
            {isRecentPositive ? '+' : ''}{recentChange.toFixed(2)} (last trade)
          </Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            style={styles.chart}
            data={normalizedData}
            width={330}
            height={120}
            spacing={60}
            initialSpacing={30}
            endSpacing={20}
            thickness={2}
            color={lineColor}
            maxValue={maxProfit - minProfit}
            minValue={0}
            dataPointsColor={lineColor}
            dataPointsRadius={4}
            onPointPress={(point) => setSelectedPoint(point)}
            enablePanGesture
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
            showDataPoints={profitData.length <= 15}
            showXAxisLabel
            yAxisLabelSuffix=""
            yAxisTextNumberOfLines={1}
            noOfSections={4}
            scrollToEnd={true}
            scrollAnimation={true}
            rulesType="solid"
            rulesColor="rgba(255,255,255,0.1)"
            formatYLabel={(value) => {
              if (value !== undefined && value !== null) {
                return `$${(Number(value) + minProfit).toFixed(2)}`;
              }
              return '';
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162C46',
    paddingHorizontal: 14,
    paddingTop: 5,
    paddingBottom: 0,
    borderRadius: 12,
  },
  chart: {
    Height: '35%',
  },
  headerContainer: {
    marginBottom: 10,
  },
  title: {
    color: '#4ECDC4',
    fontSize: 15,
    fontWeight: '600',
  },
  priceText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,

  },
  changeText: {
    fontSize: 14,
  },
  loadingContainer: {
    backgroundColor: '#162C46',
    padding: 14,
    borderRadius: 12,
    height: '35%',
    justifyContent: 'center',
    alignItems: 'center',
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
  chartContainer: {
    paddingBottom: 10,
  },
});

export default ProfitChart;