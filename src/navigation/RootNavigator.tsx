import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setUser, setOnboardingComplete, setLoading } from '../store/slices/authSlice';
import { OnboardingNavigator } from './OnboardingNavigator';
import { MainNavigator } from './MainNavigator';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      // Check if onboarding was completed
      const onboardingComplete = await AsyncStorage.getItem('@parapluie/onboardingCompleted');
      if (onboardingComplete === 'true') {
        dispatch(setOnboardingComplete(true));
      }

      // Check Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        // TODO: Fetch full user profile from Supabase
        // For now, just mark as authenticated
        dispatch(setLoading(false));
      } else {
        dispatch(setLoading(false));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch(setLoading(false));
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#785978" />
      </View>
    );
  }

  // If user hasn't completed onboarding, show onboarding flow
  if (!hasCompletedOnboarding) {
    return <OnboardingNavigator />;
  }

  // If user is authenticated, show main app
  if (isAuthenticated) {
    return <MainNavigator />;
  }

  // Otherwise show onboarding (can be updated later to show login/register)
  return <OnboardingNavigator />;
}
