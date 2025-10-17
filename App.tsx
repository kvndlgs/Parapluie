import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { TamaguiProvider } from '@tamagui/core';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts } from 'expo-font';
import { testConnection } from './src/lib/testSupabase';
import { MaterialSymbols_300Light } from '@expo-google-fonts/material-symbols';
import config from './src/tamagui/config';

export default function App() {
  useEffect(() => {
    testConnection();
  }, []);


  const [loaded] = useFonts({
    'Monument-Regular': require('./fonts/PPMonumentNormal-Regular.otf'),
    'Monument-Black': require('./fonts/PPMonumentNormal-Black.otf'),
    'Monument-Light': require('./fonts/PPMonumentNormal-Light.otf'),
    'MonumentWide-Regular': require('./fonts/PPMonumentWide-Regular.otf'),
    'MonumentWide-Black': require('./fonts/PPMonumentWide-Black.otf'),
    MaterialSymbols_300Light
  });

  if (!loaded) return null;

  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="light" />
        </NavigationContainer>
      </Provider>
    </TamaguiProvider>
  );
}
