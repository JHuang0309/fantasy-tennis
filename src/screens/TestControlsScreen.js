import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { markPlayerEliminated, updatePlayerPrice } from '../store/playersSlice';
import { startNewRound, updatePlayerPoints } from '../store/squadSlice';
import { mockMatchResults, simulateMatchCompletion } from '../utils/mockData';
import { getPointsBreakdown } from '../utils/points';
import { calculateUpsetBonus, formatPrice } from '../utils/pricing';

const TestControlsScreen = () => {
  const dispatch = useDispatch();
  const { currentRound, players: squadPlayers, totalPoints } = useSelector((state) => state.squad);
  const { list: allPlayers } = useSelector((state) => state.players);

  const handleSimulateMatch = (playerId) => {
    const matchResult = simulateMatchCompletion(playerId);
    
    if (!matchResult) {
      Alert.alert('No match data', 'No simulated match found for this player');
      return;
    }

    const player = squadPlayers.find(p => p.id === playerId);
    if (!player) {
      Alert.alert('Error', 'Player not in your squad');
      return;
    }

    // Update player points
    dispatch(updatePlayerPoints({
      playerId: matchResult.playerId,
      matchStats: matchResult.stats,
      opponentRank: matchResult.opponentRank,
    }));

    // Show points breakdown
    const breakdown = getPointsBreakdown(
      matchResult.stats,
      matchResult.playerRank,
      matchResult.opponentRank,
      currentRound,
      player.roundsKept || 0
    );

    const breakdownText = breakdown.map(item => 
      `${item.label}: ${item.points} pts`
    ).join('\n');

    const totalMatchPoints = breakdown.reduce((sum, item) => sum + item.points, 0);

    Alert.alert(
      'Match Complete!',
      `${player.name}\n\n${breakdownText}\n\nTotal: ${totalMatchPoints} pts`,
      [{ text: 'OK' }]
    );

    // If it was an upset, update player price
    if (matchResult.won && matchResult.playerRank > matchResult.opponentRank) {
      const upsetBonus = calculateUpsetBonus(matchResult.playerRank, matchResult.opponentRank);
      const currentPlayer = allPlayers.find(p => p.id === playerId);
      if (currentPlayer) {
        const newPrice = Math.round(currentPlayer.price * (1 + upsetBonus));
        dispatch(updatePlayerPrice({
          playerId,
          newPrice,
          upsetBonus,
        }));
      }
    }

    // Eliminate opponent (if you want to simulate this)
    if (matchResult.won) {
      dispatch(markPlayerEliminated(matchResult.opponentId));
    }
  };

  const handleAdvanceRound = () => {
    Alert.alert(
      'Advance Round',
      `Move to Round ${currentRound + 1}?\n\nYou'll need to pick a new squad with a fresh budget.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Advance',
          onPress: () => {
            dispatch(startNewRound(currentRound + 1));
            Alert.alert('Success', `Advanced to Round ${currentRound + 1}`);
          },
        },
      ]
    );
  };

  const handleEliminatePlayer = (playerId) => {
    const player = allPlayers.find(p => p.id === playerId);
    if (!player) return;

    Alert.alert(
      'Eliminate Player',
      `Remove ${player.name} from available players?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Eliminate',
          style: 'destructive',
          onPress: () => {
            dispatch(markPlayerEliminated(playerId));
            Alert.alert('Success', `${player.name} has been eliminated`);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Testing Controls</Text>
          <Text style={styles.subtitle}>Simulate matches and test features</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Round: {currentRound}</Text>
            <Text style={styles.infoText}>Squad Size: {squadPlayers.length}</Text>
            <Text style={styles.infoText}>Total Points: {totalPoints}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Round Management</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleAdvanceRound}
          >
            <Text style={styles.buttonText}>
              Advance to Round {currentRound + 1}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Squad - Simulate Matches</Text>
          {squadPlayers.length === 0 ? (
            <Text style={styles.emptyText}>No players in squad</Text>
          ) : (
            squadPlayers.map((player) => {
              const hasMatchData = mockMatchResults.some(m => m.playerId === player.id);
              return (
                <View key={player.id} style={styles.playerItem}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    <Text style={styles.playerDetails}>
                      Rank #{player.rank} • {formatPrice(player.price)}
                    </Text>
                    {player.points > 0 && (
                      <Text style={styles.playerPoints}>Points: {player.points}</Text>
                    )}
                    {player.roundsKept > 0 && (
                      <Text style={styles.loyaltyBadge}>
                        🔄 Kept {player.roundsKept} round{player.roundsKept > 1 ? 's' : ''}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[styles.smallButton, !hasMatchData && styles.buttonDisabled]}
                    onPress={() => handleSimulateMatch(player.id)}
                    disabled={!hasMatchData}
                  >
                    <Text style={styles.smallButtonText}>
                      {hasMatchData ? 'Simulate' : 'No Data'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eliminate Players (Testing)</Text>
          <Text style={styles.sectionSubtitle}>
            Remove players to test pricing adjustments
          </Text>
          {allPlayers.slice(0, 5).map((player) => (
            <View key={player.id} style={styles.playerItem}>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerDetails}>Rank #{player.rank}</Text>
              </View>
              <TouchableOpacity
                style={[styles.smallButton, styles.dangerButton]}
                onPress={() => handleEliminatePlayer(player.id)}
              >
                <Text style={styles.smallButtonText}>Eliminate</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Mock Match Results</Text>
          {mockMatchResults.map((match) => {
            const player = allPlayers.find(p => p.id === match.playerId);
            if (!player) return null;
            
            return (
              <View key={match.id} style={styles.matchCard}>
                <Text style={styles.matchPlayer}>{player.name}</Text>
                <Text style={styles.matchDetails}>
                  {match.won ? '✅ Won' : '❌ Lost'} • Round {match.round}
                </Text>
                <Text style={styles.matchStats}>
                  {match.stats.aces} aces, {match.stats.breakPointsConverted} BP converted
                </Text>
                {match.won && match.playerRank > match.opponentRank && (
                  <Text style={styles.upsetLabel}>🔥 UPSET!</Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  section: {
    padding: SIZES.large,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.small,
  },
  sectionSubtitle: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginBottom: SIZES.medium,
  },
  infoBox: {
    backgroundColor: COLORS.card,
    padding: SIZES.medium,
    borderRadius: 8,
  },
  infoText: {
    fontSize: FONTS.size.medium,
    color: COLORS.text,
    marginBottom: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.card,
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
  },
  playerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: SIZES.medium,
    borderRadius: 8,
    marginBottom: SIZES.small,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  playerDetails: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginTop: 2,
  },
  playerPoints: {
    fontSize: FONTS.size.small,
    color: COLORS.success,
    fontWeight: '600',
    marginTop: 2,
  },
  loyaltyBadge: {
    fontSize: FONTS.size.small,
    color: COLORS.primary,
    marginTop: 2,
  },
  smallButton: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    borderRadius: 6,
  },
  smallButtonText: {
    color: COLORS.card,
    fontSize: FONTS.size.small,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  dangerButton: {
    backgroundColor: COLORS.error,
  },
  emptyText: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
    textAlign: 'center',
    padding: SIZES.large,
  },
  matchCard: {
    backgroundColor: COLORS.card,
    padding: SIZES.medium,
    borderRadius: 8,
    marginBottom: SIZES.small,
  },
  matchPlayer: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  matchDetails: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginTop: 4,
  },
  matchStats: {
    fontSize: FONTS.size.small,
    color: COLORS.text,
    marginTop: 2,
  },
  upsetLabel: {
    fontSize: FONTS.size.small,
    color: COLORS.warning,
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default TestControlsScreen;