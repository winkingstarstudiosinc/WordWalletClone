import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function IronyDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          Irony is the expression of one's meaning by using language that
          normally signifies the opposite, typically for humorous or emphatic
          effect. Scroll down for examples.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. A firestation burns down.</Text>
        <Text style={styles.exampleText}>2. A policestation gets robbed.</Text>
        <Text style={styles.exampleText}>
          3. A marriage counsellor files for divorce.
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
    padding: wp(2.5), // Adaptive padding while keeping proportions
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? (8.5) : isSmallPhone ? wp(2.5) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2), // Matches 16px
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

export default IronyDefinition;
