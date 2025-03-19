import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function WitWisdomInput({ entryPair, setNewEntry, onAdd, addTurquoiseButton }) {
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
      <View style={{ position:'relative', bottom: isMediumTallPhone ? hp(0) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(1.5) : null, top: isGalaxySPhone ? hp(1) : null}}>
        <View>
          <TextInput
            placeholder={'Witticism or wisdom'}
            style={styles.inputOne}
            value={entryPair.firstPart.text} // Access nested text
            onChangeText={text => handleInputChange('firstPart', text)}
          />
        </View>
        <View>
          <TextInput
            placeholder={'Enter author'}
            style={styles.inputTwo}
            value={entryPair.secondPart.text} // Access nested text
            onChangeText={text => handleInputChange('secondPart', text)}
          />
        </View>
        <View style={styles.buttonContainer}>
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
    padding: isSmallPhone ? wp(0.5) : isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.5) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
    marginBottom: isMediumTallPhone ? hp(0.5) : isSmallPhone ? hp(0.1) : isCompactMediumPhone ? hp(0.25) : isGalaxySPhone ? wp(0.5) : null,
  },
  inputTwo: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.25) : isCompactMediumPhone ? wp(1.5) : isSmallPhone ? wp(0.5) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
  },
  buttonContainer: {
    position: 'relative',
    left: isMediumTallPhone ? wp(26) : isCompactMediumPhone ? wp(25.5) : isSmallPhone ? wp(25.5) : isGalaxySPhone ? wp(26) : null,
    bottom: null,
    overflow: 'hidden',
    borderRadius: wp(2.5), // Matches 10px
    borderColor: 'black',
    borderWidth: wp(0.3), // Matches 1px
    marginTop: isMediumTallPhone ? hp(0.75) : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(0.25) : isGalaxySPhone ? hp(0.75) : null,
    width: wp(30), // Matches '35%'
  },
});

export default WitWisdomInput;