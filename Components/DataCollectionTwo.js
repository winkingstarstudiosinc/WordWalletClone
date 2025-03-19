import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

const DataCollectionTwo = ({ visible, collectedGoogleData, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    
    const handleSubmit = async () => {
      if (!email || !password) {
          alert('Please fill out both fields.');
          return;
      }
  
      try {
          console.log('🚀 Calling onSubmit...');
          const loginSuccess = await onSubmit(email, password, collectedGoogleData?.idToken);
          
          console.log('🔎 onSubmit returned:', loginSuccess); // Debug log
  
          if (!loginSuccess) {
              alert('❌ Invalid email address or password. Please try again.');
              return; // Do NOT close the modal on incorrect login
          }
  
          // Save googleLinkCheck as true to AsyncStorage
          await AsyncStorage.setItem('googleLinkCheck', email);
  
          // Close the modal only if login is successful
          onClose();
      } catch (error) {
          console.error('❌ DataCollectionTwo Error:', error);
          alert('An unexpected error occurred. Please try again.');
      }
  };


    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.title}>Enter Your Details</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Cancel </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '80%',
    padding: wp(5),
    backgroundColor: '#fff',
    borderRadius: wp(2.6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp(0.26) },
    shadowOpacity: 0.25,
    shadowRadius: wp(1),
    elevation: 5,
  },
  title: {
    fontSize: wp(5.2),
    fontWeight: 'bold',
    marginBottom: hp(1.8),
    textAlign: 'center',
  },
  input: {
    borderWidth: wp(0.3),
    borderColor: '#ccc',
    borderRadius: wp(1.3),
    padding: wp(2.6),
    marginBottom: hp(1.3),
  },
  submitButton: {
    backgroundColor: '#2096F3',
    paddingVertical: hp(1.6),
    borderRadius: wp(1.3),
    alignItems: 'center',
    marginBottom: hp(1.3),
  },
  submitButtonText: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  closeButton: {
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#2096F3',
    fontSize: wp(3.7),
  },
});

export default DataCollectionTwo;