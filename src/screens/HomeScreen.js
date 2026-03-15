import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PlayerCard from '../components/PlayerCard';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { fetchPlayers } from '../store/playersSlice';
import { addPlayerToSquad, removePlayerFromSquad } from '../store/squadSlice';
import { formatPrice, getRequiredSquadSize, getRoundBudget } from '../utils/pricing';

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { list: players, loading, eliminated } = useSelector((state) => state.players);
  const { players: squadPlayers, totalSpent, currentRound } = useSelector((state) => state.squad);
  const [searchQuery, setSearchQuery] = useState('');

  const roundBudget = getRoundBudget(currentRound);
  const requiredSquadSize = getRequiredSquadSize(currentRound);

  useEffect(() => {
    dispatch(fetchPlayers({ 
      roundBudget, 
      eliminatedPlayerIds: eliminated 
    }));
  }, [dispatch, currentRound, eliminated]);

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
      // Check if squad is full
      if (squadPlayers.length >= requiredSquadSize) {
        alert(`Squad is full! Maximum ${requiredSquadSize} players for Round ${currentRound}`);
        return;
      }
      dispatch(addPlayerToSquad(player));
    }
  };

  const remainingBudget = roundBudget - totalSpent;
  const canAffordAnyPlayer = players.some(p => 
    !isPlayerInSquad(p.id) && p.price <= remainingBudget
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Round {currentRound} - Select Players</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Budget</Text>
            <Text style={styles.statValue}>{formatPrice(roundBudget)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={[styles.statValue, { color: canAffordAnyPlayer ? COLORS.success : COLORS.error }]}>
              {formatPrice(remainingBudget)}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Squad</Text>
            <Text style={styles.statValue}>
              {squadPlayers.length}/{requiredSquadSize}
            </Text>
          </View>
        </View>

        {squadPlayers.length === requiredSquadSize && (
          <View style={styles.completeBox}>
            <Text style={styles.completeText}>✓ Squad Complete!</Text>
          </View>
        )}
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
          <Text style={styles.loadingText}>Calculating player prices...</Text>
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
              canAfford={item.price <= remainingBudget || isPlayerInSquad(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No players available</Text>
            </View>
          }
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
    marginBottom: SIZES.medium,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  completeBox: {
    marginTop: SIZES.medium,
    padding: SIZES.small,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeText: {
    color: COLORS.card,
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
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
  loadingText: {
    marginTop: SIZES.medium,
    color: COLORS.textLight,
    fontSize: FONTS.size.medium,
  },
  emptyContainer: {
    padding: SIZES.xlarge,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.size.large,
    color: COLORS.textLight,
  },
});

export default HomeScreen;