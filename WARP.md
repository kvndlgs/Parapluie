# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Parapluie** is a React Native mobile app built with Expo that protects seniors from scams using an AI assistant named Walter. The app uses React Navigation, Redux, Supabase for backend, and Tamagui for UI components.

## Development Commands

### Core Commands
- `npm start` - Start Expo development server
- `npm run android` - Run on Android device/emulator 
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run web version

### Supabase Commands
- `npx supabase start` - Start local Supabase instance (requires Docker)
- `npx supabase stop` - Stop local Supabase
- `npx supabase status` - Check service status
- `npx supabase db reset` - Reset database with migrations

### Development Environment
- Uses PowerShell on Windows
- Requires Expo CLI and Supabase CLI
- Local Supabase runs on ports 54321-54327

## Architecture Overview

### Navigation Structure
The app uses a hierarchical navigation pattern:
```
RootNavigator (manages auth flow)
├── OnboardingNavigator (conditional - first-time users)
└── MainNavigator (bottom tabs)
    ├── HomeTab 
    ├── WalterChat (elevated center button)
    └── SafetyTab
```

### State Management
- **Redux Toolkit** for global state with slices:
  - `authSlice` - authentication and onboarding status
  - `eventsSlice` - safety events (calls, SMS, threats)
- **AsyncStorage** for persistence (onboarding completion, user data)
- **Supabase** for backend data and authentication

### Key Directories
```
src/
├── components/        # Reusable UI components (Button, Input, WalterBubble, etc.)
├── screens/
│   ├── main/         # Main app screens (HomeScreen, SafetyScreen, etc.)
│   ├── onboarding/   # Onboarding flow screens (COMPLETED)
│   └── modals/       # Modal screens (WalterChatModal)
├── navigation/       # Navigation configuration
├── services/         # API and business logic (authService, onboardingService)
├── store/           # Redux store and slices
├── lib/             # Utilities (supabase client, deep linking)
├── theme/           # Design system (colors, typography, spacing)
└── types/           # TypeScript interfaces
```

### Environment Configuration
- Supabase configuration in `src/lib/supabase.ts`
- Environment variables: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`
- Tamagui configuration in `src/config/tamagui.config.ts`

## Current Implementation Status

### ✅ Completed
- **Onboarding flow** - Complete user registration flow
- **Core components** - Button, Input, WalterBubble, InfoCard
- **Authentication service** - Phone OTP via Supabase
- **Design system** - PP Monument fonts, Tamagui setup
- **Basic navigation** - OnboardingNavigator implemented

### 🚧 In Progress
- **Main navigation** - HomeScreen and SafetyScreen exist but MainNavigator needs work
- **Redux integration** - Store exists but not fully connected to components

### ❌ Not Implemented
- **WalterChatModal** - AI chat interface
- **Event management** - Safety events handling
- **Permissions** - Camera, location, notifications
- **Deep linking** - App linking support

## Key Technical Patterns

### Component Structure
Components follow a consistent pattern with TypeScript interfaces, StyleSheet, and proper props typing:

```typescript
interface ComponentProps {
  // Define props with proper types
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Component logic
  return <View style={styles.container}>...</View>;
}

const styles = StyleSheet.create({
  container: { /* styles */ }
});
```

### Redux Integration
State management uses Redux Toolkit with typed hooks:

```typescript
// Access state
const { isAuthenticated } = useSelector((state: RootState) => state.auth);

// Dispatch actions  
const dispatch = useDispatch();
dispatch(setUser(userData));
```

### Authentication Flow
- **Phone-based authentication** using Supabase OTP
- **AsyncStorage** for local session persistence
- **Onboarding completion** tracked separately from auth

### Styling Approach
- **Tamagui** for component styling with design tokens
- **StyleSheet** for screen-level layouts
- **Custom fonts** - PP Monument family loaded via expo-font
- **Color system** - Purple theme (#785978) with light background

## Testing Approach

Since no test framework is configured, manual testing is the current approach:

1. Test on both iOS and Android simulators
2. Verify navigation flows work correctly  
3. Check Redux state updates properly
4. Validate Supabase connection and auth
5. Test onboarding completion persistence

## Development Guidelines

### File Organization
- Use absolute imports from `src/` root
- Keep components small and focused
- Separate business logic into services
- Use TypeScript interfaces for all data structures

### Naming Conventions  
- PascalCase for components and screens
- camelCase for functions and variables
- SCREAMING_SNAKE_CASE for constants
- Descriptive names (e.g., `SafetyEventsCard` not `Card`)

### Error Handling
- Wrap async operations in try/catch blocks
- Log errors to console for debugging
- Provide user-friendly error messages
- Handle network failures gracefully

## Common Development Tasks

### Adding a New Screen
1. Create screen component in appropriate `screens/` subdirectory
2. Add route type to navigation types
3. Register route in navigator
4. Add necessary Redux state if needed

### Adding a New Service
1. Create service file in `src/services/`
2. Export typed functions
3. Handle async operations properly
4. Integrate with Supabase client when needed

### Debugging Issues
- Check Metro bundler logs
- Use React Developer Tools
- Check Supabase dashboard for backend issues
- Verify AsyncStorage data persistence
- Test on physical devices for platform-specific issues