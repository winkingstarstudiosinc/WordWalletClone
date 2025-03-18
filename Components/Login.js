import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import GoogleLogo from '../assets/google_logo.png';
import MicrosoftLogo from '../assets/microsoft_logo.png';
import DataCollection from './DataCollection';
import DataCollectionTwo from './DataCollectionTwo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hp, wp, isMediumTallPhone, isCompactMediumPhone, isSmallPhone, isGalaxySPhone } from './DynamicDimensions';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [microsoftLinkCheck, setMicrosoftLinkCheck] = useState(null); 
  const [googleLinkCheck, setGoogleLinkCheck] = useState(null); 
  const [dataCollectionVisible, setDataCollectionVisible] = useState(false);
  const [dataCollectionTwoVisible, setDataCollectionTwoVisible] = useState(false);
  const [collectedGoogleData, setCollectedGoogleData] = useState(null); 
  const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-3940256099942544/1033173712';
  const [interstitial, setInterstitial] = useState(null); // Store the latest ad instance
  const [adLoaded, setAdLoaded] = useState(false);  

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5-second timeout

        // This endpoint returns a JSON object containing your IP address if reachable.
        const response = await fetch('https://api.ipify.org?format=json', {
          method: 'GET',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          // We expect data to contain an "ip" field if successful.
          if (data && data.ip) {
            // Connection is good; do nothing.
            return;
          } else {
            // Data didn't load as expected.
            throw new Error("Data format unexpected");
          }
        } else {
          throw new Error("Response not ok");
        }
      } catch (error) {
        // If any error occurs, we assume there is no valid connection.
        alert("No connection detected. WordWallet requires internet for many of its services, including logging in. Please establish a connection.");
      }
    };

    checkConnection();
  }, []);


  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1085965804289-iatc2g9bf6sgd730f1o8n1b2gugce8b2.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('WalletFlap');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMicrosoftLinkCheck = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('microsoftLinkCheck');
        if (storedValue) {
          setMicrosoftLinkCheck(storedValue); // Set the email from storage
          console.log('Loaded microsoftLinkCheck from AsyncStorage:', storedValue);
        }
      } catch (error) {
        console.error('Error fetching microsoftLinkCheck from AsyncStorage:', error);
      }
    };
  
    fetchMicrosoftLinkCheck();
  }, []);

  useEffect(() => {
    const fetchGoogleLinkCheck = async () => {
      try {
        const storedData = await AsyncStorage.getItem('googleLinkCheck'); // Fetch from storage
        if (storedData) {
          setGoogleLinkCheck(storedData); // Set the email from storage
          console.log('Loaded googleLinkCheck from AsyncStorage:', storedData);
        }
      } catch (error) {
        console.error('Error fetching googleLinkCheck from AsyncStorage:', error);
      }
    };
  
    fetchGoogleLinkCheck(); // Run on component mount
  }, []);


  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        const savedPassword = await AsyncStorage.getItem('userPassword');
        
        if (savedEmail) {
          setEmail(savedEmail);
          console.log('Loaded saved email:', savedEmail);
        }
        if (savedPassword) {
          setPassword(savedPassword);
          console.log('Loaded saved password.');
        }
      } catch (error) {
        console.error('Error loading saved login credentials:', error);
      }
    };
  
    loadSavedCredentials();
  }, []);


  useEffect(() => {
    console.log("📢 Setting up interstitial ad...");
  
    const loadAd = () => {
      console.log("📢 Attempting to load interstitial ad...");
      
      const newInterstitial = InterstitialAd.createForAdRequest(adUnitId);
      setInterstitial(newInterstitial); // Store the fresh ad instance
  
      newInterstitial.addAdEventListener(AdEventType.LOADED, () => {
        console.log("✅ Interstitial Ad Successfully Loaded!");
        setAdLoaded(true);
      });
  
      newInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
        console.log("🚪 Ad dismissed. Reloading...");
        setAdLoaded(false);
        loadAd(); // 🔄 Preload next ad after closing
      });
  
      newInterstitial.load(); // Load the ad
    };
  
    loadAd(); // Load ad on component mount
  
    return () => {
      console.log("🧹 Cleaning up event listeners...");
      if (interstitial) {
        interstitial.removeAllListeners();
      }
    };
  }, []);


  const showAdOrNavigate = () => {
    if (adLoaded && interstitial) {
      console.log("📢 Ad is loaded! Showing now...");
      
      interstitial.show().then(() => {
        console.log("✅ Ad successfully shown.");
        setAdLoaded(false);  // Mark ad as used
        setInterstitial(null); // Ensure fresh instance will be used next time
      }).catch((error) => {
        console.error("❌ Ad failed to show:", error);
        console.log("🔄 Reloading Ad after failure...");
        setAdLoaded(false);
        setInterstitial(null);
      });
  
    } else {
      console.log("⚠️ Ad wasn't ready yet, navigating immediately.");
      navigation.replace('WalletFlap');
    }
  };
  

  const handleCredentialCollision = async (credential) => {
    try {
      const user = auth().currentUser;

      if (user) {
        await user.linkWithCredential(credential);
        Alert.alert('Success', 'Your account has been linked successfully.');
        setIsAuthenticated(true);
      } else {
        await auth().signInWithCredential(credential);
        setIsAuthenticated(true);
      }
    } catch (error) {
      if (error.code === 'auth/credential-already-in-use') {
        Alert.alert(
          'Credential In Use',
          'This credential is already linked to another account. Please sign in with your email and password first.'
        );
      } else {
        console.error('Error during credential collision handling:', error);
      }
    }
  };


  const handleLogin = async () => {
    try {
        if (!email && !password) {
            Alert.alert('Missing Information', 'Please enter your email and password.');
            return;
        }

        if (!email) {
            Alert.alert('Missing Email', 'Please enter your email.');
            return;
        }

        if (!password) {
            Alert.alert('Missing Password', 'Please enter your password.');
            return;
        }

        console.log('Attempting Email/Password Sign-In...');
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user.emailVerified) {
            console.log('Email verified. Logging in...');
            await AsyncStorage.setItem('userEmail', email);
            await AsyncStorage.setItem('userPassword', password);

            Alert.alert('Welcome!', 'You are now logged in.');

            // 🚀 Show ad before navigating
            showAdOrNavigate();
        } else {
            console.log('Email not verified.');
            await auth().signOut();
            Alert.alert('Email Not Verified', 'Please verify your email address before logging in.');
        }
    } catch (error) {

        Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
    }
};



