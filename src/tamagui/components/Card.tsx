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
  shadowOffset: { width: 0, height: 2 } as any,
  shadowOpacity: 0.1 as any,
  shadowRadius: 4 as any,
  elevation: 2, // Android

  // States
  hoverStyle: {
    backgroundColor: '$surfaceHover',
    shadowOpacity: 0.15 as any,
    shadowRadius: 8 as any,
    elevation: 4,
  } as any,

  pressStyle: {
    backgroundColor: '$surfacePress',
    scale: 0.99,
  },

  variants: {
    variant: {
      outlined: {
        backgroundColor: 'transparent' as any,
        borderWidth: 1,
        borderColor: '$borderColor',
        shadowOpacity: 0 as any,
        elevation: 0,
      } as any,
      elevated: {
        shadowOpacity: 0.15 as any,
        shadowRadius: 8 as any,
        elevation: 4,
      } as any,
    },

    interactive: {
      true: {
        cursor: 'pointer' as any,
        userSelect: 'none' as any,
      } as any,
    },
  },
});
