import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button, Input, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: undefined;
  ContactInfo: undefined;
  Share: undefined;
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  const [userName, setUserName] = useState('');

  const handleContinue = () => {
    if (userName.trim()) {
      navigation.navigate('Permissions', { userName: userName.trim() });
    }
  };

  const handleSkip = () => {
    navigation.navigate('Permissions', { userName: '' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Section - Walter and Message */}
        <View style={styles.topSection}>
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-smile-1.png')}
            message="Bonjour ! Je m'appelle Walter, votre compagnon. Et vous, comment vous appelez-vous ?"
          />

          {/* Input Field */}
          <View style={styles.inputContainer}>
            <Input
              placeholder="Votre prénom"
              value={userName}
              onChangeText={setUserName}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handleContinue}
            />
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={handleContinue}
            disabled={!userName.trim()}
          >
            Continuer
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
  inputContainer: {
    paddingHorizontal: 24,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
  },
});
