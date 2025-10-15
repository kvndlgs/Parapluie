import { createTamagui, createTokens, createFont } from '@tamagui/core';
import { shorthands } from '@tamagui/shorthands';
import { themes, tokens as defaultTokens } from '@tamagui/themes';

const MonumentNormal = createFont({
  family: 'PPMonumentNormal',
  size: {
    1: 11,
    2: 12,
    3: 16,
    4: 18,
    5: 20,
    6: 24
  },
  weight: {1: '400', 2: '900'},
  face: {
    '400': {
      normal: 'PPMonumentNormal'
    },
    '900': {
      normal: 'PPMonumentNormalBlack'
  },
});



const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
  },
  space: defaultTokens.space,
  size: defaultTokens.size,
  radius: defaultTokens.radius,
  zIndex: defaultTokens.zIndex,
});

const config = createTamagui({
  tokens,
  themes,
  defaultFont: 'body',
  fonts: {
    body: MonumentNormal,
    heading: MonumentNormal,
  },
  shorthands,
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
  },
});

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
