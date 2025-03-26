import React from 'react';
import {View, TextInput, Button, StyleSheet} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function NicknamesInput({ entryPair, setNewEntry, onAdd, addTurquoiseButton }) {
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
    <View style={{ position:'relative', bottom: isMediumTallPhone ? hp(0) : isCompactMediumPhone ? hp(1) : isSmallPhone ? hp(2.1) : isGalaxySPhone ? hp(0) : null, marginTop: '2.5%'  }}>
      <View>
      <TextInput
        placeholder={'enter name for rhyme'}
        style={styles.inputOne}
        value={entryPair.firstPart.text} // ✅ Ensure we're accessing `text`
        onChangeText={text => handleInputChange('firstPart', text)}
      />
      </View>
      <View>
        <TextInput
          placeholder={'enter a rhyme:'}
          style={styles.inputTwo}
          value={entryPair.secondPart.text} // ✅ Ensure we're accessing `text`
          onChangeText={text => handleInputChange('secondPart', text)}
        />
      </View>
    </View>
      <View
        style={{
          position: 'relative',
          top: isMediumTallPhone ? hp(0.5) : null,
          bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(0.75) : isSmallPhone ? hp(1.65) : isGalaxySPhone ? null : null, 
          left: '32%',
          marginTop: isMediumTallPhone ? '0.50%' : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(0.1) : isGalaxySPhone ? '3%' : null,
          overflow: 'hidden',
          borderRadius: 10,
          width: '35%',
        }}>
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
    padding: isMediumTallPhone ? wp(2.30) : isCompactMediumPhone ? wp(1.5) : isSmallPhone ? wp(.60) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
    marginBottom: isMediumTallPhone ? hp(0.5) : isCompactMediumPhone ? hp(0.10) : isSmallPhone ? hp(0.01) : isGalaxySPhone ? hp(0.5) : null,
    marginTop: isMediumTallPhone ? null : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(-1.25) : isGalaxySPhone ? null : null,
  },
  inputTwo: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(1.3), // Matches 5px
    borderWidth: wp(0.3), // Matches 1px
    overflow: 'hidden',
    padding: isMediumTallPhone ? wp(2.30) : isCompactMediumPhone ? wp(1.5) : isSmallPhone ? wp(.60) : isGalaxySPhone ? wp(2.25) : null,
    color: 'black',
  },
});

export default NicknamesInput;
