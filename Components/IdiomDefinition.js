import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isGalaxySPhone, isSmallPhone, hp, wp } from './DynamicDimensions';

function IdiomDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          An idiom is a group of words established by usage as having a meaning
          not deducible from those of the invididuals words. Scroll down for
          examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. Spill the beans.</Text>
        <Text style={styles.exampleText}>2. On cloud nine. </Text>
        <Text style={styles.exampleText}>3. When pigs fly.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1) : isGalaxySPhone ? hp(1.5) : isSmallPhone ? hp(1.0) : null,
    padding: wp(2.5), // Converted from 15
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isGalaxySPhone ? wp(2.25) : isSmallPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(0.65), // Converted from 5
  },
  examplesTitle: {
    fontSize: wp(4.2), // Converted from 16
    fontWeight: 'bold',
    marginBottom: hp(1.3), // Converted from 10
  },
  introText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(1.3), // Converted from 10
  },
  scrollContainer: {
    paddingBottom: hp(1.3), // Converted from 10
  },
  scrollableArea: {
    maxHeight: hp(6), // Converted from 45
    width: '100%',
  },
});

export default IdiomDefinition;
