import React from 'react';
import {View} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

function NotesDropdown({onChange, selectedOption, commonColor, discoveredColor, createTextColor}) {
  return (
    <View
      style={{
        borderWidth: wp(0.3),
        borderColor: '#ccc',
        borderRadius: wp(2.3),
        marginVertical: hp(1.5),
      }}>
      <Picker
        selectedValue={selectedOption}
        style={{height: 50, backgroundColor: 'white'}}
        onValueChange={itemValue => {
          onChange(itemValue); // Ensure synchronization with ParentFusionForms state
        }}>
        <Picker.Item color={'#999'} label={'Null'} value={'Null'} />
        <Picker.Item color={commonColor} label={'Common'} value={'Common'} />
        <Picker.Item
          color={discoveredColor}
          label={'Discovered'}
          value={'Discovered'}
        />
        <Picker.Item color={createTextColor} label={'Create'} value={'Create'} />
      </Picker>
    </View>
  );
}

export default NotesDropdown;
