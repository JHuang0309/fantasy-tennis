import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { formatPrice } from '../utils/pricing';

const PlayerCard = ({ player, onPress, isSelected, canAfford = true }) => {
  const getTierColor = (rank) => {
    if (rank <= 3) return '#FFD700'; // Gold
    if (rank <= 10) return '#C0C0C0'; // Silver
    if (rank <= 32) return '#CD7F32'; // Bronze
    return COLORS.textLight;
  };

  const tierColor = getTierColor(player.rank);

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected && styles.cardSelected,
        !canAfford && styles.cardDisabled,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!canAfford && !isSelected}
    >
      <View style={styles.playerInfo}>
        <View style={[styles.avatar, { backgroundColor: tierColor }]}>
          <Text style={styles.avatarText}>
            {player.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.rank}>Rank #{player.rank} • {player.country}</Text>
          {player.recentForm && (
            <Text style={styles.form}>
              Form: {player.recentForm.wins}W-{player.recentForm.losses}L 
              ({Math.round(player.recentForm.winRate * 100)}%)
            </Text>
          )}
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={[styles.price, !canAfford && styles.priceDisabled]}>
          {formatPrice(player.price)}
        </Text>
        {player.points > 0 && (
          <Text style={styles.points}>{player.points} pts</Text>
        )}
        {player.upsetBonus > 0 && (
          <View style={styles.bonusBadge}>
            <Text style={styles.bonusText}>🔥 +{Math.round(player.upsetBonus * 100)}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.small,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#eff6ff',
  },
  cardDisabled: {
    opacity: 0.5,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  avatarText: {
    color: COLORS.card,
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  rank: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  form: {
    fontSize: FONTS.size.small,
    color: COLORS.success,
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FONTS.size.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  priceDisabled: {
    color: COLORS.error,
  },
  points: {
    fontSize: FONTS.size.small,
    color: COLORS.success,
  },
  bonusBadge: {
    backgroundColor: COLORS.warning,
    paddingHorizontal: SIZES.small,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  bonusText: {
    fontSize: FONTS.size.small,
    color: COLORS.card,
    fontWeight: 'bold',
  },
});

export default PlayerCard;