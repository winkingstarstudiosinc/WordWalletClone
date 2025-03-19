import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import ColorPicker from 'react-native-wheel-color-picker';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';


function ChangeWalletColor({
  onBack,
  onColorChange,
  onCardHolderColorChange,
  onLexiconColorChange,
  onTranslateColorChange,
  onDeviceColorChange,
  onDictionaryColorChange,
  onInputAreaColorChange, 
}) {
  const [selectedColor, setSelectedColor] = useState('#3827b3'); // Selected color
  const [isColorWheelVisible, setIsColorWheelVisible] = useState(false); // Toggle wallet color wheel
  const [isCardHolderColorWheelVisible, setIsCardHolderColorWheelVisible] = useState(false); // Toggle card holder color wheel
  const [isLexiconColorWheelVisible, setIsLexiconColorWheelVisible] = useState(false); // Toggle lexicon color wheel
  const [isTranslateColorWheelVisible, setIsTranslateColorWheelVisible] = useState(false); // Toggle translate color wheel
  const [isDeviceColorWheelVisible, setIsDeviceColorWheelVisible] = useState(false);
  const [isDictionaryColorWheelVisible, setIsDictionaryColorWheelVisible] = useState(false); 
  const [isInputAreaColorWheelVisible, setIsInputAreaColorWheelVisible] = useState(false)


  const resetToDefaultColors = () => {
    onColorChange('#3827b3'); // Reset wallet background color
    onCardHolderColorChange('rgb(36, 95, 141)'); // Reset card holder color
    onLexiconColorChange('#007bff'); // Reset lexicon card color
    onTranslateColorChange('#ff6347'); // Reset translate card color
    onDeviceColorChange('#dff13c'); // Reset device card color
    onDictionaryColorChange('#28a745'); // Reset dictionary card color
    onInputAreaColorChange('rgb(219, 220, 250)'); // Reset input area color
  };

  return (
    <View>
      {!isColorWheelVisible &&
      !isCardHolderColorWheelVisible &&
      !isLexiconColorWheelVisible &&
      !isTranslateColorWheelVisible && 
      !isDeviceColorWheelVisible &&
      !isDictionaryColorWheelVisible &&
      !isInputAreaColorWheelVisible ? (
        <>
          {/* Main Selection Screen */}
          <Text style={styles.modalTitle}>Change Colors</Text>

          {/* Open Wallet Background Color Picker */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change Wallet Background </Text>
          </TouchableOpacity>

          {/* Open Card Holder Color Picker */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsCardHolderColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change Card Holder </Text>
          </TouchableOpacity>

          {/* Lexicon Card */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsLexiconColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change color: Lexicon </Text>
          </TouchableOpacity>

          {/* Open Translate Card Color Picker */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsTranslateColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change color: Translate  </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsDeviceColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change color: Device </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsDictionaryColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change color: Dictionary   </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsInputAreaColorWheelVisible(true)}>
            <Text style={styles.optionText}>Change Wallet Input </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.resetButton]}
            onPress={resetToDefaultColors}>
            <Text style={styles.optionText}>Reset to Default Colors</Text>
          </TouchableOpacity>

          {/* Back Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onBack}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isColorWheelVisible ? (
        <>
          {/* Wallet Background Color Picker */}
          <Text style={styles.modalTitle}>Select Background Color</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onColorChange(selectedColor);
              setIsColorWheelVisible(false);
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isCardHolderColorWheelVisible ? (
        <>
          {/* Card Holder Color Picker */}
          <Text style={styles.modalTitle}>Select Card Holder Color</Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onCardHolderColorChange(selectedColor);
              setIsCardHolderColorWheelVisible(false);
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsCardHolderColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isLexiconColorWheelVisible ? (
        <>
          {/* Lexicon Card Color Picker */}
          <Text style={styles.modalTitle}>Select Lexicon Card Color </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{height: 300, width: 300}}
            />
          </View>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onLexiconColorChange(selectedColor);
              setIsLexiconColorWheelVisible(false);
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsLexiconColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isTranslateColorWheelVisible ? (
        <>
          {/* Translate Card Color Picker */}
          <Text style={styles.modalTitle}>Select Translate Card Color </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor} // Update the selected color in real-time
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onTranslateColorChange(selectedColor); // Save selected color
              setIsTranslateColorWheelVisible(false); // Return to main screen
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsTranslateColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isDeviceColorWheelVisible ? (
        <>
          {/* Device Card Color Picker */}
          <Text style={styles.modalTitle}>Select Device Card Color </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor} // Update the selected color in real-time
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onDeviceColorChange(selectedColor); // Save selected color
              setIsDeviceColorWheelVisible(false); // Return to main screen
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsDeviceColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isDictionaryColorWheelVisible ? (
        <>
          {/* Dictionary Card Color Picker */}
          <Text style={styles.modalTitle}>Select Dictionary Card Color </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor} // Update the selected color in real-time
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onDictionaryColorChange(selectedColor); // Save selected color
              setIsDictionaryColorWheelVisible(false); // Return to main screen
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsDictionaryColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          {/* InputArea Color Picker */}
          <Text style={styles.modalTitle}>Select Input Area Color </Text>
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              color={selectedColor}
              onColorChange={setSelectedColor}
              style={{height: 300, width: 300}}
            />
          </View>

          {/* Apply and Back Buttons */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => {
              onInputAreaColorChange(selectedColor); // Save selected color
              setIsInputAreaColorWheelVisible(false); // Return to main screen
            }}>
            <Text style={styles.optionText}>Apply Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsInputAreaColorWheelVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: wp(4.7), // Converted from 18
    fontWeight: 'bold',
    marginBottom: hp(1.8), // Converted from 15
    textAlign: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#2096F3',
    paddingVertical: hp(1.5), // Increased slightly for better text fit
    paddingHorizontal: wp(3.5), // Increased slightly for better spacing
    borderRadius: wp(1.5), // Keeping the proportion
    marginVertical: hp(1.2), 
    width: '85%', // Increased from 80% to allow for more space
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: '#ff4500',
    paddingVertical: hp(1.3), // Converted from 10
    paddingHorizontal: wp(3.2), // Converted from 12
    borderRadius: wp(1.3), // Converted from 5
    marginVertical: hp(1.3), // Converted from 10
    width: '80%',
    alignSelf: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: wp(3.2), // Converted from 14
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  closeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: hp(1.3), // Converted from 10
    paddingHorizontal: wp(3.2), // Converted from 12
    borderRadius: wp(1.3), // Converted from 5
    marginTop: hp(2), // Converted from 15
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp(3.2), // Converted from 14
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  colorPickerContainer: {
    marginTop: hp(2.6), // Converted from 20
    alignItems: 'center',
    justifyContent: 'center',
    height: hp(45.5), // Converted from 350
    width: '100%',
  },
});

  
export default ChangeWalletColor;