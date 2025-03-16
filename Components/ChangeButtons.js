import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDeviceType, hp, wp } from './DynamicDimensions';


function ChangeButtons({
  onBack,
  onButtonColorChange,
  saveAddOrangeButtonColor,
  saveAddTurquoiseButtonColor,
}) {
  const [selectedColor, setSelectedColor] = useState('#2096F3'); // Default color
  const [isColorWheelVisible, setIsColorWheelVisible] = useState(false); // Toggle color wheel
  const [currentTarget, setCurrentTarget] = useState(''); // Track which button is being modified

  const defaultColors = {
    primaryBlue: '#2096F3',
    addOrange: '#FFA500',
    addTurquoise: 'turquoise',
  };

  return (
    <View style={styles.container}>
      {!isColorWheelVisible ? (
        <>
          {/* Main Screen */}
          <Text style={styles.modalTitle}>Change Buttons</Text>

          {/* Change Primary Blue Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('primaryBlue'); // Set target to Primary Blue
              setIsColorWheelVisible(true); // Show the color picker
            }}
          >
            <Text style={styles.optionText}>Change Light Blue Buttons</Text>
          </TouchableOpacity>

          {/* Change Add Orange Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('addOrange'); // Set target to Add Orange
              setIsColorWheelVisible(true); // Show the color picker
            }}
          >
            <Text style={styles.optionText}>Change Add: Orange</Text>
          </TouchableOpacity>

          {/* Change Add Turquoise Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('addTurquoise'); // Set target to Add Turquoise
              setIsColorWheelVisible(true); // Show the color picker
            }}
          >
            <Text style={styles.optionText}>Change Add: Turquoise</Text>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              // Reset all colors to default
              setSelectedColor(defaultColors.primaryBlue);
              onButtonColorChange(defaultColors.primaryBlue); // Reset Primary Blue
              saveAddOrangeButtonColor(defaultColors.addOrange); // Reset Add Orange
              saveAddTurquoiseButtonColor(defaultColors.addTurquoise); // Reset Add Turquoise
            }}
          >
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
            {currentTarget === 'primaryBlue'
              ? 'Primary Blue'
              : currentTarget === 'addOrange'
              ? 'Add Orange'
              : 'Add Turquoise'}
          </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{ height: 250, width: 250 }}
            />
          </View>

          {/* Apply Color for the Selected Target */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              if (currentTarget === 'primaryBlue') {
                onButtonColorChange(selectedColor); // Save Primary Blue color
              } else if (currentTarget === 'addOrange') {
                saveAddOrangeButtonColor(selectedColor); // Save Add Orange color
              } else if (currentTarget === 'addTurquoise') {
                saveAddTurquoiseButtonColor(selectedColor); // Save Add Turquoise color
              }
              setIsColorWheelVisible(false); // Close the color picker
            }}
          >
            <Text style={styles.optionText}>Apply Color</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsColorWheelVisible(false)}
          >
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
    fontSize: wp(4.7), // Converted from 18
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
    width: '80%',
    maxWidth: wp(80), // Converted from 300
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(6.5), // Converted from 50
  },
  optionText: {
    color: '#fff',
    fontSize: wp(3.0), // Converted from 14
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  closeButton: {
    backgroundColor: '#f44336',
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
    backgroundColor: '#ff5722',
    paddingVertical: hp(1.0), // Converted from 10
    paddingHorizontal: wp(3.5), // Converted from 15
    borderRadius: wp(2.1), // Converted from 8
    marginVertical: hp(1.2), // Converted from 10
    width: '70%',
    maxWidth: wp(67), // Converted from 250
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: hp(5.8), // Converted from 45
  },
  resetButtonText: {
    color: '#fff',
    fontSize: wp(3.0), // Converted from 14
    textAlign: 'center',
  },
});

export default ChangeButtons;