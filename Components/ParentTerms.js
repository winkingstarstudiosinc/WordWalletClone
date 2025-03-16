import React, {useState, useEffect} from 'react';
import {RadioButton} from 'react-native-paper';
import DeviceBackButton from './DeviceBackButton';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import TermsDefinition from './TermsDefinition';
import TermsList from './TermsList';
import TermsInput from './TermsInput';
import DeviceQuill from './DeviceQuill';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useStorage} from './StorageContext';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentTerms({onBack, commonColor, buttonColor, discoveredColor, createTextColor, addTurquoiseButton }) {
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
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for Fusion Forms
  const [radioSelection, setRadioSelection] = useState('');
  const {loadStoredData, saveData} = useStorage(); // Import storage methods
  const classIdentifier = 'Termswords'; // Unique identifier for this component
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
    if (displayMode === 'Notes' && editorContent === '') {
      // Only load content if it's empty
      loadStoredData('TermsNotes')
        .then(data => {
          setEditorContent(data || ''); // Set content once
          console.log('Data loaded for TermsNotes:', data);
        })
        .catch(err => console.error('Error loading TermsNotes:', err));
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
                style: { fontStyle: 'italic', fontFamily: 'sans-serif', color: selectedOption === 'Common' ? commonColor : selectedOption === 'Discovered' ? discoveredColor: createTextColor },
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
        setSelectedOption(value); // Sync `selectedOption` with NotesDropdown
        console.log('Syncing selectedOption with NotesDropdown:', value);
      }
    } else if (dropdownType === 'Device') {
      // Set the selectedOption in both modes (List and Notes)
      setSelectedOption(value); // Update textType for Device Dropdown
      console.log('Syncing DeviceDropdown with selectedOption:', value);

      // Sync NotesDropdown with DeviceDropdown if needed
      if (displayMode === 'Notes') {
        setNotesOption(value);
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

  const theme = {
    colors: {
      primary: '#4A90E2', // Set the radio button color
    },
  };

  const handleSaveEditorContent = () => {
    console.log('Attempting to save editor content:', editorContent);

    // Ensure editorContent is always a string before calling .trim()
    const content = editorContent ? editorContent.toString() : ''; // Fallback to an empty string if undefined or null

    if (!content.trim()) {
      Alert.alert(
        'Uh oh,',
        "why don't you try writing something down first, silly sally",
      );
      return;
    }

    saveData('NicknamesNotes', content)
      .then(() => {
        console.log('Notes saved successfully:', content);
        Alert.alert(
          'Excellent!',
          'Your nickname notes have been successfully saved, dear wordsmith!',
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: wp(5.2), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{postion: 'relative', bottom: '3.75%'}}>
            <TermsDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
              height: isMediumTallPhone ? '53%' : isCompactMediumPhone ? '48%' : isSmallPhone ? '48%' : isGalaxySPhone ? '53%' : null,
              maxHeight: hp(62.5),
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <TermsList
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
              marginVertical: hp(1.5),
            }}>
            <View style={{position: 'relative', top:isMediumTallPhone ? null : isCompactMediumPhone ? '3.0%' : isSmallPhone ? '3.0%' : isGalaxySPhone ? null : null, height: hp(8.5), width: '50%'}}>
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
                  top: isMediumTallPhone ? '5%' : isCompactMediumPhone ? '5%' : isSmallPhone ? '5%' : isGalaxySPhone ? '5%' : null,
                  left: '40%',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <View
                    style={{
                      position: 'relative',
                      right: '10%',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        right: '25%',
                        bottom: '10%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Technical'}
                      />
                    </View>
                    <View style={{position: 'relative', right: '35%'}}>
                      <Text style={{ position: 'relative', bottom: '80%', fontSize: wp(2.6), textAlign: 'center', color: 'white' }}>Technical </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      right: isMediumTallPhone ? '5%' : isCompactMediumPhone ? null : isSmallPhone ? null : isGalaxySPhone ? '5%' : null,
                      left: isMediumTallPhone ? null : isCompactMediumPhone ? '25%' : isSmallPhone ? null : isGalaxySPhone ? '25%' : null,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        left: isMediumTallPhone ? null : isCompactMediumPhone ? null : isSmallPhone ? '15%' : isGalaxySPhone ? null : null,
                        bottom: '10%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Scientific'}
                      />
                    </View>
                    <View>
                      <Text style={{ position: 'relative', right: isMediumTallPhone ? '5%' : isCompactMediumPhone ? '5%' : isSmallPhone ? '1.5%' : isGalaxySPhone ? '5%' : null, bottom: '80%', fontSize: wp(2.6), color: 'white' }}>Scientific </Text>
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
                        right: '30%',
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Social'}
                      />
                    </View>
                    <View>
                      <Text style={{ position: 'relative', right: '40%', bottom: '120%', fontSize: wp(2.6), color: 'white' }}>Social </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      position: 'relative',
                      left: isMediumTallPhone ? '30%' : isCompactMediumPhone ? '30%' : isSmallPhone ? '2.5%' : isGalaxySPhone ? '30%' : null,
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        position: 'relative',
                        bottom: '25%',
                        left: isMediumTallPhone ? '47.5%' : isCompactMediumPhone ? '47.5%' : isSmallPhone ? '40%' : isGalaxySPhone ? '47.5%' : null,
                        transform: [{scale: 0.5}],
                      }}>
                      <RadioButton
                        backgroundColor={'white'}
                        theme={theme}
                        value={'Miscellaneous'}
                      />
                    </View>
                    <View>
                      <Text style={{ position: 'relative', left: isMediumTallPhone ? '47.5%' : isCompactMediumPhone ? '47.5%' : isSmallPhone ? '43%' : isGalaxySPhone ? '47.5%' : null, bottom: '120%', fontSize: wp(2.6), color: 'white' }}>Misc </Text>
                    </View>
                  </View>
                </View>
              </View>
            </RadioButton.Group>
          </View>
          <View style={{position: 'relative', bottom: '9%'}}>
            <View
              style={{
                position: 'relative',
                bottom: '5%',
                marginTop: '4%',
                borderColor: 'black',
              }}>
              <TermsInput
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
                  padding: isMediumTallPhone ? wp(2.0) : isCompactMediumPhone ? wp(1.75) : isSmallPhone ? wp(1.25) : isGalaxySPhone ? wp(2.0) : null,
                  borderRadius: wp(2.3),
                  borderColor: 'black',
                  borderWidth: wp(0.3),
                  alignItems: 'center',
                  width: '35%',
                  bottom: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? '29.5%' : isSmallPhone ? '45.5%' : isGalaxySPhone ? hp(1) : null,
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
                top: isMediumTallPhone ? '18.5%' : isCompactMediumPhone ? '17.75%' : isSmallPhone ? '15.75%' : isGalaxySPhone ? '15.5%' : null,
                bottom: '5%',
                marginTop: '4%',
              }}>
              <View
                style={{
                  position: 'relative',
                  bottom: '140%',
                  borderRadius: wp(2.3),
                  left: '2%',
                }}>
                <DeviceBackButton buttonColor={buttonColor} style={{borderRadius: 15}} onBack={onBack} />
              </View>
              <View
                style={{
                  position: 'relative',
                  bottom: '190.5%',
                  left: '113%',
                  width: '30%',
                  overflow: 'hidden',
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
                    borderRadius: wp(2.3),
                  }}
                  onPress={() => {
                    saveData(classIdentifier, entries)
                      .then(() => {
                        console.log('List saved successfully:', entries); // Debug log
                        Alert.alert(
                          'Beep beep!',
                          'Your terms list is safe and sound and spellbound!',
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
                marginBottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(.1) : isSmallPhone ? hp(0.1) : isGalaxySPhone ? hp(1.5) : null,
                backgroundColor: 'white',
                borderRadius: wp(4),
                bottom: '1.75%',
              }}>
              <Text>Write down your terms notes and thoughts here</Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(61) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(55) : isGalaxySPhone ? hp(61) : null }}>
            <DeviceQuill
              editorConent={editorContent}
              setEditorContent={setEditorContent}
              storageKey={'TermsNotes'}
            />
            </View>
            <View
              style={{
                position: 'relative',
                bottom: '1.5%',
                marginBottom: '2.5%',
              }}>
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
                bottom: isMediumTallPhone ? '2.50%' : isCompactMediumPhone ? '3.75%' : isSmallPhone ? '3.75%' : isGalaxySPhone ? '2.50%' : null,
                width: '50%',
                left: '50%',
                overflow: 'hidden',
                borderRadius: wp(2.6),
                borderColor: 'black',
                borderWidth: wp(0.3),
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: buttonColor,
                  padding: wp(2.3),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: wp(2.6),
                }}
                onPress={handleSaveEditorContent}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  Save Notes
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{position: 'relative', bottom:  isMediumTallPhone ? '9.02%' : isCompactMediumPhone ? '11.5%' : isSmallPhone ? '11.5%' : isGalaxySPhone ? '9.02%' : null, right: '35%'}}>
              <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentTerms;
