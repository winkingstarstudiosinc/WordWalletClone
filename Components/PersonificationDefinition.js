import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function PersonificationDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Personification is a literary device where human qualities are given
          to animals, objects, or ideas. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. The sun kissed me while I was clicking a picture.
        </Text>
        <Text style={styles.exampleText}>
          2. The flowers danced to the wind.
        </Text>
        <Text style={styles.exampleText}>
          3. The breeze whispered in my ear.
        </Text>
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
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isSmallPhone ? wp(2.5) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4), // Converted from 16px
    marginBottom: hp(1), // Converted from 5px
  },
  examplesTitle: {
    fontSize: wp(4), // Converted from 16px
    fontWeight: 'bold',
    marginBottom: hp(1.8), // Converted from 10px
  },
  introText: {
    fontSize: wp(4), // Converted from 16px
    marginBottom: hp(1.8), // Converted from 10px
  },
  scrollContainer: {
    paddingBottom: hp(1.5), // Converted from 10px
  },
  scrollableArea: {
    maxHeight: hp(5.8), // Converted from 45px
    width: '100%',
  },
});

export default PersonificationDefinition;
