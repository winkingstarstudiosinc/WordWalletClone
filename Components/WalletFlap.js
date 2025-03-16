import React, {useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Text,
  Modal,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useStorage } from './StorageContext';
import TransLang from './TransLang';
import DictionaryAndThesaurus from './DictionaryAndThesaurus';
import Card from './Card';
import WordList from './WordList';
import InputArea from './InputArea';
import DeviceArea from './DeviceArea';
import ParentFusionForms from './ParentFusionForms';
import ParentWitWisdom from './ParentWitWisdom';
import ParentNicknames from './ParentNicknames';
import ParentTerms from './ParentTerms';
import ParentAlliteration from './ParentAlliteration';
import ParentAllusion from './ParentAllusion';
import ParentEuphemism from './ParentEuphemism';
import ParentHyperbole from './ParentHyperbole';
import ParentIdiom from './ParentIdiom';
import ParentImagery from './ParentImagery';
import ParentIrony from './ParentIrony';
import ParentJuxtaposition from './ParentJuxtaposition';
import ParentMetaphor from './ParentMetaphor';
import ParentOnomatopoeia from './ParentOnomatopoeia';
import ParentOxymoron from './ParentOxymoron';
import ParentPersonification from './ParentPersonification';
import ParentSimile from './ParentSimile';
import ChangeWalletColor from './ChangeWalletColor';
import ChangeTextColor from './ChangeTextColor';
import PaginatedHelpModal from './PaginatedHelpModal';
import ChangeButtons from './ChangeButtons';
import ChangeInnerFrameColor from'./ChangeInnerFrameColor'
import ParentAllegory from './ParentAllegory';
import { hp, wp, isCompactMediumPhone, isMediumTallPhone, isSmallPhone, isTallMediumPhone, isGalaxySPhone } from './DynamicDimensions';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';





