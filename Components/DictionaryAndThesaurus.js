import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { isMediumTallPhone, isCompactMediumPhone, hp, wp } from './DynamicDimensions';


function DictionaryAndThesaurus({onAddWord, buttonColor, dictionaryInnerColor, dictionaryDefinitionColor }) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [synonyms, setSynonyms] = useState([]);
  const [error, setError] = useState(null);

  // Load the last searched word on component mount
  const loadLastSearch = async () => {
    try {
      const savedWord = await AsyncStorage.getItem('lastWord');
      const savedDefinition = await AsyncStorage.getItem('lastDefinition');
      const savedSynonyms = await AsyncStorage.getItem('lastSynonyms');
  
      if (savedWord) setWord(savedWord);
      
      // Ensure definition is retrieved as an array
      if (savedDefinition) {
        const parsedDefinition = JSON.parse(savedDefinition);
        setDefinition(Array.isArray(parsedDefinition) ? parsedDefinition : [parsedDefinition]);
      }
  
      if (savedSynonyms) setSynonyms(JSON.parse(savedSynonyms));
    } catch (error) {
      console.error('Failed to load last search:', error);
    }
  };

  // Save the last searched word when it changes
  const saveLastSearch = async () => {
    try {
      await AsyncStorage.setItem('lastWord', word);
  
      // Ensure definition is stored as a string
      await AsyncStorage.setItem('lastDefinition', JSON.stringify(definition));
  
      await AsyncStorage.setItem('lastSynonyms', JSON.stringify(synonyms));
    } catch (error) {
      console.error('Failed to save last search:', error);
    }
  };

  useEffect(() => {
    loadLastSearch();
  }, []);


  useEffect(() => {
    if (word || definition.length > 0 || synonyms.length > 0) {
      saveLastSearch();
    }
  }, [word, definition, synonyms]);



  const handleInputChange = text => {
    setWord(text);
  };

  const handleLookup = async () => {
    try {
      // Check if the entered word contains spaces
      if (/\s/.test(word)) {
        Alert.alert(
          "Sorry", 
          "Dictionary defines only a single word. Please enter a word and ensure there is no space after the last letter."
        );
        return; // Stop execution if a space is detected
      }
  
      const defResponse = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=cb3eb3d3-8f9e-4e34-aba0-37f7c0b79b25`,
      );
  
      const defData = defResponse.data[0];
  
      // Ensure definition is always an array
      const newDefinitions = Array.isArray(defData.shortdef) ? defData.shortdef : [defData.shortdef];
  
      setDefinition(newDefinitions);
      await AsyncStorage.setItem('lastDefinition', JSON.stringify(newDefinitions));
  
      // Fetch synonyms with the correct API key
      const synResponse = await axios.get(
        `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=70214f0d-9f71-4e02-9195-c560a2227a78`,
      );
  
      const synData = synResponse.data[0];
  
      // Debugging: Check full API response
      console.log("🔍 FULL SYNONYMS API RESPONSE:", JSON.stringify(synResponse.data, null, 2));
  
      if (!synData || Object.keys(synData).length === 0) {
        console.warn("⚠️ No valid data found in synonyms API response.");
        setSynonyms([]); 
        return;
      }
  
      console.log("🔍 Available keys in synData:", Object.keys(synData));
  
      // Ensure `synonyms` is always a valid array
      let newSynonyms = [];
  
      if (synData.meta && Array.isArray(synData.meta.syns) && synData.meta.syns.length > 0) {
        newSynonyms = synData.meta.syns.flat(); // Flattens nested arrays, if any
      } else {
        console.warn("⚠️ No synonyms found under 'meta.syns'. Checking alternative fields...");
        
        // 🔍 Check if there are alternative synonym fields in the response
        if (Array.isArray(synData.shortdef) && synData.shortdef.length > 0) {
          newSynonyms = synData.shortdef; // Sometimes the API stores related words under 'shortdef'
          console.log("✅ Using 'shortdef' as synonyms:", newSynonyms);
        } else {
          console.warn("⚠️ No synonyms found in 'meta.syns' or 'shortdef'.");
        }
      }
  
      console.log("✅ Processed Synonyms:", newSynonyms);
  
      if (newSynonyms.length === 0) {
        console.warn("⚠️ No synonyms found for this word.");
      }
  
      setSynonyms(newSynonyms);
      await AsyncStorage.setItem('lastSynonyms', JSON.stringify(newSynonyms));
  
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setError('No definition found. Please ensure correct spelling or try a different word.');
      setDefinition([]);
      setSynonyms([]); // Clear synonyms on error
    }
  };
  
  const handleClear = async () => {
    try {
      // Clear state
      setWord('');
      setDefinition('');
      setSynonyms([]);
      setError(null);

      // Clear data from AsyncStorage
      await AsyncStorage.removeItem('lastWord');
      await AsyncStorage.removeItem('lastDefinition');
      await AsyncStorage.removeItem('lastSynonyms');
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  };

  const handleAddWord = (term, definition) => {
    if (!term.trim() || !definition.trim()) {
      Alert.alert('Error', 'Please fill in both the term and its definition before adding.');
      return;
    }
  
    if (onAddWord) {
      // Capitalize the first letter of the term
      const capitalizedTerm = term.charAt(0).toUpperCase() + term.slice(1);
  
      // Pass the capitalized term and definition to addStyledWord
      onAddWord({
        term: capitalizedTerm,
        definition,
        cardType: 'Dictionary', // Optional: if you want to identify the source
      });
  
      Alert.alert(
        'Success',
        `${capitalizedTerm} has been successfully added to your Lexicon!`,
      );
    } else {
      console.error('onAddWord function not passed correctly.');
    }
  };

  return (
    <ScrollView style={[styles.mainScrollView, { backgroundColor: dictionaryInnerColor }]} nestedScrollEnabled={true}>
      <TextInput
        placeholder={'Enter a word'}
        style={styles.input}
        value={word}
        onChangeText={handleInputChange}
      />
      <View style={styles.buttonContainer}>
        <View style={{ overflow: 'hidden', borderRadius: 10 }}>
          <Button color={buttonColor} title={'Define'} onPress={handleLookup} />
        </View>
        <View style={{ overflow: 'hidden', borderRadius: 10 }}>
          <Button color={'#ff6347'} title={'Clear'} onPress={handleClear} />
        </View>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
  
      {definition.length > 0 && (
        <View style={[styles.definitionContainer, { backgroundColor: dictionaryDefinitionColor }]}>
          <ScrollView style={styles.definitionScrollView} nestedScrollEnabled={true}>
            {/* Main Definition */}
            <Text style={styles.definition}>
              <Text style={styles.strong}>Definition:</Text> {definition[0]}
            </Text>
          </ScrollView>
  
          {/* Main Add to Lexicon Button */}
          <View style={styles.addToLexiconButton}>
            <Button
              color={buttonColor}
              title={'Add to Lexicon'}
              onPress={() => handleAddWord(word, definition[0])}
            />
          </View>
  
          {/* Additional Definitions (if any) */}
          {definition.length > 1 && (
            <ScrollView style={styles.additionalDefinitionsScrollView} nestedScrollEnabled={true}>
              {definition.slice(1).map((def, index) => (
                <View 
                  key={index} 
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    marginBottom: hp(2), 
                    padding: wp(2),
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: wp(2)
                  }}
                >
                  <Text style={{ color: 'ivory', fontSize: wp(2.75), flex: 1 }}>
                    <Text>Definition {index + 2}:</Text> {def}
                  </Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: buttonColor,
                      padding: wp(2),
                      borderRadius: wp(2),
                      borderWidth: wp(0.3),
                      borderColor: 'black',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: wp(2),
                    }}
                    onPress={() => handleAddWord(word, def)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Add</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      )}
  
  {synonyms.length > 0 && (
  <View style={[styles.synonymsContainerWrapper, { display: 'flex' }]}>
    <Text style={{ color: 'black', marginBottom: hp(1.5) }}>Synonyms:</Text>
    <ScrollView style={styles.synonymsScrollView} nestedScrollEnabled={true}>
      {synonyms.map((item, index) => (
        <View key={index} style={styles.synonymItem}>
          <Text style={styles.synonymText}>
            {index + 1}. {item}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddWord(item, definition[0])}
          >
            <View style={styles.squareAddButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  </View>
)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addButton: {
    borderRadius: wp(2.6), // Converted from 10
    overflow: 'hidden',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#3827b3',
    borderColor: 'silver',
    borderRadius: wp(2.6), // Converted from 10
    borderWidth: wp(0.3), // Converted from 1
    padding: wp(5.2), // Converted from 20
    width: '100%',
    marginBottom: isMediumTallPhone ? '-2%' : isCompactMediumPhone ? '-8' : null,
  },
  definition: {
    color: 'ivory',
    fontStyle: 'italic',
    marginTop: hp(1), // Converted from '8%'
  },
  error: {
    color: 'red',
    marginVertical: hp(1.3), // Converted from 10
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderRadius: wp(1.3), // Converted from 5
    borderWidth: wp(0.3), // Converted from 1
    color: 'black',
    marginBottom: hp(1.3), // Converted from 10
    padding: wp(2.6), // Converted from 10
    width: '100%',
  },
  strong: {
    fontWeight: 'bold',
    color:'ivory',
  },
  synonymItem: {
    marginBottom: hp(0.13), // Converted from '1%'
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  synonymText: {
    flex: 1,
    color: 'black',
    marginRight: wp(2.6), // Converted from 10
  },
  synonymsContainer: {
    flex: 1,
    width: '100%',
    maxHeight: hp(26), // Converted from 200
    overflow: 'hidden',
    borderWidth: wp(0.3), // Converted from 1
    borderColor: '#ccc',
    padding: wp(2.6), // Converted from 10
    borderRadius: wp(1), // Converted from 4
    backgroundColor: 'white',
    marginTop: hp(0.65), // Converted from '5%'
  },
  synonymsContainerWrapper: {
    position: 'relative',
    width: '100%',
    backgroundColor: 'white',
    borderWidth: wp(0.3),
    borderColor: '#ccc',
    borderRadius: wp(2.6),
    padding: wp(2.6),
    marginTop: hp(1.3),
    maxHeight: isMediumTallPhone ? hp(20) : isCompactMediumPhone ? hp(18) : null,
    overflow: 'scroll', // Allow full visibility
    display: 'flex', // Ensures it appears
  },
  synonymsScrollView: {
    maxHeight: hp(21),
    nestedScrollEnabled: true,
  },
  definitionContainer: {
    width: '100%', 
    maxHeight: hp(45), // Slightly larger than before for easier scrolling
    overflow: 'hidden', 
    borderWidth: wp(0.3),
    borderColor: '#ccc',
    borderRadius: wp(1.3),
    padding: wp(2.6),
    backgroundColor: '#3827b3',
    marginTop: hp(1.3),
  },
  
  definitionScrollView: {
    maxHeight: '100%',
    nestedScrollEnabled: true, // Enables independent scrolling
  },

  mainScrollView: {
    flex: 1,
    width: '100%',
    height: '100%',
    nestedScrollEnabled: true,
  },

  addToLexiconButton: {
    position:'relative',
    top: isMediumTallPhone ? hp(0.5) : isCompactMediumPhone ? hp(1.5) : null,
    left: isMediumTallPhone ? wp(12) : isCompactMediumPhone ? null : null, 
    width: '65%',
    overflow: 'hidden',
    borderRadius: 10,
    marginTop: '5%',
    marginBottom: '6.5%',
  },


  squareAddButton: {
    width: wp(12), // Adjust size as needed
    height: wp(7),
    borderRadius: wp(2), // Rounded edges
    backgroundColor: '#2096F3', // Your requested color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: wp(0.3),
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
  },
  
  addButtonText: {
    color: 'white',
    fontSize: wp(3.0),
    fontWeight: 'bold',
  },


});

export default DictionaryAndThesaurus;