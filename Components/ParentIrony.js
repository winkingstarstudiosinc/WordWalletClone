import React, {useState, useEffect, useRef} from 'react';
import {useStorage} from './StorageContext';
import {View, Text, Button, Alert, TouchableOpacity} from 'react-native';
import IronyDefinition from './IronyDefinition';
import IronyList from './IronyList';
import IronyInput from './IronyInput';
import DeviceDropdown from './DeviceDropdown';
import NotesDropdown from './NotesDropdown';
import DeviceBackButton from './DeviceBackButton';
import DeviceQuill from './DeviceQuill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';


function ParentIrony({onBack, commonColor, buttonColor, discoveredColor, createTextColor, addOrangeButton}) {
  const [newFusion, setNewFusion] = useState('');
  const [selectedOption, setSelectedOption] = useState('Common');
  const [notesOption, setNotesOption] = useState('Null');
  const [displayMode, setDisplayMode] = useState('List');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempTerm, setTempTerm] = useState('');
  const [editorContent, setEditorContent] = useState(''); // Rich editor content for Fusion Forms
  const {loadStoredData, saveData} = useStorage(); // Updated destructure for storage
  const classIdentifier = 'ironyFormsData'; // Unique identifier for this component
  const [lastSavedFusions, setLastSavedFusions] = useState([]);
  const lastSavedFusionsRef = useRef([]);
  const [notesDataLoaded, setNotesDataLoaded] = useState(false); // New state to track if notes are already loaded
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type for new fusions
  const [fusions, setFusions] = useState([]);

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
      loadStoredData('IronyNotes')
        .then(data => {
          setEditorContent(data || '');
          console.log('Data loaded for IronyNotes:', data);
          setNotesDataLoaded(true); // Mark data as loaded
        })
        .catch(err => console.error('Error loading IronyNotes:', err));
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
    if (!editorContent.trim()) {
      Alert.alert(
        'Whoa, easy there,',
        'Editor content is empty. Fill that space with your imagination. :) <3',
      );
      return;
    }
    saveData('IronyNotes', editorContent)
      .then(() => {
        console.log('Notes saved successfully:', editorContent);
        Alert.alert(
          'Success!',
          "You irony notes have been successfully saved. We gon' do this or what, daughter/son?",
        );
      })
      .catch(err => console.error('Failed to save notes:', err));
  };

  return (
    <View style={{padding: wp(5.2), width: '110%', height: '100%'}}>
      {displayMode === 'List' ? (
        <>
          <View style={{position: 'relative', bottom: '3.75%'}}>
            <IronyDefinition />
          </View>
          <View
            style={{
              width: '105%',
              backgroundColor: 'white',
              borderWidth: 1,
              borderColor: 'black',
              height: isMediumTallPhone ? '69%' : isCompactMediumPhone ? '65%' : isSmallPhone ? '65%' : isGalaxySPhone ? '69%' : null,
              maxHeight: hp(75),
              position: 'relative',
              right: '2.5%',
              bottom: '4.5%',
            }}>
            <IronyList
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

          <View style={{position: 'relative', bottom: '5%'}}>
            <View
              style={{
                position: 'relative',
                height: 65,
                width: '50%',
                marginBottom: '4%',
                marginTop: wp(.75),
              }}>
              <DeviceDropdown
                selectedOption={selectedOption}
                onChange={value => handleDropdownChange(value, 'Device')}
                commonColor={commonColor}
                createTextColor={createTextColor}
                discoveredColor={discoveredColor}
              />
            </View>
            <View
              style={{
                width: '35%',
                borderRadius: '50%',
                left: '32.5%',
                top: isMediumTallPhone ? '21.50%' : isCompactMediumPhone ? '16%' : isSmallPhone ? '13.5%' : isGalaxySPhone ? '22.50%' : null,  
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
                <Text style={{color: 'black', fontSize: wp(4)}}>Notes </Text>
              </TouchableOpacity>
            </View>
            <View style={{bottom: '13%'}}>
              <View style={{position: 'relative', bottom: '13%'}}>
                <IronyInput
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
                  top: isMediumTallPhone ? '18.00%' : isCompactMediumPhone ? '17%' : isSmallPhone ? '15%' : isGalaxySPhone ? '18.50%' : null, 
                  bottom: '6%',
                  marginTop: '4%',
                }}>
                <View
                  style={{
                    position: 'relative',
                    bottom: '60%',
                    borderRadius: 5,
                    left: '2%',
                  }}>
                  <DeviceBackButton buttonColor={buttonColor} onBack={onBack} />
                </View>
                <View
                  style={{
                    position: 'relative',
                    bottom: isMediumTallPhone ? '109.5%' : isCompactMediumPhone ? '109.5%' : isSmallPhone ? '109.5%' : isGalaxySPhone ? '109.5%' : null,
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
                      if (!fusions || fusions.length === 0) {
                        Alert.alert(
                          'No allusions, partner,',
                          'take a look, there are no allusions to save!',
                        );
                        return;
                      }
                      saveData(classIdentifier, fusions)
                        .then(() => {
                          Alert.alert(
                            'Swishhh and swagger!',
                            'Your allusion list has been successfully dunked!',
                          );
                          setLastSavedFusions([...fusions]);
                        })
                        .catch(() => {
                          Alert.alert(
                            'Excuse me,',
                            'but an error occurred while saving your beautiful allusions. Please try again.',
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
              <Text> Write your irony notes and thoughts here</Text>
            </View>
            <View style={{ height: isMediumTallPhone ? hp(62) : isCompactMediumPhone ? hp(60) : isSmallPhone ? hp(57.5) : isGalaxySPhone ? hp(66) : null }}> 
            <DeviceQuill
              editorContent={editorContent}
              setEditorContent={content => {
                if (content !== editorContent) {
                  console.log('DeviceQuill updated editor content:', content);
                  setEditorContent(content);
                }
              }}
              storageKey={'IronyNotes'}
            />
            </View>
            <View
              style={{
                position: 'relative',
                bottom: '1%',
                marginBottom: '3.5%',
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
                bottom: isMediumTallPhone ? '2.50%' : isCompactMediumPhone ? '4.0%' : isSmallPhone ? '4.0%' : isGalaxySPhone ? '3.50%' : null,
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
            <View style={{ position: 'relative', right: '35%', bottom: isMediumTallPhone ? '9.02%' : isCompactMediumPhone ? '11.5%' : isSmallPhone ? '12.25%' : isGalaxySPhone ? '7.35%' : null }}>
              <DeviceBackButton buttonColor={buttonColor} onPress={handleBackOne} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

export default ParentIrony;
