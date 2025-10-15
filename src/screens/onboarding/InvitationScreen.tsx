import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button, WalterBubble, InfoCard } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: undefined;
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Invitation'>;

export function InvitationScreen({ navigation, route }: Props) {
  const { userName } = route.params;

  const handleAddContact = () => {
    navigation.navigate('ContactInfo', { userName });
  };

  const handleSkip = () => {
    // Skip to home screen (will be implemented later)
    // For now, we'll navigate to next screen as placeholder
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Section - Walter and Message */}
        <View style={styles.topSection}>
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-smile-2.png')}
            message="Désirez-vous inviter un membre de votre famille ou un proche à prendre part à votre sécurité ?"
          />

          {/* Privacy Notice Card */}
          <View style={styles.cardContainer}>
            <InfoCard
              emoji="⚠️"
              title="Avis de confidentialité"
              text="Le membre invité est seulement autorisé à voir ce que vous choisissez de partager."
            />
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleAddContact}>
            Ajouter un contact
          </Button>
          <Button variant="ghost" onPress={handleSkip}>
            Sauter
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
    gap: 24,
  },
  cardContainer: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
  },
});
