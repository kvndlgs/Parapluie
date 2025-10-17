# Parapluie Onboarding Flows v3.0 (FINAL)

## Overview
Complete onboarding flows for Parapluie including social authentication (Google, Apple), email/password fallback, and all edge cases.

**Last Updated:** January 2025  
**Version:** 3.0 (MVP with Social Auth)

---

## CHANGES FROM v2.0

### What's New in v3.0:
- ✅ **Social authentication added** (Google Sign-In, Apple Sign In)
- ✅ **Combined Welcome + Name/Phone screen** (Senior flow)
- ✅ **Password requirements simplified** (no special characters)
- ✅ **Account linking logic** (same email, different providers)
- ✅ **Platform-specific buttons** (Apple first on iOS, Google first on Android)
- ✅ **Updated screen counts** (8 screens Senior, 5-6 screens TC)
- ✅ **All error states documented**

---

## TABLE OF CONTENTS

1. [Senior Onboarding Flow](#1-senior-onboarding-flow)
2. [Trusted Contact Onboarding Flow](#2-trusted-contact-onboarding-flow)
3. [Social Auth Implementation](#3-social-auth-implementation)
4. [Account Linking Logic](#4-account-linking-logic)
5. [Error States & Edge Cases](#5-error-states--edge-cases)
6. [Navigation Structure](#6-navigation-structure)
7. [Analytics Events](#7-analytics-events)
8. [Testing Scenarios](#8-testing-scenarios)

---

## 1. SENIOR ONBOARDING FLOW

### Flow Overview

**Type:** Linear with one optional branch (TC invitation)  
**Estimated Time:** 3-5 minutes  
**Total Screens:** 8 (9 if inviting TC)  
**Exit Points:** None (must complete to access app)

**Screen Sequence:**
```
1. Splash Screen (2s auto)
2. Welcome + Name/Phone (combined)
3. Account Creation (Email/Password OR Social Auth)
4. Permissions Request
5. Invite TC Prompt (optional)
6. [Optional] TC Contact Info
7. [Optional] Share Invitation Code
8. Onboarding Complete → Home Screen
```

---

### Screen 1: Splash Screen

**Purpose:** Brand introduction + Session check  
**Duration:** 2 seconds (auto-advance)  
**User Action:** None (automatic)

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│           💧                    │
│       PARAPLUIE                 │
│                                 │
│   Votre protection numérique    │
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Background Operations:**
```typescript
useEffect(() => {
  const initializeApp = async () => {
    // 1. Check for existing session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // 2. Check if onboarding completed
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.onboarding_completed) {
        // Skip onboarding, go to home
        navigation.replace('MainApp');
      } else {
        // Resume onboarding (they created account but didn't finish)
        navigation.replace('PermissionsScreen', { 
          userId: session.user.id 
        });
      }
    } else {
      // No session, start onboarding
      setTimeout(() => {
        navigation.replace('WelcomeNamePhoneScreen');
      }, 2000);
    }
  };
  
  initializeApp();
}, []);
```

**Analytics:**
```typescript
analytics.track('App Launched', {
  is_first_launch: await isFirstLaunch(),
  has_session: !!session,
});
```

**Next Screen:** WelcomeNamePhoneScreen (after 2s)

---

### Screen 2: Welcome + Name + Phone (Combined)

**Purpose:** Introduce Walter + Collect basic info  
**Duration:** 1-2 minutes  
**User Action:** Required (can't skip)

```
┌─────────────────────────────────┐
│         💧 Walter               │
│     (waving animation)          │
│                                 │
│  Bonjour! Je m'appelle Walter,  │
│  votre compagnon numérique.     │
│                                 │
│  Ma mission est de vous         │
│  protéger des appels et         │
│  messages indésirables.         │
│                                 │
│  Et vous, comment vous          │
│  appelez-vous?                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 👤 Nom de contact       │   │
│  │ [Votre nom]             │   │
│  │ [Mary________________]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📱 Votre nom            │   │
│  │ [Mobile]                │   │
│  │ [+1 (514) 555-1234___]  │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Votre numéro nous aide à    │
│     identifier les appels pour  │
│     vous.                       │
│                                 │
│  ┌─────────────────────────┐   │
│  │     Continuer →         │   │
│  └─────────────────────────┘   │
│                                 │
│  [Sauter]                       │
│                                 │
│  ━━━━━━━━━━ 1/7                │
└─────────────────────────────────┘
```

**Form Validation:**
```typescript
// Name validation
const validateName = (name: string): ValidationResult => {
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { 
      valid: false, 
      message: "Entrez au moins 2 caractères" 
    };
  }
  
  if (trimmed.length > 50) {
    return { 
      valid: false, 
      message: "Le nom est trop long (max 50 caractères)" 
    };
  }
  
  return { valid: true };
};

// Phone validation (Canadian numbers)
const validatePhone = (phone: string): ValidationResult => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Check length (10 digits for Canada, or 11 with country code)
  if (digits.length === 10) {
    return { 
      valid: true,
      formatted: `+1${digits}` // Add country code
    };
  } else if (digits.length === 11 && digits.startsWith('1')) {
    return { 
      valid: true,
      formatted: `+${digits}`
    };
  } else {
    return { 
      valid: false, 
      message: "Entrez un numéro de téléphone valide (10 chiffres)" 
    };
  }
};

// Auto-format phone as user types
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
```

**Skip Behavior:**
```typescript
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
          // Use defaults
          const defaultData = {
            name: 'Utilisateur',
            phone: null,
          };
          navigation.navigate('AccountCreationScreen', { 
            onboardingData: defaultData 
          });
        },
      },
    ]
  );
};
```

**Continue Handler:**
```typescript
const handleContinue = async () => {
  // Validate inputs
  const nameValidation = validateName(name);
  const phoneValidation = validatePhone(phone);
  
  if (!nameValidation.valid) {
    setNameError(nameValidation.message);
    return;
  }
  
  if (!phoneValidation.valid) {
    setPhoneError(phoneValidation.message);
    return;
  }
  
  // Store data temporarily (not in database yet - no account!)
  const onboardingData = {
    name: name.trim(),
    phone: phoneValidation.formatted, // E.164 format: +15145551234
  };
  
  // Track event
  analytics.track('Name and Phone Entered', {
    name_length: name.length,
    has_phone: !!phone,
  });
  
  // Navigate to account creation
  navigation.navigate('AccountCreationScreen', { onboardingData });
};
```

**Next Screen:** AccountCreationScreen

---

### Screen 3: Account Creation with Social Auth ⭐

**Purpose:** Create secure account (social or email/password)  
**Duration:** 30 seconds (social) or 1-2 minutes (email)  
**User Action:** Required

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Parfait, Mary!                 │
│                                 │
│  Créons votre compte sécurisé.  │
│                                 │
│  ╔════════════════════════════╗ │
│  ║ ✨ Essai gratuit - 30 jours ║ │
│  ║ Aucune carte de crédit     ║ │
│  ║ requise                    ║ │
│  ╚════════════════════════════╝ │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🍎 Continuer avec Apple │   │ ← iOS: Apple first
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔵 Continuer avec Google│   │ ← Android: Google first
│  └─────────────────────────┘   │
│                                 │
│  ────────── OU ──────────       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📧 Adresse courriel     │   │
│  │ [mary@gmail.com______]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Mot de passe         │   │
│  │ [••••••••___________] 👁│   │
│  └─────────────────────────┘   │
│                                 │
│  Force: [████████░░] Fort ✓    │
│                                 │
│  Requirements:                  │
│  ✓ Au moins 8 caractères        │
│  ✓ Une majuscule (A-Z)          │
│  ✓ Une minuscule (a-z)          │
│  ✓ Un chiffre (0-9)             │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Confirmer mot passe  │   │
│  │ [••••••••___________] 👁│   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Commencer mon essai     │   │
│  │      gratuit →          │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Continuer avec Apple ou     │
│     Google est plus rapide et   │
│     sécuritaire.                │
│                                 │
│  En créant un compte, j'accepte │
│  les [conditions d'utilisation].│
│                                 │
│  Vous avez déjà un compte?      │
│  [Se connecter]                 │
│                                 │
│  ━━━━━━━━━━ 2/7                │
└─────────────────────────────────┘
```

**Platform-Specific Button Order:**
```typescript
// iOS: Apple Sign In must be first (App Store requirement)
const buttonOrder = Platform.OS === 'ios' 
  ? ['apple', 'google', 'divider', 'email']
  : ['google', 'apple', 'divider', 'email'];
```

**Password Requirements (Senior-Friendly):**
```typescript
const passwordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false, // ❌ NO special chars (hard for seniors)
};

const calculatePasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    score, // 0-4
    strength: ['Très faible', 'Faible', 'Moyen', 'Bon', 'Fort'][score],
    color: ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#22C55E'][score],
    percentage: (score / 4) * 100,
    isValid: score === 4,
    checks,
  };
};
```

**Social Auth Handlers:**
```typescript
// Apple Sign In
const handleAppleSignIn = async () => {
  try {
    setLoading(true);
    
    // 1. Initiate Apple Sign In
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'parapluie://auth/callback',
        skipBrowserRedirect: true,
      },
    });
    
    if (error) throw error;
    
    // 2. Handle OAuth response
    // (Supabase will redirect back to app with session)
    
  } catch (error) {
    console.error('Apple Sign In error:', error);
    showError('Impossible de se connecter avec Apple. Réessayez.');
  } finally {
    setLoading(false);
  }
};

// Google Sign-In
const handleGoogleSignIn = async () => {
  try {
    setLoading(true);
    
    // 1. Initiate Google Sign In
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'parapluie://auth/callback',
        skipBrowserRedirect: true,
      },
    });
    
    if (error) throw error;
    
    // 2. OAuth flow handled by Supabase
    
  } catch (error) {
    console.error('Google Sign In error:', error);
    showError('Impossible de se connecter avec Google. Réessayez.');
  } finally {
    setLoading(false);
  }
};

// Handle OAuth callback
useEffect(() => {
  // Listen for deep link from OAuth callback
  const subscription = Linking.addEventListener('url', async ({ url }) => {
    if (url.includes('auth/callback')) {
      // Extract tokens from URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        // Social auth successful!
        await createUserProfile(session.user, 'social');
      }
    }
  });
  
  return () => subscription.remove();
}, []);

