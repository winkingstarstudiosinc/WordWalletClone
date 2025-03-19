import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function EuphemismDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          A euphemism is a mild or indirect word or expression substituted for
          one considered to be too harsh or blunt. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. Someone died: Kicked the bucket.
        </Text>
        <Text style={styles.exampleText}>2. Having sex: Knocking boots.</Text>
        <Text style={styles.exampleText}>
          3. Making lots of money: Bringing home the bacon.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1) : isSmallPhone ? null : isGalaxySPhone ? hp(1.5) : null,
    padding: wp(3.0), // Converted from 15
    width: isMediumTallPhone ? wp(85.75) : isCompactMediumPhone ? wp(85.75) : isSmallPhone ? wp(85.75) : isGalaxySPhone ? wp(85.75) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(2.25) : isSmallPhone ? wp(2.25) : isGalaxySPhone ? wp(2.25) : null,
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

export default EuphemismDefinition;
