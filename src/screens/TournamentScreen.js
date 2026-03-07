import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import TournamentCard from '../components/TournamentCard';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TournamentScreen = () => {
  // Mock tournament data - replace with API data later
  const [tournaments] = useState([
    {
      id: 1,
      name: 'Australian Open',
      date: 'January 14-28, 2024',
      surface: 'Hard Court',
      status: 'Upcoming',
      userPoints: 0,
    },
    {
      id: 2,
      name: 'French Open',
      date: 'May 26 - June 9, 2024',
      surface: 'Clay',
      status: 'Upcoming',
      userPoints: 0,
    },
    {
      id: 3,
      name: 'Wimbledon',
      date: 'July 1-14, 2024',
      surface: 'Grass',
      status: 'Upcoming',
      userPoints: 0,
    },
    {
      id: 4,
      name: 'US Open',
      date: 'August 26 - September 8, 2024',
      surface: 'Hard Court',
      status: 'Upcoming',
      userPoints: 0,
    },
  ]);

  const handleTournamentPress = (tournament) => {
    // Navigation to tournament details will be added later
    console.log('Selected tournament:', tournament.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grand Slams</Text>
        <Text style={styles.subtitle}>Track your performance across major tournaments</Text>
      </View>

      <FlatList
        data={tournaments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TournamentCard
            tournament={item}
            onPress={() => handleTournamentPress(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SIZES.large,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: FONTS.size.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  subtitle: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
  },
  listContent: {
    padding: SIZES.medium,
  },
});

export default TournamentScreen;