function WalletFlap( { navigation } ) {
  const {loadStoredData, saveData} = useStorage(); // Updated destructure for storage methods
  const classIdentifier = 'walletFlapWords'; // Unique identifier for this component

  const [words, setWords] = useState([]);
  const [selectedCard, setSelectedCard] = useState('Lexicon');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tempTerm, setTempTerm] = useState('');
  const [tempDefinition, setTempDefinition] = useState('');
  const [editingId, setEditingId] = useState(null); // Tracks which word is being edited
  const [selectedDevice, setSelectedDevice] = useState('');
  const [isSettingsModalVisible, setIsSettingsModalVisible] = useState(false);
  const [isChangeColorVisible, setIsChangeColorVisible] = useState(false);
  const [walletFlapColor, setWalletFlapColor] = useState('#3827b3'); 
  const [cardHolderColor, setCardHolderColor] = useState('rgb(36, 95, 141)'); // For card holder
  const [lexiconColor, setLexiconColor] = useState('#007bff'); // Lexicon card color
  const [translateColor, setTranslateColor] = useState('#ff6347'); // Default Translate color
  const [deviceColor, setDeviceColor] = useState('#dff13c'); // Default Device color
  const [dictionaryColor, setDictionaryColor] = useState('#28a745'); // Default Dictionary color
  const [inputAreaColor, setInputAreaColor] = useState('rgb(219, 220, 250)'); // Default InputArea color
  const [commonColor, setCommonColor] = useState('#8a47ff'); // Default Common color
  const [discoveredColor, setDiscoveredColor] = useState('#2096F3'); 
  const [createTextColor, setCreateTextColor] = useState('turquoise'); // Default value
  const [buttonColor, setButtonColor] = useState('#2096F3');
  const [addOrangeButton, setAddOrangeButton] = useState('orange');
  const [addTurquoiseButton, setAddTurquoiseButton] = useState('turquoise'); // Default turquoise color
  const [translateInnerColor, setTranslateInnerColor] = useState('#3827b3'); // Default color for Translate Inner Frame
  const [dictionaryInnerColor, setDictionaryInnerColor] = useState('#3827b3');
  const [dictionaryDefinitionColor, setDictionaryDefinitionColor] = useState('#3827b3');
  const [translateHeaderOne, setTranslateHeaderOne] = useState('#3827b3'); // Default color for Translate H1
  const [translateHeaderTwo, setTranslateHeaderTwo] = useState('#3827b3'); 


  useEffect(() => {
    loadStoredData(classIdentifier).then(data => {
      setWords(data); // Load WalletFlap-specific words
    });
  }, [classIdentifier]); // Load data when component mounts

  const [lastSavedWords, setLastSavedWords] = useState(null); // Track the last saved state

  useEffect(() => {
    if (
      words.length > 0 &&
      JSON.stringify(words) !== JSON.stringify(lastSavedWords)
    ) {
      saveData(classIdentifier, words); // Save only if words have changed
      setLastSavedWords(words); // Update the last saved state
    }
  }, [words, saveData, classIdentifier, lastSavedWords]); // Watch for changes

  useEffect(() => {
    const loadTranslateColor = async () => {
      const savedColor = await AsyncStorage.getItem('translateColor');
      if (savedColor) setTranslateColor(savedColor);
    };
    loadTranslateColor();
  }, []);

  useEffect(() => {
    const loadDeviceColor = async () => {
      const savedColor = await AsyncStorage.getItem('deviceColor');
      if (savedColor) setDeviceColor(savedColor);
    };
    loadDeviceColor();
  }, []);

  useEffect(() => {
    const loadDictionaryColor = async () => {
      const savedColor = await AsyncStorage.getItem('dictionaryColor');
      if (savedColor) setDictionaryColor(savedColor);
    };
    loadDictionaryColor();
  }, []);

  useEffect(() => {
    const loadInputAreaColor = async () => {
      const savedColor = await AsyncStorage.getItem('inputAreaColor');
      if (savedColor) setInputAreaColor(savedColor);
    };
    loadInputAreaColor();
  }, []);


  useEffect(() => {
    const loadWalletFlapColor = async () => {
      const savedColor = await AsyncStorage.getItem('walletFlapColor');
      if (savedColor) setWalletFlapColor(savedColor);
    };
    loadWalletFlapColor();
  }, []);
  
  // Load CardHolder color
  useEffect(() => {
    const loadCardHolderColor = async () => {
      const savedColor = await AsyncStorage.getItem('cardHolderColor');
      if (savedColor) setCardHolderColor(savedColor);
    };
    loadCardHolderColor();
  }, []);
  
  // Load Lexicon color
  useEffect(() => {
    const loadLexiconColor = async () => {
      const savedColor = await AsyncStorage.getItem('lexiconColor');
      if (savedColor) setLexiconColor(savedColor);
    };
    loadLexiconColor();
  }, []);

  useEffect(() => {
    const loadCommonColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('commonColor');
        if (savedColor) {
          setCommonColor(savedColor);
        }
      } catch (error) {
        console.error('Failed to load Common color:', error);
      }
    };
    loadCommonColor();
  }, []);


  useEffect(() => {
    const loadDiscoveredTextColor = async () => {
      const savedColor = await AsyncStorage.getItem('discoveredTextColor');
      if (savedColor) setDiscoveredColor(savedColor);
    };
    loadDiscoveredTextColor();
  }, []);

  useEffect(() => {
    const loadCreateTextColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('createTextColor');
        if (savedColor) {
          setCreateTextColor(savedColor); // Load saved color
        }
      } catch (error) {
        console.error('Failed to load create text color:', error);
      }
    };
  
    loadCreateTextColor();
  }, []);


  useEffect(() => {
    const loadButtonColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('buttonColor');
        if (savedColor) {
          setButtonColor(savedColor); // Apply saved color
          console.log('Button color loaded:', savedColor);
        }
      } catch (error) {
        console.error('Failed to load button color:', error);
      }
    };
  
    loadButtonColor(); // Load color when component mounts
  }, []);

  useEffect(() => {
    const loadAddOrangeButtonColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('addOrangeButtonColor');
        if (savedColor) {
          setAddOrangeButton(savedColor); // Apply saved color
          console.log('Add button color loaded:', savedColor);
        }
      } catch (error) {
        console.error('Failed to load add button color:', error);
      }
    };
  
    loadAddOrangeButtonColor(); // Call the function
  }, []);


  useEffect(() => {
    const loadAddTurquoiseButtonColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('addTurquoiseButtonColor');
        if (savedColor) {
          setAddTurquoiseButton(savedColor); // Apply saved color
          console.log('Add Turquoise button color loaded:', savedColor);
        }
      } catch (error) {
        console.error('Failed to load Add Turquoise button color:', error);
      }
    };
  
    loadAddTurquoiseButtonColor(); // Call the function on mount
  }, []);


  useEffect(() => {
    const loadTranslateFrameColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('translateInnerColor');
        if (savedColor) setTranslateInnerColor(savedColor);
      } catch (error) {
        console.error('Failed to load Translate Inner Frame color:', error);
      }
    };
    loadTranslateFrameColor();
  }, []);
  
  // Load Dictionary Inner Frame Color on App Start
  useEffect(() => {
    const loadDictionaryFrameColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('dictionaryInnerColor');
        if (savedColor) setDictionaryInnerColor(savedColor);
      } catch (error) {
        console.error('Failed to load Dictionary Inner Frame color:', error);
      }
    };
    loadDictionaryFrameColor();
  }, []);


  useEffect(() => {
    const loadTranslateHeaderOne = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('translateHeaderOne');
        if (savedColor) {
          setTranslateHeaderOne(savedColor);
          console.log('Translate H1 color loaded:', savedColor);
        }
      } catch (error) {
        console.error('Failed to load Translate H1 color:', error);
      }
    };
    loadTranslateHeaderOne();
  }, []);
  
  // Load Translate H2 Color
  useEffect(() => {
    const loadTranslateHeaderTwo = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('translateHeaderTwo');
        if (savedColor) {
          setTranslateHeaderTwo(savedColor);
          console.log('Translate H2 color loaded:', savedColor);
        }
      } catch (error) {
        console.error('Failed to load Translate H2 color:', error);
      }
    };
    loadTranslateHeaderTwo();
  }, []);


  useEffect(() => {
    const loadDictionaryDefinitionColor = async () => {
      try {
        const savedColor = await AsyncStorage.getItem('dictionaryDefinitionColor');
        if (savedColor) setDictionaryDefinitionColor(savedColor);
      } catch (error) {
        console.error('Failed to load Dictionary Definition color:', error);
      }
    };
    loadDictionaryDefinitionColor();
  }, []);


  const handleCardSelect = card => {
    setSelectedCard(card);
    setSelectedDevice(''); // Reset device selection when switching cards
    if (card !== selectedCard) {
      setSelectedCard(card);
    } else {
      setSelectedCard('Lexicon');
    }
  };

  const onChangeDevice = device => {
    setSelectedDevice(device);
    if (device) {
      setSelectedCard('Device');
    }
  };

  const addStyledWord = (newWord) => {
    // Check if the word already exists in the list
    const isDuplicate = words.some(entry => entry.term.toLowerCase() === newWord.term.toLowerCase());
  
    if (isDuplicate) {
      Alert.alert(
        'Woops', 
        'This word already exists within the list! Please enter a different word.'
      );
      return; // Stop execution if duplicate is found
    }
  
    const termStyle = {
      color: selectedCard === 'Lexicon' ? commonColor 
           : selectedCard === 'Dictionary' ? discoveredColor 
           : selectedCard === 'Translate' ? 'orange' 
           : null,
    };
  
    const definitionStyle = { fontStyle: 'italic' };
  
    const newWordEntry = {
      id: `word-${Date.now()}`, // 🔥 Ensure unique ID for new words
      ...newWord,
      termStyle,
      definitionStyle,
    };
  
    setWords([...words, newWordEntry]);
  };

  const onEditInit = (id, term, definition) => {
    console.log(`🔵 onEditInit called → ID: ${id}, Term: ${term}, Definition: ${definition}`);
  
    if (!id) {
      console.error("❌ ERROR: Tried to edit a word with no ID!");
      return; // Stop execution if no ID is present
    }
  
    setEditingId(id);
    setTempTerm(term || ''); // ✅ Ensure values are never undefined
    setTempDefinition(definition || ''); // ✅ Keeps definition safe
  };

  const onEditSave = () => {
    if (!editingId) {
      console.error("❌ ERROR: Attempted to save but no editingId is set.");
      return;
    }
  
    const updatedWords = words.map(word =>
      word.id === editingId
        ? { ...word, term: tempTerm.trim(), definition: tempDefinition.trim() }
        : word
    );
  
    console.log("✅ Successfully saved:", { editingId, tempTerm, tempDefinition });
  
    setWords(updatedWords);
    setEditingId(null); // Reset edit mode
    setTempTerm('');
    setTempDefinition('');
  };



  const onDelete = (id) => {
    console.log(`🟥 onDelete triggered → ID: ${id}`);
  
    if (!id) {
      console.error('❌ ERROR: Attempted to delete an undefined ID.');
      return;
    }
  
    const updatedWords = words.filter(word => word.id !== id);
    setWords(updatedWords);
  
    // Ensure that if the deleted word was being edited, reset edit mode
    if (editingId === id) {
      setEditingId(null);
      setTempTerm('');
      setTempDefinition('');
    }
  };


  const deleteWordsWithoutId = () => {
    const filteredWords = words.filter(word => word.id); // Only keep words WITH an ID
    setWords(filteredWords);
  };



  const handleBack = () => {
    setSelectedDevice(''); // Resets to device view
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('User logged out successfully.');
        Alert.alert('Logged Out', 'You have been logged out successfully.');
      })
      .catch(error => {
        console.error('Logout error:', error);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      });
  };
  


  const toggleSettingsModal = () => {
    setIsSettingsModalVisible(!isSettingsModalVisible);
    setIsChangeColorVisible(false); // Reset when closing modal
  };


  const handleChangeWalletColor = () => {
    setIsChangeColorVisible(true);
  };

  const saveWalletFlapColor = async (color) => {
    try {
      await AsyncStorage.setItem('walletFlapColor', color);
      setWalletFlapColor(color);
    } catch (error) {
      console.error('Failed to save WalletFlap color:', error);
    }
  };
  
  // Save CardHolder color
  const saveCardHolderColor = async (color) => {
    try {
      await AsyncStorage.setItem('cardHolderColor', color);
      setCardHolderColor(color);
    } catch (error) {
      console.error('Failed to save CardHolder color:', error);
    }
  };
  
  // Save Lexicon color
  const saveLexiconColor = async (color) => {
    try {
      await AsyncStorage.setItem('lexiconColor', color);
      setLexiconColor(color);
    } catch (error) {
      console.error('Failed to save Lexicon color:', error);
    }
  };

  const saveTranslateColor = async (color) => {
    try {
      await AsyncStorage.setItem('translateColor', color);
      setTranslateColor(color);
    } catch (error) {
      console.error('Failed to save translate color:', error);
    }
  };

  const saveDeviceColor = async (color) => {
    try {
      await AsyncStorage.setItem('deviceColor', color);
      setDeviceColor(color);
    } catch (error) {
      console.error('Failed to save device color:', error);
    }
  };

  const saveDictionaryColor = async (color) => {
    try {
      await AsyncStorage.setItem('dictionaryColor', color);
      setDictionaryColor(color);
    } catch (error) {
      console.error('Failed to save dictionary color:', error);
    }
  };


  const saveInputAreaColor = async (color) => {
    try {
      await AsyncStorage.setItem('inputAreaColor', color);
      setInputAreaColor(color);
    } catch (error) {
      console.error('Failed to save input area color:', error);
    }
  };

  const saveCommonTextColor = async (color) => {
    try {
      await AsyncStorage.setItem('commonColor', color); // Save the color
      setCommonColor(color); // Update the state
      console.log('Common color updated:', color); // Debug log
    } catch (error) {
      console.error('Failed to save Common color:', error);
    }
  };

  const saveDiscoveredTextColor = async color => {
    try {
      await AsyncStorage.setItem('discoveredTextColor', color);
      setDiscoveredColor(color); // Update the state
    } catch (error) {
      console.error('Failed to save Discovered color:', error);
    }
  };

  const saveCreateTextColor = async (color) => {
    try {
      await AsyncStorage.setItem('createTextColor', color);
      setCreateTextColor(color); // Update state
    } catch (error) {
      console.error('Failed to save create text color:', error);
    }
  };


  const saveButtonColor = async (color) => {
    try {
      await AsyncStorage.setItem('buttonColor', color);
      setButtonColor(color); // Update state
      console.log('Button color saved:', color);
    } catch (error) {
      console.error('Failed to save button color:', error);
    }
  };

  const saveAddOrangeButtonColor = async (color) => {
    try {
      await AsyncStorage.setItem('addOrangeButtonColor', color); // Save to AsyncStorage
      setAddOrangeButton(color); // Update state
      console.log('Add button color saved:', color);
    } catch (error) {
      console.error('Failed to save add button color:', error);
    }
  };


  const saveAddTurquoiseButtonColor = async (color) => {
    try {
      await AsyncStorage.setItem('addTurquoiseButtonColor', color); // Save to AsyncStorage
      setAddTurquoiseButton(color); // Update state
      console.log('Add Turquoise button color saved:', color);
    } catch (error) {
      console.error('Failed to save Add Turquoise button color:', error);
    }
  };


  const saveTranslateFrameColor = async (color) => {
    try {
      await AsyncStorage.setItem('translateInnerColor', color); // Save to AsyncStorage
      setTranslateInnerColor(color); // Update state
      console.log('Translate Inner Frame color saved:', color);
    } catch (error) {
      console.error('Failed to save Translate Inner Frame color:', error);
    }
  };
  
  // Save Dictionary Inner Frame Color
  const saveDictionaryFrameColor = async (color) => {
    try {
      await AsyncStorage.setItem('dictionaryInnerColor', color); // Save to AsyncStorage
      setDictionaryInnerColor(color); // Update state
      console.log('Dictionary Inner Frame color saved:', color);
    } catch (error) {
      console.error('Failed to save Dictionary Inner Frame color:', error);
    }
  };


  const saveTranslateHeaderOne = async (color) => {
    try {
      await AsyncStorage.setItem('translateHeaderOne', color); // Save to AsyncStorage
      setTranslateHeaderOne(color); // Update state
      console.log('Translate H1 color saved:', color);
    } catch (error) {
      console.error('Failed to save Translate H1 color:', error);
    }
  };
  
  // Save Translate H2 Color
  const saveTranslateHeaderTwo = async (color) => {
    try {
      await AsyncStorage.setItem('translateHeaderTwo', color); // Save to AsyncStorage
      setTranslateHeaderTwo(color); // Update state
      console.log('Translate H2 color saved:', color);
    } catch (error) {
      console.error('Failed to save Translate H2 color:', error);
    }
  };


  const saveDictionaryDefinitionColor = async (color) => {
    try {
      await AsyncStorage.setItem('dictionaryDefinitionColor', color);
      setDictionaryDefinitionColor(color); // Updates state in WalletFlap.js
    } catch (error) {
      console.error('Failed to save Dictionary Definition color:', error);
    }
  };





  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.walletFlap, {backgroundColor: walletFlapColor}]}>
          {selectedDevice === 'Fusion Forms' ? (
            <ParentFusionForms onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor} />
          ) : selectedDevice === 'Wit & Wisdom' ? (
            <ParentWitWisdom onBack={handleBack} addTurquoiseButton={addTurquoiseButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Nicknames' ? (
            <ParentNicknames onBack={handleBack} addTurquoiseButton={addTurquoiseButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Terms' ? (
            <ParentTerms onBack={handleBack} addTurquoiseButton={addTurquoiseButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Alliteration' ? (
            <ParentAlliteration onBack={handleBack} addTurquoiseButton={addTurquoiseButton} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Allusion' ? (
            <ParentAllusion onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Allegory' ? (
            <ParentAllegory onBack={handleBack} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Euphemism' ? (
            <ParentEuphemism onBack={handleBack} addTurquoiseButton={addTurquoiseButton} commonColor={commonColor} setCommonCOlor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Hyperbole' ? (
            <ParentHyperbole onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Idiom' ? (
            <ParentIdiom onBack={handleBack} addTurquoiseButton={addTurquoiseButton} commonColor={commonColor} setCommonCOlor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Imagery' ? (
            <ParentImagery onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Irony' ? (
            <ParentIrony onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Juxtaposition' ? (
            <ParentJuxtaposition onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Metaphor' ? (
            <ParentMetaphor onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Onomatopoeia' ? (
            <ParentOnomatopoeia onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Oxymoron' ? (
            <ParentOxymoron onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : selectedDevice === 'Personification' ? (
            <ParentPersonification onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor} />
          ) : selectedDevice === 'Simile' ? (
            <ParentSimile onBack={handleBack} addOrangeButton={addOrangeButton} commonColor={commonColor} setCommonColor={setCommonColor} discoveredColor={discoveredColor} createTextColor={createTextColor} buttonColor={buttonColor}/>
          ) : (
            <>
              <View style={[styles.cardHolder, {backgroundColor: cardHolderColor}]}>
                <Card
                  color={lexiconColor} // Dynamic color for Lexicon card
                  isSelected={selectedCard === 'Lexicon'}
                  label={'Lexicon '}
                  style={styles.card}
                  onPress={() => handleCardSelect('Lexicon')}
                />
                <Card
                  color={translateColor}
                  isSelected={selectedCard === 'Translate'}
                  label={'Translate '}
                  style={styles.card}
                  onPress={() => handleCardSelect('Translate')}
                />
                <Card
                  color={deviceColor} // Dynamic color for Device card
                  isSelected={selectedCard === 'Device'}
                  label={'Device '}
                  style={styles.card}
                  onPress={() => handleCardSelect('Device')}
                />
                <Card
                  color={dictionaryColor} 
                  isSelected={selectedCard === 'Dictionary'}
                  label={'Dictionary '}
                  style={styles.card}
                  onPress={() => handleCardSelect('Dictionary')}
                />
              </View>
              {selectedCard === 'Device' ? (
                <DeviceArea
                  onChangeDevice={onChangeDevice}
                  onSaveNote={(item, note) => console.log(item, note)}
                  buttonColor={buttonColor}
                />
              ) : selectedCard === 'Translate' ? (
                <TransLang onAddWord={addStyledWord} buttonColor={buttonColor} walletFlapColor={walletFlapColor} translateInnerColor={translateInnerColor} translateHeaderOne={translateHeaderOne} translateHeaderTwo={translateHeaderTwo} />
              ) : selectedCard === 'Dictionary' ? (
                <DictionaryAndThesaurus onAddWord={addStyledWord} buttonColor={buttonColor} walletFlapColor={walletFlapColor} dictionaryInnerColor={dictionaryInnerColor} dictionaryDefinitionColor={dictionaryDefinitionColor} />
              ) : (
                <>
                  <WordList
                    editingIndex={editingIndex}
                    setTempDefinition={setTempDefinition}
                    setTempTerm={setTempTerm}
                    tempDefinition={tempDefinition}
                    tempTerm={tempTerm}
                    words={words}
                    onDelete={onDelete}
                    editingId={editingId} 
                    onEditInit={onEditInit}
                    onEditSave={onEditSave}
                    onAddWord={addStyledWord}
                    selectedCard={selectedCard}
                  />
                  <InputArea onAddWord={addStyledWord} selectedCard={selectedCard} inputAreaColor={inputAreaColor} buttonColor={buttonColor} />
                <View
                    style={{
                    position: 'relative',
                    bottom: isMediumTallPhone ? '22.10%' : isCompactMediumPhone ? '21.5%' : isSmallPhone ? '21.60%' : isGalaxySPhone ? '22.10%' : null,
                    right: '28.5%',
                    width: null,
                    overflow: 'hidden',
                    borderRadius: wp(1.3),
                    }}>
                  <TouchableOpacity
                    style={{
                    paddingHorizontal: wp(4.75),
                    padddingVertical: hp(5),
                    backgroundColor: buttonColor, // Save button color
                    padding: hp(0.95),
                    alignItems: 'center',
                    borderRadius: wp(1.3),
                    borderColor: 'black',
                    borderWidth: wp(0.3),
                    }}
                    onPress={() => {
                    saveData(classIdentifier, words)
                    .then(() => {
                    console.log('Words saved successfully:', words); // Debug log
                    Alert.alert('Saved', 'Your list has been saved!');
                    })
                      .catch(err => {
                      console.error('Failed to save words:', err);
                      Alert.alert(
                      'Error',
                      'Failed to save your words. Please try again.',
                      );
                      });
                      }}>
                      <Text
                        style={{
                        color: '#fff',
                        fontSize: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.90) : isSmallPhone ? hp(1.90) : isGalaxySPhone ? hp(1.75) : null,
                        fontWeight: 'bold',
                      }}>
                        Save List
                        </Text>
                    </TouchableOpacity>
                  </View>
                  {selectedCard === 'Lexicon' && (
                  <View
                    style={{
                    position: 'relative',
                    bottom: isMediumTallPhone ? hp(17.35) : isCompactMediumPhone ? hp(16.30) : isSmallPhone ? hp(16.65) : isGalaxySPhone ? hp(16.60) : null,
                    right:wp(6),
                    alignItems: 'center',
                    }}>
                    <TouchableOpacity
                      style={{
                      backgroundColor: '#f08080', // Button color
                      padding: hp(0.25),
                      alignItems: 'center',
                      borderRadius: wp(2.6),
                      borderColor: 'black',
                      borderWidth: 1,
                      width: 'auto', // Adjust dynamically to text
                      minWidth: wp(13), // Ensures a reasonable minimum width
                      flexDirection: 'row', // Ensures text stays in one line
                      justifyContent: 'center',
                      }}
                      onPress={handleLogout}>
                        <Text
                          style={{
                          color: 'black', // Classic black text
                          fontSize: wp(2.1),
                          fontWeight: 'bold',
                          }}
                          numberOfLines={1} // Prevents wrapping
                          ellipsizeMode="tail">
                             Logout
                        </Text>
                    </TouchableOpacity>
                  </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
        {selectedCard === 'Lexicon' && (
        <View
          style={{
          position: 'relative',
          bottom: isMediumTallPhone ? hp(5.25) : isCompactMediumPhone ? hp(6.65) : isSmallPhone ? hp(6.50) : isTallMediumPhone ? hp(5.25) : isGalaxySPhone ? hp(5.25) : null,
          left:wp(9),
          alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
            backgroundColor: 'ivory', // 🌙 Silver button for consistency
            padding: hp(0.25),
            alignItems: 'center',
            borderRadius: wp(2.6),
            borderColor: 'black',
            borderWidth: 1,
            width: 'auto', // Adjust dynamically to text
            minWidth: wp(13), // Ensures a reasonable minimum width
            flexDirection: 'row', // Ensures text stays in one line
            justifyContent: 'center',
            }}
            onPress={toggleSettingsModal}>
           <Text
            style={{
            color: 'black', // Classic black text
            fontSize: wp(2.1),
            fontWeight: 'bold',
            }}
            numberOfLines={1} // Prevents wrapping
            ellipsizeMode="tail">
              Settings
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Modal
  visible={isSettingsModalVisible}
  transparent={true}
  animationType="slide">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      {!isChangeColorVisible ? (
        <>
          {/* Main Settings Options */}
          <Text style={styles.modalTitle}>Settings</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('walletColorOptions')}>
            <Text style={styles.optionText}>Change Wallet Color </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('help')}>
            <Text style={styles.optionText}>Help </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('support')}>
            <Text style={styles.optionText}>Support </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={toggleSettingsModal}>
            <Text style={styles.closeButtonText}>Close </Text>
          </TouchableOpacity>
        </>
      ) : isChangeColorVisible === 'walletColorOptions' ? (
        <>
          {/* Wallet Color Options */}
          <Text style={styles.modalTitle}>Change Wallet Color</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('background')}>
            <Text style={styles.optionText}>Change Background </Text>
          </TouchableOpacity>
          
          {/* New Button for Inner Frame */}
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('innerFrame')}>
            <Text style={styles.optionText}>Change 'Translate' & 'Dictionary' Inner Frames </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('buttons')}>
            <Text style={styles.optionText}>Change Buttons </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setIsChangeColorVisible('text')}>
            <Text style={styles.optionText}>Change Text </Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsChangeColorVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : isChangeColorVisible === 'background' ? (
        <ChangeWalletColor
          onBack={() => setIsChangeColorVisible('walletColorOptions')}
          onColorChange={saveWalletFlapColor}
          onCardHolderColorChange={saveCardHolderColor}
          onLexiconColorChange={saveLexiconColor}
          onTranslateColorChange={saveTranslateColor}
          onDeviceColorChange={saveDeviceColor}
          onDictionaryColorChange={saveDictionaryColor}
          onInputAreaColorChange={saveInputAreaColor}
        />
      ) : isChangeColorVisible === 'innerFrame' ? (
        <ChangeInnerFrameColor
        onBack={() => setIsChangeColorVisible('walletColorOptions')}
        onTranslateFrameColorChange={saveTranslateFrameColor}
        onDictionaryFrameColorChange={saveDictionaryFrameColor}
        onDictionaryDefinitionColorChange={saveDictionaryDefinitionColor} // Pass new function
        onTranslateHeaderOneChange={saveTranslateHeaderOne} // New prop for Translate H1
        onTranslateHeaderTwoChange={saveTranslateHeaderTwo} // New prop for Translate H2
        />
      ) : isChangeColorVisible === 'text' ? (
        <ChangeTextColor
          onBack={() => setIsChangeColorVisible('walletColorOptions')}
          onCommonTextColorChange={saveCommonTextColor}
          onDiscoveredTextColorChange={saveDiscoveredTextColor}
          onCreateTextColorChange={saveCreateTextColor}
        />
      ) : isChangeColorVisible === 'buttons' ? (
        <ChangeButtons
          onBack={() => setIsChangeColorVisible('walletColorOptions')}
          onButtonColorChange={saveButtonColor}
          saveAddOrangeButtonColor={saveAddOrangeButtonColor}
          saveAddTurquoiseButtonColor={saveAddTurquoiseButtonColor}
        />
      ) : isChangeColorVisible === 'help' ? (
        <>
          <PaginatedHelpModal onBack={() => setIsChangeColorVisible(false)} />
        </>
      ) : isChangeColorVisible === 'support' ? (
        <>
          {/* Support Screen in Modal */}
          <Text style={styles.modalTitle}>Support </Text>
          <Text style={styles.supportText}>
            To report a bug, make a request to modify the code, or for account management-related issues, including account deletion, please contact: contactsupport@winkingstarstudios.net. We will get back to you within the day.
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsChangeColorVisible(false)}>
            <Text style={styles.closeButtonText}>Back </Text>
          </TouchableOpacity>
        </>
      ) : null}
    </View>
  </View>
</Modal>
      </KeyboardAwareScrollView>
        <View style={styles.adContainer}>
          <BannerAd
            unitId={__DEV__ ? TestIds.BANNER : 'ca-app-pub-3940256099942544/9214589741'}
            size={BannerAdSize.ADAPTIVE_BANNER}
            requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
</View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  cardHolder: {
    alignItems: 'center',
    backgroundColor: 'rgb(36, 95, 141)',
    borderColor: 'black',
    borderWidth: wp(0.3),
    flexDirection: 'column',
    marginBottom: hp(2.5),
    marginTop: hp(1.2),
    width: wp(90),
  },
  container: {
    backgroundColor: '#eee',
    flex: 1,
    height: hp(100),
    width: wp(100),
  },
  scrollContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    padding: wp(2.6),
  },
  walletFlap: {
    position:'relative',
    bottom: isMediumTallPhone ? hp(2.5) : isCompactMediumPhone ? hp(3.5) : isSmallPhone ? hp(3.5) : isTallMediumPhone ? hp(2.5) : isGalaxySPhone ? hp(2.5) : null,
    alignItems: 'center',
    backgroundColor: '#3827b3',
    borderColor: 'black',
    borderRadius: wp(4.5),
    borderWidth: wp(0.5),
    height: isMediumTallPhone ? hp(90) : isCompactMediumPhone ? hp(87.5) : isSmallPhone ? hp(87.5) : isTallMediumPhone ? hp(75) : isGalaxySPhone ? hp(90) : null,
    maxWidth: wp(150),
    padding: wp(5.2),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(1) },
    shadowOpacity: 0.3,
    shadowRadius: wp(4),
    width: '100%',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },


  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: wp(2.6),
    padding: wp(5.2),
    alignItems: 'center',
    elevation: 10,
  },

   modalTitle: {
    fontSize: wp(4.8),
    fontWeight: 'bold',
    marginBottom: hp(2.5),
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#2096F3',
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(5.2),
    borderRadius: wp(2.1),
    marginVertical: hp(1.6),
    width: wp(65),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    color: '#fff',
    fontSize: wp(3.7),
    textAlign: 'center',
  },
  supportText: {
    fontSize: wp(4.2),
    textAlign: 'center',
    lineHeight: hp(3),
    marginVertical: hp(2),
    color: '#333',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: wp(4),
    alignSelf: 'center',
  },
  closeButton: {
    backgroundColor: '#ff6347',
    paddingVertical: hp(1.6),
    paddingHorizontal: wp(5.2),
    borderRadius: wp(2.1),
    marginTop: hp(2.5),
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: wp(3.7),
    textAlign: 'center',
  },
  adContainer: {
    position: 'absolute',
    bottom: isMediumTallPhone ? '3%' : isCompactMediumPhone ? '3%' : isSmallPhone ? '2.50%' : isTallMediumPhone ? '3%' : isGalaxySPhone ? '3%' : null,
    width: isMediumTallPhone ? wp(5) : isCompactMediumPhone ? '97.5%' : isTallMediumPhone ? wp(5) : isGalaxySPhone ? wp(5) : null,
    left: isMediumTallPhone ? wp(47.5) : isCompactMediumPhone ? wp(3) : isTallMediumPhone ? wp(5) : isGalaxySPhone ? wp(47.5) : null, 
    height: isMediumTallPhone ? '1.5%' : isCompactMediumPhone ? '.1%' : isSmallPhone ? hp(1) : isTallMediumPhone ? '1.5%' : isGalaxySPhone ? '1.5%' : null,
    alignItems: 'center',
    backgroundColor: 'black', // Matches app theme
    justifyContent: 'center',
  },
});

export default WalletFlap;