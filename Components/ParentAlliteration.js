import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Alert, Button, TouchableOpacity} from 'react-native';
import { useStorage } from './StorageContext';
import AlliterationDefinition from './AlliterationDefinition';
import AlliterationList from './AlliterationList';
import AlliterationInput from './AlliterationInput';
import LetterNavigation from './LetterNavigation';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import { useFirebase, db } from './FirebaseProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentAlliteration({ onBack, commonColor, discoveredColor, createTextColor, buttonColor, addTurquoiseButton }) {
  const { alliterations, setAlliterations, addAlliteration, editAlliteration, deleteAlliteration } = useFirebase();
  const [localAlliterations, setLocalAlliterations] = useState(
    Array(26).fill([]),
  ); 
  const [currentLetter, setCurrentLetter] = useState(0); // Selected letter index
  const [editingIndex, setEditingIndex] = useState(-1); // Index for editing
  const [tempAlliteration, setTempAlliteration] = useState(''); // Temporary alliteration for editing
  const [startingLetter, setStartingLetter] = useState('A'); // Letter navigation
  const [inputAlliteration, setInputAlliteration] = useState(''); // Input for new alliteration
  const [selectedOption, setSelectedOption] = useState('Common'); // Dropdown selection
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List'); // Display mode: List or Notes
  const [editorContent, setEditorContent] = useState(''); // Tracks content of DeviceQuill
  const classIdentifier = 'AlliterationWords'; // Unique identifier for storage
  const [lastSavedAlliterations, setLastSavedAlliterations] = useState(null); // Tracks last saved state
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type for new fusions
  const [isEditing, setIsEditing] = useState(false);
  const [editingAlliterationId, setEditingAlliterationId] = useState(null);
  const [newAlliteration, setNewAlliteration] = useState('');
  const lastSavedAlliterationsRef = useRef([]);
  const { addNote, editNote, quillEntries } = useFirebase();
  const { saveData, loadStoredData } = useStorage();

