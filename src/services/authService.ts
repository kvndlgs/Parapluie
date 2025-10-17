import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthResult {
  success: boolean;
  userId?: string;
  error?: string;
  requiresVerification?: boolean;
}

/**
 * Send OTP to phone number via SMS
 */
export async function sendPhoneOTP(phoneNumber: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });

    if (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ OTP sent successfully');
    return {
      success: true,
      requiresVerification: true,
    };
  } catch (error: any) {
    console.error('Error in sendPhoneOTP:', error);
    return { success: false, error: error.message || 'Failed to send OTP' };
  }
}

/**
 * Verify OTP code
 */
export async function verifyPhoneOTP(
  phoneNumber: string,
  otpCode: string
): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: otpCode,
      type: 'sms',
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }

    if (data.session) {
      // Store user ID locally
      await AsyncStorage.setItem('@parapluie/userId', data.session.user.id);

      console.log('✅ Phone verified successfully');
      return {
        success: true,
        userId: data.session.user.id,
      };
    }

    return { success: false, error: 'No session returned' };
  } catch (error: any) {
    console.error('Error in verifyPhoneOTP:', error);
    return { success: false, error: error.message || 'Failed to verify OTP' };
  }
}

/**
 * Sign up with phone number (sends OTP)
 */
export async function signUpWithPhone(phoneNumber: string): Promise<AuthResult> {
  return sendPhoneOTP(phoneNumber);
}

/**
 * Sign in with phone number (sends OTP)
 */
export async function signInWithPhone(phoneNumber: string): Promise<AuthResult> {
  return sendPhoneOTP(phoneNumber);
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Error getting session:', error);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error in getCurrentSession:', error);
    return null;
  }
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Error getting user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Error signing out:', error);
      return { success: false, error: error.message };
    }

    // Clear local storage
    await AsyncStorage.multiRemove([
      '@parapluie/userId',
      '@parapluie/onboardingCompleted',
      '@parapluie/onboardingData',
      '@parapluie/invitationCode',
    ]);

    console.log('✅ Signed out successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error in signOut:', error);
    return { success: false, error: error.message || 'Failed to sign out' };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem('@parapluie/onboardingCompleted');
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}