// Create user profile after social auth
const createUserProfile = async (user: User, method: 'social' | 'email') => {
  try {
    // Check if profile already exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (existingProfile) {
      // Profile exists, continue to permissions
      navigation.navigate('PermissionsScreen', { userId: user.id });
      return;
    }
    
    // Create new profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        first_name: onboardingData.name,
        phone_number: onboardingData.phone,
        email: user.email,
        language: 'fr',
        timezone: 'America/Montreal',
        onboarding_completed: false,
      });
    
    if (profileError) throw profileError;
    
    // Create security settings
    await supabase
      .from('security_settings')
      .insert({
        user_id: user.id,
        protection_level: 'medium',
        call_protection_enabled: true,
        sms_protection_enabled: true,
      });
    
    // Create user stats
    await supabase
      .from('user_stats')
      .insert({
        user_id: user.id,
        since: new Date().toISOString(),
      });
    
    // Track signup
    analytics.track('Account Created', {
      method: method,
      provider: user.app_metadata.provider,
    });
    
    // Continue to permissions
    navigation.navigate('PermissionsScreen', { userId: user.id });
    
  } catch (error) {
    console.error('Profile creation error:', error);
    showError('Erreur lors de la création du profil');
  }
};
```

**Email/Password Handler:**
```typescript
const handleEmailPasswordSignup = async () => {
  // Validate
  const emailValid = validateEmail(email);
  const passwordStrength = calculatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;
  
  if (!emailValid.valid) {
    setEmailError(emailValid.message);
    return;
  }
  
  if (!passwordStrength.isValid) {
    setPasswordError('Le mot de passe doit respecter tous les critères');
    return;
  }
  
  if (!passwordsMatch) {
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
        setShowSignInButton(true);
        return;
      }
      throw authError;
    }
    
    // Create user profile
    await createUserProfile(authData.user!, 'email');
    
  } catch (error) {
    console.error('Signup error:', error);
    showError('Une erreur est survenue. Réessayez.');
  } finally {
    setLoading(false);
  }
};
```

**Account Linking (Same Email):**
```typescript
// If user signs in with Google but email already exists with password
const checkAndLinkAccounts = async (socialEmail: string, provider: string) => {
  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('id, email')
    .eq('email', socialEmail)
    .single();
  
  if (existingUser) {
    Alert.alert(
      'Compte existant trouvé',
      `Vous avez déjà un compte avec ${socialEmail}. Voulez-vous le lier à ${provider}?`,
      [
        { 
          text: 'Non, utiliser un autre email',
          style: 'cancel'
        },
        {
          text: 'Oui, lier les comptes',
          onPress: async () => {
            // Supabase handles account linking automatically
            // Just continue to next screen
            navigation.navigate('PermissionsScreen', { 
              userId: existingUser.id 
            });
          },
        },
      ]
    );
  }
};
```

**Next Screen:** PermissionsScreen

---

### Screen 4: Permissions Request

**Purpose:** Request OS permissions for protection  
**Duration:** 1-2 minutes  
**User Action:** Strongly recommended (can skip with warning)

```
┌─────────────────────────────────┐
│         💧 Walter               │
│     (holding umbrella)          │
│                                 │
│  Je suis ravi de vous protéger, │
│  Mary! Je vais maintenant        │
│  sécuriser votre appareil        │
│  ensemble.                       │
│                                 │
│  Bien joué! Débutons maintenant │
│  à sécuriser votre appareil     │
│  ensemble.                       │
│                                 │
│  Pour vous protéger efficacement,│
│  j'aurai besoin de votre accord │
│  sur quelques permissions:      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📞 Appels et Messages   │   │
│  │                         │   │
│  │ Pour bloquer les appels │   │
│  │ et messages suspects    │   │
│  │                         │   │
│  │          ⚠️ REQUIS      │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📍 Localisation         │   │
│  │                         │   │
│  │ Pour les alertes locales│   │
│  │ (optionnel)             │   │
│  │                         │   │
│  │       🌟 RECOMMANDÉ     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔔 Notifications        │   │
│  │                         │   │
│  │ Pour vous alerter des   │   │
│  │ menaces                 │   │
│  │                         │   │
│  │       🌟 RECOMMANDÉ     │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Accepter la protection →│   │
│  └─────────────────────────┘   │
│                                 │
│  [Je le ferai plus tard]        │
│                                 │
│  ━━━━━━━━━━ 3/7                │
└─────────────────────────────────┘
```

**Permission Request Flow:**
```typescript
const requestAllPermissions = async () => {
  setLoading(true);
  const results: PermissionResults = {
    phone: false,
    location: false,
    notifications: false,
  };
  
  try {
    // 1. Phone permissions (CRITICAL)
    if (Platform.OS === 'ios') {
      // iOS: CallKit + Message Filter Extension
      const callKitStatus = await requestIOSCallKitPermission();
      const messageFilterStatus = await requestIOSMessageFilterPermission();
      results.phone = callKitStatus && messageFilterStatus;
    } else {
      // Android: CallScreeningService + READ_SMS
      const phoneState = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
      );
      const readSms = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS
      );
      const receiveSms = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS
      );
      
      results.phone = 
        phoneState === 'granted' && 
        readSms === 'granted' && 
        receiveSms === 'granted';
    }
    
    // 2. Location (OPTIONAL but recommended)
    const locationStatus = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    );
    results.location = locationStatus === 'granted';
    
    // 3. Notifications (RECOMMENDED)
    const notificationStatus = await requestNotifications(['alert', 'badge', 'sound']);
    results.notifications = notificationStatus.status === 'granted';
    
    // Store results
    await AsyncStorage.setItem(
      StorageKeys.PERMISSIONS_GRANTED,
      JSON.stringify(results)
    );
    
    // Update database
    await supabase
      .from('security_settings')
      .update({
        call_protection_enabled: results.phone,
        sms_protection_enabled: results.phone,
        location_alerts_enabled: results.location,
        notifications_enabled: results.notifications,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    
    // Track results
    analytics.track('Permissions Requested', {
      phone: results.phone,
      location: results.location,
      notifications: results.notifications,
      all_granted: results.phone && results.location && results.notifications,
    });
    
    // Check if critical permission denied
    if (!results.phone) {
      showCriticalPermissionWarning();
    } else {
      // Continue to next screen
      navigation.navigate('InviteTCPromptScreen');
    }
    
  } catch (error) {
    console.error('Permission request error:', error);
    showError('Erreur lors de la demande d\'autorisations');
  } finally {
    setLoading(false);
  }
};