// 🧠 Tracks the ID of an existing Firestore note
const [existingNoteId, setExistingNoteId] = useState(null);


  const deepEqual = (a, b) => {
    if (a === b) {
      return true;
    }
    if (
      typeof a !== 'object' ||
      typeof b !== 'object' ||
      a == null ||
      b == null
    ) {
      return false;
    }
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  };



  // Load alliterations from storage on mount
  useEffect(() => {
    const loadAlliterations = async () => {
      try {
        const storedData = await AsyncStorage.getItem(classIdentifier);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData)) {
            setAlliterations(parsedData);
            console.log('📜 Loaded alliterations from AsyncStorage.');
          }
        }
      } catch (error) {
        console.error('❌ Error loading alliterations from AsyncStorage:', error);
      }
    };
  
    loadAlliterations();
  }, []);



  useEffect(() => {
    if (
      JSON.stringify(alliterations) !== JSON.stringify(lastSavedAlliterations)
    ) {
      saveData(classIdentifier, alliterations);
      setLastSavedAlliterations(alliterations);
    }
  }, [alliterations, saveData, classIdentifier, lastSavedAlliterations]);

  // Update local alliterations grouped by letters when global list changes
  useEffect(() => {
    if (!isEditing && editingIndex === -1) {
      console.log('Grouping triggered.');
      const groupedAlliterations = Array.from({length: 26}, (_, i) =>
        alliterations.filter(
          alliteration =>
            alliteration.term &&
            alliteration.term[0].toUpperCase() === String.fromCharCode(65 + i),
        ),
      );
      setLocalAlliterations(groupedAlliterations);
    }
  }, [alliterations, isEditing, editingIndex]);



  useEffect(() => {
    const fetchAlliterationsFromFirebase = async () => {
      try {
        const alliterationSnapshot = await db
          .collection('wordlists')
          .where('type', '==', 'alliterations')
          .orderBy('createdAt', 'desc')
          .get();
  
        const alliterationList = alliterationSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setAlliterations(alliterationList);
        await AsyncStorage.setItem('alliterationFormsData', JSON.stringify(alliterationList));
  
        console.log('🌿 Alliterations successfully fetched and stored.');
      } catch (error) {
        console.error('❌ Error fetching alliterations from Firestore:', error);
      }
    };
  
    fetchAlliterationsFromFirebase();
  }, []);



  useEffect(() => {
    if (hasAlliterationChanged()) {
      saveData(classIdentifier, alliterations)
        .then(() => {
          lastSavedAlliterationsRef.current = [...alliterations];
          setLastSavedAlliterations([...alliterations]);
        });
    }
  }, [alliterations, saveData, classIdentifier]);


  useEffect(() => {
    const loadLatestAlliterationNote = async () => {
      try {
        console.log("🔄 Fetching latest alliteration note from Firestore on mount...");
  
        const snapshot = await db.collection('quilllists')
          .where("type", "==", "alliterationnotes") // 🔑 Filter by type
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();
  
        if (!snapshot.empty) {
          const latestNote = snapshot.docs[0].data();
          setEditorContent(latestNote.content || "<p><br></p>");
          setExistingNoteId(snapshot.docs[0].id);
          console.log("✅ Loaded alliteration note from Firestore:", latestNote.content);
  
          await saveData('AlliterationNotes', latestNote.content || "<p><br></p>");
          console.log("💾 Synced rich text note to AsyncStorage.");
        } else {
          console.log("⚠️ No alliteration notes found in Firestore.");
        }
      } catch (error) {
        console.error("❌ Error fetching alliteration note from Firestore:", error);
      }
    };
  
    loadLatestAlliterationNote();
  }, []);


  useEffect(() => {
    if (quillEntries.length > 0) {
      const existingNote = quillEntries.find(entry => entry.type === 'alliterationnotes'); // 🔑 Type filter
  
      if (existingNote && existingNote.content.trim() !== editorContent.trim()) {
        setEditorContent(existingNote.content || "<p><br></p>");
        setExistingNoteId(existingNote.id);
  
        saveData('AlliterationNotes', existingNote.content || "<p><br></p>");
        console.log('💾 Synced rich text note from Firestore into AsyncStorage.');
      }
    }
  }, [quillEntries]);


  // Handle adding a new alliteration
  const handleAddClick = () => {
    console.log('Adding new alliteration:', inputAlliteration, selectedOption); // Debug log
  
    if (inputAlliteration.charAt(0).toUpperCase() !== startingLetter) {
      Alert.alert(
        'Ooops...',
        'Letter must start with the selected letter. Gentle reminder: this is an alliteration. Please see definition at the top.',
      );
      return;
    }
  
    const normalizedTerm = inputAlliteration.trim().toLowerCase();
    const capitalizedTerm =
      normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1);
  
    const newAlliterationStyle = {
      color:
        selectedOption === 'Common'
          ? commonColor
          : selectedOption === 'Discovered'
            ? discoveredColor
            : createTextColor,
    };
  
    const newAlliterationEntry = {
      term: capitalizedTerm,
      textType: selectedOption,
      style: newAlliterationStyle,
      category: selectedOption,
      type: 'alliterations',
    };
  
    // Check for duplicate
    const isDuplicate = alliterations.some(
      alliteration =>
        alliteration.term.trim().toLowerCase() ===
          newAlliterationEntry.term.trim().toLowerCase() &&
        alliteration.textType === newAlliterationEntry.textType,
    );
  
    console.log('Duplicate check result:', isDuplicate);
  
    if (isDuplicate) {
      Alert.alert('Shchucks!', 'Looks like we got a doppelganger :/');
    } else {
      addAlliteration(newAlliterationEntry).then(savedAlliteration => {
        if (savedAlliteration) {
          console.log('✅ Alliteration successfully saved to Firestore:', savedAlliteration);
          // 🔄 No need to update state here — snapshot listener will handle it
        }
      });
  
      setInputAlliteration('');
    }
  };




  const onEditInit = (index, text, id) => {
    console.log('Initializing edit for index:', index, 'Text:', text, 'ID:', id); // Debug log
    setEditingIndex(index);
    setTempAlliteration(text);
    setSelectedTextType(alliterations[index].textType || 'Common');
    setEditingAlliterationId(id); // 🔗 Firestore ID
  };


  // Handle deleting an alliteration
  const onDelete = index => {
    const itemToDelete = alliterations[index];
  
    if (!itemToDelete?.id) {
      console.warn("⚠️ No Firestore ID found for selected alliteration.");
      return;
    }
  
    // 🔥 Firestore deletion
    deleteAlliteration(itemToDelete.id);
  
    // 🧼 Local state update for immediate UI response
    setAlliterations(prevAlliterations =>
      prevAlliterations.filter((_, i) => i !== index)
    );
  
    console.log(`🗑️ Deleted Alliteration at index ${index}, ID: ${itemToDelete.id}`);
  };



  const onEditSave = index => {
    if (editingIndex === null || editingAlliterationId === null) return;
  
    setIsEditing(true); // Start editing process
  
    const updatedAlliterations = [...alliterations];
    const wordToEdit = updatedAlliterations[index];
  
    const updatedAlliteration = {
      ...wordToEdit,
      term: tempAlliteration,
      textType: selectedTextType,
      style: {
        ...wordToEdit?.style,
        color:
          selectedTextType === 'Common'
            ? commonColor
            : selectedTextType === 'Discovered'
              ? discoveredColor
              : createTextColor,
      },
    };
  
    updatedAlliterations[index] = updatedAlliteration;
    setAlliterations(updatedAlliterations);
  
    // 🔥 Firestore update
    editAlliteration(editingAlliterationId, updatedAlliteration);
  
    console.log('📜 Before edit:', alliterations);
    console.log('✅ After edit:', updatedAlliterations);
  
    setEditingIndex(-1);
    setEditingAlliterationId(null);
    setTempAlliteration('');
  
    setTimeout(() => setIsEditing(false), 200); // Graceful exit from edit mode
  };

  const handleDropdownChange = (value, dropdownType) => {
    console.log(`${dropdownType} Dropdown changed to:`, value);

    if (dropdownType === 'Notes') {
      setNotesOption(value);
      if (value !== 'Null' && displayMode === 'Notes') {
        setTimeout(() => {
          setDisplayMode('List');
          setSelectedOption(value);
          setSelectedTextType(value); // Update selectedTextType here
          console.log(
            'Reverting to List mode and syncing selectedOption with NotesDropdown selection:',
            value,
          );
        }, 100);
      }
    } else if (dropdownType === 'Device') {
      setSelectedOption(value);
      setSelectedTextType(value); // Update selectedTextType based on Device selection
      if (displayMode === 'Notes') {
        setTimeout(() => {
          setNotesOption(value);
          console.log(
            'Syncing NotesDropdown with DeviceDropdown selection:',
            value,
          );
        }, 100);
      }
    }
  };

  const handleSaveEditorContent = async () => {
    console.log('Attempting to save editor content:', editorContent);
  
    if (
      typeof editorContent !== 'string' ||
      !editorContent.trim() ||
      editorContent === '<p><br></p>'
    ) {
      Alert.alert(
        'Careful there, wordsmith,',
        "we're lacking words to save. Please feel free to write some down.",
      );
      return;
    }
  
    try {
      // 🔥 Firestore Save
      if (existingNoteId) {
        await editNote(existingNoteId, { content: editorContent.trim() });
        console.log('✅ Rich text note updated in Firestore.');
      } else {
        const newNote = {
          content: editorContent.trim(),
          type: 'alliterationnotes', // 🔑 Alliteration Notes Identifier
        };
        const newNoteId = await addNote(newNote);
  
        if (newNoteId) {
          setExistingNoteId(newNoteId);
          console.log('🆕 New alliteration note created in Firestore → ID:', newNoteId);
        } else {
          console.warn("⚠️ Failed to retrieve Firestore ID after creating new note.");
        }
      }
  
      // 💾 AsyncStorage Save
      await saveData('AlliterationNotes', editorContent.trim());
      console.log('💾 Alliteration note saved to AsyncStorage.');
  
      Alert.alert(
        'Bravo, bard!',
        'Your alliterative musings have been preserved in both the cloud and the scroll.',
      );
    } catch (err) {
      console.error('🔥 Failed to save alliteration notes:', err);
      Alert.alert('Oh no!', 'Something went wrong saving your notes.');
    }
  };

  const handleBackOne = () => {
    setDisplayMode('List'); // Resets to device view
  };

  const handleStateChange = () => {
    console.log('Switching to Notes mode...');

    // Resetting necessary states when entering Notes
    setNotesOption('Null'); // Or your desired default
    setDisplayMode('Notes');
  };

  const onSelectLetter = letter => {
    setStartingLetter(letter.toUpperCase()); // Update startingLetter on button press
    setCurrentLetter(letter.charCodeAt(0) - 'A'.charCodeAt(0)); // Update currentLetter state
    setSelectedTextType('Common'); // Reset text type to the last used one in the group
    setSelectedOption('Common'); // Reset option to default

    // Add logic to reset any necessary states to prevent duplicate when switching letters
    setEditingIndex(-1); // Reset editing index to prevent incorrect state when switching
  };

  const handleTextTypeChange = (newTextType, index) => {
    if (editingIndex === index) {
      const updatedAlliterations = [...alliterations];
      const updatedAlliteration = {
        ...updatedAlliterations[editingIndex],
        textType: newTextType,
        style: {
          ...updatedAlliterations[editingIndex].style,
          color:
            newTextType === 'Common'
              ? commonColor
              : newTextType === 'Discovered'
                ? discoveredColor
                : createTextColor,
        },
      };
  
      updatedAlliterations[editingIndex] = updatedAlliteration;
      setAlliterations(updatedAlliterations);
      setSelectedTextType(newTextType);
  
      // 🔥 Firestore sync if editing a saved entry
      if (editingAlliterationId) {
        editAlliteration(editingAlliterationId, {
          textType: newTextType,
          style: updatedAlliteration.style,
        });
      }
    }
  };

  const hasAlliterationChanged = () => {
    if (alliterations.length !== lastSavedAlliterationsRef.current.length) {
      return true;
    }
    for (let i = 0; i < alliterations.length; i++) {
      if (!deepEqual(alliterations[i], lastSavedAlliterationsRef.current[i])) {
        return true;
      }
    }
    return false;
  };

  return (
    <View style={{padding: wp(4), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{postion: 'relative', bottom: '4%'}}>
            <AlliterationDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
              height: isMediumTallPhone ? '50%' : isCompactMediumPhone ? '45%' : isSmallPhone ? '45%' : isGalaxySPhone ? '50%' : null,
              maxHeight: hp(75),
              position: 'relative',
              right: '2.5%',
              bottom: '5%',
            }}>
            <AlliterationList
              alliterations={localAlliterations[currentLetter]}
              onEditInit={onEditInit}
              onDelete={index => onDelete(index)}
              onEditSave={onEditSave}
              editingIndex={editingIndex}
              tempAlliteration={tempAlliteration}
              setTempAlliteration={setTempAlliteration}
              onTextTypeChange={handleTextTypeChange}
              selectedTextType={selectedTextType}
              commonColor={commonColor}
              discoveredColor={discoveredColor}
              createTextColor={createTextColor}
            />
          </View>
          <View style={{width: '100%', position: 'relative', bottom: '5%'}}>
            <View
              style={{
                position: 'relative',
                height: hp(7.25),
                width: '50%',
                marginBottom: '3.5%',
              }}>
              <DeviceDropdown
                onChange={value => handleDropdownChange(value, 'Device')}
                selectedOption={selectedOption}
                commonColor={commonColor}
                discoveredColor={discoveredColor}
                createTextColor={createTextColor}
              />
            </View>
            <View style={{position: 'relative', right: '3%', bottom: '3%'}}>
              <AlliterationInput
                startingLetter={startingLetter} // Ensure startingLetter is passed down
                inputAlliteration={inputAlliteration}
                onLetterChange={letter =>
                  setStartingLetter(letter.toUpperCase())
                }
                onAlliterationChange={text => setInputAlliteration(text)}
                onAdd={handleAddClick}
                addTurquoiseButton={addTurquoiseButton}
              />
            </View>
            <View
              style={{
                position: 'relative',
                width: '35%',
                borderRadius: '50%',
                left: '32.5%',
                top: isMediumTallPhone ? '32.25%' : isCompactMediumPhone ? '32.25%' : isSmallPhone ? '31.50%' : isGalaxySPhone ? '34.25%' : null,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'ivory',
                  padding: isMediumTallPhone ? wp(2) : isCompactMediumPhone ? wp(2) : isSmallPhone ? wp(1.5) : isGalaxySPhone ? wp(2) : null,
                  marginTop: null,
                  borderRadius: wp(2.3),
                  alignItems: 'center',
                  borderColor: 'black',
                  borderWidth: wp(0.3),
                }}
                onPress={handleStateChange}>
                <Text style={{color: 'black', fontSize: 16}}>Notes </Text>
              </TouchableOpacity>
            </View>
            <View style={{ position: 'relative', bottom: isMediumTallPhone ? '20%' : isCompactMediumPhone ? '18%' : isSmallPhone ? '18%' : isGalaxySPhone ? '20%' : null }}>
              <LetterNavigation
                onSelectLetter={onSelectLetter}
                setCurrentLetter={setCurrentLetter}
              />
            </View>
            <View
              style={{
                position: 'relative',
                right: '40%',
                bottom: isMediumTallPhone ? '6.5%' : isCompactMediumPhone ? '6.5%' : isSmallPhone ? '7.5%' : isGalaxySPhone ? '7.5%' : null,
                marginTop: '4%',
              }}>
              <View
                style={{position: 'relative', bottom: '1%', borderRadius: 5, left:'2.5%'}}>
                <DeviceBackButton buttonColor={buttonColor} style={{borderRadius: 15}} onBack={onBack} />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom: '50.5%',
                  left: '112.5%',
                  width: '30%',
                  overflow: 'hidden',
                  borderRadius: wp(2.3),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: buttonColor,
                    padding: wp(2),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: 'black',
                    borderWidth: wp(0.3),
                  }}
                  onPress={() => {
                    saveData(classIdentifier, alliterations)
                      .then(() => {
                        console.log('List saved successfully:', alliterations); // Debug log
                        Alert.alert(
                          'Safe and sound!',
                          'Relax, bucko, your alliterations list is in the cybersafe. :)',
                        );
                      })
                      .catch(err => console.error('Failed to save list:', err));
                  }}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>Save </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={{height: '104%'}}>
            <View
              style={{
                position: 'relative',
                padding: '2.5%',
                fontSize: 18,
                backgroundColor: 'white',
                borderRadius: 15,
                marginBottom: isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp (0.1) : isSmallPhone ? hp (0.1) : isGalaxySPhone ? hp(0.25) : null,
                bottom: '1.75%',
              }}>
              <Text>Write your alliteration notes and thoughts here </Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(62) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp (58) : isGalaxySPhone ? hp(67.5) : null }}>
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              storageKey="AlliterationNotes"
              buttonColor={buttonColor}
            />
            </View>
            <View>
              <View style={{position: 'relative', bottom: '5.5%'}}>
                <NotesDropdown
                  style={{borderColor: 'black', borderWidth: 1}}
                  onChange={value => handleDropdownChange(value, 'Notes')}
                  selectedOption={notesOption}
                  commonColor={commonColor}
                  discoveredColor={discoveredColor}
                  createTextColor={createTextColor}
                />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom: isMediumTallPhone ? '2.0%' : isCompactMediumPhone ? '6.5%' : isSmallPhone ? '6.5%' : isGalaxySPhone ? '10%' : null,
                  left: '50%',
                  width: '50%',
                  borderRadius: wp(2.3),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: buttonColor, // Button background color
                    borderColor: 'black',
                    borderWidth: wp(0.3),
                    padding: wp(2.3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10, // Matches the view's borderRadius for a cohesive look
                  }}
                  onPress={handleSaveEditorContent}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Save Notes
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{ position: 'relative', right: '35%', bottom: isMediumTallPhone ? '28.50%' : isCompactMediumPhone ? '33.5%' : isSmallPhone ? '31.5%': isGalaxySPhone ? '35.00%' : null }}>
                <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentAlliteration;
