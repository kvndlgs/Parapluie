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
  }) as string,

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
