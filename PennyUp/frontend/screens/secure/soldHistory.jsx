import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const soldHistory = ( {navigation} ) => {
  return (
    <SafeAreaView style={styles.container}>
    
      <Text style={styles.header}>Trade History</Text>

      <View style={styles.navContainer}>
        <Text onPress={() => navigation.pop()} style={styles.broughtHeader} >Active Trades</Text>
        <Text onPress={() => {}} style={styles.soldHeader}>Sold Trades</Text>
      </View>
    </SafeAreaView>
  )
}

export default soldHistory

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B2038',
        alignItems: 'center',
      },
    header: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
      },
    navContainer: {
        marginTop: '50',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: '#1C3A5B',
        width: '100%',
        padding: 10,

    },
    broughtHeader: {
        color: 'white',
        fontSize: 16,
    },
    soldHeader: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',

    }
})