import React from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useDeviceType, hp, wp, normalize, scaleSize } from './DynamicDimensions';

function WordList({
  words,
  onEditInit,
  onDelete,
  onEditSave,
  editingId,
  tempTerm,
  setTempTerm,
  tempDefinition,
  setTempDefinition,
}) {
  const capitalize = (word) => {
    if (!word || typeof word !== 'string') return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const sortedWords = [...words]
    .filter(item => item.type === "Lexicon")
    .map(item => ({
      ...item,
      term: item.term ? capitalize(item.term) : "Unnamed Entry",
      definition: item.definition || "",
    }))
    .sort((a, b) => a.term.localeCompare(b.term));

  console.log(`🟢 Current editingId: ${editingId}`);

  const deleteWordWithoutId = (index) => {
    setWords(prevWords => prevWords.filter((_, i) => i !== index));
    console.log(`🗑 Deleted word at index: ${index}`);
  };

  return (
    <View style={styles.wordListContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {sortedWords.map((item, index) => {
          console.log(`Rendering item → ID: ${item.id}, Term: ${item.term}, Definition: ${item.definition}`);
          
          const uniqueKey = item.id ? `id-${item.id}` : `idx-${index}`;

          return (
            <View key={uniqueKey} style={styles.wordItem}>
              {editingId && editingId === item.id ? (
                <View style={styles.editControls}>
                  <TextInput
                    placeholder={'Edit term'}
                    style={styles.input}
                    value={tempTerm}
                    onChangeText={text => setTempTerm(capitalize(text))}
                  />
                  <TextInput
                    placeholder={'Edit definition'}
                    style={styles.input}
                    value={tempDefinition}
                    onChangeText={text => setTempDefinition(text)}
                  />
                  <View style={styles.saveButtonContainer}>
                    <Button title={'Save'} onPress={onEditSave} />
                  </View>
                </View>
              ) : (
                <View style={styles.wordDisplay}>
                  <Text style={styles.wordText}>
                    {index + 1}.{' '}
                    <Text
                      style={{
                        color: item.isFromDictionary ? '#8a47ff' : item.termStyle?.color,
                      }}>
                      {item.term}
                    </Text>
                    {item.definition ? (
                      <>
                        :{' '}
                        <Text style={{ fontStyle: 'italic', color: 'black' }}>
                          {item.definition}
                        </Text>
                      </>
                    ) : null}
                  </Text>
                  <View style={styles.controlButtons}>
                    <View style={styles.controlButtonsEdit}>
                      <Button
                        color={'#2096F3'}
                        title={'Ed'}
                        onPress={() => onEditInit(item.id, item.term, item.definition)}
                      />
                    </View>
                    <View style={styles.controlButtonsDelete}>
                      <Button
                        color={'#ff6347'}
                        title={'Del'}
                        onPress={() => onDelete(item.id)}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  controlButtons: {
    flexDirection: 'row',
    gap: wp(0.8),
  },
  controlButtonsDelete: {
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    overflow: 'hidden',
  },
  controlButtonsEdit: {
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    overflow: 'hidden',
  },
  editControls: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: wp(2),
    width: '100%',
  },
  input: {
    borderColor: '#ccc',
    borderRadius: wp(1.5),
    borderWidth: wp(0.3),
    marginBottom: hp(1.2),
    padding: wp(2.2),
    width: '100%',
  },
  saveButtonContainer: {
    alignSelf: 'flex-end',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: hp(2.5),
  },
  wordDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  wordItem: {
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: wp(0.3),
    flexDirection: 'column',
    padding: wp(2.6),
    width: '100%',
  },
  wordListContainer: {
    width: '110%',
    height: '35%',
    maxHeight: hp(36),
    backgroundColor: '#fff',
    padding: wp(2.6),
    marginBottom: hp(2.5),
    borderRadius: wp(1.5),
    borderWidth: wp(0.5),
    borderColor: 'black',
    overflow: 'hidden',
  },
  wordText: {
    flex: 1,
    marginRight: wp(2.6),
  },
});

export default WordList;