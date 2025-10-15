import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {/* Tab Bar Background */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const isFocused = state.index === index;

          // Skip the Walter tab (middle position)
          if (index === 2) return null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={styles.tab}
            >
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {typeof label === 'string' ? label : 'Tab'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Elevated Walter Button */}
      <TouchableOpacity
        style={styles.walterButton}
        onPress={() => {
          // TODO: Open Walter chat modal
          console.log('Walter pressed');
        }}
        activeOpacity={0.8}
      >
        <View style={styles.walterCircle}>
          <Text style={styles.walterEmoji}>👨‍💼</Text>
        </View>
        <Text style={styles.walterLabel}>Walter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    color: '#666',
    fontSize: 12,
    fontFamily: 'Monument-Regular',
  },
  tabLabelActive: {
    color: '#785978',
  },
  walterButton: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -35,
    alignItems: 'center',
  },
  walterCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#785978',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#785978',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  walterEmoji: {
    fontSize: 32,
  },
  walterLabel: {
    color: '#785978',
    fontSize: 11,
    fontFamily: 'Monument-Regular',
    marginTop: 4,
  },
});
