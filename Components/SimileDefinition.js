import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function SimileDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          A simile is a figure of speech that directly compares two things using
          the words "like" or "as." Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. My love is like a red rose.</Text>
        <Text style={styles.exampleText}>
          2. Onyong is always busy as a bee.
        </Text>
        <Text style={styles.exampleText}> 3. Kitty works like a sloth.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8px
    marginBottom: hp(1.5), // Converted from 5%
    padding: wp(2.5), // Converted from 15px
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isSmallPhone ? wp(2.0) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Converted from 16px
    marginBottom: hp(1.2), // Converted from 5px
  },
  examplesTitle: {
    fontSize: wp(4.2),
    fontWeight: 'bold',
    marginBottom: hp(1.8), // Converted from 10px
  },
  introText: {
    fontSize: wp(4.2),
    marginBottom: hp(1.8),
  },
  scrollContainer: {
    paddingBottom: hp(1.5), // Converted from 10px
  },
  scrollableArea: {
    maxHeight: hp(6), // Converted from 45px
    width: '100%',
  },
});

export default SimileDefinition;
