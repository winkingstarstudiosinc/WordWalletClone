import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function TermsDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>Terms creates storage room for newly learned or novel terminology in several categories including technical, scientific, social and miscellanious.</Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>
          1. Compound association: an association or result comprised of several
          pertinent components (technical)
        </Text>
        <Text style={styles.exampleText}>
          2. Common sentience: the notion that we all are sentient (social){' '}
        </Text>
        <Text style={styles.exampleText}>
          3. Fugaze: a person or situation who is false (social){' '}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Matches requested value
    marginBottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1) : isGalaxySPhone ? hp(1.5) : null,
    padding: wp(2.5), // Matches requested value
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.5) : isSmallPhone ? wp(2.25) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Converted from 16px
    marginBottom: hp(1.2), // Converted from 5px
  },
  examplesTitle: {
    fontSize: wp(4.2), // Converted from 16px
    fontWeight: 'bold',
    marginBottom: hp(1.8), // Converted from 10px
  },
  introText: {
    fontSize: wp(4.2), // Converted from 16px
    marginBottom: hp(1.8), // Converted from 10px
    marginRight:wp(5)
  },
  scrollContainer: {
    paddingBottom: hp(1.5), // Converted from 10px
  },
  scrollableArea: {
    maxHeight: hp(6), // Converted from 45px
    width: '100%',
  },
});

export default TermsDefinition;
