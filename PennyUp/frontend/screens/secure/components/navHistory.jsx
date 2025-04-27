import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BroughtTradeHistory from '../BroughtTradeHistory'
import SoldTradeHistory from '../SoldTradeHistory'

const Stack = createNativeStackNavigator();

const navHistory = () => {
  return (
    <Stack.Navigator styles={styles.container} screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="Brought" component={BroughtTradeHistory} options={{headerShown: false} }/>
      <Stack.Screen name="Sold" component={SoldTradeHistory} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default navHistory

const styles = StyleSheet.create({

})