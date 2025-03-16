import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function ImageryDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Imagery involves visually descriptive or figurative language,
          especially in literary work, that appeals to the senses. Scroll down
          for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          {' '}
          1. The air smelled salty, reminding me of the nearby beach.
        </Text>
        <Text style={styles.exampleText}>
          {' '}
          2. The warm doughnut tasted sweet with hints of vanilla and
          strawberry.
        </Text>
        <Text style={styles.exampleText}>
          {' '}
          3. The baby's hair is soft and downy.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: isMediumTallPhone ? hp(1.70) : isCompactMediumPhone ? hp(1.70) : isSmallPhone ? hp(1.0) : isGalaxySPhone ? hp(1.70) : null, // Converted from '5%'
    padding: wp(2.70), // Converted from 15
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? hp(43.15) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.5) : isSmallPhone ? wp(2.5) : isGalaxySPhone ? wp(2.25) : null,
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

export default ImageryDefinition;
