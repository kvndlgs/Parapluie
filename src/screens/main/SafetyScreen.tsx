import React from 'react';
import { View, Text } from 'react-native';

export function SafetyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'hsl(300, 15%, 97%)', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#6F526F', fontSize: 24, fontFamily: 'Monument-Regular' }}>
        Sécurité
      </Text>
    </View>
  );
}
