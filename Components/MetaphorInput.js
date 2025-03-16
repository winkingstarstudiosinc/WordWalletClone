import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function MetaphorInput({ newFusion, setNewFusion, onAdd, addOrangeButton }) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={'metaphor'}
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
    marginTop: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? hp(2.50) : isSmallPhone ? hp(2.0) : isGalaxySPhone ? hp(1) : null, 
    flex: 1,
    borderColor: '#ccc',
    borderWidth: wp(0.3),
    borderRadius: wp(2.3),
    padding: isMediumTallPhone ? wp(2.6) : isCompactMediumPhone ? wp(1.6) : isSmallPhone ? wp(1.6) : isGalaxySPhone ? wp(2.6) : null,
    marginRight: wp(2.6),
    backgroundColor: 'white',
  },
  buttonWrapper: {
    position: 'relative',
    top: isMediumTallPhone ? hp(0.33) : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(1.0) : isGalaxySPhone ? hp(0.33) : null,
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

export default MetaphorInput;