// Warning if phone permission denied
const showCriticalPermissionWarning = () => {
  Alert.alert(
    '⚠️ Protection limitée',
    'Sans autorisation d\'accès aux appels et messages, Walter ne peut pas vous protéger efficacement.\n\nVous pouvez activer cette permission plus tard dans Réglages.',
    [
      { 
        text: 'Réessayer', 
        onPress: requestAllPermissions 
      },
      {
        text: 'Continuer sans protection',
        style: 'destructive',
        onPress: () => {
          analytics.track('Critical Permission Denied');
          navigation.navigate('InviteTCPromptScreen');
        },
      },
    ]
  );
};
```

**Skip Handler:**
```typescript
const handleSkipPermissions = () => {
  Alert.alert(
    'Êtes-vous sûr?',
    'Walter ne pourra pas vous protéger sans ces autorisations. Vous pouvez les activer plus tard dans les réglages de l\'application.',
    [
      { text: 'Revenir', style: 'cancel' },
      {
        text: 'Passer quand même',
        style: 'destructive',
        onPress: async () => {
          // Store that user skipped
          await AsyncStorage.setItem(
            StorageKeys.PERMISSIONS_GRANTED,
            JSON.stringify({ phone: false, location: false, notifications: false })
          );
          
          analytics.track('Permissions Skipped');
          
          navigation.navigate('InviteTCPromptScreen');
        },
      },
    ]
  );
};
```

**Next Screen:** InviteTCPromptScreen

---

### Screen 5: Invite Trusted Contact Prompt

**Purpose:** Ask if senior wants to invite family  
**Duration:** 10-20 seconds  
**User Action:** Optional (can skip)

```
┌─────────────────────────────────┐
│         💧 Walter               │
│     (with family icon)          │
│                                 │
│  Merveilleux, Mary!             │
│                                 │
│  Désirez-vous inviter un        │
│  membre de votre famille        │
│  ou un proche à prendre         │
│  part à votre sécurité?         │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Avis de              │   │
│  │    confidentialité       │   │
│  │                         │   │
│  │ Votre personne de       │   │
│  │ confiance pourra:       │   │
│  │                         │   │
│  │ • Voir les alertes de   │   │
│  │   sécurité              │   │
│  │ • Être notifié des      │   │
│  │   menaces               │   │
│  │ • Vous aider à rester   │   │
│  │   protégé               │   │
│  │                         │   │
│  │ Elle NE pourra PAS:     │   │
│  │ • Consulter vos messages│   │
│  │ • Accéder à vos appels  │   │
│  │ • Contrôler votre       │   │
│  │   appareil              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Ajouter un contact →   │   │
│  └─────────────────────────┘   │
│                                 │
│  [Je le ferai plus tard]        │
│                                 │
│  ━━━━━━━━━━ 4/7                │
└─────────────────────────────────┘
```

**Decision Handlers:**
```typescript
// If "Ajouter un contact"
const handleAddContact = () => {
  analytics.track('TC Invitation Started');
  navigation.navigate('InviteTCContactInfoScreen');
};

// If "Je le ferai plus tard"
const handleSkipInvitation = async () => {
  analytics.track('TC Invitation Skipped');
  
  // Mark onboarding as complete
  await completeOnboarding(false); // false = no TC invited
  
  // Navigate to success screen
  navigation.navigate('OnboardingCompleteScreen', {
    hasTrustedContact: false,
  });
};

