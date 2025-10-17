import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderSectionProps {
  userName: string;
  currentDate: Date;
  protectionStatus: 'active' | 'paused' | 'disabled';
}

export function HeaderSection({ userName, currentDate, protectionStatus }: HeaderSectionProps) {
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('fr-CA', options);
  };

  const getStatusColor = () => {
    switch (protectionStatus) {
      case 'active': return 'hsl(145, 87%, 67%)';
      case 'paused': return 'hsl(36, 97%, 56%)';
      case 'disabled': return 'hsl(300, 15%, 77%)';
      default: return 'hsl(300, 15%, 88%)';
    }
  };

  const getStatusText = () => {
    switch (protectionStatus) {
      case 'active': return 'Protection activée';
      case 'paused': return 'Protection en pause';
      case 'disabled': return 'Protection désactivée';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Bonjour, {userName}!</Text>
      <Text style={styles.date}>{formatDate(currentDate)}</Text>
      <View style={styles.statusContainer}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60, // Account for status bar
    backgroundColor: 'hsl(300, 15%, 98%)',
  },
  greeting: {
    fontFamily: 'Monument-Regular',
    fontSize: 28,
    color: '#6F526F',
    marginBottom: 8,
  },
  date: {
    fontFamily: 'Monument-Light',
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Monument-Regular',
    fontSize: 13,
    color: '#6F526F',
  },
});
