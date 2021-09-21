import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { Provider } from 'react-redux'
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import {
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_400Regular,
} from '@expo-google-fonts/inter';

import dayjs from "dayjs";
import 'dayjs/locale/fr';
dayjs.locale('fr')

import RootNavigation from './navigation/RootNavigation';
import SplashScreen from './screens/auth/SplashScreen'



export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular
  })


  useEffect(() => {
    console.log("------------------------")
  }, [])

  if (!fontsLoaded) {
    return <SplashScreen />
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <RootNavigation />
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
