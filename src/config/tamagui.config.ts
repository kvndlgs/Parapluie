import { createTamagui } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes as defaultThemes } from '@tamagui/themes';
import { createAnimations } from '@tamagui/animations-react-native';

// Import your custom design system
import { tokens } from '../tamagui/tokens';
import { themes } from '../tamagui/themes';
import { fonts } from '../tamagui/fonts';

// Animations for smooth interactions (senior-friendly)
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
    duration: 800, // Slower for seniors
  },
});

const config = createTamagui({
  tokens,
  themes: {
    ...defaultThemes,
    ...themes,
  },
  fonts,
  animations,
  defaultFont: 'body',
  shorthands,
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

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
