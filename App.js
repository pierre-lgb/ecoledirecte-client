import React from 'react';
import { SafeAreaView } from 'react-native';

import { Provider } from 'react-redux'
import {
  store,
  persistor
} from './store';
import { PersistGate } from 'redux-persist/integration/react';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import {
  Inter_700Bold,
  Inter_600SemiBold,
  Inter_500Medium,
  Inter_400Regular,
} from '@expo-google-fonts/inter';

import dayjs from "dayjs";
import 'dayjs/locale/fr';
dayjs.locale('fr')

import RootNavigation from './navigation/RootNavigation';
import SplashScreen from './screens/SplashScreen'


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Inter_700Bold,
    Inter_600SemiBold,
    Inter_500Medium,
    Inter_400Regular
  })

  if (!fontsLoaded) {
    return <SplashScreen />
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <SafeAreaView style={{
          flex: 1
        }}>
          <RootNavigation />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
}