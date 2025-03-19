import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function WitWisdomDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          "Wit and Wisdom" captures expressions that offer insightful
          observations or clever descriptions that enlighten or entertain.
          Browse through to spark your intellect or tickle your fancy.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. "Better to remain silent and be thought a fool than to speak and to
          remove all doubt." —Abraham Lincoln (Wisdom)
        </Text>
        <Text style={styles.exampleText}>
          2. "I can resist everything except temptation." —Oscar Wilde (Wit)
        </Text>
        <Text style={styles.exampleText}>
          3. "The early bird might get the worm, but the second mouse gets the
          cheese." —Anonymous (Wit)
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(2),
    borderWidth: wp(0.3),
    marginBottom: hp(1),
    padding: wp(3.75),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.5) : isSmallPhone ? wp(1.95) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4),
    marginBottom: hp(1.2),
  },
  examplesTitle: {
    fontSize: wp(4),
    fontWeight: 'bold',
    marginBottom: hp(2),
  },
  introText: {
    fontSize: wp(4),
    marginBottom: hp(2),
  },
  scrollContainer: {
    paddingBottom: hp(2),
  },
  scrollableArea: {
    maxHeight: hp(6), // Adjusted for better proportional scaling
    width: '100%',
  },
});

export default WitWisdomDefinition;
