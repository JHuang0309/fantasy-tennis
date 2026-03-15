// Base point values
export const POINT_VALUES = {
  MATCH_WIN: 100,
  ACE: 2,
  BREAK_POINT_CONVERTED: 5,
  SERVICE_GAME_WON: 3,
  DOMINANT_WIN: 50, // Straight sets win
};

// Round multipliers
export const ROUND_MULTIPLIERS = {
  1: 1.0,
  2: 1.0,
  3: 1.5,
  4: 1.5,
  5: 2.0,   // Quarters
  6: 3.0,   // Semis
  7: 5.0,   // Finals
};

// Upset bonus: 50 points per 10 rank difference
export const UPSET_BONUS_PER_10_RANKS = 50;

// Calculate points for a match performance
export const calculateMatchPoints = (matchStats, playerRank, opponentRank, roundNumber) => {
  let points = 0;

  // Base points for winning
  if (matchStats.won) {
    points += POINT_VALUES.MATCH_WIN;
  }

  // Aces
  if (matchStats.aces) {
    points += matchStats.aces * POINT_VALUES.ACE;
  }

  // Break points converted
  if (matchStats.breakPointsConverted) {
    points += matchStats.breakPointsConverted * POINT_VALUES.BREAK_POINT_CONVERTED;
  }

  // Service games won
  if (matchStats.serviceGamesWon) {
    points += matchStats.serviceGamesWon * POINT_VALUES.SERVICE_GAME_WON;
  }

  // Dominant win bonus (straight sets)
  if (matchStats.won && matchStats.setsLost === 0) {
    points += POINT_VALUES.DOMINANT_WIN;
  }

  // Apply round multiplier
  const roundMultiplier = ROUND_MULTIPLIERS[roundNumber] || 1.0;
  points *= roundMultiplier;

  // Upset bonus
  if (matchStats.won && playerRank > opponentRank) {
    const rankDifference = playerRank - opponentRank;
    const upsetBonus = Math.floor(rankDifference / 10) * UPSET_BONUS_PER_10_RANKS;
    points += upsetBonus;
  }

  return Math.round(points);
};

// Calculate loyalty bonus for keeping a player from previous round
export const calculateLoyaltyBonus = (roundsKept) => {
  // 10% bonus per round kept, up to 50%
  const bonusPercent = Math.min(roundsKept * 0.10, 0.50);
  return bonusPercent;
};

// Apply loyalty bonus to player's points
export const applyLoyaltyBonus = (basePoints, roundsKept) => {
  const bonus = calculateLoyaltyBonus(roundsKept);
  return Math.round(basePoints * (1 + bonus));
};

// Calculate total squad points
export const calculateSquadPoints = (players) => {
  return players.reduce((total, player) => {
    const basePoints = player.points || 0;
    const loyaltyPoints = applyLoyaltyBonus(basePoints, player.roundsKept || 0);
    return total + loyaltyPoints;
  }, 0);
};

// Format points for display
export const formatPoints = (points) => {
  return points.toLocaleString();
};

// Get points breakdown for display
export const getPointsBreakdown = (matchStats, playerRank, opponentRank, roundNumber, roundsKept = 0) => {
  const breakdown = [];

  if (matchStats.won) {
    breakdown.push({
      label: 'Match Win',
      points: POINT_VALUES.MATCH_WIN,
    });
  }

  if (matchStats.aces) {
    breakdown.push({
      label: `Aces (${matchStats.aces})`,
      points: matchStats.aces * POINT_VALUES.ACE,
    });
  }

  if (matchStats.breakPointsConverted) {
    breakdown.push({
      label: `Break Points (${matchStats.breakPointsConverted})`,
      points: matchStats.breakPointsConverted * POINT_VALUES.BREAK_POINT_CONVERTED,
    });
  }

  if (matchStats.serviceGamesWon) {
    breakdown.push({
      label: `Service Games (${matchStats.serviceGamesWon})`,
      points: matchStats.serviceGamesWon * POINT_VALUES.SERVICE_GAME_WON,
    });
  }

  if (matchStats.won && matchStats.setsLost === 0) {
    breakdown.push({
      label: 'Dominant Win',
      points: POINT_VALUES.DOMINANT_WIN,
    });
  }

  // Calculate base total
  let baseTotal = breakdown.reduce((sum, item) => sum + item.points, 0);

  // Add round multiplier
  const roundMultiplier = ROUND_MULTIPLIERS[roundNumber] || 1.0;
  if (roundMultiplier > 1.0) {
    breakdown.push({
      label: `Round ${roundNumber} Multiplier (×${roundMultiplier})`,
      points: baseTotal * (roundMultiplier - 1),
    });
  }

  baseTotal *= roundMultiplier;

  // Add upset bonus
  if (matchStats.won && playerRank > opponentRank) {
    const rankDifference = playerRank - opponentRank;
    const upsetBonus = Math.floor(rankDifference / 10) * UPSET_BONUS_PER_10_RANKS;
    breakdown.push({
      label: `Upset Bonus (${rankDifference} ranks)`,
      points: upsetBonus,
    });
    baseTotal += upsetBonus;
  }

  // Add loyalty bonus
  if (roundsKept > 0) {
    const loyaltyPercent = calculateLoyaltyBonus(roundsKept);
    const loyaltyPoints = Math.round(baseTotal * loyaltyPercent);
    breakdown.push({
      label: `Loyalty Bonus (${roundsKept} rounds)`,
      points: loyaltyPoints,
    });
  }

  return breakdown;
};