// Helper: Complete onboarding
const completeOnboarding = async (hasTrustedContact: boolean) => {
  await AsyncStorage.setItem(
    StorageKeys.ONBOARDING_COMPLETED,
    'true'
  );
  
  await supabase
    .from('user_profiles')
    .update({
      onboarding_completed: true,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  analytics.track('Onboarding Completed', {
    has_trusted_contact: hasTrustedContact,
  });
};
```

**Next Screen:**
- If "Ajouter" → InviteTCContactInfoScreen
- If "Plus tard" → OnboardingCompleteScreen

---

### Screen 6: TC Contact Info (Optional Path)

**Purpose:** Collect trusted contact details  
**Duration:** 30-60 seconds  
**User Action:** Required (if chosen to invite)

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Parfait! Veuillez préciser le  │
│  nom et la nature de votre      │
│  relation avec ce contact       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 👤 Nom du Contact       │   │
│  │ [ex: John]              │   │
│  │ [Jean Dubois_________]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🤝 Lien avec le contact │   │
│  │ [ex: Mon fils       ▼]  │   │
│  └─────────────────────────┘   │
│                                 │
│  Options: Fils, Fille, Conjoint,│
│  Ami(e), Voisin(e), Autre       │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Créer l'invitation → │   │
│  └─────────────────────────┘   │
│                                 │
│  [← Retour]                     │
│  [Sauter]                       │
│                                 │
│  ━━━━━━━━━━ 5/8                │
└─────────────────────────────────┘
```

**Relationship Options:**
```typescript
const relationshipOptions = [
  { value: 'fils', label: 'Fils' },
  { value: 'fille', label: 'Fille' },
  { value: 'conjoint', label: 'Conjoint(e)' },
  { value: 'ami', label: 'Ami(e)' },
  { value: 'voisin', label: 'Voisin(e)' },
  { value: 'autre', label: 'Autre' },
];
```

**Validation:**
```typescript
const validateContactInfo = (): boolean => {
  if (contactName.trim().length < 2) {
    setNameError('Entrez au moins 2 caractères');
    return false;
  }
  
  if (!relationship) {
    setRelationshipError('Sélectionnez une relation');
    return false;
  }
  
  return true;
};
```

**Create Invitation:**
```typescript
const handleCreateInvitation = async () => {
  if (!validateContactInfo()) return;
  
  setLoading(true);
  
  try {
    // 1. Generate unique 4-character code
    const invitationCode = await generateUniqueInvitationCode();
    
    // 2. Set expiration (24 hours)
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
    
    // 4. Track creation
    analytics.track('Invitation Created', {
      relationship: relationship,
    });
    
    // 5. Navigate to share screen
    navigation.navigate('ShareInvitationScreen', {
      invitationCode,
      contactName,
      expiresAt: expiresAt.toISOString(),
    });
    
  } catch (error) {
    console.error('Invitation creation error:', error);
    showError('Erreur lors de la création de l\'invitation');
  } finally {
    setLoading(false);
  }
};

// Generate unique code
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
```

**Next Screen:** ShareInvitationScreen

---

### Screen 7: Share Invitation Code (Optional Path)

**Purpose:** Send invitation to trusted contact  
**Duration:** 30-60 seconds  
**User Action:** Choose method

```
┌─────────────────────────────────┐
│         💧 Walter               │
│        (celebrating)            │
│                                 │
│  Bravo! Partagez le code        │
│  ci-dessous avec Jean:          │
│                                 │
│  ┌─────────────────────────┐   │
│  │         A63N            │   │
│  │                         │   │
│  │  Se code est valide     │   │
│  │  24 heures              │   │
│  └─────────────────────────┘   │
│                                 │
│  Comment souhaitez-vous         │
│  partager le code               │
│  d'invitation?                  │
│                                 │
│  ┌───┬──────────┬──────────┐   │
│  │💬 │    ✉️    │    📋    │   │
│  │SMS│ Courriel │En personne│  │
│  └───┴──────────┴──────────┘   │
│  [Active tab highlighted]       │
│                                 │
│  [Tab content based on choice:] │
│                                 │
│  IF SMS:                        │
│  ┌─────────────────────────┐   │
│  │ 📱 Téléphone du contact │   │
│  │ [+1 (514) 555-1234]     │   │
│  │ [Trouver dans contacts] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Envoyer par SMS →      │   │
│  └─────────────────────────┘   │
│                                 │
│  IF EMAIL:                      │
│  ┌─────────────────────────┐   │
│  │ 📧 Courriel du contact  │   │
│  │ [jean@example.com]      │   │
│  │ [Trouver dans contacts] │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Envoyer par courriel →  │   │
│  └─────────────────────────┘   │
│                                 │
│  IF MANUAL:                     │
│  ┌─────────────────────────┐   │
│  │   Copier le code        │   │
│  └─────────────────────────┘   │
│                                 │
│  💡 Astuce: Vous pouvez         │
│     également noter le code     │
│     sur un papier.              │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Terminer           │   │
│  └─────────────────────────┘   │
│                                 │
│  ━━━━━━━━━━ 6/8                │
└─────────────────────────────────┘
```

**Share Methods:**

**1. SMS:**
```typescript
const shareBySMS = async (phoneNumber: string) => {
  const message = `Bonjour! 

J'utilise Parapluie pour me protéger des arnaques. Pouvez-vous m'aider en tant que personne de confiance?

Code d'invitation: ${invitationCode}
Valide pendant 24 heures

Téléchargez l'app: https://parapluie.app

Merci!`;
  
  try {
    await SMS.sendSMSAsync([phoneNumber], message);
    
    // Mark as sent
    await updateInvitationSentStatus('sms');
    
    analytics.track('Invitation Sent', { method: 'sms' });
    
    navigation.navigate('OnboardingCompleteScreen', {
      hasTrustedContact: true,
      invitationMethod: 'sms',
    });
    
  } catch (error) {
    console.error('SMS error:', error);
    showError('Impossible d\'envoyer le SMS');
  }
};
```

**2. Email:**
```typescript
const shareByEmail = async (email: string) => {
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
    await MailComposer.composeAsync({
      recipients: [email],
      subject,
      body,
    });
    
    await updateInvitationSentStatus('email');
    
    analytics.track('Invitation Sent', { method: 'email' });
    
    navigation.navigate('OnboardingCompleteScreen', {
      hasTrustedContact: true,
      invitationMethod: 'email',
    });
    
  } catch (error) {
    console.error('Email error:', error);
    showError('Impossible d\'ouvrir l\'email');
  }
};
```

**3. Manual (Copy Code):**
```typescript
const copyCodeManually = () => {
  Clipboard.setString(invitationCode);
  Toast.show('Code copié dans le presse-papiers!', {
    duration: 2000,
    position: Toast.positions.BOTTOM,
  });
};

const finishManualShare = async () => {
  await updateInvitationSentStatus('manual');
  
  analytics.track('Invitation Shared', { method: 'manual' });
  
  navigation.navigate('OnboardingCompleteScreen', {
    hasTrustedContact: true,
    invitationMethod: 'manual',
  });
};
```

**Helper:**
```typescript
const updateInvitationSentStatus = async (method: string) => {
  await supabase
    .from('trusted_contacts')
    .update({
      invitation_sent_at: new Date().toISOString(),
      preferred_contact_method: method,
    })
    .eq('invitation_code', invitationCode);
};
```

**Next Screen:** OnboardingCompleteScreen

---

### Screen 8: Onboarding Complete

**Purpose:** Celebrate + Auto-navigate to home  
**Duration:** 3 seconds (auto)  
**User Action:** None (automatic)

```
┌─────────────────────────────────┐
│                                 │
│         💧 Walter               │
│        (celebrating)            │
│           🎉✨                  │
│                                 │
│  Bravo! Tout est fait,          │
│  Mary!                          │
│                                 │
│  Vous êtes maintenant           │
│  protégée.                      │
│                                 │
│  {IF hasTrustedContact:         │
│   Jean recevra une notification │
│   quand il accepte              │
│   l'invitation.}                │
│                                 │
│  Allons explorer votre          │
│  tableau de bord ensemble!      │
│                                 │
│  [Loading animation...]         │
│                                 │
│  ━━━━━━━━━━ 7/7                │
└─────────────────────────────────┘
```

**Logic:**
```typescript
useEffect(() => {
  const finalizeOnboarding = async () => {
    // Ensure onboarding is marked complete
    await AsyncStorage.setItem(
      StorageKeys.ONBOARDING_COMPLETED,
      'true'
    );
    
    await supabase
      .from('user_profiles')
      .update({
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    // Track final completion
    analytics.track('Onboarding Completed', {
      has_trusted_contact: hasTrustedContact,
      invitation_method: invitationMethod,
      duration_seconds: Date.now() - onboardingStartTime,
      permissions_granted: permissionResults,
      signup_method: signupMethod, // 'google', 'apple', 'email'
    });
    
    // Auto-navigate after 3 seconds
    setTimeout(() => {
      navigation.replace('MainApp');
    }, 3000);
  };
  
  finalizeOnboarding();
}, []);
```

**Next Screen:** MainApp (Home Screen)

---

## 2. TRUSTED CONTACT ONBOARDING FLOW

### Flow Overview

**Type:** Conditional (depends on deep link vs manual entry)  
**Estimated Time:** 2-4 minutes  
**Total Screens:** 5-6 (depending on account status)

**Screen Sequence:**
```
ENTRY: Deep link OR Manual code entry
↓
1. TC Welcome Screen
2. Enter Invitation Code (if manual)
3. Account Creation (if no account) OR Sign In (if account exists)
4. Review Permissions & Accept/Decline
5. Success + Optional Senior Protection Upsell
6. TC Dashboard
```

---

### Entry Point: Deep Link Handling

**Not a visible screen - background logic**

```typescript
// Listen for deep links
useEffect(() => {
  // Handle initial URL (app was closed)
  Linking.getInitialURL().then(url => {
    if (url) handleDeepLink(url);
  });
  
  // Handle URL when app is open
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });
  
  return () => subscription.remove();
}, []);

const handleDeepLink = async (url: string) => {
  // Parse URL: parapluie://invite?code=A63N
  if (url.includes('/invite')) {
    const code = extractCodeFromURL(url);
    
    // Check if user has active session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // User already signed in, go to code validation
      navigation.navigate('ValidateInvitationScreen', {
        invitationCode: code,
        prefilled: true,
      });
    } else {
      // User not signed in, show TC welcome
      navigation.navigate('TCWelcomeScreen', {
        invitationCode: code,
      });
    }
  }
};

const extractCodeFromURL = (url: string): string => {
  const regex = /code=([A-Z0-9]{4})/;
  const match = url.match(regex);
  return match ? match[1] : '';
};
```

---

### Screen 1: TC Welcome

**Purpose:** Explain TC role + Get consent  
**Duration:** 20-30 seconds  
**User Action:** Required

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Bonjour!                       │
│                                 │
│  Mary vous invite à devenir     │
│  sa personne de confiance.      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ En tant que personne de │   │
│  │ confiance, vous pourrez:│   │
│  │                         │   │
│  │ ✓ Voir les alertes de   │   │
│  │   sécurité de Mary      │   │
│  │                         │   │
│  │ ✓ Être notifié des      │   │
│  │   menaces détectées     │   │
│  │                         │   │
│  │ ✓ Aider Mary à rester   │   │
│  │   protégée              │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Vous NE pourrez PAS:    │   │
│  │                         │   │
│  │ ✗ Voir ses messages     │   │
│  │   personnels            │   │
│  │                         │   │
│  │ ✗ Accéder à ses appels  │   │
│  │                         │   │
│  │ ✗ Contrôler son         │   │
│  │   téléphone             │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │     Continuer →         │   │
│  └─────────────────────────┘   │
│                                 │
│  [Non, ce n'est pas pour moi]   │
└─────────────────────────────────┘
```

**Handlers:**
```typescript
const handleContinue = () => {
  // If we have code from deep link, go to validation
  if (route.params?.invitationCode) {
    navigation.navigate('ValidateInvitationScreen', {
      invitationCode: route.params.invitationCode,
      prefilled: true,
    });
  } else {
    // No code yet, prompt for manual entry
    navigation.navigate('EnterInvitationCodeScreen');
  }
};

const handleDecline = () => {
  Alert.alert(
    'Refuser l\'invitation?',
    'Mary compte sur vous pour l\'aider à rester protégée.',
    [
      { text: 'Revenir', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: () => {
          analytics.track('TC Invitation Declined at Welcome');
          // Close app or go to landing
          BackHandler.exitApp();
        },
      },
    ]
  );
};
```

**Next Screen:** 
- If has code → ValidateInvitationScreen
- If no code → EnterInvitationCodeScreen

---

### Screen 2: Enter Invitation Code

**Purpose:** Manual code entry (if no deep link)  
**Duration:** 10-30 seconds  
**User Action:** Required

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Mary vous invite à être sa     │
│  personne de confiance          │
│                                 │
│  Entrez le code de sécurité     │
│  de 4 charactères alpha         │
│  numériques inclus dans         │
│  votre message d'invitation.    │
│                                 │
│  ┌─┬─┬─┬─┐                      │
│  │A│6│3│N│                      │
│  └─┴─┴─┴─┘                      │
│                                 │
│  [Attempts: 0/3]                │
│                                 │
│  ┌─────────────────────────┐   │
│  │    Confirmer →          │   │
│  └─────────────────────────┘   │
│                                 │
│  Vous n'avez pas de code?       │
│  [Contactez Mary]               │
│                                 │
└─────────────────────────────────┘
```

**Code Entry Logic:**
```typescript
const [code, setCode] = useState(['', '', '', '']);
const [attempts, setAttempts] = useState(0);
const maxAttempts = 3;
const inputRefs = [useRef(), useRef(), useRef(), useRef()];

// Auto-focus next input
const handleCodeChange = (index: number, value: string) => {
  const newCode = [...code];
  newCode[index] = value.toUpperCase();
  setCode(newCode);
  
  // Clear error
  setError('');
  
  // Auto-focus next
  if (value && index < 3) {
    inputRefs[index + 1].current?.focus();
  }
  
  // Auto-validate when complete
  if (newCode.every(c => c.length > 0)) {
    validateInvitationCode(newCode.join(''));
  }
};

// Handle backspace
const handleKeyPress = (index: number, key: string) => {
  if (key === 'Backspace' && !code[index] && index > 0) {
    inputRefs[index - 1].current?.focus();
  }
};
```

**Validation:**
```typescript
const validateInvitationCode = async (codeString: string) => {
  setLoading(true);
  
  try {
    // 1. Query database for code
    const { data: invitation, error } = await supabase
      .from('trusted_contacts')
      .select(`
        *,
        senior:user_profiles!senior_id(
          id,
          first_name,
          email
        )
      `)
      .eq('invitation_code', codeString)
      .single();
    
    if (error || !invitation) {
      handleInvalidCode('Code invalide');
      return;
    }
    
    // 2. Check expiration
    const expiresAt = new Date(invitation.invitation_expires_at);
    const now = new Date();
    
    if (now > expiresAt) {
      handleCodeExpired();
      return;
    }
    
    // 3. Check if already accepted
    if (invitation.contact_status === 'active') {
      handleCodeAlreadyUsed();
      return;
    }
    
    // 4. Check if declined (can't reuse)
    if (invitation.contact_status === 'declined') {
      handleCodeDeclined();
      return;
    }
    
    // 5. Code is valid!
    analytics.track('Invitation Code Validated', {
      code: codeString,
      senior_id: invitation.senior_id,
      senior_name: invitation.senior.first_name,
    });
    
    // Check if TC has account
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Has account, go to accept screen
      navigation.navigate('AcceptInvitationScreen', {
        invitation,
        seniorName: invitation.senior.first_name,
      });
    } else {
      // No account, create one
      navigation.navigate('TCAccountCreationScreen', {
        invitation,
        seniorName: invitation.senior.first_name,
      });
    }
    
  } catch (error) {
    console.error('Code validation error:', error);
    handleInvalidCode('Erreur de validation');
  } finally {
    setLoading(false);
  }
};
```

**Error Handlers:**
```typescript
const handleInvalidCode = (message: string) => {
  const newAttempts = attempts + 1;
  setAttempts(newAttempts);
  
  // Clear inputs
  setCode(['', '', '', '']);
  inputRefs[0].current?.focus();
  
  // Show error
  setError(`${message} (${newAttempts}/${maxAttempts})`);
  
  // Lock after 3 attempts
  if (newAttempts >= maxAttempts) {
    analytics.track('Invitation Code Locked', {
      attempts: newAttempts,
    });
    navigation.navigate('CodeLockedScreen');
  }
};

const handleCodeExpired = () => {
  Alert.alert(
    'Code expiré',
    'Ce code d\'invitation a expiré. Les codes sont valides 24 heures. Demandez à Mary de vous envoyer un nouveau code.',
    [
      {
        text: 'Contacter Mary',
        onPress: () => {
          // Open contact options
        },
      },
      { text: 'Fermer' },
    ]
  );
};

const handleCodeAlreadyUsed = () => {
  Alert.alert(
    'Code déjà utilisé',
    'Ce code d\'invitation a déjà été accepté.',
    [{ text: 'OK' }]
  );
};

const handleCodeDeclined = () => {
  Alert.alert(
    'Code invalide',
    'Cette invitation n\'est plus valide. Contactez Mary pour plus d\'informations.',
    [{ text: 'OK' }]
  );
};
```

**Next Screen:**
- Valid code + No account → TCAccountCreationScreen
- Valid code + Has account → AcceptInvitationScreen
- 3 failed attempts → CodeLockedScreen

---

### Screen 3a: TC Account Creation (If No Account)

**Purpose:** Create TC account with social/email auth  
**Duration:** 30 seconds (social) or 1-2 minutes (email)  
**User Action:** Required

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Créer votre compte pour        │
│  aider Mary à rester            │
│  protégée                       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🍎 Continuer avec Apple │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔵 Continuer avec Google│   │
│  └─────────────────────────┘   │
│                                 │
│  ────────── OU ──────────       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 👤 Votre nom complet    │   │
│  │ [Jean Dubois_________]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📧 Courriel             │   │
│  │ [jean@example.com____]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Mot de passe         │   │
│  │ [••••••••___________] 👁│   │
│  └─────────────────────────┘   │
│                                 │
│  Force: [████████░░] Fort ✓    │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Créer mon compte →      │   │
│  └─────────────────────────┘   │
│                                 │
│  En créant un compte, j'accepte │
│  les conditions d'utilisation.  │
│                                 │
│  Vous avez déjà un compte?      │
│  [Se connecter]                 │
└─────────────────────────────────┘
```

**Social Auth (Same as Senior Flow):**
```typescript
const handleSocialAuth = async (provider: 'google' | 'apple') => {
  try {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'parapluie://auth/callback',
        skipBrowserRedirect: true,
      },
    });
    
    if (error) throw error;
    
    // After OAuth callback, link to invitation
    // (handled in callback listener)
    
  } catch (error) {
    console.error(`${provider} auth error:`, error);
    showError(`Impossible de se connecter avec ${provider}`);
  } finally {
    setLoading(false);
  }
};
```

**Email/Password Creation:**
```typescript
const handleCreateTCAccount = async () => {
  // Validate
  if (!validateName(name).valid) {
    setNameError('Entrez votre nom complet');
    return;
  }
  
  if (!validateEmail(email).valid) {
    setEmailError('Adresse courriel invalide');
    return;
  }
  
  if (!calculatePasswordStrength(password).isValid) {
    setPasswordError('Le mot de passe doit respecter tous les critères');
    return;
  }
  
  setLoading(true);
  
  try {
    // 1. Create Supabase auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: name,
          is_trusted_contact: true,
          language: 'fr',
        },
      },
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        setEmailError('Cet email est déjà utilisé');
        setShowSignInButton(true);
        return;
      }
      throw authError;
    }
    
    const tcUserId = authData.user!.id;
    
    // 2. Create user profile
    await supabase
      .from('user_profiles')
      .insert({
        id: tcUserId,
        first_name: name,
        email: email,
        language: 'fr',
      });
    
    // 3. Link to invitation
    await supabase
      .from('trusted_contacts')
      .update({
        contact_user_id: tcUserId,
        // Status stays 'pending' until they accept
      })
      .eq('invitation_code', invitationCode);
    
    // 4. Track creation
    analytics.track('TC Account Created', {
      senior_id: invitation.senior_id,
      method: 'email',
    });
    
    // 5. Navigate to accept screen
    navigation.navigate('AcceptInvitationScreen', {
      invitation,
      seniorName,
    });
    
  } catch (error) {
    console.error('TC account creation error:', error);
    showError('Erreur lors de la création du compte');
  } finally {
    setLoading(false);
  }
};
```

**Next Screen:** AcceptInvitationScreen

---

### Screen 3b: TC Sign In (If Has Account)

**Purpose:** Sign in existing TC  
**Duration:** 30 seconds  
**User Action:** Required

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  Connectez-vous pour            │
│  accepter l'invitation de Mary  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🍎 Continuer avec Apple │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔵 Continuer avec Google│   │
│  └─────────────────────────┘   │
│                                 │
│  ────────── OU ──────────       │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 📧 Courriel             │   │
│  │ [jean@example.com____]  │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 🔒 Mot de passe         │   │
│  │ [••••••••___________] 👁│   │
│  └─────────────────────────┘   │
│                                 │
│  [Mot de passe oublié?]         │
│                                 │
│  ┌─────────────────────────┐   │
│  │   Se connecter →        │   │
│  └─────────────────────────┘   │
│                                 │
│  Vous n'avez pas de compte?     │
│  [Créer un compte]              │
└─────────────────────────────────┘
```

