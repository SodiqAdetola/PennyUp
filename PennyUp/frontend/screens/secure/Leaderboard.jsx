import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'

const Leaderboard = () => {
  return (
    <SafeAreaView style={[styles.container,]}>

      <Text style={[styles.white, ]}>Leaderboard</Text>
      
    </SafeAreaView>
  )
}

export default Leaderboard

const styles = StyleSheet.create({

  container: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#0B2038',
    alignItems: 'center'
  },

  white: {
    color: 'white',
  },


})