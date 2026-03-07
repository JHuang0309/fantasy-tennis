import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const SquadPlayer = ({ player, onRemove }) => {
  const formatPrice = (price) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.playerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {player.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.stats}>
            Rank: {player.rank} | {formatPrice(player.price)}
          </Text>
          <Text style={styles.points}>Points: {player.points || 0}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(player.id)}
      >
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </View>
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
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.medium,
  },
  avatarText: {
    color: COLORS.card,
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: FONTS.size.medium,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  stats: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  points: {
    fontSize: FONTS.size.small,
    color: COLORS.success,
    fontWeight: '600',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: COLORS.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SquadPlayer;