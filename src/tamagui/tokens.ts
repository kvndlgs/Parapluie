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
    // Brand Primary (Purple - from app icon)
    primary50: '#EFEBFF',
    primary100: '#D7CCFF',
    primary200: '#BFDBFE',
    primary300: '#8667FE',
    primary400: '#5E35FD',
    primary500: '#3602FD', 
    primary600: '#2B02CA',
    primary700: '#200198',
    primary800: '#160165',
    primary900: '#0B0033',

    // Base Colors
    base50: 'hsl(300, 15%, 98%)',
    base100: 'hsl(300, 15%, 92%)',
    base200: 'hsl(300, 15%, 88%)',
    base300: 'hsl(300, 15%, 70%)',
    base400: 'hsl(300, 15%, 50%)',
    base500: 'hsl(300, 15%, 40%)',
    base600: 'hsl(300, 15%, 30%)',
    base700: 'hsl(300, 15%, 20%)',
    base800: 'hsl(300, 15%, 10%)',
    base900: 'hsl(300, 15%, 5%)',


    // Accent Colors
      accent50: 'hsl(202, 95%, 96%)',
      accent100: 'hsl(202, 95%, 89%)',
      accent200: 'hsl(202, 95%, 78%)',
      accent300: 'hsl(202, 95%, 68%)',
      accent400: 'hsl(202, 95%, 60%)',
      accent500: 'hsl(202, 95%, 54%)',
      accent600: 'hsl(202, 95%, 43%)',
      accent700: 'hsl(202, 95%, 38%)',
      accent800: 'hsl(202, 95%, 20%)',
      accent900: 'hsl(202, 95%, 14%)',


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
