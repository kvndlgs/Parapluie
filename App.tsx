import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useFonts } from 'expo-font';
import { testConnection } from './src/lib/testSupabase';

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
  });

  if (!loaded) return null;

  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="light" />
      </NavigationContainer>
    </Provider>
  );
}
