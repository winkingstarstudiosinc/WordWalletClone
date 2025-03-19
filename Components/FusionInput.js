import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { isCompactMediumPhone, isMediumTallPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function FusionInput({ newFusion, setNewFusion, onAdd, addOrangeButton }) {

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TextInput
        placeholder={'fusion'}
        style={{
          marginTop: isMediumTallPhone ? hp(0.75) : isCompactMediumPhone ? hp(2) : isSmallPhone ? hp(2) : isGalaxySPhone ? hp(0.75) : null,
          bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(.5) : isGalaxySPhone ? null : null,  
          flex: 1,
          borderColor: '#ccc',
          borderWidth: wp(0.3), // Converted from 1
          borderRadius: wp(1.3), // Converted from 5
          padding: isMediumTallPhone ? wp(2.6) : isCompactMediumPhone ? wp(1.6) : isSmallPhone ? wp(1.6) : isGalaxySPhone ? wp(2.6) : null, 
          marginRight: wp(2.5), // Converted from 10
          backgroundColor: 'white',
        }}
        value={newFusion}
        onChangeText={setNewFusion}
      />
      <View
        style={{
          position: 'relative',
          top: isMediumTallPhone ? hp(0.30) : isCompactMediumPhone ? hp(0.5) : isSmallPhone ? hp(0.5) : isGalaxySPhone ? hp(0.30) : null, // Converted from '2.5%'
          overflow: 'hidden',
          borderRadius: wp(2.6), // Converted from 10
          borderColor: 'black',
          borderWidth: wp(0.3), // Converted from 1
        }}>
        <TouchableOpacity
          style={{
            backgroundColor: addOrangeButton,
            position:'relative',
            padding: wp(2.5), // Converted from 10
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(2.6), // Converted from 10
          }}
          onPress={onAdd}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


export default FusionInput;