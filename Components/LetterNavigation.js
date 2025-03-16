import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function LetterNavigation({onSelectLetter, setCurrentLetter}) {
  // This function combines both actions (local and from parent)
  const handleLetterSelect = letter => {
    // Update currentLetter and startingLetter
    setCurrentLetter(letter.charCodeAt(0) - 'A'.charCodeAt(0)); // Update currentLetter state
    if (onSelectLetter) {
      onSelectLetter(letter); // Call onSelectLetter passed from ParentAlliteration
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollView}>
      <View style={styles.navigationBar}>
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
          <TouchableOpacity
            key={letter} // Unique key for each letter
            style={styles.letterButton}
            onPress={() => handleLetterSelect(letter)}>
            <Text style={styles.letterText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  letterButton: {
    position: 'relative',
    marginTop: isMediumTallPhone ? hp(0.5) : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? null : isGalaxySPhone ? hp(0.5) : null,
    marginBottom: hp(0.5),
    backgroundColor: 'lightskyblue',
    width: isMediumTallPhone ? wp(12) : isCompactMediumPhone ? wp(10) : isSmallPhone ? wp(10) : isGalaxySPhone ? wp(12) : null, // Scales based on screen width
    height: isMediumTallPhone ? wp(12) : isCompactMediumPhone ? wp(10) : isSmallPhone ? wp(9) : isGalaxySPhone ? wp(12) : null, // Keeps buttons round while adjusting to screen size
    borderRadius: wp(8), // Ensures buttons remain circular
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(1.5), // Space between buttons
    elevation: 3, // Adds a slight shadow for depth
  },
  letterText: {
    color: 'white',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  navigationBar: {
    position: 'relative',
    marginTop: isSmallPhone ? hp(0.90) : isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp(0.25) : isGalaxySPhone ? hp(1.7 ) : null,
    flexDirection: 'row', // Ensures letters are laid out in a row
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'ivory',
    borderWidth: wp(0.3),
    borderRadius: wp(2.5),
    width: '100%',
    padding: wp(0.8),
  },
  scrollView: {
    marginTop: hp(3),
  },
});

export default LetterNavigation;
