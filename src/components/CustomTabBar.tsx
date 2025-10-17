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

          // Skip the Walter tab (middle position, index 1)
          if (index === 1) return null;

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
          <Text style={styles.walterEmoji}>microphone</Text>
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
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#ABABAB',
  },
  tab: {
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  tabIcon: {
    fontFamily: 'MaterialSymbols_300Light',
    fontSize: 24,
    color: '#6F526F',
  },
  tabLabel: {
    color: '#6F526F',
    fontSize: 13,
    fontFamily: 'Monument-Regular',
  },
  tabIconActive: {
    color: '#8869FE',
  },
  tabLabelActive: {
    color: '#8869FE',
  },
  walterButton: {
    position: 'absolute',
    top: -30,
    left: '50%',
    marginLeft: -35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walterCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8869FE',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: 'hsla(300, 15%, 10%, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  walterEmoji: {
    fontFamily: 'MaterialSymbols_300Light',
    alignSelf: 'center',
    marginTop: 12,
    marginLeft: 28,
    color: '#FFF',
    fontSize: 36,
    width: '100%',
  },
  walterLabel: {
    color: '#6F526F',
    fontSize: 13,
    fontFamily: 'Monument-Regular',
    marginTop: 5,
  },
});
