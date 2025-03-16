import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function FusionDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          A fusion form is a unique expression that blends multiple literary
          devices or defies simple categorization. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. He moved like a tempest, whispering storms into the night. (Simile
          + Personification)
        </Text>
        <Text style={styles.exampleText}>
          2. Her laughter painted colors on a canvas of silence. (Metaphor +
          Imagery)
        </Text>
        <Text style={styles.exampleText}>
          3. Shadows danced in the sun’s reluctant embrace. (Oxymoron +
          Personification)
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(2), // Converted from 8
    borderWidth: wp(0.3), // Converted from 1
    marginBottom: hp(1), // Converted from '5%'
    padding: wp(3), // Converted from 15
    width: isMediumTallPhone ? wp(89) : isCompactMediumPhone ? wp(89) : isSmallPhone ? wp(88) : isGalaxySPhone ? wp(89) : null,
    right: isMediumTallPhone ? wp(2.5) : isCompactMediumPhone ? (10) : isSmallPhone ? wp(2) : isGalaxySPhone ? wp(2.5) : null,
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

export default FusionDefinition;
