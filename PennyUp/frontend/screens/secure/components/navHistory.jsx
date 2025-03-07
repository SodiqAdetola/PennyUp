import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import History from '../History'
import soldHistory from '../soldHistory'

const Stack = createNativeStackNavigator();

const navHistory = () => {
  return (
    <Stack.Navigator styles={styles.container} screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="Brought" component={History} options={{headerShown: false} }/>
      <Stack.Screen name="Sold" component={soldHistory} options={{headerShown: false}}/>
    </Stack.Navigator>
  )
}

export default navHistory

const styles = StyleSheet.create({

})