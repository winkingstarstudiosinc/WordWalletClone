import React, {useState, useEffect, useRef} from 'react';
import {useStorage} from './StorageContext';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import OxymoronDefinition from './OxymoronDefinition';
import OxymoronList from './OxymoronList';
import OxymoronInput from './OxymoronInput';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';

function ParentOxymoron({onBack, commonColor, buttonColor, discoveredColor, createTextColor, addOrangeButton }) {
  const [newFusion, setNewFusion] = useState('');
  const [selectedOption, setSelectedOption] = useState('Common');
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempTerm, setTempTerm] = useState('');
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for Fusion Forms
  const {loadStoredData, saveData} = useStorage(); // Updated destructure for storage
  const classIdentifier = 'oxyFormsData'; // Unique identifier for this component
  const [lastSavedFusions, setLastSavedFusions] = useState([]); // Track the last saved state
  const [fusions, setFusions] = useState([]);
  const lastSavedFusionsRef = useRef([]);
  const [notesDataLoaded, setNotesDataLoaded] = useState(false); // New state to track if notes are already loaded
  const [selectedTextType, setSelectedTextType] = useState('Common');

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

  const hasFusionChanged = () => {
    if (fusions.length !== lastSavedFusionsRef.current.length) {
      return true;
    }
    for (let i = 0; i < fusions.length; i++) {
      if (!deepEqual(fusions[i], lastSavedFusionsRef.current[i])) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log('ParentFusionForms component mounted');

    const loadFusions = async () => {
      try {
        console.log('Attempting to retrieve data from AsyncStorage...');
        const storedData = await AsyncStorage.getItem(classIdentifier);
        console.log('Data retrieved from AsyncStorage:', storedData);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData)) {
            setFusions(parsedData);
            console.log('State initialized with fusions:', parsedData);
          } else {
            console.error('Invalid data format retrieved:', parsedData);
          }
        }
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadFusions();

    return () => console.log('ParentFusionForms component unmounted');
  }, []);

  useEffect(() => {
    if (!fusions) {
      console.warn('Fusions is null or undefined, skipping save logic.');
      return;
    }

    if (hasFusionChanged()) {
      console.log('Detected changes in fusions. Preparing to save...');
      saveData(classIdentifier, fusions)
        .then(() => {
          console.log('Fusions auto-saved successfully:', fusions);
          lastSavedFusionsRef.current = [...fusions];
          setLastSavedFusions([...fusions]);
        })
        .catch(err => console.error('Error during auto-save:', err));
    } else {
      console.log('No changes detected in fusions, skipping save.');
    }
  }, [fusions, saveData, classIdentifier]);

  // Load editor content when displayMode changes to Notes
  useEffect(() => {
    if (displayMode === 'Notes' && !notesDataLoaded) {
      // Check if data is already loaded
      loadStoredData('OxymoronNotes')
        .then(data => {
          setEditorContent(data || '');
          console.log('Data loaded for OxymoronNotes:', data);
          setNotesDataLoaded(true); // Mark data as loaded
        })
        .catch(err => console.error('Error loading OxymoronNotes:', err));
    }
  }, [displayMode, loadStoredData, notesDataLoaded]); // Added notesDataLoaded to prevent continuous loading

  useEffect(() => {
    console.log('Fusions state updated:', fusions);
  }, [fusions]);

  const handleTextTypeChange = newTextType => {
    setSelectedTextType(newTextType);
    // If editing an existing fusion, update it in the list
    if (editingIndex !== null) {
      const updatedFusions = [...fusions];
      updatedFusions[editingIndex].textType = newTextType; // Assuming each fusion has a textType property
      setFusions(updatedFusions);
    }
  };

  const onEditInit = (index, text) => {
    setEditingIndex(index);
    setTempTerm(text);
  };

  const onDelete = id => {
    const updatedFusions = fusions.filter(fusion => fusion.id !== id);
    setFusions(updatedFusions);
  };

  const onEditSave = id => {
    const updatedFusions = [...fusions];
    updatedFusions[editingIndex].text = tempTerm; // Save edited text
    updatedFusions[editingIndex].textType = selectedTextType; // Save the new Text Type
    updatedFusions[editingIndex].style.color =
      selectedTextType === 'Common'
        ? commonColor
        : selectedTextType === 'Discovered'
          ? discoveredColor
          : createTextColor; // Update color based on selected text type
    setFusions(updatedFusions);
    setEditingIndex(null); // Exit editing mode
    setTempTerm('');
  };

  const handleAddFusion = () => {
    console.log('Adding new fusion with text type:', selectedOption); // Debugging log
    if (newFusion.trim()) {
      const newFusionEntry = {
        id: Date.now().toString(),
        text: newFusion,
        style: {
          color:
            selectedOption === 'Common'
              ? commonColor
              : selectedOption === 'Discovered'
                ? discoveredColor
                : createTextColor, // Default color for "Create"
        },
        category: selectedOption, // Ensure category aligns with selectedOption
        type: 'fusion',
      };
      setFusions(prevFusions => {
        const updatedFusions = [...prevFusions, newFusionEntry];
        console.log(
          'Added new fusion:',
          newFusionEntry,
          'Updated fusions:',
          updatedFusions,
        );
        return updatedFusions;
      });
      setNewFusion('');
    }
  };

  const handleStateChange = () => {
    console.log('Switching to Notes mode...');

    // Resetting necessary states when entering Notes
    setNotesOption('Null'); // Or your desired default
    setDisplayMode('Notes');
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

  const handleBackOne = () => {
    console.log('Back button pressed. Current mode:', displayMode);
    if (displayMode !== 'List') {
      setDisplayMode('List');
      console.log('Returning to List mode.');
    } else {
      console.log('Already in List mode, no action required.');
    }
  };

  const handleSaveEditorContent = () => {
    console.log('Attempting to save editor content:', editorContent);

    if (typeof editorContent !== 'string' || !editorContent.trim()) {
      Alert.alert(
        'My dear wordsmith,',
        'there are no oxymorons to save. Please feel free to write some down.',
      );
      return;
    }

    saveData('OxymoronNotes', editorContent)
      .then(() => {
        console.log('Notes saved successfully:', editorContent);
        Alert.alert(
          'Let the fireworks fly!',
          'Your oxymoron notes have been successfully saved. Keep them coming!',
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: wp(5.2), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{position: 'relative', bottom: '3.75%'}}>
            <OxymoronDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: wp(0.3),
              borderColor: 'black',
              height: isMediumTallPhone ? '69%' : isCompactMediumPhone ? '65%' : isSmallPhone ? '65%' : isGalaxySPhone ? '69%' : null,
              maxHeight: hp(75),
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <OxymoronList
              editingIndex={editingIndex}
              fusions={fusions}
              setTempTerm={setTempTerm}
              tempTerm={tempTerm}
              onDelete={onDelete}
              onEditInit={onEditInit}
              onEditSave={onEditSave}
              onTextTypeChange={handleTextTypeChange}
              commonColor={commonColor}
              discoveredColor={discoveredColor}
              createTextColor={createTextColor}
            />
          </View>

          <View style={{position: 'relative', marginTop: '1.5%', bottom: '5%'}}>
            <View style={{position: 'relative', height: hp(8.5), width: '50%'}}>
              <DeviceDropdown
                selectedOption={selectedOption}
                onChange={value => handleDropdownChange(value, 'Device')}
                commonColor={commonColor}
                discoveredColor={discoveredColor}
                createTextColor={createTextColor}
              />
            </View>
            <View
              style={{
                width: '35%',
                borderRadius: '50%',
                left: '32.5%',
                top: isMediumTallPhone ? '23%' : isCompactMediumPhone ? '23%' : isSmallPhone ? '23%' : isGalaxySPhone ? '25.5%' : null,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'ivory',
                  padding: wp(2.3),
                  borderRadius: wp(2.3),
                  alignItems: 'center',
                  borderColor: 'black',
                  borderWidth: wp(0.3),
                }}
                onPress={handleStateChange}>
                <Text style={{color: 'black', fontSize: 16}}>Notes </Text>
              </TouchableOpacity>
            </View>
            <View style={{bottom: '13%'}}>
              <View style={{position: 'relative', bottom: '13%'}}>
                <OxymoronInput
                  newFusion={newFusion}
                  setNewFusion={setNewFusion}
                  onAdd={handleAddFusion}
                  addOrangeButton={addOrangeButton}
                />
              </View>

              <View
                style={{
                  position: 'relative',
                  right: '40%',
                  top: isMediumTallPhone ? '18%' : isCompactMediumPhone ? '15%' : isSmallPhone ? '15%' : isGalaxySPhone ? '18%' : null,
                  bottom: '6%',
                  marginTop: '4%',
                }}>
                <View
                  style={{
                    position: 'relative',
                    bottom: '61%',
                    borderRadius: 5,
                    left: '2%',
                  }}>
                  <DeviceBackButton buttonColor={buttonColor} onBack={onBack} />
                </View>
                <View
                  style={{
                    position: 'relative',
                    bottom: '111.5%',
                    left: '113%',
                    width: '30%',
                    overflow: 'hidden',
                    borderRadius: wp(2.3),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: buttonColor,
                      borderColor: 'black',
                      borderWidth: wp(0.3),
                      padding: wp(2.3),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: wp(2.6),
                    }}
                    onPress={() => {
                      if (!fusions || fusions.length === 0) {
                        Alert.alert(
                          'No oxymorons detected,',
                          'Better get brainstorming!',
                        );
                        return;
                      }

                      saveData(classIdentifier, fusions)
                        .then(() => {
                          Alert.alert(
                            'I have joyous news!',
                            'Your oxymoron list has been preserved!',
                          );
                          setLastSavedFusions([...fusions]);
                        })
                        .catch(() => {
                          Alert.alert(
                            'Oops...',
                            "An error occurred while saving your delightful spiel. Don't let me stop you from trying again!",
                          );
                        });
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
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
                marginBottom: isMediumTallPhone ? hp(0.25) : isCompactMediumPhone ? hp (0.1) : isSmallPhone ? hp(0.1) : isGalaxySPhone ? hp(0.25) : null,
                backgroundColor: 'white',
                borderRadius: wp(4),
                bottom: '1.75%',
              }}>
              <Text> Write your oxymoron notes and thoughts here</Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(62) : isCompactMediumPhone ? hp(57) : isSmallPhone ? hp(55) : isGalaxySPhone ? hp(66) : null }}>
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={content => {
                if (content !== editorContent) {
                  console.log('DeviceQuill updated editor content:', content);
                  setEditorContent(content);
                }
              }}
              storageKey={'OxymoronNotes'}
            />
            </View>
            <View
              style={{
                position: 'relative',
                bottom: '1%',
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
                bottom: isMediumTallPhone ? '2%' : isCompactMediumPhone ? '4.0%' : isSmallPhone ? '3.5%' : isGalaxySPhone ? '3.0%' : null,
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
            <View style={{ position: 'relative', left: '35%', bottom: isMediumTallPhone ? '8.50%' : isCompactMediumPhone ? '11.5%' : isSmallPhone ? '11.5%' : isGalaxySPhone ? '8.75%' : null }}>
              <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentOxymoron;
