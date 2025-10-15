# Navigation Structure - Parapluie

## Overview

Parapluie uses a stack-based navigation system with conditional rendering for onboarding and main app flows.

## Navigation Hierarchy

```
RootNavigator (Stack)
├── OnboardingStack (conditional - first-time users)
└── MainNavigator (authenticated users)
```

- ACTUAL navigation: 3 tabs (Accueil, Walter, Sécurité)
- Remove 5-tab confusion from stacks.md
- Walter button opens chat modal overlay
- Deep link handling
- Navigation state persistence

## OnboardingStack

**Type:** Stack Navigator
**Purpose:** Guide new users through initial setup and permissions

### Screens

1. **WelcomeScreen** (`/onboarding/welcome`)
   - Route name: `Welcome`
   - Walter introduction
   - User name input
   - Actions: Continue, Skip

2. **PermissionScreen** (`/onboarding/permissions`)
   - Route name: `Permissions`
   - Phone/SMS permissions
   - Location permissions
   - Notification permissions
   - Actions: Accept Protection, Skip

3. **InvitationScreen** (`/onboarding/invitation`)
   - Route name: `Invitation`
   - Privacy notice card
   - Actions: Add Contact, Skip

4. **ContactInfoScreen** (`/onboarding/contact-info`)
   - Route name: `ContactInfo`
   - Contact name input
   - Relationship input
   - Actions: Create Invitation, Skip

5. **ShareScreen** (`/onboarding/share`)
   - Route name: `Share`
   - Generated invitation code
   - Tabs: SMS, Email, In Person
   - Actions: Send via SMS/Email/Copy

6. **ConfirmationScreen** (`/onboarding/confirmation`)
   - Route name: `Confirmation`
   - Success message
   - 7-day trial information
   - Actions: Visit with Walter

### Navigation Flow

```
Welcome → Permissions → Invitation → ContactInfo → Share → Confirmation → Home
   ↓          ↓            ↓
  Skip       Skip        Skip
   ↓          ↓            ↓
Permissions  Invitation   Home
```

## MainNavigator

**Type:** Bottom Tab Navigator
**Purpose:** Primary navigation for authenticated users

### Tabs

1. **HomeTab** (`/home`)
   - Icon: 🏠 (house icon)
   - Label: "Accueil"
   - Badge: Alert count
   - Screen: HomeScreen

2. **WalterChatModal** (`/modal/walter-chat`)
   - Icon: 🎤(microphone icon)
   - Label: "Walter (Chat avec Walter)"
   - Screen: ModalChatScreen

3. **SafetyTab** (`/safety`)
   - Icon: 🛡️ (shield icon)
   - Label: "Sécuriter"
   - Badge: None?
   - Screen: SafetyScreen

## Modal Stack

**Type:** Stack Navigator (Modal Presentation)
**Purpose:** Overlay screens that appear on top of main navigation

### Modals

1. **AlertDetailModal** (`/modal/alert-detail`)
   - Shows detailed information about security alerts
   - Actions: Dismiss, Report, Block

2. **ContactSelectorModal** (`/modal/contact-selector`)
   - Native contact picker integration
   - Search and filter contacts

3. **SettingsModal** (`/modal/settings`)
   - App settings and preferences
   - Account management
   - Privacy controls

4. **WalterChatModal** (`/modal/walter-chat`)
   - Full-screen chat with Walter AI
   - Voice input support
   - Context-aware assistance

## Deep Linking Structure

```typescript
const linking = {
  prefixes: ['parapluie://', 'https://parapluie.app'],
  config: {
    screens: {
      Onboarding: {
        screens: {
          Welcome: 'onboarding/welcome',
          Permissions: 'onboarding/permissions',
          Invitation: 'onboarding/invitation/:code?',
          ContactInfo: 'onboarding/contact-info',
          Share: 'onboarding/share',
          Confirmation: 'onboarding/confirmation',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Calendar: 'calendar',
          News: 'news',
          Learning: 'learning',
          Profile: 'profile',
        },
      },
      Modal: {
        screens: {
          AlertDetail: 'alert/:id',
          ContactSelector: 'contacts',
          Settings: 'settings',
          WalterChat: 'walter',
        },
      },
    },
  },
};
```

## Navigation Guards

### Authentication Check
- Redirects unauthenticated users to OnboardingStack
- Redirects authenticated users to MainNavigator

### Onboarding Completion Check
- Checks if user has completed onboarding
- Skips OnboardingStack if already completed
- Stored in AsyncStorage: `@parapluie:onboarding_completed`

### Permission Status Check
- Validates required permissions before accessing features
- Shows permission request screens when needed
- Graceful fallback for denied permissions

## Screen Transitions

### Onboarding Stack
- Type: `slide_from_right` (iOS) / `fade` (Android)
- Duration: 300ms
- Gesture: Swipe back enabled

### Main Tabs
- Type: `fade`
- Duration: 200ms
- Gesture: Tab bar press

### Modals
- Type: `slide_from_bottom`
- Duration: 300ms
- Gesture: Swipe down to dismiss

## State Management

### Navigation State
- Stored in Redux: `navigation.currentRoute`
- Tracked for analytics
- Used for deep link handling

### Navigation History
- Last 5 screens tracked
- Used for "Back to..." functionality
- Excludes modal screens

## Accessibility

### Tab Navigation
- Large touch targets (min 48x48px)
- Clear labels in French
- Screen reader support
- Keyboard navigation support (web)

### Screen Titles
- Each screen has descriptive title
- Announced by screen readers
- Used in navigation header

## Platform Differences

### iOS
- Native-style navigation bars
- Swipe back gesture enabled
- Tab bar safe area handling

### Android
- Material Design navigation
- Hardware back button support
- Status bar color coordination

### Web
- Browser back/forward support
- URL-based routing
- Responsive tab layout (sidebar on desktop)
