import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function JuxtapositionDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Juxtaposition is the act of placing two things side by side, often to
          highlight their contrast. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. All's fair in love and war.</Text>
        <Text style={styles.exampleText}>
          2. You're making a mountain out of a molehill.
        </Text>
        <Text style={styles.exampleText}>3. A song of ice and fire.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Matches 8px radius
    marginBottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(1.5) : isGalaxySPhone ? hp(1.5) : null,
    padding: wp(2),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.50) : isSmallPhone ? wp(2.50) : isGalaxySPhone ? wp(2.25) : null,
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

export default JuxtapositionDefinition;
