import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, ActivityIndicator } from 'react-native';
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

  const calculateYAxisLabels = (min, max, targetCount = 4) => {
    const range = max - min;
    
    // Handle case where all values are the same
    if (range === 0) {
      return {
        labels: [min - 1, min, min + 1],
        min: min - 1,
        max: min + 1,
        step: 1
      };
    }

    let step = range / targetCount;
    const exponent = Math.floor(Math.log10(step));
    const fraction = step / Math.pow(10, exponent);
    
    let niceStep;
    if (fraction <= 1) niceStep = 1 * Math.pow(10, exponent);
    else if (fraction <= 2) niceStep = 2 * Math.pow(10, exponent);
    else if (fraction <= 5) niceStep = 5 * Math.pow(10, exponent);
    else niceStep = 10 * Math.pow(10, exponent);
    
    niceStep = Math.max(niceStep, 0.1);
    
    // Adjust for very large ranges
    if (range > 1000) {
      niceStep = Math.ceil(niceStep / 100) * 100;
    } else if (range > 100) {
      niceStep = Math.ceil(niceStep / 10) * 10;
    }

    const niceMin = Math.floor(min / niceStep) * niceStep;
    const niceMax = Math.ceil(max / niceStep) * niceStep;
    
    const labels = [];
    for (let value = niceMin; value <= niceMax; value += niceStep) {
      labels.push(value);
    }

    // Ensure we have at least 3 distinct labels
    if (labels.length < 3) {
      const center = (niceMin + niceMax) / 2;
      return {
        labels: [niceMin, center, niceMax],
        min: niceMin,
        max: niceMax,
        step: niceStep
      };
    }

    return {
      labels,
      min: niceMin,
      max: niceMax,
      step: niceStep
    };
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

  const profits = profitData.map(item => item.profit);
  const maxProfit = Math.max(...profits);
  const minProfit = Math.min(...profits);

  const { labels, min, max, step } = calculateYAxisLabels(minProfit, maxProfit);
  const shiftAmount = -min;
  const adjustedRange = max - min;
  const uniqueLabels = [...new Set(labels)];

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
            data={profitData.map(item => ({
              ...item,
              value: item.value + shiftAmount
            }))}
            width={330}
            height={120}
            spacing={60}
            initialSpacing={30}
            endSpacing={20}
            thickness={2}
            color={lineColor}
            maxValue={adjustedRange}
            minValue={0}
            dataPointsColor={lineColor}
            dataPointsRadius={4}
            onPointPress={(point) => setSelectedPoint({
              ...point,
              value: point.value - shiftAmount
            })}
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
            noOfSections={uniqueLabels.length - 1}
            yAxisLabelTexts={uniqueLabels.map(label => 
              `$${Math.abs(label) < 10 ? label.toFixed(1) : Math.round(label)}`
            )}
            formatYLabel={() => ''}
            scrollToEnd={true}
            scrollAnimation={true}
            rulesType="solid"
            rulesColor="rgba(255,255,255,0.1)"
            yAxisOffset={0}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#162C46',
    padding: 14,
    borderRadius: 12,
  },
  chart: {
    minHeight: 150,
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
    marginTop: 4,
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