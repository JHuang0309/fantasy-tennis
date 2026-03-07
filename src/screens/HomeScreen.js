import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlayers } from '../store/playersSlice';
import { addPlayerToSquad, removePlayerFromSquad } from '../store/squadSlice';
import PlayerCard from '../components/PlayerCard';
import { COLORS, SIZES, FONTS, BUDGET } from '../constants/theme';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { list: players, loading } = useSelector((state) => state.players);
  const { players: squadPlayers, totalSpent } = useSelector((state) => state.squad);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // For now, using mock data. Replace with: dispatch(fetchPlayers());
    // Mock data for testing
    const mockPlayers = [
      { id: 1, name: 'Novak Djokovic', rank: 1, country: 'Serbia', price: 10000000, points: 0 },
      { id: 2, name: 'Carlos Alcaraz', rank: 2, country: 'Spain', price: 9500000, points: 0 },
      { id: 3, name: 'Daniil Medvedev', rank: 3, country: 'Russia', price: 8500000, points: 0 },
      { id: 4, name: 'Jannik Sinner', rank: 4, country: 'Italy', price: 8000000, points: 0 },
      { id: 5, name: 'Andrey Rublev', rank: 5, country: 'Russia', price: 7000000, points: 0 },
      { id: 6, name: 'Stefanos Tsitsipas', rank: 6, country: 'Greece', price: 6500000, points: 0 },
      { id: 7, name: 'Holger Rune', rank: 7, country: 'Denmark', price: 6000000, points: 0 },
      { id: 8, name: 'Casper Ruud', rank: 8, country: 'Norway', price: 5500000, points: 0 },
    ];
    // Simulate API call
    setTimeout(() => {
      dispatch({ type: 'players/fetchPlayers/fulfilled', payload: mockPlayers });
    }, 500);
  }, [dispatch]);

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPlayerInSquad = (playerId) => {
    return squadPlayers.some((p) => p.id === playerId);
  };

  const handlePlayerPress = (player) => {
    if (isPlayerInSquad(player.id)) {
      dispatch(removePlayerFromSquad(player.id));
    } else {
      dispatch(addPlayerToSquad(player));
    }
  };

  const formatBudget = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const remainingBudget = BUDGET.initial - totalSpent;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Players</Text>
        <View style={styles.budgetContainer}>
          <Text style={styles.budgetLabel}>Remaining Budget:</Text>
          <Text style={styles.budgetAmount}>{formatBudget(remainingBudget)}</Text>
        </View>
        <Text style={styles.squadCount}>
          Squad: {squadPlayers.length} players
        </Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search players..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={COLORS.textLight}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PlayerCard
              player={item}
              onPress={() => handlePlayerPress(item)}
              isSelected={isPlayerInSquad(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetLabel: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
    marginRight: SIZES.small,
  },
  budgetAmount: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  squadCount: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
  },
  searchInput: {
    margin: SIZES.medium,
    padding: SIZES.medium,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: FONTS.size.medium,
    color: COLORS.text,
  },
  listContent: {
    padding: SIZES.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;