import { createTheme } from '@tamagui/core';
import { tokens } from './tokens';

/**
 * Theme Definitions
 * Maps token values to semantic names
 */

// Light theme (default)
const lightTheme = createTheme({
  // Background colors
  background: tokens.color.white,
  backgroundHover: tokens.color.gray50,
  backgroundPress: tokens.color.gray100,
  backgroundFocus: tokens.color.primary50,
  backgroundStrong: tokens.color.gray900,
  backgroundTransparent: tokens.color.transparent,

  // Surface colors (cards, panels)
  surface: tokens.color.white,
  surfaceHover: tokens.color.gray50,
  surfacePress: tokens.color.gray100,

  // Text colors
  color: tokens.color.gray900,         // Primary text
  colorHover: tokens.color.gray800,
  colorPress: tokens.color.gray700,
  colorFocus: tokens.color.primary500,
  colorTransparent: tokens.color.transparent,

  // Secondary text
  colorSecondary: tokens.color.gray600,
  colorTertiary: tokens.color.gray500,
  colorDisabled: tokens.color.gray400,

  // Border colors
  borderColor: tokens.color.gray300,
  borderColorHover: tokens.color.gray400,
  borderColorPress: tokens.color.gray500,
  borderColorFocus: tokens.color.primary500,

  // Primary brand colors
  primary: tokens.color.primary500,
  primaryHover: tokens.color.primary600,
  primaryPress: tokens.color.primary700,
  primaryFocus: tokens.color.primary500,

  // Semantic colors
  success: tokens.color.success,
  successBackground: tokens.color.successLight,

  warning: tokens.color.warning,
  warningBackground: tokens.color.warningLight,

  error: tokens.color.error,
  errorBackground: tokens.color.errorLight,

  info: tokens.color.info,
  infoBackground: tokens.color.infoLight,

  // Shadows
  shadowColor: tokens.color.black,
  shadowColorHover: tokens.color.black,
  shadowColorPress: tokens.color.black,
  shadowColorFocus: tokens.color.black,
});

// Dark theme (future)
const darkTheme = createTheme({
  // Background colors
  background: tokens.color.gray900,
  backgroundHover: tokens.color.gray800,
  backgroundPress: tokens.color.gray700,
  backgroundFocus: tokens.color.primary900,
  backgroundStrong: tokens.color.gray50,
  backgroundTransparent: tokens.color.transparent,

  // Surface colors
  surface: tokens.color.gray800,
  surfaceHover: tokens.color.gray700,
  surfacePress: tokens.color.gray600,

  // Text colors (inverted)
  color: tokens.color.gray50,
  colorHover: tokens.color.gray100,
  colorPress: tokens.color.gray200,
  colorFocus: tokens.color.primary400,
  colorTransparent: tokens.color.transparent,

  colorSecondary: tokens.color.gray300,
  colorTertiary: tokens.color.gray400,
  colorDisabled: tokens.color.gray600,

  // Border colors
  borderColor: tokens.color.gray700,
  borderColorHover: tokens.color.gray600,
  borderColorPress: tokens.color.gray500,
  borderColorFocus: tokens.color.primary500,

  // Primary brand (slightly lighter in dark mode)
  primary: tokens.color.primary400,
  primaryHover: tokens.color.primary500,
  primaryPress: tokens.color.primary600,
  primaryFocus: tokens.color.primary400,

  // Semantic colors (same as light)
  success: tokens.color.success,
  successBackground: tokens.color.successDark,

  warning: tokens.color.warning,
  warningBackground: tokens.color.warningDark,

  error: tokens.color.error,
  errorBackground: tokens.color.errorDark,

  info: tokens.color.info,
  infoBackground: tokens.color.infoDark,

  // Shadows
  shadowColor: tokens.color.black,
  shadowColorHover: tokens.color.black,
  shadowColorPress: tokens.color.black,
  shadowColorFocus: tokens.color.black,
});

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
