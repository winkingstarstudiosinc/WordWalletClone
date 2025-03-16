import React, {useRef, useEffect} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {RichToolbar, RichEditor, actions} from 'react-native-pell-rich-editor';
import {useStorage} from './StorageContext';
import { isMediumTallPhone, isCompactMediumPhone, isSmallPhone, hp, wp } from './DynamicDimensions';


const DeviceQuill = ({ editorContent, setEditorContent, storageKey, buttonColor }) => {
  const {loadStoredData, saveData} = useStorage();
  const richTextRef = useRef(null); // Ref for the RichEditor
  const lastSavedRef = useRef(''); // Tracks the last saved content to prevent redundant saves
  const isInitializingRef = useRef(true); // Tracks initialization phase

  // Load content from AsyncStorage on mount
  useEffect(() => {
    if (isInitializingRef.current) {
      loadStoredData(storageKey).then(data => {
        console.log(`Data loaded for ${storageKey}:`, data);
        const initialContent = data || '<p><br></p>'; // Default to empty editor content
        lastSavedRef.current = initialContent;
        setEditorContent(initialContent);

        if (richTextRef.current) {
          richTextRef.current.setContentHTML(initialContent); // Initialize the editor
        }

        isInitializingRef.current = false; // Mark initialization complete
      });
    }
  }, [loadStoredData, setEditorContent, storageKey]);

  // Save content to AsyncStorage when it changes
  const handleContentChange = content => {
    if (isInitializingRef.current) {
      return;
    } // Skip saving during initialization
    if (content === lastSavedRef.current) {
      return;
    } // Prevent redundant saves

    console.log(`Content changed for ${storageKey}:`, content);
    setEditorContent(content);

    saveData(storageKey, content)
      .then(() => {
        console.log(
          `Content saved to AsyncStorage for ${storageKey}:`,
          content,
        );
        lastSavedRef.current = content; // Update last saved reference
      })
      .catch(err => console.error('Failed to save data:', err));
  };

  // Manual save handler
  const handleSavePress = () => {
    if (!editorContent.trim() || editorContent === '<p><br></p>') {
      Alert.alert('Warning', 'Editor content is empty!');
      return;
    }

    saveData(storageKey, editorContent)
      .then(() => {
        console.log(`Manual save successful for ${storageKey}:`, editorContent);
        Alert.alert('Saved', 'Your notes have been saved!');
      })
      .catch(err => console.error('Failed to manually save data:', err));
  };

  return (
    <View style={styles.container}>
      {/* RichEditor */}
      <RichEditor
        initialContentHTML={editorContent}
        placeholder={'Start typing here...'}
        ref={richTextRef}
        style={styles.editor}
        onChange={handleContentChange}
      />

      {/* RichToolbar */}
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertOrderedList,
          actions.insertBulletsList,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.undo,
          actions.redo,
        ]}
        disabledIconTint={'#bfbfbf'}
        editor={richTextRef}
        iconTint={'#000'}
        selectedIconTint={buttonColor}
        style={styles.toolbar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    bottom: hp(0), // Converted from '1%'
    height: isMediumTallPhone ? hp(70) : isCompactMediumPhone ? hp(65) : isSmallPhone ? hp(65) : null, // Converted from '75%'
    maxHeight: isMediumTallPhone ? hp(69) : isCompactMediumPhone ? hp(65) : isSmallPhone ? hp(65) : null,  // Converted from 900 (adjusted for responsiveness)
    padding: wp(2.6), // Converted from 10
    position: 'relative',
    flex: 1, // Ensures the layout is properly structured
  },
  editor: {
    borderColor: '#ccc',
    borderRadius: wp(1.3), // Converted from 5
    borderWidth: wp(0.3), // Converted from 1
    flex: 1, // Allows natural expansion while maintaining proportion
    marginBottom: hp(0.9), // Converted from 10, ensuring proper fit
    padding: wp(2.6), // Converted from 10 (space for toolbar)
  },
  toolbar: {
    backgroundColor: '#f9f9f9',
    borderTopColor: '#ccc',
    borderTopWidth: wp(0.3), // Converted from 1
    paddingVertical: hp(0.65), // Converted from 5
  },
});




export default DeviceQuill;
