import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function TermsInput({ entryPair, setNewEntry, onAdd, addTurquoiseButton }) {
  const handleInputChange = (field, value) => {
    setNewEntry({
      ...entryPair,
      [field]: {
        ...entryPair[field], // Preserve existing styles
        text: value, // Update only the text property
      },
    });
  };

  return (
    <View>
      <View style={{ position: 'relative', marginTop: isGalaxySPhone ? hp(1.5) : null, bottom: isMediumTallPhone ? hp(0) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1) : null }}>
        <View>
          <TextInput
            placeholder={'A term'}
            style={styles.inputOne}
            value={entryPair.firstPart.text} // Access nested text
            onChangeText={text => handleInputChange('firstPart', text)}
          />
        </View>
        <View>
          <TextInput
            placeholder={'Definition:'}
            style={styles.inputTwo}
            value={entryPair.secondPart.text} // Access nested text
            onChangeText={text => handleInputChange('secondPart', text)}
          />
        </View>
      </View>
      <View style={styles.buttonWrapper}>
        <Button color={addTurquoiseButton} title={'Add'} onPress={onAdd} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputOne: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.5) : isSmallPhone ? wp(0.75) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
    marginBottom: isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp(0.10) : isSmallPhone ? hp(0.10) : isGalaxySPhone ? hp(0.25) : null,
  },
  inputTwo: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.5) : isSmallPhone ? wp(0.75) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
  },
  buttonWrapper: {
    position: 'relative',
    left: wp(26.5),
    bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(0.75) : isSmallPhone ? hp(1.0) : isGalaxySPhone ? null : null,
    marginTop: isMediumTallPhone ? hp(0.75) : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(0.25) : isGalaxySPhone ? hp(1.5) : null,
    overflow: 'hidden',
    borderRadius: wp(2.5),
    width: wp(29),
  },
});

export default TermsInput;