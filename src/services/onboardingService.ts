import { supabase } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingData {
  userName: string;
  phoneNumber?: string; // Senior's phone number (optional for now)
  language: 'fr' | 'en';
  permissions: {
    callProtection: boolean;
    smsProtection: boolean;
    locationAlerts: boolean;
    notifications: boolean;
  };
  trustedContact?: {
    name: string;
    relationship: string;
    phoneNumber?: string;
    email?: string;
    preferredContactMethod: 'sms' | 'email' | 'app';
  };
}

export async function completeOnboarding(data: OnboardingData) {
  try {
    // 1. Create anonymous/unauthenticated user for senior
    // Seniors don't need to verify phone during onboarding
    // They'll verify later OR trusted contact will verify on their behalf

    const { data: { session } } = await supabase.auth.getSession();

    let userId: string;

    if (!session) {
      // Create anonymous user session for senior
      // This allows them to use the app immediately without SMS verification
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();

      if (anonError || !anonData.session) {
        console.error('❌ Error creating anonymous session:', anonError);

        // Fallback: store locally
        userId = 'temp-user-' + Date.now();
        await AsyncStorage.setItem('@parapluie/userId', userId);
        await AsyncStorage.setItem('@parapluie/onboardingData', JSON.stringify(data));
        await AsyncStorage.setItem('@parapluie/onboardingCompleted', 'true');

        return { success: true, userId, message: 'Stored locally - anonymous auth failed' };
      }

      userId = anonData.session.user.id;
      console.log('✅ Anonymous session created for senior:', userId);
    } else {
      userId = session.user.id;
    }

    // 2. Create user profile in database
    // Note: user_profiles.id references auth.users(id), so it uses the auth user's UUID

    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId, // Must match auth.users.id
        first_name: data.userName,
        phone_number: data.phoneNumber || 'not-provided',
        language: data.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }

    // 3. Save security settings
    const { error: settingsError } = await supabase
      .from('security_settings')
      .insert({
        user_id: userId,
        protection_level: 'medium',
        call_protection_enabled: data.permissions.callProtection,
        sms_protection_enabled: data.permissions.smsProtection,
        location_alerts_enabled: data.permissions.locationAlerts,
        notifications_enabled: data.permissions.notifications,
        auto_block_unknown: false,
        auto_block_international: false,
        quiet_hours_enabled: false,
      });

    if (settingsError) {
      console.error('Error creating security settings:', settingsError);
      throw settingsError;
    }

    // 4. Create trusted contact invitation if provided
    if (data.trustedContact) {
      const invitationCode = generateInvitationCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

      const { error: contactError } = await supabase
        .from('trusted_contacts')
        .insert({
          senior_id: userId,
          contact_status: 'pending',
          name: data.trustedContact.name,
          relationship: data.trustedContact.relationship,
          phone_number: data.trustedContact.phoneNumber,
          email: data.trustedContact.email,
          preferred_contact_method: data.trustedContact.preferredContactMethod,
          invitation_code: invitationCode,
          invitation_expires_at: expiresAt.toISOString(),
          permissions: {
            alert_level: 'high',
            can_view_alerts: true,
            can_receive_notifications: true,
            can_view_location: false,
            can_access_calendar: false,
            can_modify_settings: false,
          },
        });

      if (contactError) {
        console.error('Error creating trusted contact:', contactError);
        throw contactError;
      }

      // Store invitation code for sharing
      await AsyncStorage.setItem('@parapluie/invitationCode', invitationCode);
    }

    // 5. Mark onboarding as complete
    await AsyncStorage.setItem('@parapluie/onboardingCompleted', 'true');
    await AsyncStorage.setItem('@parapluie/userId', userId);

    console.log('✅ Onboarding completed successfully!');
    return { success: true, userId };

  } catch (error) {
    console.error('❌ Error completing onboarding:', error);
    return { success: false, error };
  }
}

function generateInvitationCode(): string {
  // Generate 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function getInvitationCode(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem('@parapluie/invitationCode');
  } catch (error) {
    console.error('Error getting invitation code:', error);
    return null;
  }
}
