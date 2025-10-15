import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { OnboardingNavigator } from './src/navigation/OnboardingNavigator';
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
    monumentNormal: require('./assets/fonts/PPMonumentNormal-Regular.otf'),
    monumentNormalBlack: require('./assets/fonts/PPMonumentNormal-Black.otf'),
  });
  if (!loaded) return null; // or a loading spinner, etc (you can also use SplashScreen)
    return (
    <NavigationContainer>
      <OnboardingNavigator />
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
