import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function AllusionDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          An allusion is an expression designed to call something to mind
          without mentioning it explicitly; an indirect or passing reference.
          Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. He's the Einstein of our generation!
        </Text>
        <Text style={styles.exampleText}>2. Don't be such a Grinch!</Text>
        <Text style={styles.exampleText}>3. She's quite the Silly Sally!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    marginBottom: hp(1.3), // Converted from '5%'
    padding: wp(4), // Converted from 15
    width: isMediumTallPhone ? wp(88) : isCompactMediumPhone ? wp(88) : isSmallPhone ? wp(88) : isGalaxySPhone ? wp(88) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(2.25) : isSmallPhone ? wp(2.25) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(0.6), // Converted from 5
  },
  examplesTitle: {
    fontSize: wp(4.2), // Converted from 16
    fontWeight: 'bold',
    marginBottom: hp(1.2), // Converted from 10
  },
  introText: {
    fontSize: wp(4.2), // Converted from 16
    marginBottom: hp(1.2), // Converted from 10
  },
  scrollContainer: {
    paddingBottom: hp(1.2), // Converted from 10
  },
  scrollableArea: {
    maxHeight: hp(5), // Converted from 45
    width: '100%',
  },
});

export default AllusionDefinition;
