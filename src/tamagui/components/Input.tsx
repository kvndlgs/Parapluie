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
  fontFamily: '$body' as any,
  fontSize: '$5' as any,        // 18px (body large)
  color: '$color' as any,
  backgroundColor: '$white' as any,
  borderWidth: 2 as any,
  borderColor: '$borderColor' as any,
  borderRadius: '$sm' as any,   // 8px
  paddingVertical: '$4' as any, // 16px
  paddingHorizontal: '$4' as any,
  minHeight: '$buttonMd' as any, // 56px

  // States
  focusStyle: {
    borderColor: '$primaryFocus' as any,
    outlineWidth: 0 as any,
  } as any,

  hoverStyle: {
    borderColor: '$borderColorHover' as any,
  } as any,

  disabledStyle: {
    backgroundColor: '$gray100' as any,
    color: '$gray400' as any,
    opacity: 1 as any,
  } as any,

  variants: {
    error: {
      true: {
        borderColor: '$error' as any,
        focusStyle: {
          borderColor: '$error' as any,
        } as any,
      } as any,
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
    <YStack space="$2" {...({} as any)}>
      {label && (
        <Label
          fontSize="$2"
          fontWeight="500"
          color="$colorSecondary"
          textTransform="uppercase"
          letterSpacing={0.5}
          {...({} as any)}
        >
          {label}
        </Label>
      )}

      <InputBase error={!!error} {...props} />

      {error && (
        <Text fontSize="$3" color="$error" {...({} as any)}>
          {error}
        </Text>
      )}

      {!error && helperText && (
        <Text fontSize="$3" color="$colorTertiary" {...({} as any)}>
          {helperText}
        </Text>
      )}
    </YStack>
  );
};
