import React, { useState } from 'react';
import { View, Button, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AllegoryDefinition from './AllegoryDefinition';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';



function ParentAllegory({ onBack, buttonColor }) {
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for Allegory Notes

  return (
    <View style={styles.container}>
      <View>
        <AllegoryDefinition />
      </View>      
      <View style={styles.quillContainer}>
        <DeviceQuill
          editorContent={editorContent}
          setEditorContent={setEditorContent}
          storageKey="AllegoryNotes"
          buttonColor={buttonColor}
        />
      </View>

      <View style={[styles.buttonWrapper, { width: wp(35) }]}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: buttonColor }]}
          onPress={() => {
            if (!editorContent.trim()) {
              Alert.alert('Oops...', 'Editor content is empty, my friend!');
              return;
            }
            console.log('Saving content:', editorContent); // Debug log
            Alert.alert(
              'Awesome!',
              'Your allegories have been successfully salvaged in the cybersafe :)',
            );
          }}>
          <Text style={styles.buttonText}>Save Notes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.backButtonWrapper}>
        <DeviceBackButton buttonColor={buttonColor} onBack={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: hp(80),
  },
  quillContainer: {
    position: 'relative',
    height: isMediumTallPhone ? hp(94.5) : isCompactMediumPhone ? hp(95) : isSmallPhone ? hp(95) : isGalaxySPhone ? hp(70) : null,
    top: hp(1.5),
  },
  buttonWrapper: {
    position: 'relative',
    bottom: isMediumTallPhone ? hp(24.75) : isCompactMediumPhone ? hp(29.50) : isSmallPhone ? hp(29.50) : isGalaxySPhone ? hp(-0.5) : null, // Converted from '34%'
    marginTop: hp(2), // Converted from '2%'
  },
  saveButton: {
    position: 'relative',
    padding: wp(2), // Fixed missing value
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2.5), // Scaled for better responsiveness
    borderColor: 'black',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  backButtonWrapper: {
    position: 'relative',
    bottom: isMediumTallPhone ? hp(30) : isCompactMediumPhone ? hp(35) : isSmallPhone ? hp(35) : isGalaxySPhone ? hp(4.25) : null, // Converted from '34%'
    left: wp(29), // Converted from '35%'
  },
});

export default ParentAllegory;