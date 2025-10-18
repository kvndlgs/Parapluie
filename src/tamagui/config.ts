import { createTamagui } from '@tamagui/core';
import { config as defaultConfig } from '@tamagui/config/v3';
import { createAnimations } from '@tamagui/animations-react-native';
import { tokens } from './tokens';
import { themes } from './themes';
import { fonts } from './fonts';

/**
 * Main Tamagui Configuration
 * Combines tokens, themes, and fonts
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
    duration: 800, // Slower for seniors
  },
});

export const config = createTamagui({
  ...defaultConfig,

  // Your custom tokens
  tokens,

  // Your custom themes
  themes,

  // Your custom fonts
  fonts,

  // Animation settings
  animations,

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
  } as const,

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
