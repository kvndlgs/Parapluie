import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes as defaultThemes } from '@tamagui/themes';
import { createAnimations } from '@tamagui/animations-react-native';

// Import custom configuration
import { tokens } from './src/tamagui/tokens';
import { themes } from './src/tamagui/themes';
import { fonts } from './src/tamagui/fonts';

/**
 * Main Tamagui Configuration
 * This file is in the root to ensure it's loaded before any components
 */

const animations = createAnimations({
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
    duration: 800,
  },
});

const tamaguiConfig = createTamagui({
  tokens,
  themes: {
    ...defaultThemes,
    ...themes,
  },
  fonts,
  animations,
  shorthands,
  defaultFont: 'body',
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 661 },
    gtSm: { minWidth: 801 },
    gtMd: { minWidth: 1021 },
    gtLg: { minWidth: 1281 },
  },
  settings: {
    allowedStyleValues: 'somewhat-strict',
    autocompleteSpecificTokens: 'except-special',
  },
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
