import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Button, Input, WalterBubble } from '../../components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { supabase } from '../../lib/supabase';
import { useDeepLinkHandler, initiateOAuthFlow } from '../../lib/deepLinking';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type OnboardingStackParamList = {
  Welcome: undefined;
  AccountCreation: { onboardingData: { name: string; phone: string | null } };
  Permissions: { userId: string };
};

type Props = NativeStackScreenProps<OnboardingStackParamList, 'AccountCreation'>;

interface PasswordStrength {
  score: number;
  strength: string;
  color: string;
  percentage: number;
  isValid: boolean;
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
  };
}

export function AccountCreationScreen({ navigation, route }: Props) {
  const { onboardingData } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Set up deep link handler for OAuth callbacks
  useDeepLinkHandler(
    // onAuthSuccess
    async (userId) => {
      console.log('OAuth success, creating profile for:', userId);
      await createUserProfile(userId, 'google'); // Will detect provider from session
    },
    // onAuthError
    (error) => {
      console.error('OAuth error:', error);
      Alert.alert('Erreur', 'Erreur lors de la connexion. Réessayez.');
      setLoading(false);
    }
  );

  // Password strength calculation (v3.0 spec - NO special chars required)
  const calculatePasswordStrength = (pwd: string): PasswordStrength => {
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
    };

    const score = Object.values(checks).filter(Boolean).length;

    const strengths = ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort'];
    const colors_map = ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#22C55E'];

    return {
      score,
      strength: strengths[score],
      color: colors_map[score],
      percentage: (score / 4) * 100,
      isValid: score === 4,
      checks,
    };
  };

  const passwordStrength = calculatePasswordStrength(password);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle Google Sign-In (functional)
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await initiateOAuthFlow('google');
      // The useDeepLinkHandler hook will handle the callback
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      Alert.alert(
        'Erreur',
        'Impossible de se connecter avec Google. Réessayez ou utilisez votre email.'
      );
      setLoading(false);
    }
  };

  // Handle Apple Sign In (UI ready, backend TODO)
  const handleAppleSignIn = async () => {
    Alert.alert(
      'Bientôt disponible',
      'La connexion avec Apple sera disponible prochainement. Utilisez Google ou votre email pour le moment.'
    );
    // TODO: Implement when Apple Sign In is configured in Supabase
    // Uncomment when ready:
    /*
    try {
      setLoading(true);
      await initiateOAuthFlow('apple');
      // The useDeepLinkHandler hook will handle the callback
    } catch (error: any) {
      console.error('Apple Sign-In error:', error);
      Alert.alert('Erreur', 'Impossible de se connecter avec Apple.');
      setLoading(false);
    }
    */
  };

  // Handle Email/Password Signup
  const handleEmailPasswordSignup = async () => {
    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Adresse courriel invalide');
      return;
    }

    // Validate password
    if (!passwordStrength.isValid) {
      setPasswordError('Le mot de passe doit respecter tous les critères');
      return;
    }

    // Check passwords match
    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      // Create Supabase auth account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: onboardingData.name,
            phone_number: onboardingData.phone,
            language: 'fr',
          },
        },
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          setEmailError('Cet email est déjà utilisé');
          return;
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('User creation failed');
      }

      // Create user profile in database
      await createUserProfile(authData.user.id, 'email');
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Erreur', 'Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string, method: 'email' | 'google' | 'apple') => {
    try {
      // Small delay to ensure auth.users record is committed
      await new Promise(resolve => setTimeout(resolve, 500));

      // Retry logic for profile creation (in case of timing issues)
      let attempts = 0;
      const maxAttempts = 3;
      let profileError: any = null;

      while (attempts < maxAttempts) {
        const { error } = await supabase.from('user_profiles').insert({
          id: userId,
          first_name: onboardingData.name,
          phone_number: onboardingData.phone,
          email: email || null,
          language: 'fr',
          timezone: 'America/Montreal',
          onboarding_completed: false,
        });

        if (!error) {
          profileError = null;
          break; // Success!
        }

        profileError = error;
        attempts++;

        // If it's a foreign key error, wait a bit and retry
        if (error.code === '23503' && attempts < maxAttempts) {
          console.log(`Profile creation attempt ${attempts} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          break; // Other error or max attempts reached
        }
      }

      if (profileError) throw profileError;

      // Create security settings (with error handling)
      const { error: securityError } = await supabase.from('security_settings').insert({
        user_id: userId,
        protection_level: 'medium',
        call_protection_enabled: true,
        sms_protection_enabled: true,
      });

      if (securityError) {
        console.warn('Security settings creation warning:', securityError);
        // Don't throw - continue anyway
      }

      // Create user stats (with error handling)
      const { error: statsError } = await supabase.from('user_stats').insert({
        user_id: userId,
        since: new Date().toISOString(),
      });

      if (statsError) {
        console.warn('User stats creation warning:', statsError);
        // Don't throw - continue anyway
      }

      // Continue to permissions
      navigation.navigate('Permissions', { userId });
    } catch (error: any) {
      console.error('Profile creation error:', error);
      Alert.alert(
        'Erreur',
        'Erreur lors de la création du profil. Veuillez réessayer.',
        [
          {
            text: 'OK',
            onPress: () => setLoading(false)
          }
        ]
      );
    }
  };

  // Platform-specific button order (iOS: Apple first, Android: Google first)
  const socialButtons = Platform.OS === 'ios'
    ? [
        { provider: 'apple', label: 'Continuer avec Apple', icon: 'apple', handler: handleAppleSignIn },
        { provider: 'google', label: 'Continuer avec Google', icon: 'google', handler: handleGoogleSignIn },
      ]
    : [
        { provider: 'google', label: 'Continuer avec Google', icon: 'google', handler: handleGoogleSignIn },
        { provider: 'apple', label: 'Continuer avec Apple', icon: 'apple', handler: handleAppleSignIn },
      ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>━━━━━━━━━━ 2/7</Text>
        </View>

        {/* Walter Message */}
        <WalterBubble
          imageSrc={require('../../../assets/walter/walter-smile-1.png')}
          message={`Parfait, ${onboardingData.name}!

Créons votre compte sécurisé.`}
        />

        {/* Free Trial Banner */}
        <View style={styles.trialBanner}>
          <Text style={styles.trialText}>✨ Essai gratuit - 30 jours</Text>
          <Text style={styles.trialSubtext}>Aucune carte de crédit requise</Text>
        </View>

        {/* Social Auth Buttons */}
        <View style={styles.socialContainer}>
          {socialButtons.map((button) => (
            <TouchableOpacity
              key={button.provider}
              style={styles.socialButton}
              onPress={button.handler}
              disabled={loading}
            >
              <Icon name={button.icon} size={24} color="#000" />
              <Text style={styles.socialButtonText}>{button.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OU</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>📧 Adresse courriel</Text>
          <Input
            placeholder="mary@gmail.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>🔒 Mot de passe</Text>
          <View style={styles.passwordInputContainer}>
            <Input
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                <View
                  style={[
                    styles.strengthFill,
                    {
                      width: `${passwordStrength.percentage}%`,
                      backgroundColor: passwordStrength.color,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                {passwordStrength.strength}
              </Text>
            </View>
          )}

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Critères:</Text>
            <Text
              style={[
                styles.requirementText,
                passwordStrength.checks.length && styles.requirementMet,
              ]}
            >
              {passwordStrength.checks.length ? '✓' : '○'} Au moins 8 caractères
            </Text>
            <Text
              style={[
                styles.requirementText,
                passwordStrength.checks.uppercase && styles.requirementMet,
              ]}
            >
              {passwordStrength.checks.uppercase ? '✓' : '○'} Une majuscule (A-Z)
            </Text>
            <Text
              style={[
                styles.requirementText,
                passwordStrength.checks.lowercase && styles.requirementMet,
              ]}
            >
              {passwordStrength.checks.lowercase ? '✓' : '○'} Une minuscule (a-z)
            </Text>
            <Text
              style={[
                styles.requirementText,
                passwordStrength.checks.number && styles.requirementMet,
              ]}
            >
              {passwordStrength.checks.number ? '✓' : '○'} Un chiffre (0-9)
            </Text>
          </View>
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>🔒 Confirmer mot de passe</Text>
          <View style={styles.passwordInputContainer}>
            <Input
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordError('');
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={24} color="#666" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>

        {/* Continue Button */}
        <Button
          variant="primary"
          onPress={handleEmailPasswordSignup}
          disabled={!email || !password || !confirmPassword || loading}
          loading={loading}
        >
          Commencer mon essai gratuit →
        </Button>

        {/* Info Text */}
        <Text style={styles.infoText}>
          💡 Continuer avec Apple ou Google est plus rapide et sécuritaire.
        </Text>

        {/* Terms Text */}
        <Text style={styles.termsText}>
          En créant un compte, j'accepte les conditions d'utilisation.
        </Text>

        {/* Already have account */}
        <TouchableOpacity style={styles.signInContainer}>
          <Text style={styles.signInText}>
            Vous avez déjà un compte? <Text style={styles.signInLink}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base[700],
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  progressContainer: {
    paddingTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.base[300],
    fontFamily: 'Monument-Light',
    textAlign: 'center',
  },
  trialBanner: {
    backgroundColor: colors.primary[500],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  trialText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  trialSubtext: {
    fontSize: 13,
    color: '#FFF',
    marginTop: 4,
    opacity: 0.9,
  },
  socialContainer: {
    gap: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.base[500],
  },
  dividerText: {
    fontSize: 14,
    color: colors.base[300],
    fontWeight: '600',
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.base[200],
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 14,
  },
  errorText: {
    fontSize: 13,
    color: colors.danger[400],
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    height: 6,
    backgroundColor: colors.base[600],
    borderRadius: 3,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  requirementsContainer: {
    marginTop: 12,
    gap: 4,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.base[300],
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 13,
    color: colors.base[400],
  },
  requirementMet: {
    color: colors.success[500],
  },
  infoText: {
    fontSize: 13,
    color: colors.base[300],
    textAlign: 'center',
    marginTop: 8,
  },
  termsText: {
    fontSize: 12,
    color: colors.base[400],
    textAlign: 'center',
  },
  signInContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    color: colors.base[300],
    textAlign: 'center',
  },
  signInLink: {
    color: colors.primary[400],
    fontWeight: '600',
  },
});
