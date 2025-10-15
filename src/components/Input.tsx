import React from 'react';
import { TextInput, View, StyleSheet, TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        {...props}
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        placeholderTextColor="#a1a1aa"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#d4d4d8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#18181b',
  },
  inputError: {
    borderColor: '#ef4444',
  },
});
