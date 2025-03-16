import React from 'react';
import {RadioButton} from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

function EuphemismList({
  entries,
  onEditInit,
  onDelete,
  onEditSave,
  editingIndex,
  editTempEntry,
  setEditTempEntry,
  commonColor,
  discoveredColor,
  createTextColor,
}) {
  return (
    <ScrollView style={styles.listContainer}>
      {entries.map((entry, index) => {
        const getColorForTextType = textType => {
          switch (textType) {
            case 'Create':
              return createTextColor;
            case 'Discovered':
              return discoveredColor;
            case 'Common':
              return commonColor;
            default:
              return '#000'; // Default to black
          }
        };

        const entryColor = getColorForTextType(entry.textType);

        return (
          <View key={entry.id} style={styles.entryItem}>
            {editingIndex === index ? (
              <View style={styles.editControls}>
                {/* First Part Input */}
                <TextInput
                  placeholder={'Enter substituted expression'}
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
                  placeholder={'Enter euphemism'}
                  style={styles.input}
                  value={editTempEntry.secondPart.text || ''} // ✅ Ensure only .text is accessed
                  onChangeText={text =>
                  setEditTempEntry({
                  ...editTempEntry,
                  secondPart: { ...editTempEntry.secondPart, text }
                })
                }
              />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  {/* Category Column */}
                  <View style={{marginHorizontal: 20}}>
                    <Text>Category:</Text>
                    <RadioButton.Group
                      value={editTempEntry.category || 'None'} // ✅ Ensure category defaults properly
                      onValueChange={newValue =>
                      setEditTempEntry({ ...editTempEntry, category: newValue })
                    }>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Positive'} />
                      <Text>Positive </Text>
                      </View>
                      <View style={styles.radioGroup}>
                      <RadioButton value={'Negative'} />
                      <Text>Negative </Text>
                      </View>
                        <View style={styles.radioGroup}>
                      <RadioButton value={'None'} />
                      <Text>None </Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                <View style={{marginHorizontal: 20}}>
                  <Text>Text Type:</Text>
                  <RadioButton.Group
                      value={editTempEntry.textType || 'Common'} // ✅ Ensure a default fallback
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
                <View
                  style={{
                    overFLow: 'hidden',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 5,
                    marginBottom: '5%',
                    alignItems: 'center',
                  }}>
                  <Button title={'Save'} onPress={() => onEditSave(entry.id)} />
                </View>
              </View>
            ) : (
              <View style={styles.wordDisplay}>
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
                      onEditInit(
                        index,
                        entry.firstPart.text, // ✅ Ensure only the text is passed
                        entry.secondPart.text, // ✅ Ensure only the text is passed
                        entry.category,
                        entry.textType
                      )
                    }>
                    <Text style={styles.buttonText}>Ed </Text>
                  </TouchableOpacity>
                  <View style={styles.gap} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(entry.id)}>
                    <Text style={styles.buttonText}>Del </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: wp(3.7), // Converted from 14
  },
  controlButtons: {
    flexDirection: 'row',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    borderColor: 'black',
    borderRadius: wp(2.6), // Converted from 10
    borderWidth: wp(0.3), // Converted from 1
    padding: wp(1.6), // Converted from 6
  },
  editButton: {
    backgroundColor: '#2096F3',
    borderColor: 'black',
    borderRadius: wp(2.6), // Converted from 10
    borderWidth: wp(0.3), // Converted from 1
    padding: wp(1.6), // Converted from 6
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
    borderBottomWidth: wp(0.3), // Converted from 1
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: wp(2.6), // Converted from 10
  },
  gap: {
    width: wp(0.8), // Converted from 3
  },
  gapTwo: {
    width: wp(5.2), // Converted from 20
  },
  input: {
    borderColor: '#ccc',
    borderWidth: wp(0.3), // Converted from 1
    marginBottom: hp(0.65), // Converted from 5
    padding: wp(2.6), // Converted from 10
    width: '100%',
  },
  listContainer: {
    flex: 1,
    padding: wp(2.6), // Converted from 10
  },
  radioGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(0.65), // Converted from 5
  },
  wordDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wordText: {
    flex: 1,
  },
});

export default EuphemismList;
