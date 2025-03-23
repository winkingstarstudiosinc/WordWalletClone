import React, {useState, useEffect, useRef} from 'react';
import {useStorage} from './StorageContext';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import { useFirebase, DB } from './FirebaseProvider';
import FusionDefinition from './FusionDefinition';
import FusionList from './FusionList';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import FusionInput from './FusionInput';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNotes} from './NotesContext'; // Import the context hook
import { isCompactMediumPhone, isMediumTallPhone, isSmallPhone, isGalaxySPhone, hp, wp,  } from './DynamicDimensions';

function ParentFusionForms({ onBack, commonColor, addOrangeButton, discoveredColor, createTextColor, buttonColor }) {
  const [newFusion, setNewFusion] = useState('');
  const [selectedOption, setSelectedOption] = useState('Common');
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempTerm, setTempTerm] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const {loadStoredData, saveData} = useStorage();
  const classIdentifier = 'fusionFormsData';
  const { fusions, setFusions, addFusion, editFusion, deleteFusion } = useFirebase();  
  const [lastSavedFusions, setLastSavedFusions] = useState([]);
  const lastSavedFusionsRef = useRef([]);
  const [notesDataLoaded, setNotesDataLoaded] = useState(false); // New state to track if notes are already loaded
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type for new fusions

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
      loadStoredData('FusionNotes')
        .then(data => {
          setEditorContent(data || '');
          console.log('Data loaded for FusionNotes:', data);
          setNotesDataLoaded(true); // Mark data as loaded
        })
        .catch(err => console.error('Error loading FusionNotes:', err));
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
    deleteFusion(id);
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
    editFusion(updatedFusions[editingIndex].id, updatedFusions[editingIndex]);
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
      addFusion(newFusionEntry).then((savedFusion) => {
        if (savedFusion) {
            console.log('✅ Fusion successfully saved to Firestore:', savedFusion);
        }
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
        'Careful there, wordsmith,',
        "we're lacking words to save. Please feel free to write some down.",
      );
      return;
    }

    saveData('FusionNotes', editorContent)
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
      <View style={{ padding: wp(4), width: '110%', height: '100%'}}> 
        {displayMode === 'List' ? (
        <>
        <View style={{ position: 'relative', bottom: '3.75%'}}> 
        <FusionDefinition />
          </View>
          <View
            style={{
            width: '105%',
            backgroundColor: 'white',
            borderWidth: wp(0.3), // Ensures border adapts correctly
            borderColor: 'black',
            height: isMediumTallPhone ? '69%' : isCompactMediumPhone? '64%' : isSmallPhone ? '64%' : isGalaxySPhone ? '67%' : null,
            maxHeight: hp(75),
            position: 'relative',
            right: '2.5%',
            bottom:'4.5%',
            }} 
            >
            <FusionList
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

          <View style={{position: 'relative', bottom: '5%' }}>
            <View
              style={{
                position: 'relative',
                height: hp(8.5),
                width: '50%',
                marginBottom: '4%',
                marginTop: isGalaxySPhone ? '5%' : null,
              }}>
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
                top: isMediumTallPhone ? '19%' : isCompactMediumPhone ? '22.5%' : isSmallPhone ? '20%' : isGalaxySPhone ? '19%' : null,
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
                <FusionInput
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
                  top: isMediumTallPhone ? '16%' : isCompactMediumPhone ? '16%' : isSmallPhone ? '13%' : isGalaxySPhone ? '16%' : null,
                  marginTop: '4%',
                }}>
                <View
                  style={{
                    position: 'relative',
                    bottom: '55%',
                    borderRadius: wp(2.3),
                    left: '2%',
                  }}>
                  <DeviceBackButton buttonColor={buttonColor} onBack={onBack} />
                </View>
                <View
                  style={{
                    position: 'relative',
                    bottom: '105.5%',
                    left: '113%',
                    width: '30%',
                    overflow: 'hidden',
                    borderRadius: wp(2.3),
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: buttonColor,
                      padding: wp(2.0),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: wp(2.6),
                      borderWidth: wp(0.3),
                      borderColor: 'black',
                    }}
                    onPress={() => {
                      if (!fusions || fusions.length === 0) {
                        Alert.alert(
                          'No Fusions detected, sire',
                          "Well, what're you waiting for?",
                        );
                        return;
                      }

                      saveData(classIdentifier, fusions)
                        .then(() => {
                          Alert.alert(
                            'Bravo!',
                            'Your fusion forms list has been saved with great gusto!',
                          );
                          setLastSavedFusions([...fusions]);
                        })
                        .catch(() => {
                          Alert.alert(
                            'Schucks',
                            "An error occurred while saving your delightful spiel. Better get typin' spud ;)",
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
              <Text> Write your fusion form notes and thoughts here</Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(62) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(60) : isGalaxySPhone ? hp(67) : null }}>
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={content => {
                if (content !== editorContent) {
                  console.log('DeviceQuill updated editor content:', content);
                  setEditorContent(content);
                }
              }}
              storageKey={'FusionNotes'}
            />
            </View>
            <View
              style={{
                position: 'relative',
                bottom: isMediumTallPhone ? '1%' : isCompactMediumPhone ? '1%': isSmallPhone ? '1%' : isGalaxySPhone ? '1%' : null, 
                marginBottom: '3.5%',
              }}>
              <NotesDropdown
                selectedOption={notesOption}
                commonColor={commonColor}
                onChange={value => handleDropdownChange(value, 'Notes')}
                discoveredColor={discoveredColor}
                createTextColor={createTextColor}
              />
            </View>
            <View
              style={{
                position: 'relative',
                bottom: isMediumTallPhone ? '2.0%' : isCompactMediumPhone ? '4.0%' : isSmallPhone ? '4.0%' : isGalaxySPhone ? '3.5%' : null,
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
            <View style={{position: 'relative', right: '35%', bottom: isMediumTallPhone ? '8.33%' : isCompactMediumPhone ? '11.5%' : isSmallPhone ? '11.5%' : isGalaxySPhone ? '9.33%' : null }}>
              <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentFusionForms;