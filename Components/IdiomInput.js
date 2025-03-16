import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp, normalize } from './DynamicDimensions';


function IdiomInput({ entryPair, setNewEntry, onAdd, addTurquoiseButton }) {
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
    <View style={{ position: isMediumTallPhone ? null : isCompactMediumPhone ? 'relative' : null, marginTop: isGalaxySPhone ? hp(0.25) : null, bottom: isMediumTallPhone ? hp(0) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1.0) : isGalaxySPhone ? hp(0) : null }}>
      <View>
      <TextInput
        placeholder={'explanation'}
        style={styles.inputOne}
        value={entryPair.firstPart.text} // ✅ Ensure we only access the text property
        onChangeText={text => handleInputChange('firstPart', text)}
      />
      </View>
      <View>
      <TextInput
        placeholder={'idiom'}
        style={styles.inputTwo}
        value={entryPair.secondPart.text} // ✅ Ensure we only access the text property
        onChangeText={text => handleInputChange('secondPart', text)}
      />
      </View>
      <View
        style={{
          position: 'relative',
          bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(0.75) : isSmallPhone ? (5) : isGalaxySPhone ? null : null,
          left: isMediumTallPhone ? hp(13) : isCompactMediumPhone ? hp(16) : isSmallPhone ? hp(16) : isGalaxySPhone ? hp(13) : null,
          top: isGalaxySPhone ? hp(0.50) : null,
          width: wp(29), // Converted from '35%'
          overflow: 'hidden',
          borderRadius: wp(2.6), // Converted from 10
          marginTop: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(1.5) : isGalaxySPhone ? hp(1.75) : null,
        }}>
        <Button color={addTurquoiseButton} title={'Add'} onPress={onAdd} />
      </View>
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
    padding: isMediumTallPhone ? wp(2.30) : isCompactMediumPhone ? wp(2.0) : isGalaxySPhone ? wp(2.30) : isSmallPhone ? wp(.75) : null,
    color: 'black',
    marginBottom: isMediumTallPhone ? hp(0.5) : isCompactMediumPhone ? hp(0.10) : isGalaxySPhone ? hp(0.5) : isSmallPhone ? hp(0.25) : null,
  },
  inputTwo: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.30) : isCompactMediumPhone ? wp(2.0) : isGalaxySPhone ? wp(2.30) : isSmallPhone ? wp(.75) : null,
    color: 'black',
  },
});

export default IdiomInput;
