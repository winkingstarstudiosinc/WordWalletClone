import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function OxymoronDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          An oxymoron is a figure of speech in which apparently contradictory
          terms appear in conjunction. Scroll down for more examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. Almost exactly.</Text>
        <Text style={styles.exampleText}>2. Awfully good.</Text>
        <Text style={styles.exampleText}>3. Deafening silence.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2),
    marginBottom: hp(1.5),
    padding: wp(2.5),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isGalaxySPhone ? wp(2.25) : null,
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
    maxHeight: hp(6),
    width: '100%',
  },
});

export default OxymoronDefinition;
