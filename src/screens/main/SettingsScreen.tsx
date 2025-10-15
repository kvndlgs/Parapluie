import React from 'react';
import { View, Text } from 'react-native';

export function SettingsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'Monument-Regular' }}>
        Paramètres
      </Text>
    </View>
  );
}
