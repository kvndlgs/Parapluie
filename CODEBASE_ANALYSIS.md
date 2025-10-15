# Parapluie Codebase Analysis

## Executive Summary

Parapluie is a React Native mobile application designed to protect seniors from scams using an AI-powered assistant named Walter. The codebase currently has the onboarding flow implemented but the main app screens and navigation structure still need to be built.

Current Status: Phase 1 - Onboarding Complete | Phase 2 - Main App Navigation (In Progress)

## 1. DIRECTORY STRUCTURE

/src
├── /components           # Reusable UI components
│   ├── Button.tsx           
│   ├── Input.tsx            
│   ├── WalterBubble.tsx      
│   ├── InfoCard.tsx          
│   └── index.ts             
├── /screens              # Screen components
│   └── /onboarding       # Onboarding screens (COMPLETED)
│       ├── WelcomeScreen.tsx           
│       ├── PermissionScreen.tsx        
│       ├── InvitationScreen.tsx        
│       ├── ContactInfoScreen.tsx       
│       ├── ShareScreen.tsx             
│       ├── ConfirmationScreen.tsx      
│       └── index.ts                    
├── /navigation           # Navigation configuration
│   └── OnboardingNavigator.tsx     
├── /lib                  # Services & utilities
│   ├── supabase.ts           
│   └── testSupabase.ts       
├── /config               # App configuration
│   └── tamagui.config.ts     
└── /theme                # Design tokens
    └── colors.ts         

/App.tsx                  # Root app component
/app.json                 # Expo configuration

## 2. WHAT'S ALREADY BUILT

### 2.1 Onboarding Flow (COMPLETED)
- WelcomeScreen: Walter intro + user name input
- PermissionScreen: Request phone/SMS/location/notification perms
- InvitationScreen: Family contact invitation intro
- ContactInfoScreen: Emergency contact details
- ShareScreen: 6-digit code with SMS/Email/InPerson tabs
- ConfirmationScreen: Success + 7-day trial info

### 2.2 Reusable Components (COMPLETED)

Button.tsx
- Variants: primary (purple), ghost (transparent)
- Sizes: sm, md, lg
- States: loading, disabled

Input.tsx
- Basic text input with error state
- Placeholder and error border styling

WalterBubble.tsx
- Avatar image + speech bubble layout
- Purple accent styling

InfoCard.tsx
- Emoji + title + text layout
- White background with shadow

### 2.3 Backend & Config
- Supabase client initialized
- AsyncStorage for persistence
- Tamagui UI framework configured
- PP Monument font family setup

---

## 3. WHAT NEEDS TO BE BUILT

### 3.1 Main Navigation Structure (HIGH PRIORITY)

RootNavigator (Stack)
├── OnboardingStack (conditional)
└── MainNavigator (TAB NAVIGATOR NEEDED)
    ├── HomeTab (/home)
    ├── WalterChat (/modal/walter-chat) - elevated button
    └── SafetyTab (/safety)

### 3.2 Main App Screens (HIGH PRIORITY)

HomeScreen (/screens/main/HomeScreen.tsx)
- Header: Greeting, date, protection status
- WalterQuickAccess: "Talk to Walter" button
- SafetyEventsCard: Blocked calls/SMS stats
- UpcomingEventsSection: Calendar events
- LocalNewsSection: Geo-fenced alerts
- CommunityActivitiesSection: Activities nearby

SafetyScreen (/screens/main/SafetyScreen.tsx)
- Event hub with tabs/filters
- Call/SMS/Threat history
- Event detail view
- Threat level indicators
- Mark safe/unsafe actions

WalterChatModal (/screens/modals/WalterChatModal.tsx)
- Full-screen chat interface
- Text input + message history
- Voice input UI
- Context-aware AI responses

### 3.3 Required New Components

- ThreatLevelBadge
- EventListItem
- EventCard
- WalterAnalysisCard
- ReportActionButtons
- CustomTabNavigator (with elevated Walter button)
- HeaderBar
- EmptyState
- LoadingState
- ErrorState

### 3.4 Services & State Management

Redux store needed for:
- auth (user authentication)
- user (profile data)
- events (calls/SMS/threats)
- walter (AI state)
- settings (preferences)

Services to build:
- AuthService
- EventService
- WalterService
- NotificationService
- PermissionService
- StorageService

### 3.5 Folder Structure to Create

/src/screens/main/ - HomeScreen, SafetyScreen
/src/screens/modals/ - WalterChatModal, etc
/src/store/ - Redux setup and slices
/src/services/ - API/business logic
/src/types/ - TypeScript interfaces
/src/constants/ - App constants

---

## 4. TECH STACK

### Currently Installed
- React Native 0.74.x
- Expo 51.x
- TypeScript
- React Navigation 6.x
- Supabase
- Tamagui
- NativeWind

### Needs Installation
- Redux and react-redux
- redux-thunk
- react-native-permissions
- expo-notifications
- redux-persist

---

## 5. KEY FILE PATHS (ABSOLUTE)

Existing Components:
- /c/Users/poiss/Documents/dev/Parapluie/src/components/Button.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/components/Input.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/components/WalterBubble.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/components/InfoCard.tsx

Onboarding Screens:
- /c/Users/poiss/Documents/dev/Parapluie/src/screens/onboarding/WelcomeScreen.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/screens/onboarding/PermissionScreen.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/screens/onboarding/ContactInfoScreen.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/screens/onboarding/ShareScreen.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/screens/onboarding/ConfirmationScreen.tsx

Core Files:
- /c/Users/poiss/Documents/dev/Parapluie/App.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/navigation/OnboardingNavigator.tsx
- /c/Users/poiss/Documents/dev/Parapluie/src/lib/supabase.ts

Documentation:
- /c/Users/poiss/Documents/dev/Parapluie/.claude/docs/stacks.md
- /c/Users/poiss/Documents/dev/Parapluie/.claude/docs/main-screens.md
- /c/Users/poiss/Documents/dev/Parapluie/.claude/docs/main-flows.md
- /c/Users/poiss/Documents/dev/Parapluie/.claude/docs/walter-ai-spec.md

---

## 6. IMPLEMENTATION ROADMAP

Sprint 1: Navigation Foundation
- RootNavigator with auth state checking
- MainNavigator with TabNavigator
- CustomTabBar with elevated Walter button
- Redux store setup

Sprint 2: Home Screen
- HomeScreen with all sections
- SafetyEventsCard component
- Mock event data
- Pull-to-refresh

Sprint 3: Safety Hub
- SafetyScreen with filters/tabs
- Event detail screen
- Mark safe/unsafe actions

Sprint 4: Walter Chat
- WalterChatModal
- Basic chat UI
- Message components

Sprint 5: Authentication
- LoginScreen, RegisterScreen
- Supabase auth integration
- Session persistence

Sprint 6+: Polish & Features
- Notifications
- Permissions handling
- Deep linking
- Analytics

---

## 7. SUMMARY TABLE

Component/Feature | Status | Location
Onboarding Flow | DONE | /src/screens/onboarding/
Reusable Components | DONE | /src/components/
Onboarding Navigator | DONE | /src/navigation/
Design System | DONE | /src/theme/
Supabase Setup | DONE | /src/lib/
Root Navigation | TODO | /src/navigation/
Main Navigation | TODO | /src/navigation/
Home Screen | TODO | /src/screens/main/
Safety Screen | TODO | /src/screens/main/
Walter Chat | TODO | /src/screens/modals/
Redux Setup | TODO | /src/store/
Services | TODO | /src/services/
Types/Constants | TODO | /src/types/ /src/constants/

