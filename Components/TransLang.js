import React, {useState, useEffect} from 'react';
import {translateText} from './translatetextmodule';
import {debounce} from 'lodash';
import axios from 'axios';
import {Picker} from '@react-native-picker/picker';
import {Alert} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone, hp, wp } from './DynamicDimensions';



function TransLang({ onAddWord, buttonColor, translateHeaderOne, translateHeaderTwo, translateInnerColor }) {
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState('');
  const [targetLang, setTargetLang] = useState('');
  const [translateOption, setTranslateOption] = useState('');
  const [inputWord, setInputWord] = useState('');
  const [inputWords, setInputWords] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');
  const [error, setError] = useState(null);
  const [showAddLexicon, setShowAddLexicon] = useState(false);
  const [sourceLangName, setSourceLangName] = useState('');
  const [targetLangName, setTargetLangName] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: 'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation',
          headers: {
            'Ocp-Apim-Subscription-Key': '9b1b61cc4eca4636bc326e4fb09bd331',
            'Ocp-Apim-Subscription-Region': 'canadacentral',
          },
          timeout: 10000, // Set timeout to 10000 milliseconds (10 seconds)
        });
        const langs = Object.entries(response.data.translation).map(
          ([code, {name}]) => ({
            code: code,
            label: name,
          }),
        );
        setLanguages(langs);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx and possibly additional details
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
      }
    };
    fetchLanguages();
  }, []);

  useEffect(() => {
    const debouncedTranslate = debounce(async text => {
      if (!text || !sourceLang || !targetLang) {
        setTranslatedWord('');
        return;
      }
      try {
        const translation = await translateText(text, sourceLang, targetLang);
        setTranslatedWord(translation);
      } catch (error) {
        console.error('Error translating text:', error);
        setTranslatedWord('Translation failed');
      }
    }, 300);

    if (translateOption === 'words' && inputWords) {
      debouncedTranslate(inputWords);
    }

    return () => {
      debouncedTranslate.cancel();
    };
  }, [inputWords, sourceLang, targetLang, translateOption]);

  

  const clearInputWord = () => {
    setInputWord('');
    setTranslatedWord('');
    setShowAddLexicon(false); // This will hide the "Add to Lexicon" button
  };

  const clearInputWords = () => {
    setInputWords('');
    setTranslatedWord('');
    setShowAddLexicon(false); // This will hide the "Add to Lexicon" button
  };

  
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('translationState');
        if (savedState) {
          const {
            sourceLang,
            targetLang,
            sourceLangName,
            targetLangName,
            translateOption,
            inputWord,
            inputWords,
            translatedWord,
            showAddLexicon,
          } = JSON.parse(savedState);
        
          setSourceLang(sourceLang || '');
          setTargetLang(targetLang || '');
          setSourceLangName(sourceLangName || '');
          setTargetLangName(targetLangName || '');
          setTranslateOption(translateOption || '');
          setInputWord(inputWord || '');
          setInputWords(inputWords || '');
          setTranslatedWord(translatedWord || '');
          setShowAddLexicon(showAddLexicon || false);
        }
      } catch (error) {
        console.error('Failed to load state from AsyncStorage:', error);
      }
    };
  
    loadState();
  }, []);


  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(
          'translationState',
          JSON.stringify({
            sourceLang,
            targetLang,
            sourceLangName,
            targetLangName,
            translateOption,
            inputWord,
            inputWords,
            translatedWord,
            showAddLexicon,
          }),
        );
      } catch (error) {
        console.error('Failed to save state to AsyncStorage:', error);
      }
    };
  
    saveState();
  }, [sourceLang, targetLang, sourceLangName, targetLangName, translateOption, inputWord, inputWords, translatedWord, showAddLexicon]);


  const handleTranslation = async () => {
    if (!inputWord || !sourceLang || !targetLang) {
      setError('Please complete all fields before translating.');
      return;
    }

    if (translateOption === 'word' && inputWord.trim().includes(' ')) {
      Alert.alert('Translation Error', 'Must type one word');
      return;
    }

    try {
      const translation = await translateText(
        inputWord,
        sourceLang,
        targetLang,
      );
      setTranslatedWord(translation);
      await AsyncStorage.setItem(
        'translationState',
        JSON.stringify({
          sourceLang,
          targetLang,
          translateOption,
          inputWord,
          inputWords,
          translatedWord: translation,
          showAddLexicon: true,
        }),
      );
      setShowAddLexicon(true);
      setError(null);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedWord('Translation failed');
      setError('Failed to translate. Please check your input and try again.');
    }
  };


  const handleOptionChange = (newValue) => {
    setTranslateOption(newValue);
  };

  const handleAddToLexicon = () => {
    if (!inputWord.trim() || !translatedWord.trim()) {
      Alert.alert('Error', 'Please enter a word and ensure it has been translated before adding.');
      return;
    }
  
    if (translatedWord) {
      const capitalizedTerm = inputWord.charAt(0).toUpperCase() + inputWord.slice(1);
  
      const languageSuffix = targetLang ? targetLang.toUpperCase() : '';
  
      onAddWord({
        term: capitalizedTerm,
        definition: `${translatedWord} [${languageSuffix}]`,
        cardType: 'Translate',
      });
  
      Alert.alert(
        'Lexicon Update',
        `${capitalizedTerm} has been successfully added to your Lexicon!`
      );
  
      // ✅ DO NOT clear `inputWord` or `translatedWord`
      // ✅ KEEP `showAddLexicon` TRUE so the buttons remain
      setShowAddLexicon(true);
    }
  };

  

  const theme = {
    colors: {
      primary: '#2096F3', // Set the radio button color
    },
  };

  const resetState = async () => {
    try {
      await AsyncStorage.removeItem('translationState');
      setSourceLang('');
      setTargetLang('');
      setTranslateOption('');
      setInputWord('');
      setInputWords('');
      setTranslatedWord('');
      setShowAddLexicon(false);
    } catch (error) {
      console.error('Failed to reset state:', error);
    }
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: translateInnerColor, borderColor:buttonColor}]}>
  <View style={[styles.header, {backgroundColor:translateHeaderOne, borderColor:buttonColor}]}>
    <Text style={styles.headerText}>Translate a language</Text>
  </View>
  <View style={[styles.languageSelect, {borderColor:buttonColor, backgroundColor:translateHeaderTwo}]}>
    <Picker
      selectedValue={sourceLang}
      style={styles.picker}
      onValueChange={itemValue => {
      setSourceLang(itemValue);
      const selectedLang = languages.find(lang => lang.code === itemValue);
      setSourceLangName(selectedLang ? selectedLang.label : '');
      }}>
      <Picker.Item label={'Language'} value={''} />
        {languages.map(lang => (
      <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
      ))}
    </Picker>
    <Button
      color={buttonColor}
      title={'⇄'}
      onPress={() => {
        const tempLang = sourceLang;
        const tempLangName = sourceLangName;
      
        setSourceLang(targetLang);
        setSourceLangName(targetLangName);
      
        setTargetLang(tempLang);
        setTargetLangName(tempLangName);
      }}
    />
    <Picker
      selectedValue={targetLang}
      style={styles.picker}
      onValueChange={itemValue => {
        setTargetLang(itemValue);
        const selectedLang = languages.find(lang => lang.code === itemValue);
        setTargetLangName(selectedLang ? selectedLang.label : '');
        }}>
      <Picker.Item label={'Language'} value={''} />
        {languages.map(lang => (
      <Picker.Item key={lang.code} label={lang.label} value={lang.code} />
      ))}
    </Picker>
  </View>
  {sourceLang && targetLang && (
    <View>
      <View style={styles.selectedLanguagesContainer}>
    <Text style={styles.selectedLanguagesText}>
      {sourceLangName} to {targetLangName}
    </Text>
  </View>
      <RadioButton.Group
        value={translateOption}
        onValueChange={newValue => handleOptionChange(newValue)}
       >
        <View style={{flexDirection: 'row', width: '100%', color: 'white', right: isGalaxySPhone ? wp(2) : null, bottom: isMediumTallPhone ? hp(1.5) : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(1.5) : isGalaxySPhone ? hp(1.5) : null  }}>
          <View style={styles.radioButtonContainerOne}>
              <Text style={styles.radioText}>Single Word</Text>
            <RadioButton
              position={'relative'}
              right={'50%'}
              backgroundColor = {'white'}
              theme={theme}
              value={'word'}
            />
          </View>
          <View style={styles.radioButtonContainerTwo}>
            <Text style={styles.radioTextMulti}>Multi Word</Text>
            <RadioButton
              position={'relative'}
              right={'50%'}
              backgroundColor = {'white'}
              theme={theme}
              value={'words'}
            />
          </View>
        </View>
      </RadioButton.Group>
    </View>
  )}
  {translateOption === 'word' && (
    <View style={styles.inputContainerOne}>
      <TextInput
        placeholder={'Enter word'}
        style={styles.input}
        value={inputWord}
        onChangeText={text => setInputWord(text)}
      />
      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            position: 'relative',
            bottom: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? '6%' : isSmallPhone ? '6%' : isGalaxySPhone ? hp(1) : null,
            borderWidth: wp(0.3),
            borderColor: 'black',
            overflow: 'hidden',
            width: '40%',
            marginBottom: isMediumTallPhone ? '5%' : isCompactMediumPhone ? hp(5) : isSmallPhone ? hp(5) : isGalaxySPhone ? '5%' : null,
            borderRadius: wp(2.3),
          }}>
          <Button
            color={buttonColor}
            title={'Translate'}
            onPress={handleTranslation}
          />
        </View>
        <View width={'5.5%'} />
        <View
          style={{
            position: 'relative',
            bottom: isMediumTallPhone ? hp(1) : isCompactMediumPhone ? '6%' : isSmallPhone ? '6%' : isGalaxySPhone ? hp(1) : null,
            borderWidth: wp(0.3),
            borderColor: 'black',
            width: '29%',
            overflow: 'hidden',
            marginBottom: isMediumTallPhone ? '5%' : isCompactMediumPhone ? hp(5) : isSmallPhone ? hp(5) : isGalaxySPhone ? '5%' : null,
            borderRadius: wp(2.3),
          }}>
          <Button
            color={buttonColor}
            title={'Clear'}
            onPress={clearInputWord}
          />
        </View>
      </View>
      <View>
        <View style={{ position:'relative', top:' 7.5%' }}>
        {translatedWord && (
        <View style={{ overFlow:'visible', minHeight:'20%', lineHeight:hp(19), verticalAlign: 'middle' }}>
          <Text style={styles.translationOne}>
            Translation: {translatedWord}
          </Text>
        </View>
        )}
        </View>
        {error && <Text style={styles.error}>{error}</Text>}
        {showAddLexicon && (
          <View style={{ position: 'relative', top: '5%' }}>
            <View
              style={{
                position:'relative',
                top:'10%',
                borderWidth: 1,
                borderColor: 'black',
                width: '55%',
                overflow: 'hidden',
                borderRadius: 5,
                marginBottom: '15%',
              }}>
              <Button
                color={buttonColor}
                style={{height: 25}}
                title={'Add to Lexicon'}
                onPress={handleAddToLexicon}
              />
            </View>
            {translatedWord && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: 'black',
                  width: '55%',
                  overflow: 'hidden',
                  borderRadius: 5,
                  position: 'relative',
                  bottom: '2.5%',
                  marginBottom:'10%'
                }}>
                <Button
                  color={'#FF6347'}
                  title={'Reset All'}
                  onPress={resetState}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  )}
  {translateOption === 'words' && (
    <View style={styles.inputContainerTwo}>
      <View>
        <TextInput
          maxLength={1000}
          multiline={true}
          placeholder={'Enter words'}
          placeholderTextColor={'gray'}
          style={styles.textArea}
          textAlignVertical={'top'}
          value={inputWords}
          onChangeText={text => setInputWords(text)}
      />
      </View>
      <View style={{position: 'relative'}}>
        <View style={{position:'relative', bottom:'3%' , width: '35%', borderWidth: 1, borderColor: 'black'}}>
          <Button
            color={buttonColor}
            title={'Clear'}
            onPress={clearInputWords}
          />
        </View>
        <View style={{maxHeight: 150000}}>
            <Text style={styles.translationTwo}>
              Translation: {translatedWord}
            </Text>
          {translatedWord && (
            <View
              style={{
                position:'relative',
                top: null,
                bottom: null,
                left: isMediumTallPhone ? wp(13) : isCompactMediumPhone ? null: isGalaxySPhone ? wp(13) : null,
                width: '55%',
                overflow: 'hidden',
                borderRadius: wp(2.3),
                marginBottom: '10%',

              }}>
              <Button
                color={'#FF6347'}
                title={'Reset All'}
                onPress={resetState}
              />
            </View>
          )}
        </View>
      </View>
    </View>
  )}
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3827b3',
    borderColor: '#2096F3',
    borderRadius: wp(2),
    borderWidth: wp(0.5),
    padding: wp(2.6),
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    height:'auto',
  },
  error: {
    color: 'red',
    fontSize: wp(6), // Converted from 24px
    marginBottom: hp(2.5), // Converted from 10px
  },
  header: {
    backgroundColor: '#3827b3',
    borderColor: '#2096F3',
    borderRadius: wp(2),
    borderWidth: wp(0.5),
    marginBottom: hp(3), // Converted from 20px
    padding: wp(2.6),
    textAlign: 'center',
  },
  headerText: {
    color: 'ivory',
    fontSize: wp(5.2), // Converted from 20px
    textAlign: 'center',
  },
  input: {
    position:'relative',
    bottom: isMediumTallPhone ? null: isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(1.5) : isGalaxySPhone ? null : null,
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: wp(2.3),
    borderWidth: wp(0.3),
    fontSize: wp(4.2), // Converted from 16px
    height: hp(6.5), // Converted from '30%'
    marginBottom: hp(5),
    marginTop: hp(3),
    textAlign: 'center',
    width: '90',
  },
  inputContainerOne: {
    height: 'auto',
    marginBottom: hp(2.5),
  },

  inputContainerTwo: {
    position: 'relative',
    left: wp(3.5), // Converted from '3.5%'
    height: 'auto',// Converted from '35%'
  },

  languageSelect: {
    alignItems: 'center',
    borderColor: '#2096F3',
    borderRadius: wp(2),
    borderWidth: wp(0.3),
    color: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2.5),
    padding: wp(1.3),
  },

  picker: {
    borderColor: 'black',
    borderWidth: wp(0.3),
    color: 'white',
    height: hp(6), // Converted from 45px
    width: '45%',
  },

  radioButtonContainerOne: {
    position: 'relative',
    left: isMediumTallPhone ? wp(10) : isCompactMediumPhone ? wp(12) : isSmallPhone ? wp(12) : isGalaxySPhone ? wp(15) : null,
    bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? wp(0.01) : isGalaxySPhone ? null : null,
    color: 'white',
    flexDirection: 'row',
  },

  radioButtonContainerTwo: {
    position: 'relative',
    left: isMediumTallPhone ? wp(10) : isCompactMediumPhone ? wp(15) : isSmallPhone ? wp(15) : isGalaxySPhone ? wp(19) : null,
    bottom: isMediumTallPhone ? null : isCompactMediumPhone ? hp(1.5) : isSmallPhone ? hp(0.01) : isGalaxySPhone ? null : null,
    color: 'white',
    flexDirection: 'row',
  },

  radioText: {
    position: 'relative',
    right: isMediumTallPhone ? null : isCompactMediumPhone ? wp(5) : isSmallPhone ? wp(5) : isGalaxySPhone ? wp(5) : null,
    color: 'ivory',
    fontSize: wp(2.6), // Converted from 10px
    textAlign: 'left',
  },

  radioTextMulti: {
    position: 'relative',
    right: isMediumTallPhone ? null : isCompactMediumPhone ? wp(5) : isSmallPhone ? wp(5) : isGalaxySPhone ? wp(5) : null,
    color: 'ivory',
    fontSize: wp(2.6),
    textAlign: 'left',
  },
  textArea: {
    position:'relative',
    
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: wp(0.3),
    color: 'black',
    fontSize: wp(4.2), // Converted from 16px
    height: hp(25), // Converted from 200px
    marginBottom: hp(5),
    marginTop: hp(5),
    maxHeight: hp(25),
    maxWidth: wp(78), // Converted from 300px
    padding: wp(2.6),
    textAlign: 'left',
    width: wp(70),
  },
  toText: {
    color: 'white',
    fontSize: wp(5), // Converted from 19px
    fontWeight: 'bold',
    textAlign: 'center',
    width: '10%',
  },

  translationOne: {
    color: 'ivory',
    fontSize: wp(4.5),
    marginBottom: isMediumTallPhone ? hp(3.5) : isCompactMediumPhone ? hp(3.5) : isSmallPhone ? hp(3.5) : isGalaxySPhone ? hp(3.5) : null,
    position: 'relative', // Reset bottom
    lineHeight: wp(5.5), // Ensure text isn't cut off
    textAlignVertical: 'center', // Helps with text alignment
    textAlign: 'center',
    minHeight: hp(10), // Ensure enough space for text
  },
  translationTwo: {
    position: 'relative',
    top: hp(0), // Converted from '13%'
    color: 'ivory',
    fontSize: wp(3.8), // Converted from 15px
    marginBottom: hp(5),
    marginTop: hp(3),
    overFlow: 'visible',
    whiteSpace: 'normal'
  },
  selectedLanguagesContainer: {
    alignItems: 'center',
    marginVertical: hp(2.5),
    marginBottom: hp(5),
  },
  selectedLanguagesText: {
    fontSize: wp(4.7), // Converted from 18px
    color: 'ivory',
    fontWeight: 'bold',
  },
});



export default TransLang;