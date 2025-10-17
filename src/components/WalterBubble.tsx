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
    backgroundColor: '#6F526F',
    borderRadius:16,
    padding: 20,
    width: '100%',
  },
  text: {
    fontFamily: 'Monument-Regular',
    fontSize: 18,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '400',
  },
});
