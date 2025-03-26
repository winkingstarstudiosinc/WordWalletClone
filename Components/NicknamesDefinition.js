import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function NicknamesDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          "Rhymes" is a safe haven to store all of your most memorable rhymes. Whether they be poetry, song, rap or simply a phrase this device will preserve your hearts inspiration.  
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}> 1. The gentle-gems singing on high, in the trees, with a breeze, the better to realize for you and I.</Text>
        <Text style={styles.exampleTextTwo}> 2. Lets trade shoes my bro, yours for mine for a time, see who will fall, who will grow, who will stall, and who will know, the difference between yall, is dis still my show. </Text>
        <Text style={styles.exampleText}> 3. Because I am true blue the obscurity I cannot see through.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Matches 8px radius
    marginBottom: isMediumTallPhone ? hp(1.65) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1) : isGalaxySPhone ? hp(1.65) : null,
    padding: wp(2.0),
    width: isMediumTallPhone ? wp(85.70) : isCompactMediumPhone ? wp(85.70) : isSmallPhone ? wp(85.70) : isGalaxySPhone ? wp(85.70) : null,
    right: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(8.5) : isSmallPhone ? hp(1.50) : isGalaxySPhone ? wp(2.25) : null,
  },
  exampleText: {
    fontSize: wp(4.2),
    marginBottom: hp(0.5),
    marginTop: null,
    height: hp(20),
    maxHeight:hp(20)
  },
  exampleTextTwo :{
    position: 'relevant',
    marginTop: hp(-6.0),
    fontSize: wp(4.2),
    marginBottom: hp(0.5),
    height: hp(20),
    maxHeight:hp(20)
  },
  examplesTitle: {
    fontSize: wp(4.2),
    fontWeight: 'bold',
    marginBottom: hp(1.0),
  },
  introText: {
    fontSize: wp(4.2),
    marginBottom: hp(1.8),
  },
  scrollContainer: {
    paddingBottom: hp(1.5),
    maxHeight:hp(67.5)
  },
  scrollableArea: {
    maxHeight: hp(7), // Matches 45px while keeping responsiveness
    width: '100%',
  },
});

export default NicknamesDefinition;
