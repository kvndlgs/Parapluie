import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, WalterBubble, InfoCard } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: undefined;
  Share: undefined;
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Permissions'>;

export function PermissionScreen({ navigation, route }: Props) {
  const { userName } = route.params;

  const handleAccept = () => {
    // In a real app, this would request permissions
    navigation.navigate('Invitation', { userName });
  };

  const handleSkip = () => {
    navigation.navigate('Invitation', { userName });
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
          <View style={styles.walterContainer}>
            {/* Walter and Message */}
            <WalterBubble
              imageSrc={require('../../../assets/walter/walter-happy-1.png')}
              message={`Je suis ravi de vous rencontrer, ${userName || 'cher ami'}! Je vous protégerai en gardant un oeil sur les alertes, mais pour cela, j'aurai besoin de votre accord sur quelques petites choses.`}
            />
          </View>

          {/* Permission Cards */}
          <View style={styles.cardsContainer}>
            <InfoCard
              emoji="📞"
              title="Appels et messages"
              text="Je pourrai ainsi bloquer les appels et messages frauduleux avant même qu'ils ne vous soient transmis."
            />
            <InfoCard
              emoji="📍"
              title="Location"
              text="Je pourrai ainsi vous alerter lorsqu'un évènement se produit près de votre location."
            />
            <InfoCard
              emoji="🔔"
              title="Notifications"
              text="Je pourrai ainsi vous alerter rapidement lorsque je détecte un risque potentiel."
            />
          </View>
        </ScrollView>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button variant="primary" onPress={handleAccept}>
            Accepter la protection
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
    gap: 16,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});
