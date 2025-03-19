import React, { useState } from 'react';
import { RadioButton } from 'react-native-paper';
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



function PersonificationList({
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
  createTextColor,
}) {
  const [selectedTextType, setSelectedTextType] = useState('Common'); // Default Text Type

  const handleTextTypeChange = newTextType => {
    setSelectedTextType(newTextType);
    onTextTypeChange(newTextType);
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        {fusions.map((item, index) => {
          const textColor = item.style?.color || 'black';
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
                    value={item.textType || 'Create'}
                    onValueChange={value => onTextTypeChange(value, index)}>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Common'} />
                      <Text style={{ color: commonColor, marginLeft: wp(1.3) }}>
                        Common
                      </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Discovered'} />
                      <Text style={{ color: discoveredColor, marginLeft: wp(1.3) }}>
                        Discovered
                      </Text>
                    </View>
                    <View style={styles.radioGroup}>
                      <RadioButton value={'Create'} />
                      <Text style={{ color: createTextColor }}>Create</Text>
                    </View>
                  </RadioButton.Group>
                  <Button title={'Save'} onPress={() => onEditSave(item.id)} />
                </View>
              ) : (
                <View style={styles.contentContainer}>
                  <Text style={[styles.itemText, { color: textColor }]}>
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
                      <Text style={styles.buttonText}>Del</Text>
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
    marginTop: hp(1.5),
  },
  buttonText: {
    color: 'white',
    fontSize: wp(3.8),
  },
  container: {
    flex: 1,
    padding: wp(2.6),
  },
  contentContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    backgroundColor: '#ff6347',
    borderColor: 'black',
    borderRadius: wp(2.3),
    borderWidth: wp(0.3),
    padding: hp(1.2),
  },
  editButton: {
    backgroundColor: '#2096F3',
    borderColor: 'black',
    borderRadius: wp(2.3),
    borderWidth: wp(0.3),
    padding: hp(1.2),
  },
  editContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: hp(2),
  },
  gap: {
    width: wp(0.8),
  },
  input: {
    flex: 1,
    marginBottom: hp(1.5),
    height: hp(5),
    borderColor: '#ccc',
    borderWidth: wp(0.3),
    borderRadius: wp(2.3),
    paddingLeft: wp(2.6),
    width: '100%',
  },
  itemText: {
    flex: 1,
    fontSize: isMediumTallPhone ? hp(1.75) : isCompactMediumPhone ? hp(1.75) : null,
  },
  listItem: {
    backgroundColor: '#f5f5f5',
    borderBottomColor: '#ccc',
    borderBottomWidth: wp(0.3),
    borderRadius: wp(2.3),
    flexDirection: 'column',
    marginVertical: hp(0.8),
    padding: wp(2.6),
  },
  radioButton: {
    borderColor: '#ccc',
    borderRadius: wp(12.5),
    borderWidth: wp(0.5),
    height: hp(2.5),
    marginRight: wp(1.5),
    width: hp(2.5),
  },
  radioContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(2.6),
  },
  radioInnerCircle: {
    backgroundColor: '#ccc',
    borderRadius: wp(12.5),
    height: hp(1.5),
    margin: wp(1),
    width: hp(1.5),
  },
  radioLabel: {
    marginLeft: wp(1.5),
    fontSize: wp(3.8),
    whiteSpace: 'nowrap',
  },
  selectedRadio: {
    backgroundColor: '#2096F3',
  },
});

export default PersonificationList;