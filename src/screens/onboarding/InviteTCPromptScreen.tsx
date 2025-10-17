import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { Button, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

type OnboardingStackParamList = {
  Permissions: undefined;
  InviteTCPrompt: { userId: string };
  InviteTCContactInfo: { userId: string };
  OnboardingComplete: { userId: string; hasTrustedContact: boolean };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'InviteTCPrompt'>;

export function InviteTCPromptScreen({ navigation, route }: Props) {
  const { userId } = route.params;

  const handleAddContact = () => {
    navigation.navigate('InviteTCContactInfo', { userId });
  };

  const handleSkipInvitation = async () => {
    // Mark onboarding as complete without TC
    await completeOnboarding(false);

    // Navigate to success screen
    navigation.navigate('OnboardingComplete', {
      userId,
      hasTrustedContact: false,
    });
  };

  const completeOnboarding = async (hasTrustedContact: boolean) => {
    try {
      await AsyncStorage.setItem('@parapluie/onboardingCompleted', 'true');

      await supabase
        .from('user_profiles')
        .update({
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
        })
        .eq('id', userId);
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>━━━━━━━━━━ 4/7</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Walter Message */}
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-happy-1.png')}
            message="Merveilleux!

Désirez-vous inviter un membre de votre famille ou un proche à prendre part à votre sécurité?"
          />

          {/* Privacy Notice Card */}
          <View style={styles.privacyCard}>
            <Text style={styles.privacyTitle}>🔒 Avis de confidentialité</Text>

            <Text style={styles.privacyLabel}>Votre personne de confiance pourra:</Text>
            <Text style={styles.privacyItem}>• Voir les alertes de sécurité</Text>
            <Text style={styles.privacyItem}>• Être notifié des menaces</Text>
            <Text style={styles.privacyItem}>• Vous aider à rester protégé</Text>

            <Text style={[styles.privacyLabel, styles.privacyLabelNo]}>
              Elle NE pourra PAS:
            </Text>
            <Text style={styles.privacyItem}>• Consulter vos messages</Text>
            <Text style={styles.privacyItem}>• Accéder à vos appels</Text>
            <Text style={styles.privacyItem}>• Contrôler votre appareil</Text>
          </View>
        </ScrollView>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleAddContact}>
            Ajouter un contact →
          </Button>
          <Button variant="ghost" onPress={handleSkipInvitation}>
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
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 24,
  },
  privacyCard: {
    backgroundColor: colors.base[600],
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  privacyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.base[100],
    marginBottom: 16,
    textAlign: 'center',
  },
  privacyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.base[200],
    marginTop: 12,
    marginBottom: 8,
  },
  privacyLabelNo: {
    marginTop: 16,
  },
  privacyItem: {
    fontSize: 14,
    color: colors.base[300],
    marginVertical: 4,
    paddingLeft: 8,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
