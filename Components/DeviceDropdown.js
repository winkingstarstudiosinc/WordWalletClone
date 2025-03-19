import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

function DeviceDropdown({ onChange, selectedOption, commonColor, discoveredColor, createTextColor }) {
  return (
    <View
      style={{
        borderWidth: wp(0.3), // Converted from 1
        borderColor: '#ccc',
        borderRadius: wp(1.3), // Converted from 5
        marginVertical: hp(1.3), // Converted from 10
      }}>
      <Picker
        selectedValue={selectedOption}
        style={{ height: hp(6.5), backgroundColor: 'white' }} // Converted from 50
        onValueChange={itemValue => {
          onChange(itemValue); // Ensure synchronization with ParentFusionForms state
        }}>
        <Picker.Item color={commonColor} label={'Common'} value={'Common'} />
        <Picker.Item color={discoveredColor} label={'Discovered'} value={'Discovered'} />
        <Picker.Item color={createTextColor} label={'Create'} value={'Create'} />
      </Picker>
    </View>
  );
}

export default DeviceDropdown;