const googleLinkedLogin = async () => {
  try {
    console.log('Starting Google direct sign-in flow...');
    
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signOut(); // Ensure a fresh sign-in
    const userInfo = await GoogleSignin.signIn();

    // Log userInfo for debugging
    console.log('Google User Object:', JSON.stringify(userInfo, null, 2));

    // Correctly access idToken
    const idToken = userInfo?.data?.idToken || userInfo?.idToken;

    if (!idToken) {
      throw new Error('Google Sign-In failed: No ID token received.');
    }

    console.log('ID Token:', idToken);

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const result = await auth().signInWithCredential(googleCredential);

    console.log('Google sign-in successful:', JSON.stringify(result.user, null, 2));

    Alert.alert('Success', 'You are now signed in with your Google account!');

    // 🚀 Show ad before navigating
    showAdOrNavigate();

  } catch (error) {
    Alert.alert('Error', error.message || 'An unknown error occurred.');
  }
};


const onGoogleButtonPress = async () => {
  try {
      // Check if Google account is already linked
      if (googleLinkCheck) {
          console.log('Google account is already linked to:', googleLinkCheck);
          await googleLinkedLogin();
          return;
      }

      // Show confirmation alert
      Alert.alert(
          'Account Confirmation',
          'Do you already have an account with WordWallet?',
          [
              {
                  text: 'Yes',
                  onPress: () => {
                      console.log('User confirmed they have an account. Showing DataCollectionTwo modal...');
                      setDataCollectionTwoVisible(true); // Show modal first
                  },
              },
              {
                  text: 'No',
                  onPress: () => {
                      console.log('User clicked "No". Redirecting to SignUp...');
                      navigation.navigate('SignUp');
                  },
              },
          ]
      );
  } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      Alert.alert('Error', error.message || 'An unknown error occurred.');
  }
};


