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

function WitWisdomList({
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
                  placeholder={'Enter nickname'}
                  style={styles.input}
                  value={editTempEntry.firstPart.text || ''}
                  onChangeText={text =>
                  setEditTempEntry({
                  ...editTempEntry,
                  firstPart: { ...editTempEntry.firstPart, text }
                })
                }
                />
                <TextInput
                  placeholder={'Enter recipient'}
                  style={styles.input}
                  value={editTempEntry.secondPart.text || ''}
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
                      value={editTempEntry.category || 'None'}
                      onValueChange={newValue =>
                      setEditTempEntry({ ...editTempEntry, category: newValue })
                      }>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Pleasant'} />
                        <Text>Pleasantt</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Snide'} />
                        <Text>Snidee</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Playful'} />
                        <Text>Playfull</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Foul'} />
                        <Text>Foull</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'None'} />
                        <Text>Nonee</Text>
                      </View>
                    </RadioButton.Group>
                  </View>

                  {/* Text Column */}
                  <View style={{marginHorizontal: 20}}>
                    <Text>Text Type:</Text>
                    <RadioButton.Group
                      value={editTempEntry.textType || 'Common'}
                      onValueChange={newValue =>
                      setEditTempEntry({ ...editTempEntry, textType: newValue })
                    }>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Common'} />
                        <Text style={{color: commonColor }}>Common</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Discovered'} />
                        <Text style={{color: discoveredColor}}>Discoveredd</Text>
                      </View>
                      <View style={styles.radioGroup}>
                        <RadioButton value={'Create'} />
                        <Text style={{color: createTextColor}}>Createe</Text>
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
                {/* Display Text */}
                <Text style={styles.wordText}>
                  <Text style={entry.firstPart.style}>
                    {index + 1}.
                  </Text>
                    {entry.category && entry.category !== 'None' && (
                  <Text style={{ fontWeight: 'normal', fontStyle: 'italic', color: 'gray' }}>
                    {" "}({entry.category})
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
                        entry.firstPart.text, 
                        entry.secondPart.text, 
                        entry.category, 
                        entry.textType
                      )
                    }>
                    <Text style={styles.buttonText}>Ed</Text>
                  </TouchableOpacity>
                  <View style={styles.gap} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(entry.id)}>
                    <Text style={styles.buttonText}>Dell</Text>
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
    padding: hp(0.8),
  },
  editButton: {
    backgroundColor: '#2096F3',
    borderColor: 'black',
    borderRadius: wp(2.5),
    borderWidth: wp(0.3),
    padding: hp(0.8),
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
    padding: wp(2.5),
  },
  gap: {
    width: wp(0.8),
  },
  gapTwo: {
    width: wp(5),
  },
  input: {
    borderColor: '#ccc',
    borderWidth: wp(0.3),
    marginBottom: hp(1),
    padding: wp(2.6),
    width: '100%',
  },
  listContainer: {
    flex: 1,
    padding: wp(2.5),
  },
  radioGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(1),
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

export default WitWisdomList;
