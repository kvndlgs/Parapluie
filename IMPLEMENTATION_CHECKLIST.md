# Parapluie Implementation Checklist

## Phase 1: Navigation Foundation (CRITICAL)

### 1.1 Root Navigation Setup
- [ ] Create /src/navigation/RootNavigator.tsx
  - Stack navigator with conditional rendering
  - Check auth state and onboarding completion
  - Show OnboardingStack or MainNavigator based on state
- [ ] Update App.tsx to use RootNavigator
- [ ] Set up Redux store for auth state

### 1.2 Main App Navigation (TAB NAVIGATOR)
- [ ] Create /src/navigation/MainNavigator.tsx
  - BottomTabNavigator with 3 tabs
  - HomeTab navigation stack
  - SafetyTab navigation stack
  - Modal stack for overlays
- [ ] Create /src/navigation/types.ts

### 1.3 Custom Tab Bar Component
- [ ] Create /src/components/CustomTabBar.tsx
  - Render 3 tabs: Home, Safety
  - Elevated circular Walter button in center
  - Active/inactive state styling
  - Safe area handling
  - Shadow/elevation for Walter button

### 1.4 Redux Setup
- [ ] Create /src/store/store.ts
- [ ] Create /src/store/slices/authSlice.ts
- [ ] Create /src/store/slices/eventsSlice.ts
- [ ] Install: redux, react-redux, @reduxjs/toolkit

---

## Phase 2: Home Screen (MVP CORE)

### 2.1 HomeScreen Component
- [ ] Create /src/screens/main/HomeScreen.tsx
  - ScrollView with pull-to-refresh

### 2.2 Home Screen Components
- [ ] HeaderSection.tsx - Greeting, date, protection status
- [ ] WalterQuickAccess.tsx - "Talk to Walter" button
- [ ] SafetyEventsCard.tsx - Blocked calls/SMS/threat stats
- [ ] UpcomingEventsSection.tsx - Calendar events horizontal scroll
- [ ] LocalNewsSection.tsx - Geo-fenced alerts
- [ ] CommunityActivitiesSection.tsx - Nearby activities

### 2.3 Mock Data
- [ ] Create /src/data/mockEvents.ts

### 2.4 Styling
- [ ] Create /src/theme/spacing.ts
- [ ] Create /src/theme/typography.ts

---

## Phase 3: Safety Hub (EVENTS)

### 3.1 Safety Screen
- [ ] Create /src/screens/main/SafetyScreen.tsx
  - Tab navigation: All, Calls, SMS, Threats

### 3.2 Event Components
- [ ] EventListItem.tsx - Individual event in list
- [ ] ThreatLevelBadge.tsx - Severity indicator
- [ ] EmptyState.tsx - No events message
- [ ] LoadingState.tsx - Skeleton loading

### 3.3 Event Detail Screen
- [ ] Create /src/screens/main/EventDetailScreen.tsx

### 3.4 Event Service
- [ ] Create /src/services/EventService.ts
  - fetchEvents()
  - filterEvents()
  - markEventSafe/Unsafe()

### 3.5 Types
- [ ] Create /src/types/events.ts - Interfaces for events
- [ ] Create /src/constants/routes.ts
- [ ] Create /src/constants/colors.ts

---

## Phase 4: Walter AI Chat

### 4.1 Walter Chat Modal
- [ ] Create /src/screens/modals/WalterChatModal.tsx
  - Message list, input, send button

### 4.2 Message Components
- [ ] MessageBubble.tsx - User/Walter messages

### 4.3 Walter Service
- [ ] Create /src/services/WalterService.ts
  - sendMessage()
  - getResponse()

---

## Phase 5: Services & Utilities

### 5.1 Services
- [ ] PermissionService.ts - Request/check permissions
- [ ] NotificationService.ts - Push notifications
- [ ] StorageService.ts - Async storage
- [ ] ApiService.ts - Supabase API client

### 5.2 Dependencies
npm install redux react-redux @reduxjs/toolkit
npm install react-native-permissions
npm install expo-notifications

---

## Testing Checklist

- [ ] App launches without errors
- [ ] Navigation works between tabs
- [ ] HomeScreen renders with mock data
- [ ] SafetyScreen shows events
- [ ] Walter chat modal opens/closes
- [ ] Redux actions dispatch correctly
- [ ] No console warnings/errors
- [ ] Responsive layout
- [ ] Safe area handling works
- [ ] All buttons functional

---

Priority: HIGH - Start immediately with Navigation Foundation
