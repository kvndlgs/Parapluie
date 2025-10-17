import React from 'react';
import { styled } from '@tamagui/core';
import { Input as TamaguiInput, YStack, Label, Text } from 'tamagui';

/**
 * Custom Input with Parapluie styles
 * Usage: <Input label="Email" />
 */

// Base input
export const InputBase = styled(TamaguiInput, {
  name: 'Input',

  // Base styles
  fontFamily: '$body',
  fontSize: '$5',        // 18px (body large)
  color: '$color',
  backgroundColor: '$white',
  borderWidth: 2,
  borderColor: '$borderColor',
  borderRadius: '$sm',   // 8px
  paddingVertical: '$4', // 16px
  paddingHorizontal: '$4',
  minHeight: '$buttonMd', // 56px

  // States
  focusStyle: {
    borderColor: '$primaryFocus',
    outlineWidth: 0,
  },

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  disabledStyle: {
    backgroundColor: '$gray100',
    color: '$gray400',
    opacity: 1,
  },

  variants: {
    error: {
      true: {
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
        },
      },
    },
  },
});

// Wrapper component with label and error
export const Input = ({
  label,
  error,
  helperText,
  ...props
}: any) => {
  return (
    <YStack space="$2">
      {label && (
        <Label
          fontSize="$2"
          fontWeight="500"
          color="$colorSecondary"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Label>
      )}

      <InputBase error={!!error} {...props} />

      {error && (
        <Text fontSize="$3" color="$error">
          {error}
        </Text>
      )}

      {!error && helperText && (
        <Text fontSize="$3" color="$colorTertiary">
          {helperText}
        </Text>
      )}
    </YStack>
  );
};
