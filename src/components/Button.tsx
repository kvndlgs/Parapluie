import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export interface ButtonProps {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'lg',
  loading = false,
  disabled,
  onPress,
  children,
}: ButtonProps) {
  const sizeStyles = {
    sm: { height: 40, paddingHorizontal: 16 },
    md: { height: 48, paddingHorizontal: 20 },
    lg: { height: 56, paddingHorizontal: 24 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[size],
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? 'white' : '#6366f1'} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.primaryText,
            variant === 'ghost' && styles.ghostText,
            { fontSize: size === 'sm' ? 14 : size === 'md' ? 16 : 18 },
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#6366f1',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  ghostText: {
    color: '#a1a1aa',
  },
});