**Sign In Handler:**
```typescript
const handleSignIn = async () => {
  try {
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.message.includes('Invalid login')) {
        setError('Email ou mot de passe incorrect');
      } else {
        setError('Erreur de connexion');
      }
      return;
    }
    
    // Link session to invitation
    await supabase
      .from('trusted_contacts')
      .update({
        contact_user_id: data.user.id,
      })
      .eq('invitation_code', invitationCode);
    
    // Navigate to accept screen
    navigation.navigate('AcceptInvitationScreen', {
      invitation,
      seniorName,
    });
    
  } catch (error) {
    console.error('Sign in error:', error);
    setError('Une erreur est survenue');
  } finally {
    setLoading(false);
  }
};
```

**Next Screen:** AcceptInvitationScreen

---

### Screen 4: Accept Invitation

**Purpose:** Review permissions + Accept/Decline  
**Duration:** 30-60 seconds  
**User Action:** Required (must choose)

```
┌─────────────────────────────────┐
│         💧 Walter               │
│                                 │
│  En acceptant l'invitation,     │
│  vous pourrez:                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ ✓ Voir les alertes de   │   │
│  │   sécurité de Mary      │   │
│  │                         │   │
│  │ ✓ Être notifié en cas   │   │
│  │   de menace élevée      │   │
│  │                         │   │
│  │ ✓ Aider Mary à gérer    │   │
│  │   les appels suspects   │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Vous NE pourrez PAS:    │   │
│  │                         │   │
│  │ ✗ Voir ses messages ou  │   │
│  │   appels personnels     │   │
│  │                         │   │
│  │ ✗ Contrôler son         │   │
│  │   téléphone             │   │
│  │                         │   │
│  │ ✗ Modifier ses réglages │   │
│  │   sans permission       │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Accepter l'invitation  │   │
│  │         →               │   │
│  └─────────────────────────┘   │
│                                 │
│  [Refuser]                      │
└─────────────────────────────────┘
```

