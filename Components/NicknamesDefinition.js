import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function NicknamesDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          "Nicknames" stores all your favorite nicknames, from most despised of
          adversaries to most loved of all lovers and everything in between.
          Everyone deserves a memorable alias. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. Silly Sally - my sister (Playful)
        </Text>
        <Text style={styles.exampleText}>
          2. Furblong fairie - Jack Smith (Snarky){' '}
        </Text>
        <Text style={styles.exampleText}>
          3. Starshine daisy-duke - Love of my life, Peach (Pleasant)
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Matches 8px radius
    marginBottom: isMediumTallPhone ? hp(1.65) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1) : isGalaxySPhone ? hp(1.65) : null,
    padding: wp(2.0),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isSmallPhone ? hp(1.50) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2),
    marginBottom: hp(1.2),
  },
  examplesTitle: {
    fontSize: wp(4.2),
    fontWeight: 'bold',
    marginBottom: hp(1.8),
  },
  introText: {
    fontSize: wp(4.2),
    marginBottom: hp(1.8),
  },
  scrollContainer: {
    paddingBottom: hp(1.5),
  },
  scrollableArea: {
    maxHeight: hp(6), // Matches 45px while keeping responsiveness
    width: '100%',
  },
});

export default NicknamesDefinition;
