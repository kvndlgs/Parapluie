# Parapluie Tamagui Configuration Guide

## Overview
Complete guide to configuring Tamagui with the Parapluie design system, including tokens, themes, and custom component configurations.

**Last Updated:** January 2025  
**Version:** 1.0

---

## TABLE OF CONTENTS

1. [Installation & Setup](#1-installation--setup)
2. [Token Configuration](#2-token-configuration)
3. [Theme Configuration](#3-theme-configuration)
4. [Custom Components](#4-custom-components)
5. [Usage Examples](#5-usage-examples)
6. [Migration from Plain RN](#6-migration-from-plain-rn)

---

## 1. INSTALLATION & SETUP

### Install Tamagui

```bash
# Core packages
npm install tamagui @tamagui/config

# Additional packages (recommended)
npm install @tamagui/animations-react-native
npm install react-native-reanimated
npm install react-native-svg
```

### Project Structure

```
src/
├── tamagui/
│   ├── config.ts              # Main Tamagui config
│   ├── tokens.ts              # Design tokens (colors, spacing, etc)
│   ├── themes.ts              # Light/dark themes
│   ├── media.ts               # Responsive breakpoints
│   ├── fonts.ts               # Font configurations
│   └── components/            # Custom styled components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── index.ts
│
├── app/
│   └── _layout.tsx            # Wrap with TamaguiProvider
│
└── ...
```

---

## 2. TOKEN CONFIGURATION

### Create `src/tamagui/tokens.ts`

```typescript
import { createTokens } from '@tamagui/core';

/**
 * Design Tokens - The foundation of your design system
 * These match the Parapluie design system values
 */

export const tokens = createTokens({
  // ========================================
  // COLORS
  // ========================================
  color: {
    // Brand Primary (Blue - from app icon)
    primary50: '#EFF6FF',
    primary100: '#DBEAFE',
    primary200: '#BFDBFE',
    primary300: '#93C5FD',
    primary400: '#60A5FA',
    primary500: '#3B82F6',  // MAIN BRAND COLOR (app icon blue) 💧
    primary600: '#2563EB',
    primary700: '#1D4ED8',
    primary800: '#1E40AF',
    primary900: '#1E3A8A',
    
    // Semantic Colors
    success: '#10B981',
    successLight: '#D1FAE5',
    successDark: '#059669',
    
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    warningDark: '#D97706',
    
    error: '#EF4444',
    errorLight: '#FEE2E2',
    errorDark: '#DC2626',
    
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    infoDark: '#2563EB',
    
    // Neutrals (Grays)
    white: '#FFFFFF',
    offWhite: '#FAFAFA',
    
    gray50: '#F9FAFB',
    gray100: '#F3F4F6',
    gray200: '#E5E7EB',
    gray300: '#D1D5DB',
    gray400: '#9CA3AF',
    gray500: '#6B7280',
    gray600: '#4B5563',
    gray700: '#374151',
    gray800: '#1F2937',
    gray900: '#111827',
    
    black: '#000000',
    
    // Transparent colors for overlays
    transparent: 'transparent',
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
  },

  // ========================================
  // SPACING (8pt grid system)
  // ========================================
  space: {
    0: 0,
    1: 4,     // xxs - 0.5 unit
    2: 8,     // xs - 1 unit
    3: 12,    // sm - 1.5 units
    4: 16,    // md - 2 units (BASE)
    5: 20,    // 2.5 units
    6: 24,    // lg - 3 units
    7: 28,    // 3.5 units
    8: 32,    // xl - 4 units
    9: 36,    // 4.5 units
    10: 40,   // 5 units
    11: 44,   // 5.5 units
    12: 48,   // xxl - 6 units
    14: 56,   // 7 units
    16: 64,   // xxxl - 8 units
    20: 80,   // 10 units
    24: 96,   // 12 units
    32: 128,  // 16 units
    
    // Named tokens (for semantic use)
    true: 16, // Default spacing
    
    // Aliases matching design system
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // ========================================
  // SIZE (for width/height)
  // ========================================
  size: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    32: 128,
    40: 160,
    48: 192,
    56: 224,
    64: 256,
    72: 288,
    80: 320,
    96: 384,
    
    // Named sizes
    true: 44, // Default interactive element size
    
    // Icon sizes
    iconXs: 16,
    iconSm: 20,
    iconMd: 24,
    iconLg: 32,
    iconXl: 48,
    iconXxl: 64,
    
    // Touch targets (senior-friendly, 56px minimum)
    buttonSm: 44,
    buttonMd: 56,  // PRIMARY BUTTON SIZE
    buttonLg: 64,
    
    // Avatar sizes
    avatarSm: 32,
    avatarMd: 48,
    avatarLg: 64,
    avatarXl: 96,
    avatarXxl: 120,
  },

  // ========================================
  // RADIUS (border radius)
  // ========================================
  radius: {
    0: 0,
    1: 4,    // xs
    2: 8,    // sm
    3: 12,   // md
    4: 16,   // lg
    5: 20,
    6: 24,   // xl
    7: 28,
    8: 32,   // xxl
    9: 36,
    10: 40,
    true: 12, // Default radius
    
    // Named radii
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    full: 999, // Circular
  },

  // ========================================
  // Z-INDEX (layering)
  // ========================================
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    
    // Named layers
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    fixed: 1200,
    modalBackdrop: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1600,
  },
});

export type Tokens = typeof tokens;
```

---

## 3. THEME CONFIGURATION

### Create `src/tamagui/themes.ts`

```typescript
import { createTheme } from '@tamagui/core';

/**
 * Theme Definitions
 * Maps token values to semantic names
 */

// Light theme (default)
const lightTheme = createTheme({
  // Background colors
  background: tokens.color.white,
  backgroundHover: tokens.color.gray50,
  backgroundPress: tokens.color.gray100,
  backgroundFocus: tokens.color.primary50,
  backgroundStrong: tokens.color.gray900,
  backgroundTransparent: tokens.color.transparent,
  
  // Surface colors (cards, panels)
  surface: tokens.color.white,
  surfaceHover: tokens.color.gray50,
  surfacePress: tokens.color.gray100,
  
  // Text colors
  color: tokens.color.gray900,         // Primary text
  colorHover: tokens.color.gray800,
  colorPress: tokens.color.gray700,
  colorFocus: tokens.color.primary500,
  colorTransparent: tokens.color.transparent,
  
  // Secondary text
  colorSecondary: tokens.color.gray600,
  colorTertiary: tokens.color.gray500,
  colorDisabled: tokens.color.gray400,
  
  // Border colors
  borderColor: tokens.color.gray300,
  borderColorHover: tokens.color.gray400,
  borderColorPress: tokens.color.gray500,
  borderColorFocus: tokens.color.primary500,
  
  // Primary brand colors
  primary: tokens.color.primary500,
  primaryHover: tokens.color.primary600,
  primaryPress: tokens.color.primary700,
  primaryFocus: tokens.color.primary500,
  
  // Semantic colors
  success: tokens.color.success,
  successBackground: tokens.color.successLight,
  
  warning: tokens.color.warning,
  warningBackground: tokens.color.warningLight,
  
  error: tokens.color.error,
  errorBackground: tokens.color.errorLight,
  
  info: tokens.color.info,
  infoBackground: tokens.color.infoLight,
  
  // Shadows
  shadowColor: tokens.color.black,
  shadowColorHover: tokens.color.black,
  shadowColorPress: tokens.color.black,
  shadowColorFocus: tokens.color.black,
});

// Dark theme (future)
const darkTheme = createTheme({
  // Background colors
  background: tokens.color.gray900,
  backgroundHover: tokens.color.gray800,
  backgroundPress: tokens.color.gray700,
  backgroundFocus: tokens.color.primary900,
  backgroundStrong: tokens.color.gray50,
  backgroundTransparent: tokens.color.transparent,
  
  // Surface colors
  surface: tokens.color.gray800,
  surfaceHover: tokens.color.gray700,
  surfacePress: tokens.color.gray600,
  
  // Text colors (inverted)
  color: tokens.color.gray50,
  colorHover: tokens.color.gray100,
  colorPress: tokens.color.gray200,
  colorFocus: tokens.color.primary400,
  colorTransparent: tokens.color.transparent,
  
  colorSecondary: tokens.color.gray300,
  colorTertiary: tokens.color.gray400,
  colorDisabled: tokens.color.gray600,
  
  // Border colors
  borderColor: tokens.color.gray700,
  borderColorHover: tokens.color.gray600,
  borderColorPress: tokens.color.gray500,
  borderColorFocus: tokens.color.primary500,
  
  // Primary brand (slightly lighter in dark mode)
  primary: tokens.color.primary400,
  primaryHover: tokens.color.primary500,
  primaryPress: tokens.color.primary600,
  primaryFocus: tokens.color.primary400,
  
  // Semantic colors (same as light)
  success: tokens.color.success,
  successBackground: tokens.color.successDark,
  
  warning: tokens.color.warning,
  warningBackground: tokens.color.warningDark,
  
  error: tokens.color.error,
  errorBackground: tokens.color.errorDark,
  
  info: tokens.color.info,
  infoBackground: tokens.color.infoDark,
  
  // Shadows
  shadowColor: tokens.color.black,
  shadowColorHover: tokens.color.black,
  shadowColorPress: tokens.color.black,
  shadowColorFocus: tokens.color.black,
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
```

---

## 4. FONTS CONFIGURATION

### Create `src/tamagui/fonts.ts`

```typescript
import { createFont } from '@tamagui/core';
import { Platform } from 'react-native';

/**
 * Font Configuration
 * Senior-friendly sizes (15% larger than standard)
 */

// System font (Roboto on Android, San Francisco on iOS)
export const systemFont = createFont({
  family: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  }),
  
  // Font sizes (senior-friendly, 15% larger)
  size: {
    1: 11,   // tiny
    2: 12,   // small
    3: 14,   // regular UI
    4: 16,   // body regular
    5: 18,   // body large (MOST USED)
    6: 20,   // h4
    7: 24,   // h3
    8: 28,   // h2
    9: 34,   // h1
    10: 38,  // display
    true: 18, // default (body large for seniors)
  },
  
  // Line heights (generous for readability)
  lineHeight: {
    1: 14,   // tight
    2: 16,   // 
    3: 20,   // normal
    4: 24,   // relaxed
    5: 28,   // 
    6: 32,   // 
    7: 36,   // 
    8: 40,   // 
    9: 48,   // loose
    10: 52,  // 
    true: 28, // default (1.6 ratio for size 18)
  },
  
  // Font weights
  weight: {
    1: '300',  // light (rarely used)
    2: '400',  // regular
    3: '500',  // medium
    4: '600',  // semibold
    5: '700',  // bold
    true: '400', // default
  },
  
  // Letter spacing
  letterSpacing: {
    1: -0.5,  // tight
    2: 0,     // normal
    3: 0.5,   // wide
    4: 1,     // wider
    true: 0,  // default
  },
  
  // Text transform (avoid UPPERCASE for seniors)
  transform: {
    none: 'none',
    uppercase: 'uppercase',
    lowercase: 'lowercase',
    capitalize: 'capitalize',
  },
  
  // Face definitions for custom fonts (if needed later)
  face: {
    400: { normal: 'Roboto' },
    500: { normal: 'Roboto-Medium' },
    700: { normal: 'Roboto-Bold' },
  },
});

// Heading font (same as body, just different weights)
export const headingFont = createFont({
  ...systemFont,
  weight: {
    1: '500',  // medium
    2: '600',  // semibold
    3: '700',  // bold
    true: '600', // default (semibold for headings)
  },
});

export const fonts = {
  heading: headingFont,
  body: systemFont,
};
```

---

## 5. MAIN CONFIG

### Create `src/tamagui/config.ts`

```typescript
import { createTamagui } from '@tamagui/core';
import { config as defaultConfig } from '@tamagui/config/v3';
import { tokens } from './tokens';
import { themes } from './themes';
import { fonts } from './fonts';

/**
 * Main Tamagui Configuration
 * Combines tokens, themes, and fonts
 */

export const config = createTamagui({
  ...defaultConfig,
  
  // Your custom tokens
  tokens,
  
  // Your custom themes
  themes,
  
  // Your custom fonts
  fonts,
  
  // Media queries (responsive design)
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
  
  // Animation settings
  animations: {
    fast: {
      type: 'timing',
      duration: 200,
    },
    normal: {
      type: 'timing',
      duration: 300,
    },
    slow: {
      type: 'timing',
      duration: 500,
    },
    verySlow: {
      type: 'timing',
      duration: 800, // Slower for seniors
    },
  },
  
  // Shorthands (optional but helpful)
  shorthands: {
    bg: 'backgroundColor',
    br: 'borderRadius',
    p: 'padding',
    pt: 'paddingTop',
    pr: 'paddingRight',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    m: 'margin',
    mt: 'marginTop',
    mr: 'marginRight',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    w: 'width',
    h: 'height',
    miw: 'minWidth',
    mih: 'minHeight',
    maw: 'maxWidth',
    mah: 'maxHeight',
    zi: 'zIndex',
    o: 'opacity',
    f: 'flex',
    fw: 'flexWrap',
    fd: 'flexDirection',
    ai: 'alignItems',
    jc: 'justifyContent',
    als: 'alignSelf',
    gap: 'gap',
    rowGap: 'rowGap',
    columnGap: 'columnGap',
  },
  
  // Settings
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
  },
});

// TypeScript type exports
export type AppConfig = typeof config;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
```

---

## 6. APP SETUP

### Wrap App with TamaguiProvider

```typescript
// app/_layout.tsx (Expo Router)
// OR
// App.tsx (React Native CLI)

import { TamaguiProvider } from '@tamagui/core';
import config from './tamagui/config';

export default function RootLayout() {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      {/* Your app content */}
      <YourAppNavigator />
    </TamaguiProvider>
  );
}
```

---

## 7. CUSTOM COMPONENTS

### Button Component

**Create `src/tamagui/components/Button.tsx`:**

```typescript
import { styled } from '@tamagui/core';
import { Button as TamaguiButton } from 'tamagui';

/**
 * Custom Button with Parapluie styles
 * Usage: <Button variant="primary">Click me</Button>
 */

export const Button = styled(TamaguiButton, {
  name: 'Button',
  
  // Base styles
  fontFamily: '$body',
  fontSize: '$5',        // 18px (body large)
  fontWeight: '600',     // Semibold
  borderRadius: '$md',   // 12px
  paddingVertical: '$4', // 16px
  paddingHorizontal: '$6', // 24px
  minHeight: '$buttonMd', // 56px (senior-friendly)
  
  // Animation
  animation: 'fast',
  
  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primaryPress',
          scale: 0.98,
        },
        focusStyle: {
          borderColor: '$primaryFocus',
          borderWidth: 2,
        },
        disabledStyle: {
          backgroundColor: '$gray200',
          color: '$gray400',
          opacity: 1, // Don't use opacity for disabled
        },
      },
      
      secondary: {
        backgroundColor: '$white',
        borderColor: '$primary',
        borderWidth: 2,
        color: '$primary',
        hoverStyle: {
          backgroundColor: '$primary50',
          borderColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primary100',
          borderColor: '$primaryPress',
          scale: 0.98,
        },
        focusStyle: {
          borderColor: '$primaryFocus',
          borderWidth: 3,
        },
        disabledStyle: {
          borderColor: '$gray200',
          color: '$gray400',
          opacity: 1,
        },
      },
      
      text: {
        backgroundColor: 'transparent',
        paddingVertical: '$3',  // Smaller
        paddingHorizontal: '$4',
        minHeight: '$buttonSm', // 44px
        color: '$primary',
        hoverStyle: {
          backgroundColor: '$primary50',
        },
        pressStyle: {
          backgroundColor: '$primary100',
        },
        disabledStyle: {
          color: '$gray400',
          backgroundColor: 'transparent',
        },
      },
      
      danger: {
        backgroundColor: '$error',
        color: '$white',
        hoverStyle: {
          backgroundColor: '$errorDark',
        },
        pressStyle: {
          backgroundColor: '$errorDark',
          scale: 0.98,
        },
        disabledStyle: {
          backgroundColor: '$gray200',
          color: '$gray400',
          opacity: 1,
        },
      },
    },
    
    size: {
      sm: {
        fontSize: '$3',          // 14px
        paddingVertical: '$3',   // 12px
        paddingHorizontal: '$4', // 16px
        minHeight: '$buttonSm',  // 44px
      },
      md: {
        // Default (already set above)
      },
      lg: {
        fontSize: '$6',          // 20px
        paddingVertical: '$5',   // 20px
        paddingHorizontal: '$8', // 32px
        minHeight: '$buttonLg',  // 64px
      },
    },
    
    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### Input Component

**Create `src/tamagui/components/Input.tsx`:**

```typescript
import { styled } from '@tamagui/core';
import { Input as TamaguiInput, YStack, Label, Text } from 'tamagui';

/**
 * Custom Input with Parapluie styles
 * Usage: <Input label="Email" />
 */

// Base input
export const InputBase = styled(TamaguiInput, {
  name: 'Input',
  
  // Base styles
  fontFamily: '$body',
  fontSize: '$5',        // 18px (body large)
  color: '$color',
  backgroundColor: '$white',
  borderWidth: 2,
  borderColor: '$borderColor',
  borderRadius: '$sm',   // 8px
  paddingVertical: '$4', // 16px
  paddingHorizontal: '$4',
  minHeight: '$buttonMd', // 56px
  
  // States
  focusStyle: {
    borderColor: '$primaryFocus',
    outlineWidth: 0,
  },
  
  hoverStyle: {
    borderColor: '$borderColorHover',
  },
  
  disabledStyle: {
    backgroundColor: '$gray100',
    color: '$gray400',
    opacity: 1,
  },
  
  variants: {
    error: {
      true: {
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
        },
      },
    },
  },
});

// Wrapper component with label and error
export const Input = ({
  label,
  error,
  helperText,
  ...props
}: any) => {
  return (
    <YStack space="$2">
      {label && (
        <Label
          fontSize="$2"
          fontWeight="500"
          color="$colorSecondary"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Label>
      )}
      
      <InputBase error={!!error} {...props} />
      
      {error && (
        <Text fontSize="$3" color="$error">
          {error}
        </Text>
      )}
      
      {!error && helperText && (
        <Text fontSize="$3" color="$colorTertiary">
          {helperText}
        </Text>
      )}
    </YStack>
  );
};
```

### Card Component

**Create `src/tamagui/components/Card.tsx`:**

```typescript
import { styled } from '@tamagui/core';
import { YStack } from 'tamagui';

/**
 * Custom Card with Parapluie styles
 * Usage: <Card>Content here</Card>
 */

export const Card = styled(YStack, {
  name: 'Card',
  
  // Base styles
  backgroundColor: '$surface',
  borderRadius: '$md',  // 12px
  padding: '$6',        // 24px
  
  // Shadow (iOS/Android)
  shadowColor: '$shadowColor',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 2, // Android
  
  // States
  hoverStyle: {
    backgroundColor: '$surfaceHover',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  pressStyle: {
    backgroundColor: '$surfacePress',
    scale: 0.99,
  },
  
  variants: {
    variant: {
      outlined: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowOpacity: 0,
        elevation: 0,
      },
      elevated: {
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    
    interactive: {
      true: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    },
  },
});
```

### Alert Component

**Create `src/tamagui/components/Alert.tsx`:**

```typescript
import { styled } from '@tamagui/core';
import { XStack, Text } from 'tamagui';

/**
 * Alert/Banner component
 * Usage: <Alert type="success">Operation successful!</Alert>
 */

export const Alert = styled(XStack, {
  name: 'Alert',
  
  // Base styles
  borderRadius: '$sm',
  padding: '$4',
  gap: '$3',
  alignItems: 'flex-start',
  borderLeftWidth: 4,
  
  variants: {
    type: {
      success: {
        backgroundColor: '$successBackground',
        borderLeftColor: '$success',
      },
      warning: {
        backgroundColor: '$warningBackground',
        borderLeftColor: '$warning',
      },
      error: {
        backgroundColor: '$errorBackground',
        borderLeftColor: '$error',
      },
      info: {
        backgroundColor: '$infoBackground',
        borderLeftColor: '$info',
      },
    },
  },
  
  defaultVariants: {
    type: 'info',
  },
});

export const AlertText = styled(Text, {
  fontSize: '$4',
  lineHeight: '$4',
  flex: 1,
});
```

---

## 8. USAGE EXAMPLES

### Basic Usage

```typescript
import { Button, Input, Card, Alert } from '@/tamagui/components';
import { YStack, XStack, Text, H1, H2 } from 'tamagui';

export function WelcomeScreen() {
  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      padding="$6"  // Uses token: 24px
      space="$6"    // Gap between children: 24px
    >
      {/* Heading */}
      <H1 color="$color">Bienvenue sur Parapluie</H1>
      
      {/* Card */}
      <Card>
        <H2>Protection activée</H2>
        <Text fontSize="$5" color="$colorSecondary">
          Walter surveille vos appels et messages.
        </Text>
      </Card>
      
      {/* Alert */}
      <Alert type="success">
        <AlertText>Votre compte est protégé!</AlertText>
      </Alert>
      
      {/* Form */}
      <Input
        label="Nom"
        placeholder="Votre nom"
      />
      
      <Input
        label="Email"
        placeholder="email@exemple.com"
        keyboardType="email-address"
      />
      
      {/* Buttons */}
      <Button variant="primary" fullWidth>
        Continuer
      </Button>
      
      <Button variant="secondary" fullWidth>
        Retour
      </Button>
    </YStack>
  );
}
```

### Using Tokens Directly

```typescript
import { YStack, Text } from 'tamagui';

export function MyComponent() {
  return (
    <YStack
      backgroundColor="$primary500"  // Token
      padding="$6"                   // 24px
      borderRadius="$md"             // 12px
      gap="$4"                       // 16px
    >
      <Text
        fontSize="$5"                // 18px
        fontWeight="600"
        color="$white"
      >
        Hello!
      </Text>
    </YStack>
  );
}
```

### Responsive Design

```typescript
import { YStack, Text } from 'tamagui';

export function ResponsiveComponent() {
  return (
    <YStack
      padding="$4"
      $gtSm={{         // On screens > 800px
        padding: '$8',
      }}
      $gtMd={{         // On screens > 1020px
        padding: '$12',
      }}
    >
      <Text
        fontSize="$5"
        $gtSm={{
          fontSize: '$6',  // Larger on bigger screens
        }}
      >
        Responsive text
      </Text>
    </YStack>
  );
}
```

### Themed Components

```typescript
import { YStack, useTheme } from 'tamagui';

export function ThemedComponent() {
  const theme = useTheme();
  
  // Access theme values
  console.log(theme.primary.val);  // '#3B82F6'
  console.log(theme.space6.val);   // 24
  
  return (
    <YStack backgroundColor="$primary">
      {/* Component content */}
    </YStack>
  );
}
```

---

## 9. MIGRATION CHECKLIST

### From Plain React Native to Tamagui

**Step 1: Install packages**
```bash
npm install tamagui @tamagui/config
```

**Step 2: Create config files**
- ✅ `tokens.ts` (copy from this guide)
- ✅ `themes.ts` (copy from this guide)
- ✅ `fonts.ts` (copy from this guide)
- ✅ `config.ts` (copy from this guide)

**Step 3: Wrap app**
```typescript
<TamaguiProvider config={config}>
  <YourApp />
</TamaguiProvider>
```

**Step 4: Replace components**
```typescript
// Before:
import { View, Text, TouchableOpacity } from 'react-native';

<View style={{ padding: 24, gap: 16 }}>
  <Text style={{ fontSize: 18 }}>Hello</Text>
  <TouchableOpacity style={...}>
    <Text>Button</Text>
  </TouchableOpacity>
</View>

// After:
import { YStack, Text } from 'tamagui';
import { Button } from '@/tamagui/components';

<YStack padding="$6" gap="$4">
  <Text fontSize="$5">Hello</Text>
  <Button>Button</Button>
</YStack>
```

**Step 5: Update custom components**
- Replace inline styles with Tamagui props
- Use tokens instead of hardcoded values
- Leverage variants for different states

---

## 10. BEST PRACTICES

### ✅ DO:

```typescript
// Use semantic tokens
<Button variant="primary" />  // Good
<Button backgroundColor="$primary" />  // Also good

// Use responsive props
<YStack padding="$4" $gtSm={{ padding: '$8' }} />

// Use variants for common patterns
<Card variant="elevated" />

// Use space prop for gaps
<YStack space="$4">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</YStack>
```

### ❌ DON'T:

```typescript
// Don't hardcode values
<Button backgroundColor="#3B82F6" />  // Bad
<Button backgroundColor="$primary" />  // Good

// Don't use inline styles when tokens exist
<Text style={{ fontSize: 18 }} />     // Bad
<Text fontSize="$5" />                // Good

// Don't mix RN View with Tamagui components
<View>                                // Bad
  <YStack />
</View>

<YStack>                              // Good
  <YStack />
</YStack>
```

---

## 11. DOCUMENTATION STRUCTURE

**Create this in your repo:**

```
/docs
├── design-system.md            # Original design system
├── tamagui-config.md          # This file
└── components/
    ├── button.md              # Button usage
    ├── input.md               # Input usage
    ├── card.md                # Card usage
    └── ...
```

**Add to `.claude/docs/content.md`:**

```markdown
# Parapluie Documentation

## Styling System
- We use Tamagui for styling
- Configuration in `/src/tamagui/`
- Design tokens match our design system
- See `/docs/tamagui-config.md` for setup

## Component Guidelines
- All components use Tamagui primitives
- Custom components in `/src/tamagui/components/`
- Follow senior-friendly sizing (larger text, bigger buttons)
- Use semantic tokens ($primary, $spacing, etc)

## Adding New Components
1. Create in `/src/tamagui/components/`
2. Use `styled()` to extend Tamagui components
3. Add variants for different states
4. Document in `/docs/components/`
```

---

## 12. QUICK REFERENCE

### Common Token Usage:

```typescript
// Colors
backgroundColor="$primary"
backgroundColor="$white"
color="$gray900"
borderColor="$gray300"

// Spacing
padding="$6"      // 24px
margin="$4"       // 16px
gap="$4"          // 16px

// Sizes
width="$buttonMd"   // 56px
height="$iconLg"    // 32px

// Radius
borderRadius="$md"  // 12px
borderRadius="$full" // Circular

// Typography
fontSize="$5"      // 18px (body large)
fontWeight="600"   // Semibold
lineHeight="$5"    // 28px
```

### Component Mapping:

```typescript
// React Native → Tamagui
View          → YStack (vertical) / XStack (horizontal) / ZStack (layered)
Text          → Text / Paragraph / H1-H6
TouchableOpacity → Button (with variants)
TextInput     → Input
ScrollView    → ScrollView (same)
Image         → Image (same)
```

---

## SUMMARY

**You now have:**
✅ Tamagui config matching your design system  
✅ Senior-friendly tokens (larger sizes)  
✅ Custom components (Button, Input, Card, Alert)  
✅ Type-safe styling  
✅ Performance optimized  
✅ Dark mode ready  
✅ Responsive by default  

**Your icon blue (`#3B82F6`) is now `$primary` everywhere!** 💧

---

## NEXT STEPS

1. Copy config files to your project
2. Wrap app with TamaguiProvider
3. Start using components
4. Refactor existing screens gradually
5. Add your custom components in screenshots to `/tamagui/components/`

**Let me know if you need help with any specific component!** 🚀