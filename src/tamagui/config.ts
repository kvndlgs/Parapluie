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
