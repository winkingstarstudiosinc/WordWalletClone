import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function PersonificationInput({ newFusion, setNewFusion, onAdd, addOrangeButton }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={'personification'}
        style={styles.input}
        value={newFusion}
        onChangeText={setNewFusion}
      />
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: addOrangeButton }]}
          onPress={onAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    marginTop: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(2.0) : isGalaxySPhone ? hp(1.5) : null,
    flex: 1,
    borderColor: '#ccc',
    borderWidth: wp(0.3), // Converted from 1px
    borderRadius: wp(2.3), // Converted from 5px
    padding: isMediumTallPhone ? wp(2.6) : isCompactMediumPhone ? wp(1.6) : isGalaxySPhone ? wp(2.6) : isSmallPhone ? hp(0.75) : null,
    marginRight: wp(2.6), // Converted from 10px
    backgroundColor: 'white',
  },
  buttonWrapper: {
    position: 'relative',
    top: isMediumTallPhone ? hp(1.0) : isCompactMediumPhone ? hp(0.5) : isGalaxySPhone ? hp(1.0) : null,
    overflow: 'hidden',
    borderRadius: wp(2.5),
    borderColor: 'black',
    borderWidth: wp(0.3),
  },
  addButton: {
    padding: wp(2.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2.5),
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: wp(4),
  },
});

export default PersonificationInput;