**Accept Handler:**
```typescript
const handleAccept = async () => {
  setLoading(true);
  
  try {
    // 1. Update invitation status
    const { error: updateError } = await supabase
      .from('trusted_contacts')
      .update({
        contact_status: 'active',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', invitation.id);
    
    if (updateError) throw updateError;
    
    // 2. Send notification to senior
    await supabase
      .from('notifications')
      .insert({
        user_id: invitation.senior_id,
        notification_type: 'trusted_contact_alert',
        priority: 'normal',
        title: `${tcName} a accepté!`,
        body: `${tcName} est maintenant votre personne de confiance.`,
        data: {
          tc_id: invitation.id,
          tc_name: tcName,
          action: 'accepted',
        },
      });
    
    // 3. Track acceptance
    analytics.track('Invitation Accepted', {
      senior_id: invitation.senior_id,
      senior_name: seniorName,
      tc_user_id: userId,
    });
    
    // 4. Navigate to success
    navigation.navigate('InvitationAcceptedScreen', {
      seniorName,
      seniorId: invitation.senior_id,
    });
    
  } catch (error) {
    console.error('Accept error:', error);
    showError('Erreur lors de l\'acceptation');
  } finally {
    setLoading(false);
  }
};
```

**Decline Handler:**
```typescript
const handleDecline = () => {
  Alert.alert(
    'Refuser l\'invitation?',
    `Êtes-vous sûr de vouloir refuser l'invitation de ${seniorName}?`,
    [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Refuser',
        style: 'destructive',
        onPress: async () => {
          try {
            // Update status
            await supabase
              .from('trusted_contacts')
              .update({
                contact_status: 'declined',
                declined_at: new Date().toISOString(),
              })
              .eq('id', invitation.id);
            
            // Notify senior
            await supabase
              .from('notifications')
              .insert({
                user_id: invitation.senior_id,
                notification_type: 'system_message',
                priority: 'normal',
                title: 'Invitation refusée',
                body: `${tcName} a refusé votre invitation.`,
                data: {
                  tc_id: invitation.id,
                  action: 'declined',
                },
              });
            
            analytics.track('Invitation Declined', {
              senior_id: invitation.senior_id,
            });
            
            navigation.navigate('InvitationDeclinedScreen');
            
          } catch (error) {
            console.error('Decline error:', error);
            showError('Erreur lors du refus');
          }
        },
      },
    ]
  );
};
```

**Next Screen:**
- If Accept → InvitationAcceptedScreen
- If Decline → InvitationDeclinedScreen

---

### Screen 5: Invitation Accepted (Success)

**Purpose:** Celebrate + Optional upsell  
**Duration:** User-controlled  
**User Action:** Choose path

```
┌─────────────────────────────────┐
│         💧 Walter               │
│        (celebrating)            │
│           🎉✨                  │
│                                 │
│  Félicitation! Vous êtes        │
│  maintenant connecté avec       │
│  Mary en tant que personne de   │
│  confiance                      │
│                                 │
│  ┌─────────────────────────┐   │
│  │ 💡 Le saviez-vous?      │   │
│  │                         │   │
│  │ Vous pouvez aussi       │   │
│  │ protéger votre propre   │   │
│  │ appareil avec Parapluie!│   │
│  │                         │   │
│  │ ✨ Essai gratuit 30     │   │
│  │    jours                │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │  Me protéger aussi!     │   │
│  └─────────────────────────┘   │
│                                 │
│  [Non, juste surveiller Mary]   │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Explorer le tableau     │   │
│  │      de bord →          │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

