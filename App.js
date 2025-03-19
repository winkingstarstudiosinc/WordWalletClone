import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import PasswordReset from './Components/PasswordReset';
import WalletFlap from './Components/WalletFlap';
import { StorageProvider } from './Components/StorageContext';
import { FirebaseProvider } from './Components/FirebaseProvider';
import Orientation from 'react-native-orientation-locker';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('App initialized, waiting for auth state...');
    const unsubscribe = auth().onAuthStateChanged(authUser => {
      console.log('Auth state changed:', authUser ? authUser.email : 'No user');
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    Orientation.lockToPortrait();
  }, []);

  return (
    <FirebaseProvider>
      <StorageProvider>
        <NavigationContainer>
          <View style={styles.globalContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : user ? (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen component={WalletFlap} name={'WalletFlap'} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen component={Login} name={'Login'} />
                <Stack.Screen component={SignUp} name={'SignUp'} />
                <Stack.Screen component={PasswordReset} name={'PasswordReset'} />
              </Stack.Navigator>
            )}
          </View>
        </NavigationContainer>
      </StorageProvider>
    </FirebaseProvider>
  );
};

const styles = StyleSheet.create({
  globalContainer: { flex: 1 },
  loadingContainer: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingText: { color: '#555', fontSize: 18 },
});

export default App;