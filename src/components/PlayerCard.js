import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const PlayerCard = ({ player, onPress, isSelected }) => {
  const formatPrice = (price) => {
    return `$${(price / 1000000).toFixed(1)}M`;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.playerInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {player.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.rank}>Rank: {player.rank}</Text>
          <Text style={styles.country}>{player.country}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{formatPrice(player.price)}</Text>
        <Text style={styles.points}>{player.points || 0} pts</Text>
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
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
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
  country: {
    fontSize: FONTS.size.small,
    color: COLORS.textLight,
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
  points: {
    fontSize: FONTS.size.small,
    color: COLORS.success,
  },
});

export default PlayerCard;