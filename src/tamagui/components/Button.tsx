import { styled } from '@tamagui/core';
import { Button as TamaguiButton } from 'tamagui';

/**
 * Custom Button with Parapluie styles
 * Usage: <Button variant="primary">Click me</Button>
 */

// @ts-ignore - Tamagui type conflicts
export const Button = styled(TamaguiButton, {
  name: 'Button',

  // Base styles
  fontFamily: '$body',
  fontSize: '$5',        // 18px (body large)
  fontWeight: '600',     // Semibold
  borderRadius: '$md',   // 12px
  paddingVertical: '$4', // 16px
  paddingHorizontal: '$6', // 24px
  minHeight: '$buttonMd', // 56px (senior-friendly)

  // Animation
  animation: 'fast',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        color: '$white',
        hoverStyle: {
          backgroundColor: '$primaryHover',
        },
        pressStyle: {
          backgroundColor: '$primaryPress',
          scale: 0.98,
        },
        focusStyle: {
          borderColor: '$primaryFocus',
          borderWidth: 2,
        },
        disabledStyle: {
          backgroundColor: '$gray200',
          color: '$gray400',
          opacity: 1, // Don't use opacity for disabled
        },
      },

      secondary: {
        backgroundColor: '$accentLight',
        borderColor: '$accentDark',
        borderWidth: 2,
        color: '$white',
        hoverStyle: {
          backgroundColor: '$accent400',
          borderColor: '$accentDark',
        },
        pressStyle: {
          backgroundColor: '$primary100',
          borderColor: '$primaryPress',
          scale: 0.98,
        },
        focusStyle: {
          borderColor: '$primaryFocus',
          borderWidth: 3,
        },
        disabledStyle: {
          borderColor: '$gray200',
          color: '$gray400',
          opacity: 1,
        },
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        color: '$base300',
      },
      text: {
        backgroundColor: 'transparent',
        paddingVertical: '$3',  // Smaller
        paddingHorizontal: '$4',
        minHeight: '$buttonSm', // 44px
        color: '$base700',
        hoverStyle: {
          backgroundColor: '$primary50',
        },
        pressStyle: {
          backgroundColor: '$primary100',
        },
        disabledStyle: {
          color: '$gray400',
          backgroundColor: 'transparent',
        },
      },

      danger: {
        backgroundColor: '$error',
        color: '$white',
        hoverStyle: {
          backgroundColor: '$errorDark',
        },
        pressStyle: {
          backgroundColor: '$errorDark',
          scale: 0.98,
        },
        disabledStyle: {
          backgroundColor: '$gray200',
          color: '$gray400',
          opacity: 1,
        },
      },
    },

    size: {
      sm: {
        fontSize: '$3',          // 14px
        paddingVertical: '$3',   // 12px
        paddingHorizontal: '$4', // 16px
        minHeight: '$buttonSm',  // 44px
      },
      md: {
        // Default (already set above)
      },
      lg: {
        fontSize: '$6',          // 20px
        paddingVertical: '$5',   // 20px
        paddingHorizontal: '$8', // 32px
        minHeight: '$buttonLg',  // 64px
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
