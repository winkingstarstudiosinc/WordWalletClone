import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp, normalize } from './DynamicDimensions';



function ImageryInput({ newFusion, setNewFusion, onAdd, addOrangeButton }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        placeholder={'imagery'}
        style={{
          marginTop: isMediumTallPhone ? hp(2) : isCompactMediumPhone ? hp(1) : isSmallPhone ? null : isGalaxySPhone ? hp(2) : null,
          flex: 1,
          borderColor: '#ccc',
          borderWidth: wp(0.3), // Converted from 1
          borderRadius: wp(2.6), // Converted from 5
          padding: isMediumTallPhone ? wp(2.6) : isCompactMediumPhone ? wp(1.6) : isSmallPhone ? wp(1) : isGalaxySPhone ? wp(2.6) : null, 
          marginRight: wp(2.6), // Converted from 10
          backgroundColor: 'white',
        }}
        value={newFusion}
        onChangeText={setNewFusion}
      />
      <View
        style={{
          position: 'relative',
          top: isMediumTallPhone ? hp(1.0) : isCompactMediumPhone ? hp(0.5) : isGalaxySPhone ? hp(1.0) : null, 
          overflow: 'hidden',
          borderRadius: wp(2.6), // Converted from 10
          borderColor: 'black',
          borderWidth: wp(0.3), // Converted from 1
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: addOrangeButton,
            padding: wp(2.6), // Converted from 10
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(2.6), // Converted from 10
          }}
          onPress={onAdd}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ImageryInput;