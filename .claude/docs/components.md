# Components Specification - Parapluie

## Navigation Components

### AppNavigator

- **Type:** Stack Navigator with Tab Navigator

- **Screens:** Auth Stack, Main Tabs, Modal Stack
- **Auth Stack:** Login, Register, ForgotPassword, Onboarding
- **Main Tabs:** Home, Search, Profile, Settings
- **Modals:** Share, Filter, Confirmation

### TabNavigator

A fixed bottom navigation bar component with three navigation items arranged horizontally with equal spacing:

1. Left item: "Accueil" (Home)
   - Icon: House/home icon
   - Label: "Accueil"
   - Color: Purple (#7C3AED or similar)
   - State: Can be active/inactive

2. Center item: "Walter" (AI Assistant)
   - Elevated circular button (floating above the bar)
   - Icon: Microphone icon
   - Label: "Walter"
   - Color: Purple gradient background (#7C3AED)
   - Size: Larger than other nav items (approximately 80x80px circle)
   - Position: Overlaps the navigation bar, centered
   - Has subtle shadow/elevation

3. Right item: "Sécuriter" (Safety/Security)
   - Icon: Shield icon
   - Label: "Sécuriter"
   - Color: Dark gray/purple (#5B4B6B or similar)
   - State: Can be active/inactive

**Styling:**

- Background: White (#FFFFFF)
- Border: Top border with light gray divider line
- Height: Approximately 70-80px
- Padding: Standard mobile padding (16-20px horizontal)
- Safe area insets: Account for device bottom safe area
- Icons: 24x24px
- Labels: 14-16px font size
- Center button elevation: 4-8dp shadow

**Behavior:**

- Fixed position at bottom of screen
- Stays visible while scrolling
- Active state: Change icon and label color to purple
- Inactive state: Gray color
- Tap targets: Minimum 44x44px for accessibility
- Center Walter button: Slightly larger tap target (60-80px)

**State:**

- Track current active route
- Update active state styling when route changes
- Walter button can be accessible from any screen (modal overlay preferred)

### **Key Requirements for Implementation**

1. **Component must be:**
   - Reusable across all main screens
   - Responsive to safe area insets (iOS notch, Android gesture bar)
   - Accessible with proper ARIA labels
   - Support active/inactive states

2. **The Walter button must:**
   - Float above the navigation bar
   - Have circular shape with elevation/shadow
   - Be centered horizontally
   - Trigger modal/overlay rather than navigation

3. **Navigation persistence:**
   - Bottom nav should remain visible on all main screens
   - Should not re-render unnecessarily on navigation
   - Active state should update smoothly

4. **Spacing/Layout:**
   - Use flexbox with space-between or space-evenly
   - Center button positioned absolutely or with transform
   - Ensure consistent alignment across different screen sizes

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
```

## Safety Event Screen

### Cards

- Safety Events Card (for Home screen) - Shows summary stats
- Event List Item - Reusable for calls/SMS/threats in history lists
- Event Detail Card - Shows full information about an event
- Walter Analysis Card - AI assessment and recommendations
- Authority Contact Card - Shows fraud center/police options

### Modals/Overlays

- Walter Chat Modal - "Ask Walter" contextual help
- Report Options Modal - Safe/Unsafe/Copy/Share choices
- Authority Selection Modal - Choose which authority to contact
- Confirmation Modal - "Are you sure?" dialogs
- Success/Completion Modal - After reporting or calling

### Action Components

- "Ask Walter" Button - Contextual AI help trigger (reusable)
- Report Action Buttons - Mark Safe, Mark Unsafe, options
- Call Authority Button - Pre-filled phone call launcher
- Share/Copy Buttons - For sharing event details
- Back/Navigation Buttons - Consistent across screens

### Status Indicators

- Threat Level Badge - Low/Medium/High/Critical visual indicator
- Event Type Icon - Call/SMS/Threat differentiators
- Timestamp Display - When event occurred
- Status Dot - Blocked/Allowed/Pending review
- Lists & Data Display

- Event History List - Scrollable list of events
- Event Details Layout - Structured information display
- Empty State - When no events exist ("No threats detected!")
- Loading State - While Walter analyzes

## Layouts (Reusable Structures)

- Standard Screen Layout - Header + Content + Navigation
- Detail Screen Layout - Back button + Title + Content + Actions
- Modal Layout - Overlay + Content + Action buttons
- List Item Layout - Icon + Title + Subtitle + Arrow/Badge

## Special Screens

- Authority Call Screen - Shows contact being called with context
- Family Notification Confirmation - "Sarah has been notified"
- AI Learning Feedback - "Thanks! I'm getting smarter" confirmation

- **States**

- Default state - Normal view
- Empty state - No data yet
- Loading state - While fetching/analyzing
- Error state - If something fails
- Success state - After successful action

## Priority Order for MVP

- ### Phase 1 (Must Have)

- Safety Events Card (Home screen)
- Safety Events Screen (hub)
- Event History Lists (calls/SMS/threats)
- Event Detail Screens
- Basic "Ask Walter" modal
- Report action buttons
- Authority contact modal