const handleGoogleEmailPasswordSignIn = async (email, password) => {
  try {
      console.log('🔗 Attempting to sign in with Email/Password before linking with Google...');

      // Step 1: Sign in the user with email/password
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('✅ Email/Password Sign-In Successful:', user.email);

      // Step 2: Trigger Google Sign-In AFTER email/password success
      console.log('🔄 Now prompting Google Sign-In...');
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // Ensure a fresh Google login
      const userInfo = await GoogleSignin.signIn();

      // Extract ID token from Google
      const idToken = userInfo?.data?.idToken;
      if (!idToken) {
          throw new Error('Google Sign-In failed: No ID token received.');
      }
      console.log('✅ Extracted Google ID Token:', idToken);

      // Step 3: Create Google credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Step 4: Link Google account to existing email/password account
      try {
          console.log('🔄 Attempting to link Google credential...');
          const linkedResult = await user.linkWithCredential(googleCredential);
          console.log('✅ Google account successfully linked:', linkedResult.user);

          // Step 5: Save the linked email in AsyncStorage
          await AsyncStorage.setItem('googleLinkCheck', email);
          setGoogleLinkCheck(email);

          // Step 6: Show Success Alert
          Alert.alert('Success', 'Your Google account has been linked successfully!');

          // Step 7: Close the modal
          setDataCollectionTwoVisible(false);

          return true; // ✅ Ensures successful linking is recognized by DataCollectionTwo
      } catch (linkError) {
          console.error('❌ Google linking failed:', linkError);

          // Handle specific Firebase linking errors
          if (linkError.code === 'auth/credential-already-in-use') {
              Alert.alert('Error', 'This Google account is already linked to another user.');
          } else if (linkError.code === 'auth/email-already-in-use') {
              Alert.alert('Error', 'This email is already linked to a different Google account.');
          } else {
              Alert.alert('Error', 'Failed to link Google account. Please try again.');
          }

          return false; // ❌ Prevents false incorrect credentials alert
      }
  } catch (error) {
      console.error('❌ Authentication Failed:', error);

      // Handle incorrect credentials properly (invalid email/password)
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
          Alert.alert('❌ Invalid email address or password. Please try again.');
          return false; // Do NOT close the modal, just return false
      }

      // If another unexpected error occurs, alert it
      Alert.alert('Error', error.message || 'Something went wrong.');
      return false;
  }
};

  // Function for Microsoft Linked Login
  const microsoftLinkedLogin = async () => {
    try {
      const provider = new auth.OAuthProvider('microsoft.com');
      provider.addScope('email');
      provider.addScope('profile');
      provider.setCustomParameters({ prompt: 'select_account' });

      console.log('Initiating Microsoft Linked Login...');
      const result = await auth().signInWithPopup(provider);

      console.log('Microsoft Sign-In Successful:', JSON.stringify(result, null, 2));
      Alert.alert('Success', 'You are now signed in with your Microsoft account!');

      // 🚀 Show ad before navigating
      showAdOrNavigate();

    } catch (error) {
      console.error('Error during Microsoft Linked Login:', error);
      Alert.alert('Error', error.message || 'An unknown error occurred.');
    }
};
  
  // Function for handling Microsoft button press
  const onMicrosoftButtonPress = async () => {
    try {
      // Check if microsoftLinkCheck contains an email
      if (microsoftLinkCheck) {
        console.log('Microsoft account is already linked to:', microsoftLinkCheck);
        await microsoftLinkedLogin(); // Trigger traditional Microsoft login flow
        return; // Exit early to avoid showing the alert
      }
  
      // If no email is in microsoftLinkCheck, proceed to the Alert
      Alert.alert(
        'Account Confirmation',
        'Do you already have an account with WordWallet?',
        [
          {
            text: 'Yes',
            onPress: async () => {
              console.log('Microsoft account not linked. Showing DataCollection modal...');
              setDataCollectionVisible(true); // Open the modal for email/password entry
            },
          },
          {
            text: 'No',
            onPress: () => navigation.navigate('SignUp'),
          },
        ]
      );
    } catch (error) {
      console.error('Error during Microsoft sign-in:', error);
      Alert.alert('Error', error.message || 'An unknown error occurred.');
    }
  };
  
  // Function for handling Email/Password Sign-In
  const handleEmailPasswordSignIn = async (email, password) => {
    try {
        // Step 1: Sign in the user with email and password
        const userCredential = await auth().signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        console.log('✅ Email/Password Sign-In Successful:', user);

        // Step 2: Prepare Microsoft provider for linking
        const provider = new auth.OAuthProvider('microsoft.com');
        provider.addScope('email');
        provider.addScope('profile');
        provider.setCustomParameters({ prompt: 'select_account' });

        console.log('🔄 Attempting to start linking process with Microsoft credential...');
        const result = await user.linkWithPopup(provider);

        console.log('✅ Linking Successful:', JSON.stringify(result, null, 2));

        // Step 3: Retrieve and log the linked credential tokens
        const linkedCredential = result.credential;
        console.log('🔹 Linked Access Token:', linkedCredential?.accessToken);
        console.log('🔹 Linked ID Token:', linkedCredential?.idToken);

        // Step 4: Persist email to AsyncStorage
        console.log('💾 Updating microsoftLinkCheck in AsyncStorage with email:', email);
        await AsyncStorage.setItem('microsoftLinkCheck', email);
        setMicrosoftLinkCheck(email);
        console.log('✅ microsoftLinkCheck successfully updated');

        // Step 5: Alert user and close modal
        Alert.alert('Success', 'Your Microsoft account has been linked successfully!');
        setDataCollectionVisible(false);

        console.log('🔹 Returning true from handleEmailPasswordSignIn');
        return true;  // ✅ Ensures onSubmit gets the correct return value
    } catch (error) {
        console.error('❌ Microsoft Linking Failed:', error);

        // ✅ Handle incorrect credentials properly (invalid email/password)
        if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
            Alert.alert('❌ Invalid email address or password. Please try again.');
            return false; // Do NOT close the modal, just return false
        }

        // If another unexpected error occurs, alert it
        Alert.alert('Error', error.message || 'Failed to link Microsoft account.');
        return false;
    }
};


  
  return (
    <View style={styles.container}>
  <View style={{ position:'relaive', bottom:'1%' }}>
<View
  style={{
    position: 'relative',
    top: '1%',
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
  
  <View>
    <Text style={styles.title}>Login</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      placeholderTextColor='turquoise'
      value={email}
      onChangeText={setEmail}
      autoCapitalize="none"
    />
    <TextInput
      style={styles.input}
      placeholder="Password"
      placeholderTextColor='turquoise'
      value={password}
      onChangeText={setPassword}
      secureTextEntry
    />
    <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
      <Text style={styles.submitButtonText}>Login</Text>
    </TouchableOpacity>
    <View style={{ marginTop: '7.5%' }}>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('PasswordReset')}>
        <Text style={styles.link}>Forgot your password? Reset it</Text>
      </TouchableOpacity>
    </View>
    <View>
      <View style={{ position: 'relative', top: '20%', left: isMediumTallPhone ? '30%' : isCompactMediumPhone ? '30%' : isSmallPhone ? '30%' : isGalaxySPhone ? '40%' : null }}>
        <Text style={{ color:'turquoise' }}>Link account:</Text>
      </View>
      <View style={styles.socialButtonContainer}>
        <TouchableOpacity style={styles.socialButton} onPress={onGoogleButtonPress}>
          <Image source={GoogleLogo} style={styles.socialLogo} />
        </TouchableOpacity>
        <View style={{ width: '35%' }} />
        <TouchableOpacity style={styles.socialButton} onPress={onMicrosoftButtonPress}>
          <Image source={MicrosoftLogo} style={styles.socialLogo} />
        </TouchableOpacity>
      </View>
    </View>

    {/* DataCollection Modal */}
    <DataCollection
    visible={dataCollectionVisible}
    onClose={() => setDataCollectionVisible(false)}
    onSubmit={async (email, password) => {
        console.log('User entered credentials. Starting Microsoft Sign-In process...');
        
        const success = await handleEmailPasswordSignIn(email, password);
        
        console.log('🔹 Returning from onSubmit:', success);
        return success;  // ✅ Ensure onSubmit returns true or false correctly
    }}
/>

<DataCollectionTwo
    visible={dataCollectionTwoVisible}
    onClose={() => setDataCollectionTwoVisible(false)}
    onSubmit={async (email, password) => {
        console.log('User entered credentials. Starting Google Sign-In process...');
        
        const success = await handleGoogleEmailPasswordSignIn(email, password);
        
        console.log('🔹 Returning from onSubmit:', success);
        return success;  // ✅ Ensure onSubmit returns true or false correctly
    }}
/>
  </View>
  </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: isMediumTallPhone ? hp(7.5) : isCompactMediumPhone ? wp(20) : isSmallPhone ? wp(23): isGalaxySPhone ? wp(11) : null, // Converted from isSmallPhone logic
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  input: {
    color: 'turquoise',
    borderWidth: wp(0.3),
    marginBottom: hp(1.5),
    padding: wp(2.6),
    borderRadius: wp(2.3),
    borderColor: 'turquoise',
  },
  submitButton: {
    borderColor: '#b0c4de',
    borderWidth: wp(0.2),
    backgroundColor: '#3827b3',
    paddingVertical: hp(1.8),
    borderRadius: wp(2.3),
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'turquoise',
    fontSize: wp(4.2),
    fontWeight: 'bold',
  },
  socialSignInContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: hp(2.5),
  },
  socialButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10.5),
    marginBottom: hp(2.5),
    borderWidth: wp(0.3),
    overflow: 'hidden',
    borderRadius: wp(3.8),
    backgroundColor: 'black',
  },
  socialButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderWidth: wp(0.3),
    borderColor: 'turquoise',
    borderRadius: wp(12.5),
    width: wp(15),
    height: wp(15),
    marginHorizontal: wp(2.5),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  socialLogo: {
    width: wp(10),
    height: wp(10),
  },
  link: {
    color: 'turquoise',
    marginTop: hp(1.5),
    textAlign: 'center',
  },
  title: {
    color: 'turquoise',
    fontSize: wp(6.2),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(2.5),
  },
});

export default Login;