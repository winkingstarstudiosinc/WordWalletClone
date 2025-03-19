import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';


function ChangeTextColor({
  onBack,
  onCommonTextColorChange,
  onDiscoveredTextColorChange,
  onCreateTextColorChange, // New prop for handling "Create" text color changes
}) {
  const [selectedColor, setSelectedColor] = useState('#8a47ff'); // Default color for Common
  const [discoveredColor, setDiscoveredColor] = useState('#2096F3'); // Default color for Discovered
  const [createColor, setCreateColor] = useState('turquoise'); // Default color for Create
  const [isColorWheelVisible, setIsColorWheelVisible] = useState(false); // Toggle color wheel
  const [currentTarget, setCurrentTarget] = useState(''); // Tracks which button was pressed (Common, Discovered, or Create)

  const defaultColors = {
    common: '#8a47ff',
    discovered: '#2096F3',
    create: 'turquoise',
  };

  return (
    <View style={styles.container}>
      {!isColorWheelVisible ? (
        <>
          {/* Main Screen */}
          <Text style={styles.modalTitle}>Change Text Color</Text>

          {/* Change Common Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('common');
              setIsColorWheelVisible(true);
            }}>
            <Text style={styles.optionText}>Change Common </Text>
          </TouchableOpacity>

          {/* Change Discovered Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('discovered');
              setIsColorWheelVisible(true);
            }}>
            <Text style={styles.optionText}>Change Discovered </Text>
          </TouchableOpacity>

          {/* Change Create Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('create');
              setIsColorWheelVisible(true);
            }}>
            <Text style={styles.optionText}>Change Create </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedColor(defaultColors.common);
              setDiscoveredColor(defaultColors.discovered);
              setCreateColor(defaultColors.create);
              onCommonTextColorChange(defaultColors.common);
              onDiscoveredTextColorChange(defaultColors.discovered);
              onCreateTextColorChange(defaultColors.create);
            }}>
            <Text style={styles.resetButtonText}>Reset to Default </Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onBack}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* Color Picker Screen */}
          <Text style={styles.modalTitle}>
            Select a Color for{' '}
            {currentTarget === 'common'
              ? 'Common'
              : currentTarget === 'discovered'
              ? 'Discovered'
              : 'Create'}
          </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={
                currentTarget === 'common'
                  ? selectedColor
                  : currentTarget === 'discovered'
                  ? discoveredColor
                  : createColor
              }
              onColorChange={color => {
                if (currentTarget === 'common') {
                  setSelectedColor(color);
                } else if (currentTarget === 'discovered') {
                  setDiscoveredColor(color);
                } else if (currentTarget === 'create') {
                  setCreateColor(color);
                }
              }}
              style={{height: 250, width: 250}} // Adjusted size for color wheel
            />
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              if (currentTarget === 'common') {
                onCommonTextColorChange(selectedColor);
              } else if (currentTarget === 'discovered') {
                onDiscoveredTextColorChange(discoveredColor);
              } else if (currentTarget === 'create') {
                onCreateTextColorChange(createColor);
              }
              setIsColorWheelVisible(false);
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp(5), // Converted from 20
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: wp(3.0), // Converted from 18
    fontWeight: 'bold',
    marginBottom: hp(1.8), // Converted from 15
    textAlign: 'center',
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#2096F3',
    paddingHorizontal: wp(2.6), // Converted from 10
    borderRadius: wp(2.1), // Converted from 8
    marginVertical: hp(1.2), // Converted from 10
    width: '70%',
    maxWidth: wp(67), // Converted from 250
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.8), // Converted from 45
  },
  optionText: {
    color: '#fff',
    fontSize: wp(3.0), // Converted from 13
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: hp(1.3), // Converted from 10
    paddingHorizontal: wp(3.9), // Converted from 15
    borderRadius: wp(2.1), // Converted from 8
    width: '70%',
    maxWidth: wp(67), // Converted from 250
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.8), // Converted from 45
  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp(3.0), // Converted from 14
    textAlign: 'center',
  },
  colorPickerContainer: {
    marginTop: hp(2.6), // Converted from 20
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(39), // Converted from 300
    width: '100%',
  },
  resetButton: {
    backgroundColor: '#ff4500',
    paddingVertical: hp(0.9), // Converted from 10
    paddingHorizontal: wp(3.5), // Converted from 15
    borderRadius: wp(2.1), // Converted from 8
    marginVertical: hp(1.2), // Converted from 10
    width: '70%',
    maxWidth: wp(67), // Converted from 250
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.8), // Converted from 45
  },
});

export default ChangeTextColor;