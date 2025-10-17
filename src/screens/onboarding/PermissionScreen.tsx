import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet, Alert, Platform, Text } from 'react-native';
import { Button, WalterBubble, InfoCard } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

type OnboardingStackParamList = {
  Welcome: undefined;
  AccountCreation: undefined;
  Permissions: { userId: string };
  InviteTCPrompt: { userId: string };
  ContactInfo: undefined;
  Share: undefined;
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Permissions'>;

interface PermissionResults {
  phone: boolean;
  location: boolean;
  notifications: boolean;
}

export function PermissionScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const [loading, setLoading] = useState(false);

  // Request all permissions (v3.0 spec)
  const requestAllPermissions = async () => {
    setLoading(true);
    const results: PermissionResults = {
      phone: false,
      location: false,
      notifications: false,
    };

    try {
      // 1. Phone permissions (CRITICAL for call/SMS blocking)
      // Note: Actual implementation depends on React Native modules
      // For now, we'll simulate this
      if (Platform.OS === 'ios') {
        // iOS: CallKit + Message Filter Extension
        // TODO: Implement with react-native-callkit-incoming
        results.phone = true; // Simulated for now
      } else {
        // Android: CallScreeningService + READ_SMS
        // TODO: Implement with react-native-android-call-detector
        results.phone = true; // Simulated for now
      }

      // 2. Location (OPTIONAL but recommended)
      const locationPermission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const locationStatus = await request(locationPermission);
      results.location = locationStatus === RESULTS.GRANTED;

      // 3. Notifications (RECOMMENDED)
      // For React Native, notification permissions are typically requested when scheduling
      // For this demo, we'll mark as granted
      results.notifications = true;

      // Store results in AsyncStorage
      await AsyncStorage.setItem(
        '@parapluie/permissions',
        JSON.stringify(results)
      );

      // Update database
      await supabase
        .from('security_settings')
        .update({
          call_protection_enabled: results.phone,
          sms_protection_enabled: results.phone,
          location_alerts_enabled: results.location,
          notifications_enabled: results.notifications,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);

      // Check if critical permission denied
      if (!results.phone) {
        showCriticalPermissionWarning();
      } else {
        // Continue to next screen
        navigation.navigate('InviteTCPrompt', { userId });
      }
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert('Erreur', "Erreur lors de la demande d'autorisations");
    } finally {
      setLoading(false);
    }
  };

  // Warning if phone permission denied
  const showCriticalPermissionWarning = () => {
    Alert.alert(
      '⚠️ Protection limitée',
      "Sans autorisation d'accès aux appels et messages, Walter ne peut pas vous protéger efficacement.\n\nVous pouvez activer cette permission plus tard dans Réglages.",
      [
        {
          text: 'Réessayer',
          onPress: requestAllPermissions,
        },
        {
          text: 'Continuer sans protection',
          style: 'destructive',
          onPress: () => {
            navigation.navigate('InviteTCPrompt', { userId });
          },
        },
      ]
    );
  };

  const handleSkip = () => {
    Alert.alert(
      'Êtes-vous sûr?',
      "Walter ne pourra pas vous protéger sans ces autorisations. Vous pouvez les activer plus tard dans les réglages de l'application.",
      [
        { text: 'Revenir', style: 'cancel' },
        {
          text: 'Passer quand même',
          style: 'destructive',
          onPress: async () => {
            // Store that user skipped
            await AsyncStorage.setItem(
              '@parapluie/permissions',
              JSON.stringify({ phone: false, location: false, notifications: false })
            );

            navigation.navigate('InviteTCPrompt', { userId });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>━━━━━━━━━━ 3/7</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.walterContainer}>
            {/* Walter and Message */}
            <WalterBubble
              imageSrc={require('../../../assets/walter/walter-happy-1.png')}
              message="Bien joué! Débutons maintenant à sécuriser votre appareil ensemble.

Pour vous protéger efficacement, j'aurai besoin de votre accord sur quelques permissions:"
            />
          </View>

          {/* Permission Cards with badges */}
          <View style={styles.cardsContainer}>
            <View>
              <InfoCard
                emoji="📞"
                title="Appels et Messages"
                text="Pour bloquer les appels et messages suspects"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>⚠️ REQUIS</Text>
              </View>
            </View>

            <View>
              <InfoCard
                emoji="📍"
                title="Localisation"
                text="Pour les alertes locales (optionnel)"
              />
              <View style={[styles.badge, styles.badgeRecommended]}>
                <Text style={styles.badgeTextRecommended}>🌟 RECOMMANDÉ</Text>
              </View>
            </View>

            <View>
              <InfoCard
                emoji="🔔"
                title="Notifications"
                text="Pour vous alerter des menaces"
              />
              <View style={[styles.badge, styles.badgeRecommended]}>
                <Text style={styles.badgeTextRecommended}>🌟 RECOMMANDÉ</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={requestAllPermissions}
            loading={loading}
          >
            Accepter la protection →
          </Button>
          <Button variant="ghost" onPress={handleSkip}>
            Je le ferai plus tard
          </Button>
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
    paddingBottom: 16,
  },
  progressText: {
    fontSize: 14,
    color: colors.base[300],
    fontFamily: 'Monument-Light',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  walterContainer: {
    marginBottom: 24,
  },
  cardsContainer: {
    gap: 20,
    paddingHorizontal: 24,
  },
  badge: {
    backgroundColor: colors.danger[500],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: -12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  badgeRecommended: {
    backgroundColor: colors.primary[500],
  },
  badgeTextRecommended: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
