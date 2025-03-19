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
import { useFirebase, db } from './FirebaseProvider'; // ✅ Use Firestore
import { useStorage } from './StorageContext'; // ✅ Use AsyncStorage
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function DeviceArea({ onChangeDevice, buttonColor }) {
    const [selectedDevice, setSelectedDevice] = useState('');
    const [note, setNote] = useState('');
    const [existingNoteId, setExistingNoteId] = useState(null); // ✅ Track Firestore document ID
    const { editNote, quillEntries, addNote } = useFirebase(); // ✅ Include addWord for first-time saves
    const { saveData, loadStoredData } = useStorage(); // ✅ Use AsyncStorage

    const noteKey = 'MiscellaneousNote'; // Key for AsyncStorage

    // 🔥 Load note from AsyncStorage first, then update with Firestore
    useEffect(() => {
      const fetchSavedNote = async () => {
          try {
              const savedNote = await loadStoredData(noteKey);
              if (savedNote) {
                  setNote(savedNote); // ✅ Load from AsyncStorage first
                  console.log('📂 Loaded note from AsyncStorage:', savedNote);
              } else {
                  console.log('⚠️ No local note found in AsyncStorage.');
              }
          } catch (error) {
              console.error('❌ Error loading note from AsyncStorage:', error);
          }
      };
  
      fetchSavedNote();
  }, []); // ✅ Runs once when the component mounts
  
  // 🔥 Load latest note from Firestore on mount
  useEffect(() => {
      const loadNoteOnMount = async () => {
          try {
              console.log("🔄 Fetching latest note from Firestore on mount...");
  
              const snapshot = await db.collection('quilllists')
                  .orderBy("createdAt", "desc")
                  .limit(1)
                  .get();
  
              if (!snapshot.empty) {
                  const latestNote = snapshot.docs[0].data();
                  setNote(latestNote.content || ""); // ✅ Set the latest note
                  setExistingNoteId(snapshot.docs[0].id);
  
                  console.log("✅ Latest note loaded from Firestore:", latestNote.content);
  
                  // ✅ Persist Firestore data into AsyncStorage for offline use
                  await saveData(noteKey, latestNote.content || "");
              } else {
                  console.log("⚠️ No notes found in Firestore, keeping note empty.");
              }
          } catch (error) {
              console.error("❌ Error fetching latest note from Firestore:", error);
          }
      };
  
      loadNoteOnMount();
  }, []); // ✅ Ensures Firestore note loads immediately on mount
  
  useEffect(() => {
      if (quillEntries.length > 0) {
          const existingNote = quillEntries.find(entry => entry.type === 'note');
  
          if (existingNote) {
              // ✅ Prevent unnecessary overwrites
              if ((existingNote.content || "").trim() !== (note || "").trim()) { 
                  setNote(existingNote.content || ""); // ✅ Ensure `note` is always a string
                  setExistingNoteId(existingNote.id);
                  console.log('🔥 Loaded note from Firestore:', existingNote.content);
  
                  // ✅ Persist Firestore data into AsyncStorage
                  saveData(noteKey, existingNote.content || "");
                  console.log('💾 Synced Firestore note to AsyncStorage.');
              }
          } else {
              console.log('⚠️ No existing note found in Firestore.');
          }
      }
  }, [quillEntries]); // ✅ Runs whenever Firestore updates
  
  // 🔥 Save note to Firestore & AsyncStorage
  const handleSaveNote = async () => {
      try {
          console.log('📝 Saving note:', note);
  
          if (existingNoteId) {
              // ✅ Update existing note in Firestore (preventing disappearance)
              await editNote(existingNoteId, { content: note.trim(), device: selectedDevice });
              console.log('✅ Note updated in Firestore.');
          } else {
              // ✅ First-time save → Create new note in Firestore
              const newNote = { content: note.trim(), device: selectedDevice, type: 'note' };
              const newNoteId = await addNote(newNote); // ✅ Create only once!
  
              if (newNoteId) {
                  setExistingNoteId(newNoteId); // ✅ Ensure new note is recognized
                  console.log('🆕 New note created in Firestore → ID:', newNoteId);
              } else {
                  console.warn("⚠️ Failed to retrieve Firestore ID after creating new note.");
              }
          }
  
          // ✅ Save to AsyncStorage (ensuring offline persistence)
          await saveData(noteKey, note.trim());
          console.log('💾 Note saved to AsyncStorage.');
  
          // ✅ 🔥 Prevent Text Disappearance by keeping state unchanged
          setNote(note.trim()); // Reinforce that the text remains after saving
  
          Alert.alert('Success!', 'Your note has been saved to the cloud and offline storage!');
      } catch (error) {
          console.error('🔥 Error saving note:', error);
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
