import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { Button, WalterBubble, Input } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OnboardingStackParamList = {
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
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ShareInvitation'>;

type ShareMethod = 'sms' | 'email' | 'manual';

export function ShareInvitationScreen({ navigation, route }: Props) {
  const { userId, invitationCode, contactName, expiresAt } = route.params;
  const [activeTab, setActiveTab] = useState<ShareMethod>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const updateInvitationSentStatus = async (method: ShareMethod) => {
    try {
      await supabase
        .from('trusted_contacts')
        .update({
          invitation_sent_at: new Date().toISOString(),
          preferred_contact_method: method,
        })
        .eq('invitation_code', invitationCode);
    } catch (error) {
      console.error('Error updating invitation status:', error);
    }
  };

  const shareBySMS = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Erreur', 'Entrez un numéro de téléphone');
      return;
    }

    const message = `Bonjour!

J'utilise Parapluie pour me protéger des arnaques. Pouvez-vous m'aider en tant que personne de confiance?

Code d'invitation: ${invitationCode}
Valide pendant 24 heures

Téléchargez l'app: https://parapluie.app

Merci!`;

    try {
      // Open SMS app with pre-filled message
      const url = `sms:${phoneNumber}${
        Platform.OS === 'ios' ? '&' : '?'
      }body=${encodeURIComponent(message)}`;
      await Linking.openURL(url);

      await updateInvitationSentStatus('sms');

      navigation.navigate('OnboardingComplete', {
        userId,
        hasTrustedContact: true,
        invitationMethod: 'sms',
      });
    } catch (error) {
      console.error('SMS error:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir l'application SMS");
    }
  };

  const shareByEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Erreur', 'Entrez une adresse email');
      return;
    }

    const subject = 'Invitation Parapluie';
    const body = `Bonjour!

J'utilise Parapluie pour me protéger des arnaques téléphoniques et des messages suspects. Pouvez-vous m'aider en tant que personne de confiance?

Code d'invitation: ${invitationCode}
Valide pendant 24 heures

Pour accepter l'invitation:
1. Téléchargez l'application Parapluie: https://parapluie.app
2. Entrez le code ci-dessus

Merci de votre aide!`;

    try {
      const url = `mailto:${email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      await Linking.openURL(url);

      await updateInvitationSentStatus('email');

      navigation.navigate('OnboardingComplete', {
        userId,
        hasTrustedContact: true,
        invitationMethod: 'email',
      });
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert('Erreur', "Impossible d'ouvrir l'application email");
    }
  };

  const copyCodeManually = () => {
    Clipboard.setString(invitationCode);
    Alert.alert('Code copié!', 'Le code a été copié dans le presse-papiers.');
  };

  const finishManualShare = async () => {
    await updateInvitationSentStatus('manual');

    navigation.navigate('OnboardingComplete', {
      userId,
      hasTrustedContact: true,
      invitationMethod: 'manual',
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sms':
        return (
          <View style={styles.tabContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📱 Téléphone du contact</Text>
              <Input
                placeholder="+1 (514) 555-1234"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
            <Button variant="primary" onPress={shareBySMS}>
              Envoyer par SMS →
            </Button>
          </View>
        );

      case 'email':
        return (
          <View style={styles.tabContent}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📧 Courriel du contact</Text>
              <Input
                placeholder="jean@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <Button variant="primary" onPress={shareByEmail}>
              Envoyer par courriel →
            </Button>
          </View>
        );

      case 'manual':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity style={styles.copyButton} onPress={copyCodeManually}>
              <Icon name="content-copy" size={24} color='$primary500' />
              <Text style={styles.copyButtonText}>Copier le code</Text>
            </TouchableOpacity>

            <Text style={styles.tipText}>
              💡 Astuce: Vous pouvez également noter le code sur un papier.
            </Text>

            <Button variant="primary" onPress={finishManualShare}>
              Terminer
            </Button>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>━━━━━━━━━━ 6/8</Text>
        </View>

        {/* Walter Message */}
        <WalterBubble
          imageSrc={require('../../../assets/walter/walter-happy-1.png')}
          message={`Bravo! Partagez le code ci-dessous avec ${contactName}:`}
        />

        {/* Invitation Code Card */}
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Code d'invitation</Text>
          <Text style={styles.code}>{invitationCode}</Text>
          <Text style={styles.codeExpiry}>
            Ce code est valide 24 heures
          </Text>
        </View>

        {/* Share Method Tabs */}
        <View style={styles.tabsContainer}>
          <Text style={styles.tabsLabel}>
            Comment souhaitez-vous partager le code d'invitation?
          </Text>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'sms' && styles.tabActive]}
              onPress={() => setActiveTab('sms')}
            >
              <Icon
                name="message-text"
                size={24}

              />
              <Text
                style={[styles.tabText, activeTab === 'sms' && styles.tabTextActive]}
              >
                SMS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'email' && styles.tabActive]}
              onPress={() => setActiveTab('email')}
            >
              <Icon
                name="email"
                size={24}
  
              />
              <Text
                style={[styles.tabText, activeTab === 'email' && styles.tabTextActive]}
              >
                Courriel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'manual' && styles.tabActive]}
              onPress={() => setActiveTab('manual')}
            >
              <Icon
                name="clipboard-text"
                size={24}

              />
              <Text
                style={[styles.tabText, activeTab === 'manual' && styles.tabTextActive]}
              >
                En personne
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },
  progressContainer: {
    paddingTop: 8,
  },
  progressText: {
    fontSize: 14,

    fontFamily: 'Monument-Light',
    textAlign: 'center',
  },
  codeCard: {

    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  codeLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontWeight: '600',
  },
  code: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 8,
    fontFamily: 'Monument-Bold',
  },
  codeExpiry: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  tabsContainer: {
    gap: 12,
  },
  tabsLabel: {
    fontSize: 15,
    fontWeight: '600',

    textAlign: 'center',
  },
  tabs: {
    flexDirection: 'row',

    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  tabActive: {

  },
  tabText: {
    fontSize: 12,

    fontWeight: '600',
  },
  tabTextActive: {

  },
  tabContent: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',

  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 12,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 2,

  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',

  },
  tipText: {
    fontSize: 13,

    textAlign: 'center',
    fontStyle: 'italic',
  },
});
