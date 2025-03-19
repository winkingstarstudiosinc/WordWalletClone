import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp, } from './DynamicDimensions';

function AlliterationDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Alliteration occurs when sentences are comprised of words starting
          with the same letter. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. Angry alligators awarded awesome accolades afterwards{' '}
        </Text>
        <Text style={styles.exampleText}>
          2. Bilbo Baggings baked batches of beautiful brownies{' '}
        </Text>
        <Text style={styles.exampleText}>
          3. Cool cats collect cadium and capture carbon and calclcium{' '}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: hp(1.35), // Converted from '5%'
    padding: wp(4), // Converted from 15
    width: isMediumTallPhone ? wp(87.90) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(87.70) : isGalaxySPhone ? wp(87.90) : null,
    right: isMediumTallPhone ? wp(1.95) : isCompactMediumPhone ? wp(2.25) : isSmallPhone ? wp(2,25) : isGalaxySPhone ? wp(1.95) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(0.6), // Converted from 5
  },
  examplesTitle: {
    fontSize: wp(4.2), // Converted from 16
    fontWeight: 'bold',
    marginBottom: hp(1.2), // Converted from 10
  },
  introText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(1.2), // Converted from 10
  },
  scrollContainer: {
    paddingBottom: hp(0.5), // Converted from 10
  },
  scrollableArea: {
    maxHeight: hp(5.5), // Converted from 45
    width: '100%',
  },
});

export default AlliterationDefinition;
