import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDeviceType, hp, wp, normalize } from './DynamicDimensions';

const StorageContext = createContext();

export const useStorage = () => useContext(StorageContext);

export const StorageProvider = ({children}) => {
  const [storedData, setStoredData] = useState({}); // Store multiple lists by classIdentifier

  const loadStoredData = async classIdentifier => {
    try {
      const value = await AsyncStorage.getItem(classIdentifier);
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        setStoredData(prev => ({...prev, [classIdentifier]: parsedValue}));
        console.log(`Data loaded for ${classIdentifier}:`, parsedValue);
        return parsedValue; // Return loaded data for use
      } else {
        console.log(`No data found at key: ${classIdentifier}`);
        return [];
      }
    } catch (error) {
      console.error(`Failed to load data for ${classIdentifier}`, error);
      return [];
    }
  };

  const saveData = async (classIdentifier, value) => {
    try {
      const stringValue = JSON.stringify(value); // Serialize the value into a string
      await AsyncStorage.setItem(classIdentifier, stringValue);
      setStoredData(prev => ({...prev, [classIdentifier]: value}));
      console.log(`Data saved to AsyncStorage for ${classIdentifier}:`, value);
    } catch (error) {
      console.error(`Failed to save data for ${classIdentifier}`, error);
    }
  };

  return (
    <StorageContext.Provider value={{storedData, loadStoredData, saveData}}>
      {children}
    </StorageContext.Provider>
  );
};
