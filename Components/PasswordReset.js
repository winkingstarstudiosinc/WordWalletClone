import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';


const PasswordReset = ({navigation}) => {
  const [email, setEmail] = useState('');


  const handlePasswordReset = async () => {
    // Check if the email field is empty
    if (!email.trim()) {
      Alert.alert(
        'Error',
        'Please enter your email address before attempting to reset your password.'
      );
      return;
    }

    try {
      // Send password reset email directly
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success!', 'If an account exists under this email, a password reset email has been sent.');
      navigation.navigate('Login');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found under this email address. Please sign up.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
};


  return (
    <View style={styles.container}>
      <View
              style={{
                position: 'relative',
                bottom:'10%',
                width: '100%',
                aspectRatio: 1.5, // Matches the aspect ratio of your image
                overflow: 'hidden', // Ensures content respects the borderRadius
                borderRadius: 30,
                borderColor:'turquoise',
                borderWidth:2, // Apply rounded corners to the container
                alignSelf: 'center',
                marginVertical: 20,
              }}
            >
              <Image 
                source={require('../assets/WordWalletMobileLogo3.jpg')} 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  resizeMode: 'cover', // Ensures the image fills the container properly
                }} 
              />
            </View>
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'← Login'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        autoCapitalize={'none'}
        placeholder={'Enter your email'}
        placeholderTextColor='turquoise'
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={styles.resetButton}
        onPress={handlePasswordReset}>
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    left: wp(5.2),
    position: 'absolute',
    top: hp(5.2),
    zIndex: 10,
  },
  backButtonText: {
    fontSize: wp(4.5), // Adjust size as needed
    color: 'turquoise', // Matches your theme
    fontWeight: 'bold', // Optional: Makes the text bold
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    padding: wp(5.2),
  },
  input: {color:'turquoise', borderColor:'turquoise', borderRadius: 5, borderWidth: 1, marginBottom: 10, padding: 10},
  resetButton: {
    alignItems: 'center',
    backgroundColor: '#3827b3',
    borderColor:'#b0c4de',
    borderWidth:wp(0.15),
    borderRadius: wp(2.3),
    padding: wp(2.6),
  },
  resetButtonText: {
    color: 'turquoise',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  title: {
    color:'turquoise',
    fontSize: wp(6),
    fontWeight: 'bold',
    marginBottom: hp(3),
    textAlign: 'center',
  },
});

export default PasswordReset;