**Decision Handlers:**
```typescript
// If TC wants protection too
const handleBecomeProtectedUser = () => {
  analytics.track('TC Upsell Accepted');
  
  // Start senior onboarding for TC
  // Skip welcome/name (already have profile)
  navigation.navigate('SeniorOnboarding', {
    screen: 'PermissionsScreen',
    params: {
      userId: tcUserId,
      skipWelcome: true,
    },
  });
};

// If TC just wants to monitor
const handleJustMonitor = () => {
  analytics.track('TC Upsell Declined');
  
  // Go to TC dashboard
  navigation.replace('TCMainApp', {
    seniorId: invitation.senior_id,
    seniorName: seniorName,
  });
};
```

**Next Screen:**
- If "Me protéger" → Senior Onboarding (from Permissions)
- If "Surveiller" → TC Dashboard

---

### Screen 6: Code Locked (Error State)

**Purpose:** Handle 3 failed code attempts  
**Duration:** User must exit  
**User Action:** Contact senior or exit

```
┌─────────────────────────────────┐
│         💧 Walter               │
│        (concerned)              │
│                                 │
│  Code incorrect 3 fois          │
│                                 │
│  Pour votre sécurité, ce code   │
│  est maintenant verrouillé.     │
│                                 │
│  Veuillez contacter Mary pour   │
│  obtenir un nouveau code        │
│  d'invitation.                  │
│                                 │
│  ┌─────────────────────────┐   │
│  │   📞 Appeler Mary       │   │
│  │   {senior.phone}        │   │
│  └─────────────────────────┘   │
│                                 │
│  ┌─────────────────────────┐   │
│  │   💬 Envoyer un SMS     │   │
│  └─────────────────────────┘   │
│                                 │
│  [Fermer l'application]         │
└─────────────────────────────────┘
```

**Handlers:**
```typescript
const handleCallSenior = async () => {
  try {
    await Linking.openURL(`tel:${seniorPhone}`);
  } catch (error) {
    showError('Impossible d\'ouvrir le téléphone');
  }
};

const handleSendSMS = async () => {
  try {
    await SMS.sendSMSAsync(
      [seniorPhone],
      'Bonjour! J\'ai essayé d\'entrer le code d\'invitation mais il ne fonctionne pas. Pouvez-vous m\'envoyer un nouveau code? Merci!'
    );
  } catch (error) {
    showError('Impossible d\'envoyer le SMS');
  }
};

const handleClose = () => {
  BackHandler.exitApp();
};
```

---

## 3. SOCIAL AUTH IMPLEMENTATION

### Supabase Configuration

**1. Google Sign-In Setup:**

```bash
# In Supabase Dashboard:
# Authentication → Providers → Google

1. Enable Google provider
2. Add OAuth credentials:
   - Client ID: (from Google Cloud Console)
   - Client Secret: (from Google Cloud Console)
3. Add authorized redirect URIs:
   - parapluie://auth/callback
   - https://yourproject.supabase.co/auth/v1/callback
4. Save
```

**2. Apple Sign In Setup:**

```bash
# In Supabase Dashboard:
# Authentication → Providers → Apple

1. Enable Apple provider
2. Add Service ID from Apple Developer
3. Add Team ID and Key ID
4. Upload private key (.p8 file)
5. Add authorized redirect URI:
   - parapluie://auth/callback
6. Save
```

### React Native Configuration

**1. Install Dependencies:**

```bash
# Google Sign-In
npm install @react-native-google-signin/google-signin

# Apple Sign In (built-in for iOS 13+)
npm install @invertase/react-native-apple-authentication

# Deep linking support
npm install react-native-url-polyfill
```

**2. Configure Deep Links:**

**iOS (Info.plist):**
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>parapluie</string>
    </array>
  </dict>
</array>
```

**Android (AndroidManifest.xml):**
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="parapluie" />
</intent-filter>
```

### OAuth Callback Handler

```typescript
// src/lib/auth/oauth-handler.ts

import { useEffect } from 'react';
import { Linking } from 'react-native';
import { supabase } from '../supabase';

export const useOAuthHandler = (
  onSuccess: (userId: string) => void,
  onError: (error: Error) => void
) => {
  useEffect(() => {
    // Handle OAuth callback
    const handleDeepLink = async (event: { url: string }) => {
      const { url } = event;
      
      if (url.includes('auth/callback')) {
        try {
          // Extract session from callback
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) throw error;
          
          if (session) {
            onSuccess(session.user.id);
          }
        } catch (error) {
          onError(error as Error);
        }
      }
    };
    
    // Listen for deep links
    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Check for initial URL (if app was closed)
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({ url });
      }
    });
    
    return () => subscription.remove();
  }, [onSuccess, onError]);
};
```

---

## 4. ACCOUNT LINKING LOGIC

**Scenario:** User signs up with email, later tries to sign in with Google using same email.

**Solution:** Supabase handles this automatically, BUT we need to update our profile:

```typescript
const handleSocialSignIn = async (provider: 'google' | 'apple') => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: 'parapluie://auth/callback',
      },
    });
    
    if (error) throw error;
    
    // After callback returns with session...
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();
      
      if (!profile) {
        // New user, create profile
        await createUserProfile(session.user);
      } else {
        // Existing user, account is automatically linked
        // Just navigate
        navigation.navigate('MainApp');
      }
    }
    
  } catch (error) {
    console.error('Social sign in error:', error);
    showError('Erreur de connexion');
  }
};
```

---

## 5. ERROR STATES & EDGE CASES

### Network Errors

**No Internet:**
```
┌─────────────────────────────────┐
│         💧 Walter               │
│        (concerned)              │
│                                 │
│  ⚠️ Pas de connexion internet   │
│                                 │
│  Parapluie a besoin d'internet  │
│  pour créer votre compte et     │
│  synchroniser vos données.      │
│                                 │
│  Vérifiez votre connexion et    │
│  réessayez.                     │
│                                 │
│  ┌─────────────────────────┐   │
│  │      Réessayer          │   │
│  └─────────────────────────┘   │
└─────────────────────────────────┘
```

### Server Errors

**500 Error:**
```typescript
if (error.status === 500) {
  Toast.show('Erreur serveur. Réessayez dans quelques instants.', {
    duration: 3000,
    type: 'error',
  });
}
```

### Permission Errors

