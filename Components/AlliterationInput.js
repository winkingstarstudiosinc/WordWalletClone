import React from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function AlliterationInput({
  startingLetter,
  inputAlliteration,
  onLetterChange,
  onAlliterationChange,
  onAdd,
  addTurquoiseButton,
}) {
  return (
    <View style={styles.alliterationArea}>
      <TextInput
        maxLength={1}
        placeholder={'Click a letter'}
        style={styles.inputOne} // Adjusted styles for horizontal layout
        value={startingLetter}
        onChangeText={onLetterChange}
      />
      <TextInput
        placeholder={'alliteration'}
        style={styles.inputTwo} // Adjusted styles for horizontal layout
        value={inputAlliteration}
        onChangeText={onAlliterationChange}
      />
      <View
        style={{
          position: 'relative',
          right: isMediumTallPhone ? '380.5%' : isCompactMediumPhone ? '460%' : isSmallPhone ? '460%' : isGalaxySPhone ? '381.5%' : null,
          top: isMediumTallPhone ? '42.16%' : isCompactMediumPhone ? '37.5%' : isSmallPhone ? '36.5%' : isGalaxySPhone ? '44.16%' : null,
          overflow: 'hidden',
          borderRadius: wp(1),
          width: '37%',
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: addTurquoiseButton,
            padding: isMediumTallPhone ? 10 : isCompactMediumPhone ? 10 : isSmallPhone ? wp(2) : isGalaxySPhone ? 10 : null,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'black',
            borderWidth: 1,
            borderRadius: 10,
          }}
          onPress={onAdd}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Add </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alliterationArea: {
    width: '100%',
    flexDirection: 'row', // Keeping row layout
    padding: wp(1.5), // Converted from 10
    alignItems: 'center', // Ensuring vertical alignment remains centered
  },
  inputOne: {
    position: 'relative',
    top: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? hp(1.75) : isSmallPhone ? hp(2.50) : isGalaxySPhone ? hp(1) : null,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: wp(0.3), // Converted from 1
    height: hp(6.8), // Converted from 55
    width: wp(10), // Keeping 10% width
    marginRight: wp(2), // Converted from 8
    padding: wp(1.5), // Converted from 8
    overflow: 'hidden',
    borderRadius: wp(1.3), // Converted from 5
  },
  inputTwo: {
    position: 'relative',
    top: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? hp(1.75) : isSmallPhone ? hp(2.5) : isGalaxySPhone ? hp(1) : null,
    backgroundColor: 'white',
    height: hp(6.8), // Converted from 55
    width: wp(68), // Keeping 87% width
    padding: wp(0.5), // Converted from 8
    overflow: 'hidden',
    borderRadius: wp(1.3), // Converted from 5
  },
});

export default AlliterationInput;
