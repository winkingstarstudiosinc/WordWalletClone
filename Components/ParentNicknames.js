import React, {useState, useEffect} from 'react';
import {RadioButton} from 'react-native-paper';
import DeviceBackButton from './DeviceBackButton';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import NicknamesDefinition from './NicknamesDefinition';
import NicknamesList from './NicknamesList';
import NicknamesInput from './NicknamesInput';
import DeviceQuill from './DeviceQuill';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {useStorage} from './StorageContext';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentNicknames({onBack, commonColor, buttonColor, discoveredColor, createTextColor, addTurquoiseButton }) {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({
    firstPart: { text: '', style: {} },
    secondPart: { text: '', style: {} },
    textType: 'Common',  // Default to 'Common'
    category: '',  // Default to empty
});
  const [tempEntry, setTempEntry] = useState({
    firstPart: { text: '', style: {} },
    secondPart: { text: '', style: {} },
    textType: '',
    category: '',
  });
  const [selectedOption, setSelectedOption] = useState('Common');
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [radioSelection, setRadioSelection] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const {loadStoredData, saveData} = useStorage(); // Import storage methods
  const classIdentifier = 'NicknamesWords'; // Unique identifier for this component
  const [lastSavedEntries, setLastSavedEntries] = useState(null); // Track last saved state

  useEffect(() => {
    loadStoredData(classIdentifier).then(data => {
      setEntries(data || []); // Load Nicknames entries or initialize with an empty array
    });
  }, [classIdentifier]);

  // Save data when entries change
  useEffect(() => {
    if (
      entries.length > 0 &&
      JSON.stringify(entries) !== JSON.stringify(lastSavedEntries)
    ) {
      saveData(classIdentifier, entries); // Save only if entries have changed
      setLastSavedEntries(entries); // Update the last saved state
    }
  }, [entries, saveData, classIdentifier, lastSavedEntries]);

  useEffect(() => {
    // Check if we're in 'Notes' mode and editorContent is not yet loaded
    if (displayMode === 'Notes' && !editorContent) {
      loadStoredData('NicknamesNotes')
        .then(data => {
          setEditorContent(data || ''); // Default to empty string if no data
          console.log('Data loaded for NicknamesNotes:', data);
        })
        .catch(err => {
          console.error('Error loading NicknamesNotes:', err);
          setEditorContent(''); // Ensure we handle errors gracefully
        });
    }
  }, [displayMode, loadStoredData, editorContent]);

  const handleAddEntry = () => {
    if (newEntry.firstPart.text.trim() && newEntry.secondPart.text.trim()) {
        const newEntryObject = {
            id: Date.now().toString(),
            firstPart: {
                text: newEntry.firstPart.text,
                style: { fontWeight: 'bold', fontFamily: 'serif', color: selectedOption === 'Common' ? commonColor : selectedOption === 'Discovered' ? discoveredColor : createTextColor },
            },
            secondPart: {
                text: newEntry.secondPart.text,
                style: { fontStyle: 'italic', fontFamily: 'sans-serif', color: selectedOption === 'Common' ? commonColor : selectedOption === 'Discovered' ? discoveredColor : createTextColor },
            },
            textType: selectedOption,
            category: radioSelection,
        };
        setEntries([...entries, newEntryObject]);
        setNewEntry({ firstPart: { text: '', style: {} }, secondPart: { text: '', style: {} } });
        setRadioSelection('');
    }
};

  const handleDelete = id => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleEditSave = id => {
    const updatedEntries = entries.map(entry => {
        if (entry.id === id) {
            const newColor = tempEntry.textType === 'Common'
                ? commonColor
                : tempEntry.textType === 'Discovered'
                    ? discoveredColor
                    : createTextColor;

            return {
                ...entry,
                firstPart: {
                    text: tempEntry.firstPart.text,
                    style: { fontWeight: 'bold', fontFamily: 'serif', color: newColor },  // ✅ Apply new color
                },
                secondPart: {
                    text: tempEntry.secondPart.text,
                    style: { fontStyle: 'italic', fontFamily: 'sans-serif', color: newColor },  // ✅ Apply new color
                },
                textType: tempEntry.textType || entry.textType,  // ✅ Ensure textType updates
                category: tempEntry.category || entry.category,
            };
        }
        return entry;
    });

    setEntries(updatedEntries);
    setEditingIndex(-1);
    setTempEntry({
        firstPart: { text: '', style: {} },
        secondPart: { text: '', style: {} },
        textType: '',
        category: '',
    });
};

  const handleDropdownChange = (value, dropdownType) => {
    console.log(`${dropdownType} Dropdown changed to:`, value);

    if (dropdownType === 'Notes') {
      setNotesOption(value);
      if (value !== 'Null' && displayMode === 'Notes') {
        setDisplayMode('List');
        setSelectedOption(value); // Sync `selectedOption` for textType
        console.log('Syncing selectedOption with NotesDropdown:', value);
      }
    } else if (dropdownType === 'Device') {
      if (displayMode === 'List') {
        setSelectedOption(value); // Update textType for List mode
      }

      if (displayMode === 'Notes') {
        setNotesOption(value); // Sync NotesDropdown with DeviceDropdown
        console.log('Syncing NotesDropdown with DeviceDropdown:', value);
      }
    }
  };

  const onEditInit = (index, firstPart, secondPart, category, textType) => {
    setEditingIndex(index);
    setTempEntry({
        firstPart: { text: firstPart, style: {} },
        secondPart: { text: secondPart, style: {} },
        category,
        textType,
    });
};

  const theme = {
    colors: {
      primary: '#4A90E2', // Set the radio button color
    },
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

  const handleSaveEditorContent = () => {
    console.log('Attempting to save editor content:', editorContent);

    // Ensure editorContent is always a string before calling .trim()
    const content = editorContent ? editorContent.toString() : ''; // Fallback to an empty string if undefined or null

    if (!content.trim()) {
      Alert.alert(
        'Ah schucks,',
        "that looks like a lot of blank space. I'm sure you can think of something! ",
      );
      return;
    }

    saveData('NicknamesNotes', content)
      .then(() => {
        console.log('Notes saved successfully:', content);
        Alert.alert(
          'Hole in one!',
          'Your nickname notes are forever safe and sound now :)',
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: 20, width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{postion: 'relative', bottom: '3.75%'}}>
            <NicknamesDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
              height: isMediumTallPhone ? '53%' : isCompactMediumPhone ? '48%' : isSmallPhone ? '48%' : isGalaxySPhone ? '53%' : null,
              maxHeight: 500,
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <NicknamesList
              editingIndex={editingIndex}
              editTempEntry={tempEntry} // Ensure this is the prop you use
              entries={entries}
              setEditTempEntry={setTempEntry}
              onDelete={handleDelete}
              onEditInit={onEditInit}
              onEditSave={handleEditSave}
              commonColor={commonColor}
              discoveredColor={discoveredColor}
              createTextColor={createTextColor}
            />
          </View>
          <View
            style={{
              position: 'relative',
              marginTop: '1.5%',
              bottom: '10%',
              flexDirection: 'row',
              marginVertical: 10,
            }}>
            <View style={{position: 'relative', top:isMediumTallPhone ? null : isCompactMediumPhone ? '3.0%' : isSmallPhone ? '3%' : isGalaxySPhone ? null : null, height: 65, width: '50%'}}>
              <DeviceDropdown
                selectedOption={selectedOption}
                onChange={value => handleDropdownChange(value, 'Device')}
                commonColor={commonColor}
                discoveredColor={discoveredColor}
                createTextColor={createTextColor}
              />
            </View>
            <RadioButton.Group
              value={radioSelection}
              width={'100%'}
              onValueChange={newValue => setRadioSelection(newValue)}>
              <View
                style={{
                  flexDirection: 'column',
                  position: 'relative',
                  left: '40%',
                  top: isSmallPhone ? hp(1) : isCompactMediumPhone ? hp(1) : null,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      position: 'relative',
                      right: '4%',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        bottom: '10%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Pleasant'}
                      />
                    </View>
                    <View style={{position: 'relative', right: '15%'}}>
                      <Text style={{ position: 'relative', bottom: '80%', fontSize: 10, textAlign: 'center', color: 'white' }}>Poetry </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      left: isMediumTallPhone ? '80%' : isCompactMediumPhone ? '80%' : isSmallPhone ? '80%' : isGalaxySPhone ? '85%' : null,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        bottom: '10%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Snide'}
                      />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ position: 'relative', right: '5%', bottom: '80%', fontSize: 10, color: 'white' }}>Song </Text>
                    </View>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      position: 'relative',
                      left: '5%',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        bottom: '25%',
                        right: '10%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Playful'}
                      />
                    </View>
                    <View>
                      <Text style={{ position: 'relative', right: '25%', bottom: '120%', fontSize: 10, color: 'white' }}>Phrase </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      left: '55%',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        bottom: '25%',
                        left: '30%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Foul'}
                      />
                    </View>
                    <View>
                      <Text style={{ position: 'relative', left: '25%', bottom: '120%', fontSize: 10, color: 'white' }}>Rap </Text>
                    </View>
                  </View>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={{position: 'relative', bottom: '10%'}}>
            <View
              style={{
                position: 'relative',
                bottom: '5%',
                marginTop: '4%',
                borderColor: 'black',
              }}>
              <NicknamesInput
                entryPair={newEntry} // Changed from entryPair to newEntry
                setNewEntry={setNewEntry} // Correct function name to match state handler
                onAdd={handleAddEntry}
                addTurquoiseButton={addTurquoiseButton}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'ivory',
                  padding: isMediumTallPhone ? wp(2.3) : isCompactMediumPhone ? wp(1.75) : isSmallPhone ? wp(1.80) : isGalaxySPhone ? wp(2.3) : null,
                  borderRadius: 5,
                  borderColor: 'black',
                  borderWidth: 1,
                  alignItems: 'center',
                  width: '35%',
                  bottom: isMediumTallPhone ? '12%' : isCompactMediumPhone ? '36.5%' : isSmallPhone ? '50.5%' : isGalaxySPhone ? '12%' : null,
                  left: '32.5%',
                }}
                onPress={handleStateChange}>
                <Text style={{color: 'black', fontSize: 16}}>Notes </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                position: 'relative',
                right: '40%',
                top: isMediumTallPhone ? '21%' : isCompactMediumPhone ? '16.75%' : isSmallPhone ? '17.75%' : isGalaxySPhone ? '19%' : null,
                bottom: '6%',
                marginTop: '4%',
              }}>
              <View
                style={{
                  position: 'relative',
                  bottom: '150%',
                  borderRadius: 5,
                  left: '2%',
                }}>
                <DeviceBackButton buttonColor={buttonColor} style={{borderRadius: 15}} onBack={onBack} />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom:'200%',
                  left: '113%',
                  width: '30%',
                  overflow: 'hidden',
                  borderRadius: wp(2.3),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: buttonColor,
                    padding: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    borderWidth: wp(0.3),
                    borderColor: 'black'
                  }}
                  onPress={() => {
                    saveData(classIdentifier, entries)
                      .then(() => {
                        console.log('List saved successfully:', entries); // Debug log
                        Alert.alert(
                          'Well done!',
                          'Your beautiful nicknames list has been saved!',
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
                fontSize: wp(4.5),
                marginBottom: isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp (0.1) : isSmallPhone ? hp (0.1) : isGalaxySPhone ? hp(0.25) : null,
                backgroundColor: 'white',
                borderRadius: wp(4),
                bottom: '1.75%',
              }}>
              <Text>
                Write down your nickname notes here
              </Text> 
            </View>
            <View style={{ height: isMediumTallPhone ? hp(64) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(58) : isGalaxySPhone ? hp(66) : null }}>
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              storageKey={'NicknamesNotes'}
            />
            </View>
            <View>
              <View style={{position: 'relative', bottom: '6%'}}>
                <NotesDropdown
                  selectedOption={notesOption}
                  onChange={value => handleDropdownChange(value, 'Notes')}
                  commonColor={commonColor}
                  discoveredColor={discoveredColor}
                  createTextColor={createTextColor}
                />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom: isMediumTallPhone ? '1.75%' : isCompactMediumPhone ? '8.0%' : isSmallPhone ? '8.0%' : isGalaxySPhone ? '6.75%' : null,
                  left: '50%',
                  width: '50%',
                  borderRadius: wp(12.5),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: buttonColor, // Button background color
                    borderColor: 'black',
                    borderWidth: wp(0.3),
                    padding: wp(2.3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: wp(2.6), // Matches the view's borderRadius for a cohesive look
                  }}
                  onPress={handleSaveEditorContent}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Save Notes
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{position: 'relative', right: '35%', bottom: isMediumTallPhone ? '28.75%' : isCompactMediumPhone ? '34.5%' : isSmallPhone ? '34.5%' : isGalaxySPhone ? '31.75%' : null}}>
                <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentNicknames;