**Critical Permission Denied:**
```typescript
Alert.alert(
  '⚠️ Protection limitée',
  'Sans cette autorisation, Walter ne peut pas vous protéger efficacement.\n\nActivez-la dans:\nRéglages → Parapluie → Autorisations',
  [
    { text: 'Plus tard' },
    {
      text: 'Ouvrir Réglages',
      onPress: () => Linking.openSettings(),
    },
  ]
);
```

### Social Auth Errors

**Google Sign-In Failed:**
```typescript
if (error.code === 'GOOGLE_SIGN_IN_CANCELLED') {
  // User cancelled, don't show error
  return;
}

if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
  Alert.alert(
    'Services Google non disponibles',
    'Veuillez mettre à jour Google Play Services.'
  );
  return;
}

// Generic error
showError('Impossible de se connecter avec Google. Utilisez votre email à la place.');
```

**Apple Sign In Failed:**
```typescript
if (error.code === '1001') {
  // User cancelled
  return;
}

showError('Impossible de se connecter avec Apple. Utilisez votre email à la place.');
```

---

## 6. NAVIGATION STRUCTURE

### Root Navigator

```typescript
const RootNavigator = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkOnboardingStatus();
  }, []);
  
  const checkOnboardingStatus = async () => {
    const completed = await AsyncStorage.getItem(
      StorageKeys.ONBOARDING_COMPLETED
    );
    setOnboardingComplete(completed === 'true');
    setLoading(false);
  };
  
  if (loading) {
    return <SplashScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {onboardingComplete ? (
          <Stack.Screen name="MainApp" component={MainAppNavigator} />
        ) : (
          <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
        
        {/* TC Onboarding (modal) */}
        <Stack.Screen
          name="TCOnboarding"
          component={TCOnboardingNavigator}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### Senior Onboarding Navigator

```typescript
const OnboardingNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      gestureEnabled: false, // Disable swipe back
    }}
  >
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="WelcomeNamePhone" component={WelcomeNamePhoneScreen} />
    <Stack.Screen name="AccountCreation" component={AccountCreationScreen} />
    <Stack.Screen name="Permissions" component={PermissionsScreen} />
    <Stack.Screen name="InviteTCPrompt" component={InviteTCPromptScreen} />
    <Stack.Screen name="InviteTCContactInfo" component={InviteTCContactInfoScreen} />
    <Stack.Screen name="ShareInvitation" component={ShareInvitationScreen} />
    <Stack.Screen name="OnboardingComplete" component={OnboardingCompleteScreen} />
  </Stack.Navigator>
);
```

### TC Onboarding Navigator

```typescript
const TCOnboardingNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TCWelcome" component={TCWelcomeScreen} />
    <Stack.Screen name="EnterCode" component={EnterInvitationCodeScreen} />
    <Stack.Screen name="TCAccountCreation" component={TCAccountCreationScreen} />
    <Stack.Screen name="TCSignIn" component={TCSignInScreen} />
    <Stack.Screen name="AcceptInvitation" component={AcceptInvitationScreen} />
    <Stack.Screen name="InvitationAccepted" component={InvitationAcceptedScreen} />
    <Stack.Screen name="CodeLocked" component={CodeLockedScreen} />
    <Stack.Screen name="InvitationDeclined" component={InvitationDeclinedScreen} />
  </Stack.Navigator>
);
```

---

## 7. ANALYTICS EVENTS

### Track These Events:

```typescript
// App Launch
analytics.track('App Launched', {
  is_first_launch: boolean,
  has_session: boolean,
});

// Senior Onboarding
analytics.track('Onboarding Started');
analytics.track('Name Entered', { name_length: number });
analytics.track('Phone Entered', { country_code: string });
analytics.track('Account Created', { 
  method: 'email' | 'google' | 'apple'
});
analytics.track('Permission Requested', { 
  permission: string 
});
analytics.track('Permission Granted', { 
  permission: string,
  granted: boolean 
});
analytics.track('Permission Skipped');
analytics.track('TC Invitation Started');
analytics.track('TC Invitation Created', { 
  relationship: string 
});
analytics.track('TC Invitation Sent', { 
  method: 'sms' | 'email' | 'manual' 
});
analytics.track('TC Invitation Skipped');
analytics.track('Onboarding Completed', {
  duration_seconds: number,
  has_trusted_contact: boolean,
  permissions_granted: object,
  signup_method: string,
});

// TC Onboarding
analytics.track('TC Invitation Opened', { 
  code: string,
  via_deep_link: boolean 
});
analytics.track('TC Code Entered', { 
  valid: boolean,
  attempts: number 
});
analytics.track('TC Code Locked', { attempts: number });
analytics.track('TC Account Created', { 
  senior_id: string,
  method: 'email' | 'google' | 'apple'
});
analytics.track('Invitation Accepted', { 
  senior_id: string 
});
analytics.track('Invitation Declined', { 
  senior_id: string,
  at_screen: string 
});
analytics.track('TC Upsell Accepted');
analytics.track('TC Upsell Declined');

// Errors
analytics.track('Error Occurred', {
  screen: string,
  error_type: string,
  error_message: string,
});
```

---

## 8. TESTING SCENARIOS

### Senior Onboarding Tests:

1. ✅ Complete happy path (email/password)
2. ✅ Complete with Google Sign-In
3. ✅ Complete with Apple Sign In
4. ✅ Skip TC invitation
5. ✅ Invite TC via SMS
6. ✅ Invite TC via Email
7. ✅ Invite TC manually (copy code)
8. ✅ Deny permissions (partial protection)
9. ✅ Skip all optional steps
10. ✅ Email already exists → Show sign in
11. ✅ Network interruption → Error handling
12. ✅ Close app mid-onboarding → Resume later
13. ✅ Account linking (same email, different provider)

### TC Onboarding Tests:

1. ✅ Deep link with valid code (new user)
2. ✅ Deep link with valid code (existing user)
3. ✅ Manual code entry (valid)
4. ✅ Invalid code (1st attempt)
5. ✅ Invalid code (3 attempts → locked)
6. ✅ Expired code
7. ✅ Already used code
8. ✅ Declined code (try to reuse)
9. ✅ Accept invitation (email signup)
10. ✅ Accept invitation (Google)
11. ✅ Accept invitation (Apple)
12. ✅ Decline invitation
13. ✅ Accept + Upsell to senior protection
14. ✅ Accept + Just monitor

---

## 9. PERFORMANCE OPTIMIZATIONS

- Preload next screen assets while user reads current screen
- Debounce validation (don't validate every keystroke)
- Cache permission status to avoid repeated checks
- Lazy load screens not in immediate path
- Optimize Walter animations (use Lottie)
- Compress images
- Use FastImage for Watson character

---

## 10. ACCESSIBILITY

- Minimum touch target: 48x48 dp
- Color contrast ratio: 4.5:1 minimum
- Screen reader support (accessibilityLabel)
- Dynamic type support (respect user's font size)
- VoiceOver/TalkBack tested
- Keyboard navigation (for email/password fields)

---

## IMPLEMENTATION TIMELINE

**Week 1-2: Core Onboarding (MVP)**
- ✅ Senior flow (Screens 1-8)
- ✅ Email/password auth
- ✅ Basic permissions
- ✅ TC invitation flow

**Week 3: Social Auth**
- ✅ Google Sign-In
- ✅ Apple Sign In
- ✅ Account linking
- ✅ OAuth callbacks

**Week 4: Polish**
- ✅ All error states
- ✅ Loading states
- ✅ Analytics
- ✅ Testing

**Week 5: TC Onboarding**
- ✅ Deep linking
- ✅ Code validation
- ✅ Accept/Decline flows
- ✅ Upsell logic

---

## VERSION HISTORY

- **v3.0** (2025-01-15): Added social auth, combined welcome screen, simplified password requirements
- **v2.0** (2025-01-15): Added account creation screen
- **v1.0** (2025-01-10): Initial documentation