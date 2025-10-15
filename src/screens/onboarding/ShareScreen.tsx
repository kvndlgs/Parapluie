import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Clipboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: { userName: string; contactName: string; relationship: string };
  Confirmation: { userName: string };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Share'>;

type TabType = 'sms' | 'email' | 'person';

export function ShareScreen({ navigation, route }: Props) {
  const { userName, contactName, relationship } = route.params;
  const [activeTab, setActiveTab] = useState<TabType>('sms');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // Generate a random 6-digit code
  const invitationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendSMS = () => {
    // TODO: Implement SMS sending
    navigation.navigate('Confirmation', { userName });
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending
    navigation.navigate('Confirmation', { userName });
  };

  const handleCopyCode = () => {
    Clipboard.setString(invitationCode);
    // TODO: Show toast notification
  };

  const handleFinish = () => {
    navigation.navigate('Confirmation', { userName });
  };

  const getMainButtonText = () => {
    switch (activeTab) {
      case 'sms':
        return 'Envoyer par SMS';
      case 'email':
        return 'Envoyer par courriel';
      case 'person':
        return 'Terminer';
    }
  };

  const handleMainButtonPress = () => {
    switch (activeTab) {
      case 'sms':
        return handleSendSMS();
      case 'email':
        return handleSendEmail();
      case 'person':
        return handleFinish();
    }
  };

  const isButtonDisabled = () => {
    if (activeTab === 'sms') return !phoneNumber.trim();
    if (activeTab === 'email') return !email.trim();
    return false;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.innerContent}>
            {/* Walter and Message */}
            <WalterBubble
              imageSrc={require('../../../assets/walter/walter-confetti.png')}
              message={`Merveilleux, ${userName}! Partager le code ci-dessous avec un membre de votre famille. Astuce: Vous pouvez choisir de l'envoyer par SMS, Courriel, ou même en personne.`}
            />

            {/* Invitation Code Card */}
            <View style={styles.codeCardContainer}>
              <View style={styles.codeCard}>
                <Text style={styles.codeText}>{invitationCode}</Text>
                <Text style={styles.codeSubtext}>Ce code est valide 24 heures</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <View style={styles.tabButtons}>
                <View style={styles.tabButton}>
                  <Button
                    variant={activeTab === 'sms' ? 'primary' : 'ghost'}
                    onPress={() => setActiveTab('sms')}
                    size="md"
                  >
                    SMS
                  </Button>
                </View>
                <View style={styles.tabButton}>
                  <Button
                    variant={activeTab === 'email' ? 'primary' : 'ghost'}
                    onPress={() => setActiveTab('email')}
                    size="md"
                  >
                    Courriel
                  </Button>
                </View>
                <View style={styles.tabButton}>
                  <Button
                    variant={activeTab === 'person' ? 'primary' : 'ghost'}
                    onPress={() => setActiveTab('person')}
                    size="md"
                  >
                    En personne
                  </Button>
                </View>
              </View>

              {/* Tab Content */}
              <View style={styles.tabContent}>
                {activeTab === 'sms' && (
                  <>
                    <Input
                      placeholder="Téléphone du contact"
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      keyboardType="phone-pad"
                    />
                    <Button variant="ghost" size="md">
                      Trouver depuis vos contacts
                    </Button>
                  </>
                )}

                {activeTab === 'email' && (
                  <>
                    <Input
                      placeholder="Adresse courriel du contact"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    <Button variant="ghost" size="md">
                      Trouver depuis vos contacts
                    </Button>
                  </>
                )}

                {activeTab === 'person' && (
                  <Button variant="ghost" size="md" onPress={handleCopyCode}>
                    Copier le code
                  </Button>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Section - Main Button */}
        <View style={styles.bottomButton}>
          <Button
            variant="primary"
            onPress={handleMainButtonPress}
            disabled={isButtonDisabled()}
          >
            {getMainButtonText()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  innerContent: {
    gap: 24,
  },
  codeCardContainer: {
    paddingHorizontal: 24,
  },
  codeCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  codeText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#553F55',
    letterSpacing: 4,
  },
  codeSubtext: {
    fontSize: 14,
    color: '#52525b',
  },
  tabsContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  tabContent: {
    gap: 12,
  },
  bottomButton: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
