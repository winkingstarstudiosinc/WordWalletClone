import React, {useState, useEffect} from 'react';
import ConstraintLayout from 'react-native-constraint-layout';
import {RadioButton} from 'react-native-paper';
import {useStorage} from './StorageContext';
import DeviceBackButton from './DeviceBackButton';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import WitWisdomDefinition from './WitWisdomDefinition';
import WitWisdomList from './WitWisdomList';
import WitWisdomInput from './WitWisdomInput';
import DeviceQuill from './DeviceQuill';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentWitWisdom({onBack, commonColor, buttonColor, discoveredColor, createTextColor, addTurquoiseButton }) {
  const [newEntry, setNewEntry] = useState({
    firstPart: { text: '', style: {} },
    secondPart: { text: '', style: {} },
    textType: 'Common',  // Default to 'Common'
    category: '',  // Default to empty
});
  const [tempEntry, setTempEntry] = useState({
    firstPart: { text: '', style: {} },
    secondPart: { text: '', style: {} },
    category: '',
    textType: '',
});   
  const [selectedOption, setSelectedOption] = useState('Common');
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [radioSelection, setRadioSelection] = useState('');
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for notes
  const {loadStoredData, saveData} = useStorage(); // Updated destructure for storage
  const [entries, setEntries] = useState([]); // Initialize with empty array
  const [lastSavedEntries, setLastSavedEntries] = useState(null); // Track the last saved state
  const classIdentifier = 'WitWisdomWords'; // Unique identifier for this component

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
      loadStoredData('WitWisdomNotes')
        .then(data => {
          setEditorContent(data || ''); // Set content once
          console.log('Data loaded for WitWisdomNotes:', data);
        })
        .catch(err => console.error('Error loading WitWisdomNotes:', err));
    }
  }, [displayMode, loadStoredData, editorContent]); // Added editorContent as a dependency

  const handleAddEntry = () => {
    if (newEntry.firstPart.text.trim() && newEntry.secondPart.text.trim()) {
      const newEntryObject = {
        id: Date.now().toString(),
        firstPart: {
          text: newEntry.firstPart.text,
          style: {
            fontWeight: 'bold',
            fontFamily: 'serif',
            color: selectedOption === 'Common' ? commonColor : selectedOption === 'Discovered' ? discoveredColor : createTextColor,
          },
        },
        secondPart: {
          text: newEntry.secondPart.text,
          style: {
            fontStyle: 'italic',
            fontFamily: 'sans-serif',
            color: selectedOption === 'Common' ? commonColor : selectedOption === 'Discovered' ? discoveredColor : createTextColor,
          },
        },
        textType: selectedOption, 
        category: radioSelection,  // ✅ Ensure category is assigned properly
      };
      setEntries([...entries, newEntryObject]);
      setNewEntry({
        firstPart: { text: '', style: {} },
        secondPart: { text: '', style: {} },
        textType: 'Common',
        category: '',  // ✅ Reset category for next entry
      });
      setRadioSelection(''); // ✅ Reset radio selection
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
    if (!editorContent.trim()) {
      Alert.alert(
        'Oh, lawdy lawd',
        'Editor content is empty, bronco, get something in there first!',
      );
      return;
    }
    saveData('WitWisdomNotes', editorContent)
      .then(() => {
        console.log('Notes saved successfully:', editorContent);
        Alert.alert(
          'Success!',
          "Your wit & wisdom notes have been successfully saved! But I'm sure there's more to come :)",
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: wp(5.2), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{position: 'relative', bottom: '3.75%'}}>
            <WitWisdomDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: wp(0.3),
              borderColor: 'black',
              height: isMediumTallPhone ? '53%' : isCompactMediumPhone ? '48%' : isSmallPhone ? '48%' : isGalaxySPhone ? '53%' : null,
              maxHeight: hp(62.5),
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <WitWisdomList
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
            <View style={{position: 'relative', top: isMediumTallPhone ? null : isCompactMediumPhone ? '3.0%' : isSmallPhone ? '3%' : isGalaxySPhone ? null : null, height: hp(8.5), width: '50%'}}>
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
              <View style={{position: 'relative', left: '40%', top: '4.5%'}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      position: 'relative',
                      right: '15%',
                      color: 'white',
                    }}>
                    Wit
                  </Text>
                  <RadioButton backgroundColor={'white'} value={'Wit'} />
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      position: 'relative',
                      right: '15%',
                      color: 'white',
                    }}>
                    Wisdom
                  </Text>
                  <RadioButton backgroundColor={'white'} value={'Wisdom'} />
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
              <WitWisdomInput
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
                  padding: isMediumTallPhone ? wp(1.75) : isCompactMediumPhone ? wp(1.75) : isSmallPhone ? wp(1.50) : isGalaxySPhone ? wp(1.75) : null,
                  borderRadius: wp(2.3),
                  borderColor: 'black',
                  borderWidth: wp(0.3),
                  alignItems: 'center',
                  width: '35%',
                  bottom: isMediumTallPhone ? '21%' : isCompactMediumPhone ? '45.5%' : isSmallPhone ? '55.5%' : isGalaxySPhone ? '5%' : null,
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
                top: isMediumTallPhone ? '19.5%' : isCompactMediumPhone ? '15.5%' : isSmallPhone ? '15.5%' : isGalaxySPhone ? '19.5%' : null,
                bottom: '5%',
                marginTop: '4%',
              }}>
              <View
                style={{
                  position: 'relative',
                  bottom: '142%',
                  borderRadius: wp(2.3),
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
                          'Success, love!',
                          'Your wit & wisdom has been scrumptiously stored for keeping!',
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
              <Text>
                Write your wisdom and wits notes here
              </Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(64.5) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(58.5) : isGalaxySPhone ? hp(66.5) : null }}>
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={setEditorContent}
              storageKey={'WitWisdomNotes'}
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
                  bottom: isMediumTallPhone ? '4.15%' : isCompactMediumPhone ? '8.75%' : isSmallPhone ? '8.75%' : isGalaxySPhone ? '7.15%' : null,
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
                style={{ position: 'relative', right: '35%', bottom: isMediumTallPhone ? '30.75%' : isCompactMediumPhone ? '35.5%' : isSmallPhone ? '35.5%' : isGalaxySPhone ? '32.75%' : null }}>
                <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentWitWisdom;
