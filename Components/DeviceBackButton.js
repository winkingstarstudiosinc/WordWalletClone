import React from 'react';
import { Button, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

function DeviceBackButton({ onBack, onPress, buttonColor }) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={{
          backgroundColor: buttonColor,
          borderColor: 'black',
          borderWidth: wp(0.3), // Converted from 1
          padding: wp(2.0), // Converted from 8.5
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: wp(2.6), // Converted from 10
        }}
        onPress={onBack || onPress}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: 'center',
    borderRadius: wp(1.3), // Converted from 5
    overflow: 'hidden',
    width: wp(26), // Converted from '30%'
  },
});

export default DeviceBackButton;