import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '../screens/main/HomeScreen';
import { SafetyScreen } from '../screens/main/SafetyScreen';
import { CustomTabBar } from '../components/CustomTabBar';

const Tab = createBottomTabNavigator();

// Placeholder Walter screen (not actually shown, just for the tab position)
function WalterPlaceholder() {
  return null;
}

export function MainNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil'}}
      />
      {/* Middle tab for Walter button positioning */}
      <Tab.Screen
        name="Walter"
        component={WalterPlaceholder}
        options={{ tabBarLabel: 'Walter' }}
      />
      <Tab.Screen
        name="Safety"
        component={SafetyScreen}
        options={{ tabBarLabel: 'Sécurité' }}
      />
    </Tab.Navigator>
  );
}
