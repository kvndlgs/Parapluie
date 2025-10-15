import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  WelcomeScreen,
  PermissionScreen,
  InvitationScreen,
  ContactInfoScreen,
  ShareScreen,
  ConfirmationScreen,
} from '../screens/onboarding';

export type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: { userName: string; contactName: string; relationship: string };
  Confirmation: { userName: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Permissions" component={PermissionScreen} />
      <Stack.Screen name="Invitation" component={InvitationScreen} />
      <Stack.Screen name="ContactInfo" component={ContactInfoScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}
