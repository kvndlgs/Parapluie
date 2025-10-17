import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text } from 'react-native';
import { WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { useDispatch } from 'react-redux';
import { setOnboardingComplete } from '../../store/slices/authSlice';

type OnboardingStackParamList = {
  OnboardingComplete: {
    userId: string;
    hasTrustedContact: boolean;
    invitationMethod?: string;
  };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'OnboardingComplete'>;

export function OnboardingCompleteScreen({ navigation, route }: Props) {
  const { hasTrustedContact, invitationMethod } = route.params;
  const dispatch = useDispatch();

  useEffect(() => {
    // Auto-navigate to main app after 3 seconds
    const timer = setTimeout(() => {
      // Mark onboarding as complete in Redux
      dispatch(setOnboardingComplete(true));

      // Navigation will be handled by RootNavigator automatically
      // once hasCompletedOnboarding is true
    }, 3000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const getMessage = () => {
    if (hasTrustedContact) {
      return `Bravo! Tout est fait!

Vous êtes maintenant protégée.

${
  invitationMethod === 'sms' || invitationMethod === 'email'
    ? 'Votre contact recevra une notification quand il accepte l\'invitation.'
    : ''
}

Allons explorer votre tableau de bord ensemble!`;
    }

    return `Bravo! Tout est fait!

Vous êtes maintenant protégée.

Allons explorer votre tableau de bord ensemble!`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>━━━━━━━━━━ 7/7</Text>
        </View>

        {/* Walter Celebration */}
        <View style={styles.messageContainer}>
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-happy-1.png')}
            message={getMessage()}
          />

          {/* Celebration Icons */}
          <View style={styles.celebrationContainer}>
            <Text style={styles.celebrationIcon}>🎉</Text>
            <Text style={styles.celebrationIcon}>✨</Text>
          </View>
        </View>

        {/* Loading Animation */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base[700],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 24,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.base[300],
    fontFamily: 'Monument-Light',
    textAlign: 'center',
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  celebrationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 24,
  },
  celebrationIcon: {
    fontSize: 48,
  },
  loadingContainer: {
    paddingBottom: 48,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary[500],
  },
  dot1: {
    opacity: 0.3,
  },
  dot2: {
    opacity: 0.6,
  },
  dot3: {
    opacity: 1,
  },
});
