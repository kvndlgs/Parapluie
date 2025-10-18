import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert } from 'react-native';
import { YStack, XStack, Text } from 'tamagui';
import { WalterBubble } from '../../components';
import { Button, Input } from '../../tamagui/components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';


type OnboardingStackParamList = {
  Welcome: undefined;
  AccountCreation: { onboardingData: { name: string; phone: string | null } };
  Permissions: { userName: string; phoneNumber: string };
  Invitation: undefined;
  ContactInfo: undefined;
  Share: undefined;
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'Welcome'>;

interface ValidationResult {
  valid: boolean;
  message?: string;
  formatted?: string;
}

export function WelcomeScreen({ navigation }: Props) {
  const [userName, setUserName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Name validation (per v3.0 spec)
  const validateName = (name: string): ValidationResult => {
    const trimmed = name.trim();

    if (trimmed.length < 2) {
      return {
        valid: false,
        message: 'Entrez au moins 2 caractères',
      };
    }

    if (trimmed.length > 50) {
      return {
        valid: false,
        message: 'Le nom est trop long (max 50 caractères)',
      };
    }

    return { valid: true };
  };

  // Phone validation (Canadian numbers per v3.0 spec)
  const validatePhone = (phone: string): ValidationResult => {
    const digits = phone.replace(/\D/g, '');

    // 10 digits for Canada
    if (digits.length === 10) {
      return {
        valid: true,
        formatted: `+1${digits}`, // E.164 format
      };
    } else if (digits.length === 11 && digits.startsWith('1')) {
      return {
        valid: true,
        formatted: `+${digits}`,
      };
    } else {
      return {
        valid: false,
        message: 'Entrez un numéro de téléphone valide (10 chiffres)',
      };
    }
  };

  // Auto-format phone as user types (per v3.0 spec)
  const formatPhoneInput = (input: string): string => {
    const digits = input.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      // Limit to 10 digits
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (text: string) => {
    const formatted = formatPhoneInput(text);
    setPhoneNumber(formatted);
    setPhoneError('');
  };

  const handleContinue = () => {
    // Validate name
    const nameValidation = validateName(userName);
    if (!nameValidation.valid) {
      setNameError(nameValidation.message || '');
      return;
    }

    // Validate phone
    const phoneValidation = validatePhone(phoneNumber);
    if (!phoneValidation.valid) {
      setPhoneError(phoneValidation.message || '');
      return;
    }

    // Store data temporarily (not in database yet - no account per v3.0)
    const onboardingData = {
      name: userName.trim(),
      phone: phoneValidation.formatted || null,
    };

    // Navigate to AccountCreation screen (v3.0 flow)
    navigation.navigate('AccountCreation', { onboardingData });
  };

  const handleSkip = () => {
    Alert.alert(
      'Êtes-vous sûr?',
      'Votre nom et numéro aident Walter à mieux vous protéger.',
      [
        { text: 'Revenir', style: 'cancel' },
        {
          text: 'Passer',
          style: 'destructive',
          onPress: () => {
            // Use defaults per v3.0 spec
            const defaultData = {
              name: 'Utilisateur',
              phone: null,
            };
            navigation.navigate('AccountCreation', { onboardingData: defaultData });
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} justifyContent="space-between" paddingVertical="$6">
        {/* Progress Indicator */}
        <YStack paddingHorizontal="$6" paddingTop="$2">
          <Text
            fontSize="$3"
            fontFamily="Monument-Light"
            textAlign="center"
          >
            ━━━━━━━━━━ 1/7
          </Text>
        </YStack>

        {/* Top Section - Walter and Message */}
        <YStack flex={1} justifyContent="center" gap="$6">
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-smile-1.png')}
            message="Bonjour ! Je m'appelle Waler, votre compagnon. Ma mission est de vous protéger des appels et messages indésirables.  Et vous, comment vous appelez-vous ?"
          />

          {/* Name Input Field */}
          <YStack paddingHorizontal="$6" gap="$2">
            <XStack gap="$2" alignItems="center">
              <Text
                fontFamily="MaterialSymbols-Regular"
                fontSize={24}
              >
                person
              </Text>
              <YStack flex={1}>
                <Input
                  placeholder="Votre nom"
                  value={userName}
                  onChangeText={(text) => {
                    setUserName(text);
                    setNameError('');
                  }}
                  autoFocus
                  returnKeyType="next"
                />
              </YStack>
            </XStack>
            {nameError ? (
              <Text
                fontSize="$3"
                fontFamily="Monument-Light"
              >
                {nameError}
              </Text>
            ) : null}
          </YStack>

          {/* Phone Input Field */}
          <YStack paddingHorizontal="$6" gap="$2">
            <XStack gap="$2" alignItems="center">
              <Text
                fontFamily="MaterialSymbols-Regular"
                fontSize={24}
              >
                phone
              </Text>
              <YStack flex={1}>
                <Input
                  placeholder="(514) 555-5555"
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
              </YStack>
            </XStack>
            {phoneError ? (
              <Text
                fontSize="$3"
                fontFamily="Monument-Light"
              >
                {phoneError}
              </Text>
            ) : (
              <Text
                fontSize="$3"
                fontFamily="Monument-Light"
              >
                💡 Votre numéro nous aide à identifier les appels pour vous.
              </Text>
            )}
          </YStack>
        </YStack>

        {/* Bottom Section - Buttons */}
        <YStack gap="$3" paddingHorizontal="$6">
          <Button
            variant="primary"
            fullWidth
            onPress={handleContinue}
            disabled={!userName.trim() || !phoneNumber.trim()}
          >
            Continuer
          </Button>
          <Button
            variant="ghost"
            fullWidth
            onPress={handleSkip}
          >
            Sauter
          </Button>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
}
