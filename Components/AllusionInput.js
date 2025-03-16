import React from 'react';
import {View, TextInput, TouchableOpacity, Text} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function AllusionInput({ newFusion, setNewFusion, onAdd, addOrangeButton }) {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <TextInput
        placeholder={'allusion'}
        style={{
          marginTop: isMediumTallPhone ? hp(0.85) : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(2.0) : isGalaxySPhone ? hp(0.85) : null, // ✅ Now it should work instantly!
          flex: 1,
          borderColor: '#ccc',
          borderWidth: wp(0.3), // Converted from 1
          borderRadius: wp(1.3), // Converted from 5
          padding: isMediumTallPhone ? wp(2.6) : isCompactMediumPhone ? wp(1.6) : isSmallPhone ? wp(0.75) : isGalaxySPhone ? wp(2.6) : null, // Converted from 10
          marginRight: wp(2.5), // Converted from 10
          backgroundColor: 'white',
        }}
        value={newFusion}
        onChangeText={setNewFusion}
      />
      <View
        style={{
          position: 'relative',
          top: isMediumTallPhone ? hp(0.30) : isCompactMediumPhone ? hp(0.5) : isGalaxySPhone ? hp(0.30) : null, // Converted from '2.5%'
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


export default AllusionInput;
