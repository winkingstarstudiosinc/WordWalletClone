import React, {useState, useEffect} from 'react';
import {View, Text, Alert, Button, TouchableOpacity} from 'react-native';
import {useStorage} from './StorageContext';
import AlliterationDefinition from './AlliterationDefinition';
import AlliterationList from './AlliterationList';
import AlliterationInput from './AlliterationInput';
import LetterNavigation from './LetterNavigation';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentAlliteration({ onBack, commonColor, discoveredColor, createTextColor, buttonColor, addTurquoiseButton }) {
  const [alliterations, setAlliterations] = useState([]); // Global list of alliterations
  const [localAlliterations, setLocalAlliterations] = useState(
    Array(26).fill([]),
  ); // Grouped by letter
  const [currentLetter, setCurrentLetter] = useState(0); // Selected letter index
  const [editingIndex, setEditingIndex] = useState(-1); // Index for editing
  const [tempAlliteration, setTempAlliteration] = useState(''); // Temporary alliteration for editing
  const [startingLetter, setStartingLetter] = useState('A'); // Letter navigation
  const [inputAlliteration, setInputAlliteration] = useState(''); // Input for new alliteration
  const [selectedOption, setSelectedOption] = useState('Common'); // Dropdown selection
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List'); // Display mode: List or Notes
  const [editorContent, setEditorContent] = useState(''); // Tracks content of DeviceQuill
  const {loadStoredData, saveData} = useStorage();
  const classIdentifier = 'AlliterationWords'; // Unique identifier for storage
  const [lastSavedAlliterations, setLastSavedAlliterations] = useState(null); // Tracks last saved state
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type for new fusions
  const [isEditing, setIsEditing] = useState(false);

  // Load alliterations from storage on mount
  useEffect(() => {
    loadStoredData(classIdentifier).then(data => {
      if (data && Array.isArray(data)) {
        setAlliterations(data);
      } else {
        setAlliterations([]); // Ensure it's initialized as an empty array
      }
    });
  }, [classIdentifier]);

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

    // Normalize input to ensure case consistency and remove excess spaces
    const normalizedTerm = inputAlliteration.trim().toLowerCase();
    const capitalizedTerm =
      normalizedTerm.charAt(0).toUpperCase() + normalizedTerm.slice(1); // Capitalize first letter

    // Dynamically set color based on the selectedOption
    const newAlliterationStyle = {
      color:
        selectedOption === 'Common'
          ? commonColor
          : selectedOption === 'Discovered'
            ? discoveredColor
            : createTextColor,
    };

    const newAlliteration = {
      term: capitalizedTerm, // Ensure first letter is uppercase
      type: 'alliteration',
      textType: selectedOption, // Use selectedOption for new entries
    };

    // Check if the alliteration already exists before adding
    const isDuplicate = alliterations.some(
      alliteration =>
        alliteration.term.trim().toLowerCase() ===
          newAlliteration.term.trim().toLowerCase() &&
        alliteration.textType === newAlliteration.textType,
    );

    console.log('Duplicate check result:', isDuplicate); // Debug log

    if (isDuplicate) {
      Alert.alert('Shchucks!', 'Looks like we got a doppelganger :/');
    } else {
      // Add the alliteration with the dynamic style
      setAlliterations(prevAlliterations => [
        ...prevAlliterations,
        {...newAlliteration, style: newAlliterationStyle},
      ]);
      setInputAlliteration(''); // Reset the input field
    }
  };

  const onEditInit = (index, text) => {
    console.log('Initializing edit for index:', index, 'Text:', text); // Debug log
    setEditingIndex(index);
    setTempAlliteration(text);
  };

  // Handle deleting an alliteration
  const onDelete = index => {
    setAlliterations(prevAlliterations => {
      const updatedAlliterations = prevAlliterations.filter(
        (_, i) => i !== index,
      );
      return updatedAlliterations;
    });

    console.log('Updated Alliterations after delete:', alliterations);
  };

  const onEditSave = index => {
    setIsEditing(true); // Start editing process

    const updatedAlliterations = [...alliterations];
    const wordToEdit = updatedAlliterations[index];

    // Special handling for the first entry
    if (!wordToEdit && index === 0) {
      console.log('First entry detected during edit.');
      updatedAlliterations[index] = {
        term: tempAlliteration,
        type: 'alliteration',
      };
    } else if (wordToEdit) {
      updatedAlliterations[index] = {
        ...wordToEdit,
        term: tempAlliteration, // Update only the term
      };
    }

    setAlliterations(updatedAlliterations);

    console.log('Before edit:', alliterations);
    console.log('After edit:', updatedAlliterations);

    setEditingIndex(-1);
    setTempAlliteration('');

    setTimeout(() => setIsEditing(false), 200); // End editing process after 200ms to ensure stability
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

  const handleSaveEditorContent = () => {
    if (!editorContent.trim()) {
      Alert.alert(
        'Beep beep beep!',
        'Have you thought about entering some goods first?',
      );
      return;
    }
    saveData('AlliterationNotes', editorContent)
      .then(() => {})
      .catch(err => console.error('Failed to save notes:', err));
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
      updatedAlliterations[index] = {
        ...updatedAlliterations[index],
        textType: newTextType,
        style: {
          color:
            newTextType === 'Common'
              ? commonColor
              : newTextType === 'Discovered'
                ? discoveredColor
                : createTextColor,
        },
      };
      setAlliterations(updatedAlliterations); // Update the list with the new text type
      setSelectedTextType(newTextType); // Sync the selected text type
    }
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
