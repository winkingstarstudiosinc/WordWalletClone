import React from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function EuphemismInput({ entryPair, setNewEntry, onAdd, addTurquoiseButton }) {
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
    <View style={{ position: isMediumTallPhone ? null : isCompactMediumPhone ? 'relative' : null, bottom: isMediumTallPhone ? hp(0) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(0.25) : isGalaxySPhone ? hp(0) : null }}>
      <View>
      <TextInput
        placeholder={'substituted expression'}
        style={styles.inputOne}
        value={entryPair.firstPart.text} // ✅ Ensure we only access the text property
        onChangeText={text => handleInputChange('firstPart', text)}
      />
      </View>
      <View>
      <TextInput
        placeholder={'euphemism'}
        style={styles.inputTwo}
        value={entryPair.secondPart.text} // ✅ Ensure we only access the text property
        onChangeText={text => handleInputChange('secondPart', text)}
      />
      </View>
      <View
        style={{
          position: 'relative',
          bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(3) : isGalaxySPhone ? null : null,
          left: isMediumTallPhone ? hp(13) : isCompactMediumPhone ? hp(16) : isSmallPhone ? wp(26.5) : isGalaxySPhone ? hp(13) : null,
          marginTop: isMediumTallPhone ? hp(1.50) : isCompactMediumPhone ? hp(1.0) : isSmallPhone ? hp(.50) : isGalaxySPhone ? hp(1.50) : null,
          bottom: hp(0.10), // Converted from '2%'
          overflow: 'hidden',
          borderRadius: wp(1.3), // Converted from 5
          width: wp(29), // Converted from '35%'
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
    padding: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.75) : isSmallPhone ? wp(.75) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
    marginBottom: isMediumTallPhone ? hp(0.5) : isCompactMediumPhone ? hp(0.10) : isGalaxySPhone ? hp(0.5) : null,
  },
  inputTwo: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.75) : isGalaxySPhone ? wp(2.25) : isSmallPhone ? wp(.75) : null,
    color: 'black',
  },
});

export default EuphemismInput;