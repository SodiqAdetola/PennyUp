import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

const Guides = () => {
  return (
    <View style={styles.sectionContainer}>
      <ScrollView style={styles.sectionContent}>
      </ScrollView>
    </View>
  )
}

export default Guides

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0B2038',
  },
  sectionContent: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#333',
  },
})