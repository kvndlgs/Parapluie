import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: { userName: string; contactName: string; relationship: string };
  Confirmation: { userName: string };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Confirmation'>;

export function ConfirmationScreen({ navigation, route }: Props) {
  const { userName } = route.params;

  const handleFinish = () => {
    // TODO: Navigate to Home Screen
    // For now, we'll just log
    console.log('Onboarding completed!');
    // navigation.replace('Main');
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
        </View>

        {/* Bottom Section - Button */}
        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleFinish}>
            Visiter avec Walter
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
  buttonContainer: {
    paddingHorizontal: 24,
  },
});
