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
