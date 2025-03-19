import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function HyperboleDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Hyperbole is an exaggerated statement or claim not meant to be taken
          literally. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. I'm so hungry I could eat a horse.
        </Text>
        <Text style={styles.exampleText}>
          2. Dude, I've told you a million times.
        </Text>
        <Text style={styles.exampleText}>3. That bag weighs a ton.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: hp(1.5), // Converted from '5%'
    padding: wp(2.25), // Converted from 15
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.50) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (7) : isSmallPhone ? wp(3) : isGalaxySPhone ? wp(2.25) : null,
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

export default HyperboleDefinition;
