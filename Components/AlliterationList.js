import React, {useState} from 'react';
import {RadioButton} from 'react-native-paper';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { isMediumTallPhone, isCompactMediumPhone, hp, wp } from './DynamicDimensions';

function AlliterationList({
  alliterations,
  onEditInit,
  onDelete,
  onEditSave,
  editingIndex,
  tempAlliteration,
  setTempAlliteration,
  onTextTypeChange,
  selectedTextType, // Accept from parent
  commonColor,
  discoveredColor,
  createTextColor
}) {
  console.log(
    'Rendering AlliterationList, current editing index:',
    editingIndex,
  ); // Debug log

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.alliterationList}>
        {alliterations.map((item, index) => (
          <View key={item.id || index.toString()} style={styles.wordItem}>
            {editingIndex === index ? (
              <View style={styles.editControls}>
                <TextInput
                  style={styles.input}
                  value={tempAlliteration}
                  onChangeText={text => {
                    console.log('Temp alliteration changed:', text); // Debug log
                    setTempAlliteration(text);
                  }}
                />
                <RadioButton.Group
                  value={tempAlliteration.textType || selectedTextType} // Use tempAlliteration's textType here for editing
                  onValueChange={value => {
                    console.log(
                      'Text type changed for index:',
                      index,
                      'New value:',
                      value,
                    ); // Debug log
                    onTextTypeChange(value, index);
                  }}>
                  <View style={styles.radioGroup}>
                    <RadioButton value={'Common'} />
                    <Text style={{color: commonColor, marginLeft: 5}}>
                      Common
                    </Text>
                  </View>
                  <View style={styles.radioGroup}>
                    <RadioButton value={'Discovered'} />
                    <Text style={{color: discoveredColor, marginLeft: 5}}>
                      Discoveredd
                    </Text>
                  </View>
                  <View style={styles.radioGroup}>
                    <RadioButton value={'Create'} />
                    <Text style={{color: createTextColor, marginLeft: 5}}>
                      Createe
                    </Text>
                  </View>
                </RadioButton.Group>
                <Button title={'Save'} onPress={() => onEditSave(index)} />
              </View>
            ) : (
              <View style={styles.wordDisplay}>
                <Text
                  style={[
                    styles.wordText,
                    {color: item.style?.color || 'black'},
                  ]}>
                  {`${index + 1}. ${item.term}`}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => onEditInit(index, item.term)}>
                    <Text style={styles.buttonText}>Ed</Text>
                  </TouchableOpacity>
                  <View style={styles.gap} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(index)}>
                    <Text style={styles.buttonText}>Dell</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  alliterationList: {
    flex: 1,
    padding: wp(5), // Converted from 20
  },
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: 'white',
    fontSize: wp(3.8), // Converted from 14
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    borderColor: 'black',
    borderRadius: wp(2.6), // Converted from 10
    borderWidth: wp(0.3), // Converted from 1
    padding: hp(0.8), // Converted from 6
  },
  editButton: {
    backgroundColor: '#2096F3',
    borderColor: 'black',
    borderRadius: wp(2.6), // Converted from 10
    borderWidth: wp(0.3), // Converted from 1
    padding: hp(0.8), // Converted from 6
  },
  editControls: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: wp(2), // Converted from 8
    width: '100%',
  },
  gap: {
    width: wp(0.8), // Converted from 3
  },
  input: {
    borderColor: '#ccc',
    borderWidth: wp(0.3), // Converted from 1
    flex: 1,
    marginBottom: hp(1.2), // Converted from 10
    padding: wp(2), // Converted from 8
  },
  radioGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: hp(0.7), // Converted from 5
  },
  radioLabel: {
    fontSize: wp(3.8), // Converted from 14
    marginLeft: wp(1.3), // Converted from 5
  },
  scrollContainer: {
    flexGrow: 1,
  },
  wordDisplay: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  wordItem: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ccc',
    borderBottomWidth: wp(0.3), // Converted from 1
    flexDirection: 'column',
    padding: wp(2.5), // Converted from 10
    width: '100%',
  },
  wordText: {
    flex: 1,
    fontSize: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.75) : null, 
  },
});

export default AlliterationList;
