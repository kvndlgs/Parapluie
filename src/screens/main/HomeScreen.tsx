import React, { useState } from 'react';
import { View, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { HeaderSection } from '../../components/home/HeaderSection';
import { SafetyEventsCard } from '../../components/home/SafetyEventsCard';
import { UpcomingEventsCard } from '../../components/home/UpcomingEventsCard';
import { ThreatLevel } from '../../types';
import type { CalendarEvent } from '../../types';

export function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - will be replaced with Redux/API data later
  const mockStats = {
    callsBlockedToday: 3,
    messagesBlockedToday: 1,
    threatsDetected: 2,
    highestThreatLevel: ThreatLevel.MEDIUM,
  };

  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      userId: 'user-1',
      title: 'Rendez-vous médical',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      type: 'appointment' as any,
      location: 'Clinique St-Laurent',
      isRecurring: false,
      createdBy: 'user',
    },
    {
      id: '2',
      userId: 'user-1',
      title: 'Prendre médicaments',
      startTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
      endTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString(),
      type: 'medication' as any,
      isRecurring: true,
      createdBy: 'user',
    },
    {
      id: '3',
      userId: 'user-1',
      title: 'Bingo communautaire',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
      type: 'social' as any,
      location: 'Centre communautaire',
      isRecurring: false,
      createdBy: 'user',
    },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Fetch data from API
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleViewAllEvents = () => {
    // TODO: Navigate to Safety screen
    console.log('Navigate to Safety events');
  };

  const handleViewCalendar = () => {
    // TODO: Navigate to Calendar screen
    console.log('Navigate to Calendar');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#785978"
          />
        }
      >
        <HeaderSection
          userName="Marie"
          currentDate={new Date()}
          protectionStatus="active"
        />

        <SafetyEventsCard
          stats={mockStats}
          onViewAll={handleViewAllEvents}
        />

        <UpcomingEventsCard
          events={mockEvents}
          onViewCalendar={handleViewCalendar}
        />

        {/* TODO: Add WalterQuickAccess */}
        {/* TODO: Add LocalNewsSection */}
        {/* TODO: Add CommunityActivitiesSection */}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
});
