# Components Specification - Parapluie

## Navigation Components

### AppNavigator

- **Type:** Stack Navigator with Tab Navigator

- **Screens:** Auth Stack, Main Tabs, Modal Stack
- **Auth Stack:** Login, Register, ForgotPassword, Onboarding
- **Main Tabs:** Home, Search, Profile, Settings
- **Modals:** Share, Filter, Confirmation

### TabNavigator

- **Style:** Bottom tabs with icons

- **Active State:** Icon + label, primary color
- **Inactive State:** Icon only, gray
- **Badge Support:** Notifications, updates
- **Accessibility:** Large touch targets (48px minimum)

## Screen Components

### HomeScreen

- **Layout:** ScrollView with pull-to-refresh

- **Sections:** 
  - Header (user greeting, quick stats)
  - Featured content (horizontal scroll)
  - Main content (vertical list)
  - Action button (floating)
- **State Management:** 
  - Loading states
  - Empty states
  - Error states
- **Data Sources:** API endpoint /home
- **Refresh Behavior:** Pull-to-refresh reloads all sections

### LoginScreen

- **Inputs:** 

  - Email (validation: valid email format)
  - Password (validation: minimum 8 characters, show/hide toggle)

- **Actions:**

  - Login button (validates before submission)
  - "Forgot Password" link
  - "Sign Up" link
  - Social login buttons (Google, Apple)

- **States:**

  - Default (fields empty)
  - Validating (button shows spinner)
  - Error (show error message, highlight invalid fields)
  - Success (navigate to dashboard)

- **Accessibility:**

  - Labels for screen readers
  - Auto-focus on email field
  - Keyboard dismissal on scroll

## Reusable UI Components

### Button Component

**Props:**

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onPress: () => void;
  children: ReactNode;
}