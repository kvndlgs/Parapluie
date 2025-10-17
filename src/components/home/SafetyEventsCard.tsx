import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThreatLevel } from '../../types';

interface SafetyEventsCardProps {
  stats: {
    callsBlockedToday: number;
    messagesBlockedToday: number;
    threatsDetected: number;
    highestThreatLevel: ThreatLevel;
  };
  onViewAll: () => void;
}


export function SafetyEventsCard({ stats, onViewAll }: SafetyEventsCardProps) {
  const getThreatLevelColor = (level: ThreatLevel) => {
    switch (level) {
      case ThreatLevel.NONE: return 'hsl(145, 87%, 73%)';
      case ThreatLevel.LOW: return 'hsl(145, 87%, 43%)';
      case ThreatLevel.MEDIUM: return 'hsl(36, 97%, 77%)';
      case ThreatLevel.HIGH: return 'hsl(36, 97%, 57%)';
      case ThreatLevel.CRITICAL: return 'hsl(340, 72%, 57%)';
      default: return 'hsl(300, 15%, 88%)';
    }
  };

  const getThreatLevelLabel = (level: ThreatLevel) => {
    switch (level) {
      case ThreatLevel.NONE: return 'Aucune menace';
      case ThreatLevel.LOW: return 'Risque faible';
      case ThreatLevel.MEDIUM: return 'Risque modéré';
      case ThreatLevel.HIGH: return 'Risque élevé';
      case ThreatLevel.CRITICAL: return 'Risque critique';
      default: return '';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}><Text style={{ fontFamily: 'MaterialSymbols_300Light', fontSize: 26 }}>history</Text>Événements de sécurité</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.callsBlockedToday}</Text>
          <Text style={styles.statLabel}>Appels bloqués</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.messagesBlockedToday}</Text>
          <Text style={styles.statLabel}>Messages bloqués</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: getThreatLevelColor(stats.highestThreatLevel) }]}>
            {stats.threatsDetected}
          </Text>
          <Text style={styles.statLabel}>Menaces détectées</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
        <Text style={styles.viewAllText}>Voir tous les événements →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Monument-Regular',
    fontSize: 18,
    color: '#6F526F',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Monument-Regular',
    fontSize: 11,
    color: '#000',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Monument-Black',
    fontSize: 32,
    color: '#785978',
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Monument-Light',
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  viewAllText: {
    fontFamily: 'Monument-Regular',
    fontSize: 14,
    color: '#6F526F',
  },
});
