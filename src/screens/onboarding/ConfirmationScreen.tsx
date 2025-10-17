import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Button, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { setOnboardingComplete, setUser } from '../../store/slices/authSlice';
import { completeOnboarding, OnboardingData } from '../../services/onboardingService';
import { verifyPhoneOTP } from '../../services/authService';
import type { OnboardingStackParamList } from '../../navigation/OnboardingTypes';

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Confirmation'>;

export function ConfirmationScreen({ navigation, route }: Props) {
  const {
    userName,
    phoneNumber,
    permissions,
    contactName,
    relationship,
    contactPhone,
    contactEmail,
    preferredMethod,
  } = route.params;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFinish = async () => {
    try {
      setLoading(true);
      setError(null);

      // Prepare onboarding data
      const onboardingData: OnboardingData = {
        userName,
        phoneNumber, // Senior's phone number
        language: 'fr',
        permissions,
        trustedContact: contactName && relationship ? {
          name: contactName,
          relationship,
          phoneNumber: contactPhone,
          email: contactEmail,
          preferredContactMethod: preferredMethod || 'sms',
        } : undefined,
      };

      // Complete onboarding (saves to database if authenticated)
      const result = await completeOnboarding(onboardingData);

      if (!result.success) {
        throw new Error(result.error?.toString() || 'Failed to complete onboarding');
      }

      // Update Redux state - this will trigger RootNavigator to show MainNavigator
      dispatch(setOnboardingComplete(true));

      console.log('✅ Onboarding completed successfully!');
    } catch (err: any) {
      console.error('❌ Error completing onboarding:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Section - Walter and Message */}
        <View style={styles.topSection}>
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-neutral-1.png')}
            message={`Bien joué, ${userName || 'cher ami'} ! Tout est fait. Vous pouvez maintenant explorer les avantages de Parapluie-Plus gratuitement pendant 7 jours. Walter veillera sur vous et vous recevrez une alerte dès que votre contact répond à votre invitation.`}
          />

          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          )}
        </View>

        {/* Bottom Section - Button */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={handleFinish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              'Visiter avec Walter'
            )}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#553F55',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    fontFamily: 'Monument-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 24,
  },
});
