import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const TournamentCard = ({ tournament, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.status}>{tournament.status}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.date}>{tournament.date}</Text>
        <Text style={styles.surface}>{tournament.surface}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.points}>Your Points: {tournament.userPoints || 0}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: SIZES.large,
    marginBottom: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  title: {
    fontSize: FONTS.size.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },
  status: {
    fontSize: FONTS.size.small,
    color: COLORS.card,
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '600',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.medium,
  },
  date: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
  },
  surface: {
    fontSize: FONTS.size.medium,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.small,
  },
  points: {
    fontSize: FONTS.size.large,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});

export default TournamentCard;