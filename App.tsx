import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
    'Monument-Regular': require('./fonts/PPMonumentNormal-Regular.otf'),
    'Monument-Black': require('./fonts/PPMonumentNormal-Black.otf'),
    'Monument-Light': require('./fonts/PPMonumentNormal-Light.otf'),
    'MonumentWide-Regular': require('./fonts/PPMonumentWide-Regular.otf'),
    'MonumentWide-Black': require('./fonts/PPMonumentWide-Black.otf'),
  });
  if (!loaded) return null; // or a loading spinner, etc (you can also use SplashScreen)
    return (
    <NavigationContainer>
      <OnboardingNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
