import React from 'react';
import { RadioButton } from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { hp, wp } from './DynamicDimensions';

function TermsList({
  entries,
  onEditInit,
  onDelete,
  onEditSave,
  editingIndex,
  editTempEntry,
  setEditTempEntry,
  commonColor,
  discoveredColor,
  createTextColor
}) {
  return (
    <ScrollView style={styles.listContainer}>
      {entries.map((entry, index) => (
        <View key={entry.id} style={styles.entryItem}>
          {editingIndex === index ? (
            <View style={styles.editControls}>
              {/* First Part Input */}
              <TextInput
                placeholder={'Enter term'}
                style={styles.input}
                value={editTempEntry.firstPart.text || ''} // ✅ Ensure only .text is accessed
                onChangeText={text =>
                  setEditTempEntry({
                    ...editTempEntry,
                    firstPart: { ...editTempEntry.firstPart, text }
                  })
                }
              />

              {/* Second Part Input */}
              <TextInput
                placeholder={'Enter definition'}
                style={styles.input}
                value={editTempEntry.secondPart.text || ''} // ✅ Ensure only .text is accessed
                onChangeText={text =>
                  setEditTempEntry({
                    ...editTempEntry,
                    secondPart: { ...editTempEntry.secondPart, text }
                  })
                }
              />
              
              {/* Category Selection */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
                <View style={{ marginHorizontal: 1 }}>
                  <Text>Category:</Text>
                  <RadioButton.Group
                    value={editTempEntry.category || 'None'} // ✅ Ensure category is a valid string
                    onValueChange={newValue =>
                      setEditTempEntry({ ...editTempEntry, category: newValue })
                    }>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Technical'} />
                      <Text>Technical </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Scientific'} />
                      <Text>Scientific </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Social'} />
                      <Text>Social </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Miscellaneous'} />
                      <Text>Miscellaneous </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'None'} />
                      <Text>None </Text>
                    </View>
                  </RadioButton.Group>
                </View>

                {/* Text Type Selection */}
                <View style={{ marginHorizontal: wp(1) }}>
                  <Text>Text Type:</Text>
                  <RadioButton.Group
                    value={editTempEntry.textType || 'Common'} // ✅ Ensure textType is a valid string
                    onValueChange={newValue =>
                      setEditTempEntry({ ...editTempEntry, textType: newValue })
                    }>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Common'} />
                      <Text style={{ color: commonColor }}>Common </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Discovered'} />
                      <Text style={{ color: discoveredColor }}>Discovered </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Create'} />
                      <Text style={{ color: createTextColor }}>Create </Text>
                    </View>
                  </RadioButton.Group>
                </View>
              </View>
              
              {/* Save Button */}
              <View style={styles.saveButtonWrapper}>
                <Button title={'Save'} onPress={() => onEditSave(entry.id)} />
              </View>
            </View>
          ) : (
            <View style={styles.wordDisplay}>
              {/* Display Text */}
              <Text style={styles.wordText}>
                <Text style={entry.firstPart.style}>
                  {index + 1}. 
                </Text>
                  {entry.category && entry.category !== 'None' && (
                  <Text style={{ fontWeight: 'normal', fontStyle: 'italic', color: 'gray' }}>
                  {" "}({entry.category}){" "}
                </Text>
                  )}
                <Text style={entry.firstPart.style}>
                  "{entry.firstPart.text}"
                </Text>
                <Text style={entry.secondPart.style}>: {entry.secondPart.text}</Text>
              </Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    onEditInit(index, entry.firstPart.text, entry.secondPart.text, entry.category, entry.textType)
                  }
                  >
                  <Text style={styles.buttonText}>Ed</Text>
                </TouchableOpacity>
                <View style={styles.gap} />
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => onDelete(entry.id)}>
                  <Text style={styles.buttonText}>Del</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: wp(3.8),
  },
  controlButtons: {
    flexDirection: 'row',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    padding: wp(1.6),
  },
  editButton: {
    backgroundColor: '#2096F3',
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    padding: wp(1.6),
  },
  editControls: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  entryItem: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ccc',
    borderBottomWidth: wp(0.3),
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(2.6),
  },
  listContainer: {
    flex: 1,
    padding: wp(2.6),
  },
  radioGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(1.3),
  },
  wordDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wordText: {
    flex: 1,
  },
  saveButtonWrapper: {
    borderColor: 'black',
    borderWidth: wp(0.3),
    borderRadius: wp(2.3),
    marginBottom: '5%',
    alignItems: 'center',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: wp(0.3),
    marginBottom: hp(1),
    padding: wp(2.6),
    width: '100%',
  },
  gap: {
    width: wp(0.8), // Matches 3px
  },
});

export default TermsList;