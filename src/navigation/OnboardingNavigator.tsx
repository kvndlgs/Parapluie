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
import { AccountCreationScreen } from '../screens/onboarding/AccountCreationScreen';
import { InviteTCPromptScreen } from '../screens/onboarding/InviteTCPromptScreen';
import { InviteTCContactInfoScreen } from '../screens/onboarding/InviteTCContactInfoScreen';
import { ShareInvitationScreen } from '../screens/onboarding/ShareInvitationScreen';
import { OnboardingCompleteScreen } from '../screens/onboarding/OnboardingCompleteScreen';

export type OnboardingStackParamList = {
  // New v3.0 flow
  Welcome: undefined;
  AccountCreation: { onboardingData: { name: string; phone: string | null } };
  Permissions: { userId: string };
  InviteTCPrompt: { userId: string };
  InviteTCContactInfo: { userId: string };
  ShareInvitation: {
    userId: string;
    invitationCode: string;
    contactName: string;
    expiresAt: string;
  };
  OnboardingComplete: {
    userId: string;
    hasTrustedContact: boolean;
    invitationMethod?: string;
  };
  // Old screens (keeping for backward compatibility during migration)
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: { userName: string; contactName: string; relationship: string };
  Confirmation: { userName: string };
};

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export function OnboardingNavigator() {
  return (
    // @ts-ignore - Tamagui type conflict
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back per v3.0 spec
        animation: 'slide_from_right',
      }}
    >
      {/* New v3.0 Onboarding Flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AccountCreation" component={AccountCreationScreen} />
      <Stack.Screen name="Permissions" component={PermissionScreen} />
      <Stack.Screen name="InviteTCPrompt" component={InviteTCPromptScreen} />
      <Stack.Screen name="InviteTCContactInfo" component={InviteTCContactInfoScreen} />
      <Stack.Screen name="ShareInvitation" component={ShareInvitationScreen} />
      <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />

      {/* Old screens (keeping for now) */}
      <Stack.Screen name="Invitation" component={InvitationScreen} />
      <Stack.Screen name="ContactInfo" component={ContactInfoScreen} />
      <Stack.Screen name="Share" component={ShareScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
}
