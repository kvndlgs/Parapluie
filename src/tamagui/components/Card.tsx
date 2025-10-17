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
