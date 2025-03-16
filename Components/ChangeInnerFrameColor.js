import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDeviceType, hp, wp } from './DynamicDimensions';


function ChangeInnerFrameColor({
  onBack,
  onTranslateFrameColorChange,
  onDictionaryFrameColorChange,
  onTranslateHeaderOneChange,
  onTranslateHeaderTwoChange,
  onDictionaryDefinitionColorChange
}) {
  const [selectedColor, setSelectedColor] = useState('#3827b3'); // Default color for both
  const [isColorWheelVisible, setIsColorWheelVisible] = useState(false); // Toggle color wheel
  const [currentTarget, setCurrentTarget] = useState(''); // Tracks which button is pressed

  const defaultColors = {
    translateInner: '#3827b3',
    translateHeaderOne:'#3827b3',
    translateHeaderTwo:'#3827b3',
    dictionaryInner: '#3827b3',
    dictionaryDefinition: '#3827b3',
  };

  return (
    <View style={styles.container}>
      {!isColorWheelVisible ? (
        <>
          {/* Main Screen */}
          <Text style={styles.modalTitle}>Change Inner Frame Color </Text>

          {/* Change Translate Inner Color Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('translateInner');
              setIsColorWheelVisible(true);
            }}
          >
            <Text style={styles.optionText}>Change Inner Color: Translate  </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
            setCurrentTarget('translateH1');
            setIsColorWheelVisible(true);
            }}
            >
            <Text style={styles.optionText}>Change Inner Color: Translate H1  </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
            setCurrentTarget('translateH2');
            setIsColorWheelVisible(true);
            }}
        >
                <Text style={styles.optionText}>Change Inner Color: Translate H2  </Text>
          </TouchableOpacity>


          {/* Change Dictionary Inner Color Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              setCurrentTarget('dictionaryInner');
              setIsColorWheelVisible(true);
            }}
          >
            <Text style={styles.optionText}>Change Inner Color: Dictionary   </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
            setCurrentTarget('dictionaryDefinition');
            setIsColorWheelVisible(true);
          }}>
            <Text style={styles.optionText}>Change Definition Background: Dictionary</Text>
          </TouchableOpacity>

          {/* Reset Button */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setSelectedColor(defaultColors.translateInner); // Reset to default
              onTranslateFrameColorChange(defaultColors.translateInner);
              onTranslateHeaderOneChange(defaultColors.translateHeaderOne);
              onTranslateHeaderTwoChange(defaultColors.translateHeaderTwo);
              onDictionaryFrameColorChange(defaultColors.dictionaryInner);
              onDictionaryDefinitionColorChange(defaultColors.dictionaryDefinition);
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
                {' '}
            {currentTarget === 'translateInner'
              ? 'Translate Inner Frame'
              : 'Dictionary Inner Frame'}
          </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{ height: 250, width: 250 }}
            />
          </View>

          {/* Apply Color Button */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
            if (currentTarget === 'translateInner') {
            onTranslateFrameColorChange(selectedColor);
            } else if (currentTarget === 'dictionaryInner') {
            onDictionaryFrameColorChange(selectedColor);
            } else if (currentTarget === 'dictionaryDefinition') {
            onDictionaryDefinitionColorChange(selectedColor); // Call the new function
            } else if (currentTarget === 'translateH1') {
            onTranslateHeaderOneChange(selectedColor);
            } else if (currentTarget === 'translateH2') {
            onTranslateHeaderTwoChange(selectedColor);
            }
            setIsColorWheelVisible(false); // Close the picker
           }}>
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
    paddingVertical: hp(1.3), // Converted from 10
    paddingHorizontal: wp(3.9), // Converted from 15
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

export default ChangeInnerFrameColor;