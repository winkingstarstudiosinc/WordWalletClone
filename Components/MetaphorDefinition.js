import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function MetaphorDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          A metaphor is a figure of speech in which a word or phrase is applied
          to an object or action to which it is not literally applicable. A
          thing regarded as representative or symbolic of something else. Scroll
          down for more examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. My mother has a heart of gold.
        </Text>
        <Text style={styles.exampleText}>
          2. His hands were icicles from the cold.
        </Text>
        <Text style={styles.exampleText}>
          3. The boy is a lark in the choir.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Matches 8px radius
    marginBottom: hp(1.5),
    padding: wp(2.5),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.5) : isSmallPhone ? wp(2.5) : isGalaxySPhone ? wp(2.25) : null,
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

export default MetaphorDefinition;
