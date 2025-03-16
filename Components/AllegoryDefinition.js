import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import { useDeviceType, hp, wp, } from './DynamicDimensions';

function AllegoryDefinition() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.scrollableArea}>
        <Text style={styles.introText}>
          An allegory is a story, poem, or picture that can be interpreted to
          reveal a hidden meaning, typically a moral or political one.
        </Text>
        <Text style={styles.examplesTitle}>Examples:</Text>
        <Text style={styles.exampleText}>1. Romeo & Juliet </Text>
        <Text style={styles.exampleText}>2. The Lord of The Rings </Text>
        <Text style={styles.exampleText}>
          3. Battle for Lemuria: The Order of Lux Archonia{' '}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: wp(2), // Converted from 8
    padding: wp(2), // Converted from 15
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
    maxHeight: hp(7.0), // Converted from 65
    width: '100%',
  },
});

export default AllegoryDefinition;