import React, { useState } from 'react';
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

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    // Check if any field is empty
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
        Alert.alert(
            'Error',
            'All fields are required to sign up. Please fill in the necessary information.'
        );
        return;
    }

    // Validate email format using a regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        Alert.alert('Error', 'Please enter a valid email address.');
        return;
    }

    // Password strength validation: At least 8 characters, 1 number, 1 special character
    const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
        Alert.alert(
            'Weak Password',
            'Password must be at least 8 characters long, include at least one number and one special character (!@#$%^&*).'
        );
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match. Please try again.');
        return;
    }

    try {
        await auth().createUserWithEmailAndPassword(email, password);
        const user = auth().currentUser;

        if (user) {
            await user.sendEmailVerification();
            Alert.alert(
                'Verify Your Email',
                'Your account has been created! A verification email has been sent to your email address. Please verify your email before logging in.'
            );
            await auth().signOut();
        }
    } catch (error) {
        Alert.alert('Error', error.message);
    }
};

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={require('../assets/WordWalletMobileLogo3.jpg')}
          style={styles.image}
        />
      </View>
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{'← Login'}</Text>
      </TouchableOpacity>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <TextInput
          autoCapitalize={'none'}
          placeholder={'Email'}
          placeholderTextColor='turquoise'
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          secureTextEntry
          placeholder={'Password'}
          placeholderTextColor='turquoise'
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          secureTextEntry
          placeholder={'Confirm Password'}
          placeholderTextColor='turquoise'
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.link}>Already have an account? Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    left: wp(5),
    position: 'absolute',
    top: hp(5),
    zIndex: 10,
  },
  backButtonText: {
    fontSize: wp(4.5),
    color: 'turquoise',
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    padding: wp(5),
  },
  imageContainer: {
    position: 'relative',
    top: hp(1),
    width: '100%',
    aspectRatio: 1.5,
    overflow: 'hidden',
    borderRadius: wp(7.5),
    borderColor: 'turquoise',
    borderWidth: wp(0.5),
    alignSelf: 'center',
    marginVertical: hp(2.5),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formContainer: {
    position: 'relative',
    top: hp(2.5),
  },
  input: {
    marginTop: hp(2),
    borderColor: 'turquoise',
    borderWidth: wp(0.3),
    borderRadius: wp(2.3),
    padding: wp(2.6),
    marginRight: wp(2.6),
    backgroundColor: 'black',
    color: 'turquoise',
  },
  link: {
    color: 'turquoise',
    marginTop: hp(3.5),
    textAlign: 'center',
  },
  signUpButton: {
    alignItems: 'center',
    borderColor: '#b0c4de',
    borderWidth: wp(0.2),
    backgroundColor: '#3827b3',
    borderRadius: wp(2.3),
    padding: wp(2.6),
    marginTop: hp(2.5),
  },
  signUpButtonText: {
    color: 'turquoise',
    fontSize: wp(4),
    fontWeight: 'bold',
  },
  title: {
    color: 'turquoise',
    fontSize: wp(6),
    fontWeight: 'bold',
    marginBottom: hp(2),
    textAlign: 'center',
  },
});

export default SignUp;