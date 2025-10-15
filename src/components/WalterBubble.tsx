import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

export interface WalterBubbleProps {
  imageSrc: any;
  message: string;
}

export function WalterBubble({ imageSrc, message }: WalterBubbleProps) {
  return (
    <View style={styles.container}>
      {/* Walter Image */}
      <Image
        source={imageSrc}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Speech Bubble */}
      <View style={styles.bubble}>
        <Text style={styles.text}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    gap: 24,
  },
  image: {
    width: 120,
    height: 'auto',
  },
  bubble: {
    backgroundColor: 'hsl(300, 15%, 26%)',
    borderRadius: 24,
    padding: 20,
    maxWidth: 320,
    shadowColor: 'hsl(200, 15%, 20%)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
});
