import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removePlayerFromSquad, resetSquad } from '../store/squadSlice';
import SquadPlayer from '../components/SquadPlayer';
import { COLORS, SIZES, FONTS, BUDGET } from '../constants/theme';

const SquadScreen = () => {
  const dispatch = useDispatch();
  const { players, totalSpent } = useSelector((state) => state.squad);

  const formatBudget = (amount) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const totalPoints = players.reduce((sum, player) => sum + (player.points || 0), 0);
  const remainingBudget = BUDGET.initial - totalSpent;

  const handleRemovePlayer = (playerId) => {
    dispatch(removePlayerFromSquad(playerId));
  };

  const handleResetSquad = () => {
    dispatch(resetSquad());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Squad</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Players</Text>
            <Text style={styles.statValue}>{players.length}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>{formatBudget(totalSpent)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Remaining</Text>
            <Text style={styles.statValue}>{formatBudget(remainingBudget)}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Points</Text>
            <Text style={[styles.statValue, { color: COLORS.success }]}>
              {totalPoints}
            </Text>
          </View>
        </View>
      </View>

      {players.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Your squad is empty</Text>
          <Text style={styles.emptySubtext}>
            Go to Home to add players to your squad
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={players}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <SquadPlayer player={item} onRemove={handleRemovePlayer} />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetSquad}
              activeOpacity={0.7}
            >
              <Text style={styles.resetButtonText}>Reset Squad</Text>
            </TouchableOpacity>
          </View>
        </>
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
  statsContainer: {
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
  listContent: {
    padding: SIZES.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xlarge,
  },
  emptyText: {
    fontSize: FONTS.size.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  emptySubtext: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  footer: {
    padding: SIZES.medium,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resetButton: {
    backgroundColor: COLORS.error,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: COLORS.card,
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
  },
});

export default SquadScreen;