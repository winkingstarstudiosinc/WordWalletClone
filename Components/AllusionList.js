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


function AllusionList({
  fusions,
  onEditInit,
  onDelete,
  onEditSave,
  editingIndex,
  tempTerm,
  setTempTerm,
  onTextTypeChange,
  commonColor,
  discoveredColor,
  createTextColor
}) {
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type

  const handleTextTypeChange = newTextType => {
    setSelectedTextType(newTextType); // Update the selected Text Type for the editing fusion
    onTextTypeChange(newTextType); // Propagate the change to the parent component
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        {fusions.map((item, index) => {
          const textColor = item.style?.color || 'black'; // Ensure that the color is applied correctly
          return (
            <View key={item.id} style={styles.listItem}>
              {editingIndex === index ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.input}
                    value={tempTerm}
                    onChangeText={setTempTerm}
                  />
                  <RadioButton.Group
                    value={item.textType || 'Create'} // Use the item’s textType, fallback to 'Create' if undefined
                    onValueChange={value => onTextTypeChange(value, index)}>
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
                      <Text style={{color: createTextColor}}>Createe</Text>
                    </View>
                  </RadioButton.Group>
                  <Button title={'Save'} onPress={() => onEditSave(item.id)} />
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <Text style={[styles.itemText, {color: textColor}]}>
                    {index + 1}. {item.text || 'No text available'}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => onEditInit(index, item.text)}>
                      <Text style={styles.buttonText}>Ed</Text>
                    </TouchableOpacity>
                    <View style={styles.gap} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDelete(item.id)}>
                      <Text style={styles.buttonText}>Dell</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(1.2), // Converted from 10
  },
  buttonText: {
    color: 'white',
    fontSize: wp(3.8), // Converted from 14
  },
  container: {
    flex: 1,
    padding: wp(2.5), // Converted from 10
  },
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  editContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: hp(1.8), // Converted from 15
  },
  gap: {
    width: wp(0.8), // Converted from 3
  },
  input: {
    flex: 1,
    marginBottom: hp(1.2), // Converted from 10
    height: hp(5.3), // Converted from 40
    borderColor: '#ccc',
    borderWidth: wp(0.3), // Converted from 1
    borderRadius: wp(1.3), // Converted from 5
    paddingLeft: wp(2.5), // Converted from 10
    width: '100%',
  },
  itemText: {
    flex: 1,
    fontSize: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.75) : null, // Converted from 16
  },
  listItem: {
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ccc',
    borderBottomWidth: wp(0.3), // Converted from 1
    borderRadius: wp(1.3), // Converted from 5
    flexDirection: 'column',
    marginVertical: hp(0.8), // Converted from 5
    padding: wp(2.5), // Converted from 10
  },
  radioButton: {
    borderColor: '#ccc',
    borderRadius: wp(12.8), // Converted from 50
    borderWidth: wp(0.5), // Converted from 2
    height: wp(5.2), // Converted from 20
    marginRight: wp(1.3), // Converted from 5
    width: wp(5.2), // Converted from 20
  },
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2.5), // Converted from 10
  },
  radioInnerCircle: {
    backgroundColor: '#ccc',
    borderRadius: wp(12.8), // Converted from 50
    height: wp(3.1), // Converted from 12
    margin: wp(0.8), // Converted from 3
    width: wp(3.1), // Converted from 12
  },
  radioLabel: {
    marginLeft: wp(1.3), // Converted from 5
    fontSize: wp(3.8), // Converted from 14
    whiteSpace: 'nowrap',
  },
  selectedRadio: {
    backgroundColor: '#2096F3',
  },
});

export default AllusionList;
