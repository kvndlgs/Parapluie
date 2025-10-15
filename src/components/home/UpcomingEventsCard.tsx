import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CalendarEvent } from '../../types';

interface UpcomingEventsCardProps {
  events: CalendarEvent[];
  onViewCalendar: () => void;
}

export function UpcomingEventsCard({ events, onViewCalendar }: UpcomingEventsCardProps) {
  const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Aujourd'hui";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-CA', { weekday: 'short', day: 'numeric', month: 'short' });
    }
  };

  const getCategoryEmoji = (type: string) => {
    switch (type) {
      case 'appointment': return '🏥';
      case 'medication': return '💊';
      case 'social': return '🎉';
      case 'prescription': return '📋';
      default: return '📅';
    }
  };

  if (events.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Prochains événements</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun événement à venir</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prochains événements</Text>
        <TouchableOpacity onPress={onViewCalendar}>
          <Text style={styles.viewAllText}>Voir tout →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {events.slice(0, 5).map((event) => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventEmoji}>{getCategoryEmoji(event.type)}</Text>
            <Text style={styles.eventTime}>{formatTime(event.startTime)}</Text>
            <Text style={styles.eventDate}>{formatDate(event.startTime)}</Text>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            {event.location && (
              <Text style={styles.eventLocation} numberOfLines={1}>
                📍 {event.location}
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Monument-Regular',
    fontSize: 18,
    color: '#fff',
  },
  viewAllText: {
    fontFamily: 'Monument-Regular',
    fontSize: 13,
    color: '#785978',
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  eventCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    width: 160,
    borderWidth: 1,
    borderColor: '#333',
  },
  eventEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  eventTime: {
    fontFamily: 'Monument-Black',
    fontSize: 18,
    color: '#785978',
    marginBottom: 2,
  },
  eventDate: {
    fontFamily: 'Monument-Light',
    fontSize: 11,
    color: '#999',
    marginBottom: 8,
  },
  eventTitle: {
    fontFamily: 'Monument-Regular',
    fontSize: 13,
    color: '#fff',
    marginBottom: 6,
  },
  eventLocation: {
    fontFamily: 'Monument-Light',
    fontSize: 11,
    color: '#666',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: 'Monument-Light',
    fontSize: 14,
    color: '#666',
  },
});
