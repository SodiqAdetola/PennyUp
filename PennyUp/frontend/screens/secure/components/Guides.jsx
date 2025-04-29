import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import GuideItem from './GuideItem';
import investmentGuides from './data/investmentGuides.json';

const Guides = () => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Investment Guides</Text>
      <Text style={styles.sectionDescription}>
        Simple explanations to help you start your investment journey
      </Text>
      <ScrollView style={styles.sectionContent}>
        {investmentGuides.map(guide => (
          <GuideItem key={guide.id} guide={guide} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Guides;

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    padding: 15,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#0B2038',
  },
  sectionDescription: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  sectionContent: {
    flex: 1,
  },
});