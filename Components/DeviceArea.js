import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useStorage} from './StorageContext'; // Import useStorage
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function DeviceArea({ onChangeDevice, buttonColor }) {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [note, setNote] = useState('');
  const {saveData, loadStoredData} = useStorage(); // Extract save and load methods from useStorage

  // Load the saved note only when the component mounts
  useEffect(() => {
    const fetchSavedNote = async () => {
      const savedNote = await loadStoredData('MiscellaneousNote'); // Load the saved note
      if (savedNote) {
        setNote(savedNote); // Restore the saved note to the TextInput
        console.log('Loaded Note:', savedNote); // Debug log
      }
    };
    fetchSavedNote();
  }, []); // Empty dependency array ensures this only runs once on mount

  // Save note using useStorage
  const handleSaveNote = async () => {
    try {
      const key = 'MiscellaneousNote'; // Key for miscellaneous notes
      console.log('Saving Note with Key:', key, 'Value:', note); // Debug log
      await saveData(key, note); // Save the note
      Alert.alert(
        'Success, my lady or lad!',
        'Your miscellaneous notes have been successfully saved!',
      );
    } catch (error) {
      console.error('Failed to save note:', error);
      Alert.alert('Error', 'Failed to save your note. Please try again.');
    }
  };

  return (
    <View style={styles.deviceArea}>
      <Picker
        selectedValue={selectedDevice}
        style={[styles.dropdownList, {borderColor:buttonColor, borderWidth:2}]}
        onValueChange={device => {
          console.log('Device Selected:', device); // Debug log
          setSelectedDevice(device);
          onChangeDevice(device); // Propagate change to parent
        }}>
        <Picker.Item label={'Devices...'} value={''} />
        <Picker.Item label={'Fusion Forms'} value={'Fusion Forms'} />
        <Picker.Item label={'Wit & Wisdom'} value={'Wit & Wisdom'} />
        <Picker.Item label={'Nicknames'} value={'Nicknames'} />
        <Picker.Item label={'Terms'} value={'Terms'} />
        <Picker.Item label={'Alliteration'} value={'Alliteration'} />
        <Picker.Item label={'Allusion'} value={'Allusion'} />
        <Picker.Item label={'Allegory'} value={'Allegory'} />
        <Picker.Item label={'Euphemism'} value={'Euphemism'} />
        <Picker.Item label={'Hyperbole'} value={'Hyperbole'} />
        <Picker.Item label={'Idiom'} value={'Idiom'} />
        <Picker.Item label={'Imagery'} value={'Imagery'} />
        <Picker.Item label={'Irony'} value={'Irony'} />
        <Picker.Item label={'Juxtaposition'} value={'Juxtaposition'} />
        <Picker.Item label={'Metaphor'} value={'Metaphor'} />
        <Picker.Item label={'Onomatopoeia'} value={'Onomatopoeia'} />
        <Picker.Item label={'Oxymoron'} value={'Oxymoron'} />
        <Picker.Item label={'Personification'} value={'Personification'} />
        <Picker.Item label={'Simile'} value={'Simile'} />
      </Picker>
      <TextInput
        multiline
        placeholder={'Miscellaneous notes...'}
        style={[styles.deviceTextarea, {borderColor:buttonColor, borderWidth:3}]}
        value={note}
        onChangeText={setNote} // Directly updates the note state
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: buttonColor, // Custom color for the button
            borderColor:'black',
            borderWidth: 1,
            padding: wp(2.0),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(1.3),
          }}
          onPress={handleSaveNote}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: wp(5.3), // Converted from 20
    bottom: hp(4.0), // Converted from '1.85%'
    marginTop: isMediumTallPhone ? hp(4.25) : isCompactMediumPhone ? hp(4.25) : isSmallPhone ? hp(4.25) : isGalaxySPhone ? hp(3.65) : null, // Converted from '3.5%'
    position: 'relative',
    width: wp(35), // Converted from '35%'
  },
  deviceArea: {
    width: '100%',
  },
  deviceTextarea: {
    width: '100%',
    height: isMediumTallPhone ?  hp(40) : isCompactMediumPhone ? hp(35) : isSmallPhone ? hp(34) : isGalaxySPhone ? hp(42) : null, // Converted from '61%'
    borderWidth: wp(0.5), // Converted from 2
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: hp(1), // Converted from '3%'
    borderRadius: wp(1.3), // Converted from 5
    paddingHorizontal: wp(2.6), // Converted from 10
    textAlignVertical: 'top',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: wp(4), // Converted from 15
    fontSize: wp(2.6), // Converted from 10
    marginBottom: hp(1.5), // Converted from '3%'
    overflow: 'hidden',
    width: wp(50), // Converted from '50%'
  },
});

export default DeviceArea;
