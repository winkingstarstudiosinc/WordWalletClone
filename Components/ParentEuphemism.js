import React, {useState, useEffect} from 'react';
import {useStorage} from './StorageContext';
import {RadioButton} from 'react-native-paper';
import EuphemismDefinition from './EuphemismDefinition';
import EuphemismList from './EuphemismList';
import EuphemismInput from './EuphemismInput';
import DeviceBackButton from './DeviceBackButton';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import DeviceQuill from './DeviceQuill';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentEuphemism({ onBack, commonColor, addTurquoiseButton, discoveredColor, createTextColor, buttonColor }) {
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
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for Fusion Forms
  const {loadStoredData, saveData} = useStorage(); // Updated destructure for storage
  const [entries, setEntries] = useState([]); // Initialize with empty array
  const [lastSavedEntries, setLastSavedEntries] = useState(null); // Track the last saved state
  const classIdentifier = 'euphemismWords'; // Unique identifier for this component
  const [radioSelection, setRadioSelection] = useState('');
  const [notesOption, setNotesOption] = useState('Null');

  // Load entries from AsyncStorage
  useEffect(() => {
    loadStoredData(classIdentifier).then(data => {
      setEntries(data); // Load Wit & Wisdom entries
    });
  }, [classIdentifier]);

  // Save entries to AsyncStorage whenever they change
  useEffect(() => {
    if (
      entries.length > 0 &&
      JSON.stringify(entries) !== JSON.stringify(lastSavedEntries)
    ) {
      saveData(classIdentifier, entries); // Save only if entries have changed
      setLastSavedEntries(entries); // Update the last saved state
    }
  }, [entries, saveData, classIdentifier, lastSavedEntries]);

  // Fix: Prevent repeated loading of notes content
  useEffect(() => {
    if (displayMode === 'Notes' && editorContent === '') {
      // Only load content if it's empty
      loadStoredData('EuphemismNotes')
        .then(data => {
          setEditorContent(data || ''); // Set content once
          console.log('Data loaded for EuphemismNotes:', data);
        })
        .catch(err => console.error('Error loading EuphemismNotes:', err));
    }
  }, [displayMode, loadStoredData, editorContent]); // Added editorContent as a dependency

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

    if (typeof editorContent !== 'string' || !editorContent.trim()) {
      Alert.alert(
        'Careful there, wordsmith,',
        "we're lacking words to save. Please feel free to write some down.",
      );
      return;
    }

    saveData('EuphemismNotes', editorContent)
      .then(() => {
        console.log('Notes saved successfully:', editorContent);
        Alert.alert(
          'Bravo, lad or lassy!',
          'Your notes have been successfully saved!',
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: wp(5.2), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{position: 'relative', bottom: '3.75%'}}>
            <EuphemismDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
              height: isMediumTallPhone ? '53%' : isCompactMediumPhone ? '48%' : isSmallPhone ? '48%' : isGalaxySPhone ? '53.5%' : null,
              maxHeight: hp(62.5),
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <EuphemismList
              editingIndex={editingIndex}
              editTempEntry={tempEntry}
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
              marginVertical: hp(1.5),
            }}>
            <View style={{position: 'relative', top:isMediumTallPhone ? null : isCompactMediumPhone ? '3.0%' : isSmallPhone ? '3.8%' : null, height: hp(8.5), width: '50%'}}>
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
              onValueChange={newValue => setRadioSelection(newValue)}>
              <View style={{ position: 'relative', left: '35%', top: isMediumTallPhone ? '10%' : isCompactMediumPhone ? '10%' : isSmallPhone ? '10%' : isGalaxySPhone ? '10%' : null }}>
                <View
                  style={{
                    position: 'relative',
                    right: '25%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      position: 'relative',
                      right: '15%',
                      color: 'white',
                    }}>
                    Positivee
                  </Text>
                  <RadioButton backgroundColor={'white'} value={'Positive'} />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      position: 'relative',
                      right: '15%',
                      color: 'white',
                    }}>
                    Negativee
                  </Text>
                  <RadioButton backgroundColor={'white'} value={'Negative'} />
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={{position: 'relative', bottom: '5%'}}>
            <View
              style={{
                position: 'relative',
                bottom: '5%',
                marginTop: '4%',
                borderColor: 'black',
              }}>
              <EuphemismInput
                entryPair={newEntry}
                setNewEntry={setNewEntry}
                onAdd={handleAddEntry}
                addTurquoiseButton={addTurquoiseButton}
              />
            </View>
            <View>
              <TouchableOpacity
                style={{
                  backgroundColor: 'ivory',
                  padding: isMediumTallPhone ? wp(1.9) : isCompactMediumPhone ? wp(1.75) : isSmallPhone ? wp (1.75) : isGalaxySPhone ? wp(1.9) : null,
                  borderRadius: wp(2.3),
                  borderColor: 'black',
                  borderWidth: 1,
                  alignItems: 'center',
                  width: '35%',
                  bottom: isMediumTallPhone ? '21%' : isCompactMediumPhone ? '35.5%' : isSmallPhone ? '25.5%' : isGalaxySPhone ? '21%' : null,
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
                top: isMediumTallPhone ? '18%' : isCompactMediumPhone ? '15.76%' : isSmallPhone ? '19.75%' : isGalaxySPhone ? '18%' : null,
                bottom: '5%',
                marginTop: '4%',
              }}>
              <View
                style={{
                  position: 'relative',
                  bottom: '142%',
                  borderRadius: 5,
                  left: '2%',
                }}>
                <DeviceBackButton
                  style={{
                    borderRadius: wp(4),
                    borderColor: 'black',
                    borderWidth: wp(0.3),
                  }}
                  onBack={onBack}
                  buttonColor={buttonColor}
                />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom: '193%',
                  left: '113%',
                  width: '30%',
                  overflow: 'hidden',
                  borderRadius: wp(2.3),
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: buttonColor,
                    padding: wp(2.3),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: wp(2.6),
                    borderWidth: wp(0.3),
                    borderColor: 'black',
                  }}
                  onPress={() => {
                    saveData(classIdentifier, entries)
                      .then(() => {
                        console.log('List saved successfully:', entries); // Debug log
                        Alert.alert(
                          'Saved',
                          'Your wit & wisdoms list has been saved!',
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
                marginBottom: isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp(.1) : isSmallPhone ? hp(0.1) : isGalaxySPhone ? hp(0.25) : null,
                backgroundColor: 'white',
                borderRadius: wp(4),
                bottom: '1.75%',
              }}>
              <Text>Write down your euphemism notes here </Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(62) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(58.5) : isGalaxySPhone ? hp(66) : null }}>            
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              storageKey={'EuphemismNotes'}
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
                  bottom: isMediumTallPhone ? '3.75%' : isCompactMediumPhone ? '8.75%' : isSmallPhone ? '8.75%' : isGalaxySPhone ? '8.50%' : null,
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
                    borderRadius: 10, // Matches the view's borderRadius for a cohesive look
                  }}
                  onPress={handleSaveEditorContent}>
                  <Text style={{color: 'white', fontWeight: 'bold'}}>
                    Save Notes
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{ position: 'relative', right: '35%', bottom: isMediumTallPhone ? '30.75%' : isCompactMediumPhone ? '35.5%' : isSmallPhone ? '35.5%' : isGalaxySPhone ? '33.75%' : null }}>
                <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentEuphemism;
