import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useFirebase, db } from './FirebaseProvider';
import { useStorage } from './StorageContext';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function DeviceArea({ onChangeDevice, buttonColor }) {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [note, setNote] = useState('');
  const [existingNoteId, setExistingNoteId] = useState(null);
  const { editNote, quillEntries, addNote } = useFirebase();
  const { saveData, loadStoredData } = useStorage();

  const noteKey = 'MiscellaneousNote';

  useEffect(() => {
    const fetchSavedNote = async () => {
      try {
        const savedNote = await loadStoredData(noteKey);
        if (savedNote) {
          setNote(savedNote);
          console.log('📂 Loaded note from AsyncStorage:', savedNote);
        } else {
          console.log('⚠️ No local note found in AsyncStorage.');
        }
      } catch (error) {
        console.error('❌ Error loading note from AsyncStorage:', error);
      }
    };

    fetchSavedNote();
  }, []);

  useEffect(() => {
    const loadNoteOnMount = async () => {
      try {
        console.log('🔄 Fetching latest note from Firestore on mount...');
        const snapshot = await db.collection('quilllists')
          .where('type', '==', 'device-note')
          .orderBy('createdAt', 'desc')
          .limit(1)
          .get();

        if (!snapshot.empty) {
          const latestNote = snapshot.docs[0].data();
          setNote(latestNote.content || '');
          setExistingNoteId(snapshot.docs[0].id);
          console.log('✅ Latest device-note loaded from Firestore:', latestNote.content);
          await saveData(noteKey, latestNote.content || '');
        } else {
          console.log('⚠️ No device-note found in Firestore, keeping note empty.');
        }
      } catch (error) {
        console.error('❌ Error fetching latest device-note from Firestore:', error);
      }
    };

    loadNoteOnMount();
  }, []);

  useEffect(() => {
    if (quillEntries.length > 0) {
      const existingNote = quillEntries.find(entry => entry.type === 'device-note');

      if (existingNote) {
        if ((existingNote.content || '').trim() !== (note || '').trim()) {
          setNote(existingNote.content || '');
          setExistingNoteId(existingNote.id);
          console.log('🔥 Loaded device-note from Firestore:', existingNote.content);
          saveData(noteKey, existingNote.content || '');
          console.log('💾 Synced Firestore device-note to AsyncStorage.');
        }
      } else {
        console.log('⚠️ No existing device-note found in Firestore.');
      }
    }
  }, [quillEntries]);

  const handleSaveNote = async () => {
    try {
      console.log('📝 Saving device-note:', note);

      if (existingNoteId) {
        await editNote(existingNoteId, {
          content: note.trim(),
          device: selectedDevice,
          type: 'device-note'
        });
        console.log('✅ Device-note updated in Firestore.');
      } else {
        const newNote = {
          content: note.trim(),
          device: selectedDevice,
          type: 'device-note'
        };
        const newNoteId = await addNote(newNote);

        if (newNoteId) {
          setExistingNoteId(newNoteId);
          console.log('🆕 New device-note created in Firestore → ID:', newNoteId);
        } else {
          console.warn('⚠️ Failed to retrieve Firestore ID after creating new device-note.');
        }
      }

      await saveData(noteKey, note.trim());
      console.log('💾 Device-note saved to AsyncStorage.');
      setNote(note.trim());

      Alert.alert('Success!', 'Your note has been saved to the cloud and offline storage!');
    } catch (error) {
      console.error('🔥 Error saving device-note:', error);
      Alert.alert('Error', 'Failed to save your note.');
    }
  };

  return (
    <View style={styles.deviceArea}>
      <Picker
        selectedValue={selectedDevice}
        style={[styles.dropdownList, { borderColor: buttonColor, borderWidth: 2 }]}
        onValueChange={device => {
          console.log('Device Selected:', device);
          setSelectedDevice(device);
          onChangeDevice(device);
        }}
      >
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
        style={[styles.deviceTextarea, { borderColor: buttonColor, borderWidth: 3 }]}
        value={note}
        onChangeText={setNote}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            backgroundColor: buttonColor,
            borderColor: 'black',
            borderWidth: 1,
            padding: wp(2.0),
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: wp(1.3),
          }}
          onPress={handleSaveNote}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Save Note</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: wp(5.3),
    bottom: hp(4.0),
    marginTop: isMediumTallPhone ? hp(4.25) : isCompactMediumPhone ? hp(4.25) : isSmallPhone ? hp(4.25) : isGalaxySPhone ? hp(3.65) : null,
    position: 'relative',
    width: wp(35),
  },
  deviceArea: {
    width: '100%',
  },
  deviceTextarea: {
    width: '100%',
    height: isMediumTallPhone ? hp(40) : isCompactMediumPhone ? hp(35) : isSmallPhone ? hp(34) : isGalaxySPhone ? hp(42) : null,
    borderWidth: wp(0.5),
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: hp(1),
    borderRadius: wp(1.3),
    paddingHorizontal: wp(2.6),
    textAlignVertical: 'top',
  },
  dropdownList: {
    backgroundColor: 'white',
    borderRadius: wp(4),
    fontSize: wp(2.6),
    marginBottom: hp(1.5),
    overflow: 'hidden',
    width: wp(50),
  },
});

export default DeviceArea;
