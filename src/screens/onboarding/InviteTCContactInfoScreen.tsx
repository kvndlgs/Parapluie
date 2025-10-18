import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Button, Input, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../../lib/supabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OnboardingStackParamList = {
  InviteTCPrompt: undefined;
  InviteTCContactInfo: { userId: string };
  ShareInvitation: {
    userId: string;
    invitationCode: string;
    contactName: string;
    expiresAt: string;
  };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'InviteTCContactInfo'>;

const relationshipOptions = [
  { value: 'fils', label: 'Fils' },
  { value: 'fille', label: 'Fille' },
  { value: 'conjoint', label: 'Conjoint(e)' },
  { value: 'ami', label: 'Ami(e)' },
  { value: 'voisin', label: 'Voisin(e)' },
  { value: 'autre', label: 'Autre' },
];

export function InviteTCContactInfoScreen({ navigation, route }: Props) {
  const { userId } = route.params;
  const [contactName, setContactName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [nameError, setNameError] = useState('');
  const [relationshipError, setRelationshipError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);

  const validateContactInfo = (): boolean => {
    let isValid = true;

    if (contactName.trim().length < 2) {
      setNameError('Entrez au moins 2 caractères');
      isValid = false;
    }

    if (!relationship) {
      setRelationshipError('Sélectionnez une relation');
      isValid = false;
    }

    return isValid;
  };

  // Generate unique 4-character code (per v3.0 spec)
  const generateUniqueInvitationCode = async (): Promise<string> => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude I, O, 0, 1
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Generate random 4-char code
      let code = '';
      for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      // Check if code already exists
      const { data } = await supabase
        .from('trusted_contacts')
        .select('id')
        .eq('invitation_code', code)
        .single();

      if (!data) {
        // Code is unique!
        return code;
      }

      attempts++;
    }

    throw new Error('Failed to generate unique code');
  };

  const handleCreateInvitation = async () => {
    if (!validateContactInfo()) return;

    setLoading(true);

    try {
      // 1. Generate unique 4-character code
      const invitationCode = await generateUniqueInvitationCode();

      // 2. Set expiration (24 hours per v3.0 spec)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      // 3. Create invitation in database
      const { data: invitation, error } = await supabase
        .from('trusted_contacts')
        .insert({
          senior_id: userId,
          name: contactName.trim(),
          relationship: relationship,
          contact_status: 'pending',
          invitation_code: invitationCode,
          invitation_expires_at: expiresAt.toISOString(),
          invited_at: new Date().toISOString(),
          permissions: {
            can_view_alerts: true,
            can_receive_notifications: true,
            can_view_location: false,
            can_access_calendar: false,
            can_modify_settings: false,
            alert_level: 'high',
          },
        })
        .select()
        .single();

      if (error) throw error;

      // 4. Navigate to share screen
      navigation.navigate('ShareInvitation', {
        userId,
        invitationCode,
        contactName: contactName.trim(),
        expiresAt: expiresAt.toISOString(),
      });
    } catch (error: any) {
      console.error('Invitation creation error:', error);
      Alert.alert('Erreur', "Erreur lors de la création de l'invitation");
    } finally {
      setLoading(false);
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
          <Text style={styles.progressText}>━━━━━━━━━━ 5/8</Text>
        </View>

        {/* Walter Message */}
        <WalterBubble
          imageSrc={require('../../../assets/walter/walter-smile-1.png')}
          message="Parfait! Veuillez préciser le nom et la nature de votre relation avec ce contact"
        />

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>👤 Nom du Contact</Text>
          <Input
            placeholder="ex: Jean Dubois"
            value={contactName}
            onChangeText={(text) => {
              setContactName(text);
              setNameError('');
            }}
            autoFocus
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        {/* Relationship Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>🤝 Lien avec le contact</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowRelationshipPicker(!showRelationshipPicker)}
          >
            <Text style={[styles.pickerText, !relationship && styles.pickerPlaceholder]}>
              {relationship
                ? relationshipOptions.find((opt) => opt.value === relationship)?.label
                : 'ex: Mon fils'}
            </Text>
            <Icon
              name={showRelationshipPicker ? 'chevron-up' : 'chevron-down'}
              size={24}
          
            />
          </TouchableOpacity>
          {relationshipError ? (
            <Text style={styles.errorText}>{relationshipError}</Text>
          ) : null}

          {/* Relationship Options */}
          {showRelationshipPicker && (
            <View style={styles.optionsContainer}>
              {relationshipOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    relationship === option.value && styles.optionSelected,
                  ]}
                  onPress={() => {
                    setRelationship(option.value);
                    setRelationshipError('');
                    setShowRelationshipPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      relationship === option.value && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {relationship === option.value && (
                    <Icon name="check" size={20} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Helper Text */}
        <Text style={styles.helperText}>
          Options: Fils, Fille, Conjoint, Ami(e), Voisin(e), Autre
        </Text>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          variant="primary"
          onPress={handleCreateInvitation}
          disabled={!contactName.trim() || !relationship || loading}
          loading={loading}
        >
          Créer l'invitation →
        </Button>
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          ← Retour
        </Button>
      </View>
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
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',

  },
  errorText: {
    fontSize: 13,

  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d4d4d8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pickerText: {
    fontSize: 16,
    color: '#18181b',
  },
  pickerPlaceholder: {
    color: '#a1a1aa',
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,

    marginTop: 8,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  optionSelected: {

  },
  optionText: {
    fontSize: 16,
    color: '#18181b',
  },
  optionTextSelected: {
    fontWeight: '600',

  },
  helperText: {
    fontSize: 13,

    fontFamily: 'Monument-Light',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
    padding: 24,
    paddingTop: 16,
  },
});
