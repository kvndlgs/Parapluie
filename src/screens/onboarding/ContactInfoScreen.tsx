import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { Button, Input, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type OnboardingStackParamList = {
  Welcome: undefined;
  Permissions: { userName: string };
  Invitation: { userName: string };
  ContactInfo: { userName: string };
  Share: { userName: string; contactName: string; relationship: string };
  Confirmation: undefined;
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'ContactInfo'>;

export function ContactInfoScreen({ navigation, route }: Props) {
  const { userName } = route.params;
  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('');

  const handleCreateInvitation = () => {
    if (contactName.trim()) {
      navigation.navigate('Share', {
        userName,
        contactName: contactName.trim(),
        relationship: relationship.trim(),
      });
    }
  };

  const handleSkip = () => {
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Section - Walter and Message */}
        <View style={styles.topSection}>
          <WalterBubble
            imageSrc={require('../../../assets/walter/walter-smile-2.png')}
            message="Voulez-vous préciser le nom et la nature de votre relation avec ce contact ?"
          />

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <Input
              placeholder="Nom du contact"
              value={contactName}
              onChangeText={setContactName}
              autoFocus
              returnKeyType="next"
            />
            <Input
              placeholder="Ex: Fils, Soeur, Amis"
              value={relationship}
              onChangeText={setRelationship}
              returnKeyType="done"
              onSubmitEditing={handleCreateInvitation}
            />
          </View>
        </View>

        {/* Bottom Section - Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            variant="primary"
            onPress={handleCreateInvitation}
            disabled={!contactName.trim()}
          >
            Créer l'invitation
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
    gap: 16,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    gap: 12,
    paddingHorizontal: 24,
  },
});
