import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function InputArea({ onAddWord, selectedCard, inputAreaColor, buttonColor }) {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');

  const handleSubmit = () => {
    if (!term.trim() || !definition.trim()) {
      Alert.alert('Missing Information', 'Please enter both a word and its definition before submitting.');
      return;
    }
  
    console.log("Submitting:", term, definition); // Debugging line
    
    onAddWord({ term, definition, type: selectedCard}); 
    setTerm('');
    setDefinition('');
  };

  return (
    <View
      style={[
        styles.inputArea,
        { backgroundColor: inputAreaColor || 'rgb(219, 220, 250)' }, // Fallback color
      ]}
    >
      <TextInput
        placeholder={'Enter a word'}
        style={styles.inputOne}
        value={term}
        onChangeText={(text) => setTerm(text)}
      />
      <TextInput
        placeholder={'Enter the definition'}
        style={styles.inputTwo}
        value={definition}
        onChangeText={(text) => setDefinition(text)}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            paddingHorizontal: isMediumTallPhone ? wp(6.10) : isCompactMediumPhone ? wp(5.0) : isSmallPhone ? wp(5.0) : isGalaxySPhone ? wp(6.1) : null,
            backgroundColor: buttonColor, // Save button color
            padding: hp(1),
            alignItems: 'center',
            borderRadius: wp(1.3),
            borderColor: 'black',
            borderWidth: wp(0.3),
          }}
          onPress={handleSubmit}
        >
          <Text style={{ color: '#fff', fontSize: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.90) : isSmallPhone ? hp(1.90) : isGalaxySPhone ? hp(1.75) : null, fontWeight: 'bold' }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'relative',
    left: wp(25),
    top: isMediumTallPhone ? hp(0.85) : isCompactMediumPhone ? null : isGalaxySPhone ? hp(0.85) : isGalaxySPhone ? hp(0.85) : null,
    bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(0.65) : isGalaxySPhone ? null : null,
    width: null,
    overflow: 'hidden',
    borderRadius: wp(1.3),
  },
  inputOne: {
    width: wp(73),
    height: hp(5.07), // More precise match to 45px
    borderWidth: wp(0.3), // Matches 1px
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    marginBottom: isMediumTallPhone ? hp(1.2) : isCompactMediumPhone ? hp(0.75) : isSmallPhone ? hp( 0.75) : isGalaxySPhone ? hp(1.2) : null, // Adjusted for closer proportion
    paddingHorizontal: wp(2.5), // Matches 10px
    textAlign: 'center',
    backgroundColor: 'white',
  },
  inputTwo: {
    width: wp(73),
    height: hp(5.07),
    borderWidth: wp(0.3),
    borderColor: 'black',
    borderRadius: wp(1.3),
    marginBottom: hp(1.2),
    paddingHorizontal: wp(2.5),
    textAlign: 'center',
    backgroundColor: 'white',
  },
  inputArea: {
    alignItems: 'center',
    backgroundColor: 'rgb(219, 220, 250)',
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    bottom: hp(2),
    flexDirection: 'column',
    height: isMediumTallPhone ? hp(21.7902) : isCompactMediumPhone ? hp(19) : isSmallPhone ? hp(19) : isGalaxySPhone ? hp(21.7902) : null,
    marginBottom: hp(10), // Reduced to maintain fit
    marginTop: hp(2),
    padding: wp(3),
    position: 'relative',
    width: '100%',
  },
});

export default InputArea;