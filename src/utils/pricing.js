
// Tier definitions based on ATP ranking
export const TIERS = {
  TOP: { min: 1, max: 3, budgetPercent: 0.40 },
  MID_HIGH: { min: 4, max: 10, budgetPercent: 0.25 },
  MID: { min: 11, max: 32, budgetPercent: 0.15 },
  LOW: { min: 33, max: 128, budgetPercent: 0.10 },
};

// Calculate player tier based on ranking
export const getPlayerTier = (ranking) => {
  if (ranking >= TIERS.TOP.min && ranking <= TIERS.TOP.max) return 'TOP';
  if (ranking >= TIERS.MID_HIGH.min && ranking <= TIERS.MID_HIGH.max) return 'MID_HIGH';
  if (ranking >= TIERS.MID.min && ranking <= TIERS.MID.max) return 'MID';
  return 'LOW';
};

// Calculate tier strength scores based on available players
export const calculateTierStrengths = (players) => {
  const tierStrengths = {
    TOP: 0,
    MID_HIGH: 0,
    MID: 0,
    LOW: 0,
  };

  players.forEach(player => {
    const tier = getPlayerTier(player.rank);
    // Strength score inversely proportional to ranking
    const strengthScore = 1000 / player.rank;
    tierStrengths[tier] += strengthScore;
  });

  return tierStrengths;
};

// Calculate budget proportions based on tier strength distribution
export const calculateTierBudgetProportions = (players) => {
  const tierStrengths = calculateTierStrengths(players);
  const totalStrength = Object.values(tierStrengths).reduce((sum, val) => sum + val, 0);

  const proportions = {};
  Object.keys(tierStrengths).forEach(tier => {
    proportions[tier] = tierStrengths[tier] / totalStrength;
  });

  return proportions;
};

// Calculate individual player price
export const calculatePlayerPrice = (player, allPlayers, roundBudget) => {
  const tier = getPlayerTier(player.rank);
  const tierBudgetProportions = calculateTierBudgetProportions(allPlayers);
  
  // Get all players in same tier
  const tierPlayers = allPlayers.filter(p => getPlayerTier(p.rank) === tier);
  
  // Calculate this player's share within their tier
  const playerStrength = 1000 / player.rank;
  const tierTotalStrength = tierPlayers.reduce((sum, p) => sum + (1000 / p.rank), 0);
  const playerTierShare = playerStrength / tierTotalStrength;
  
  // Calculate price
  const tierBudget = roundBudget * tierBudgetProportions[tier];
  let basePrice = tierBudget * playerTierShare;
  
  // Apply recent form modifier if available (10% adjustment based on last 5 matches)
  if (player.recentForm) {
    const formModifier = (player.recentForm.winRate - 0.5) * 0.2; // -10% to +10%
    basePrice *= (1 + formModifier);
  }
  
  // Apply upset bonus (price increase for beating higher ranked players)
  if (player.upsetBonus) {
    basePrice *= (1 + player.upsetBonus);
  }
  
  // Round to nearest 100k
  return Math.round(basePrice / 100000) * 100000;
};

// Calculate recent form from match history
export const calculateRecentForm = (matchHistory) => {
  if (!matchHistory || matchHistory.length === 0) {
    return { winRate: 0.5, wins: 0, losses: 0 };
  }

  // Take last 5 matches
  const recentMatches = matchHistory.slice(0, 5);
  const wins = recentMatches.filter(match => match.won).length;
  const losses = recentMatches.length - wins;
  const winRate = wins / recentMatches.length;

  return { winRate, wins, losses };
};

// Calculate upset bonus multiplier
export const calculateUpsetBonus = (playerRank, opponentRank) => {
  if (playerRank >= opponentRank) return 0; // No bonus for favorite winning
  
  const rankDifference = opponentRank - playerRank;
  // 5% price increase per 10 rank difference
  const bonusMultiplier = (rankDifference / 10) * 0.05;
  
  return Math.min(bonusMultiplier, 0.5); // Cap at 50% increase
};

// Format price for display
export const formatPrice = (price) => {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  }
  return `$${(price / 1000).toFixed(0)}K`;
};

// Check if user can afford a player
export const canAffordPlayer = (playerPrice, currentBudget, currentSpent) => {
  return (currentSpent + playerPrice) <= currentBudget;
};

// Get round budget based on round number
export const getRoundBudget = (roundNumber) => {
  const budgets = {
    1: 25000000,  // $25M
    2: 22000000,  // $22M
    3: 18000000,  // $18M
    4: 15000000,  // $15M
    5: 15000000,  // $15M (Quarters)
    6: 12000000,  // $12M (Semis)
    7: 0,         // Free pick (Finals)
  };
  
  return budgets[roundNumber] || 25000000;
};

// Get required squad size for round
export const getRequiredSquadSize = (roundNumber) => {
  const sizes = {
    1: 8,
    2: 6,
    3: 5,
    4: 4,
    5: 3,  // Quarters
    6: 2,  // Semis
    7: 1,  // Finals
  };
  
  return sizes[roundNumber] || 8;
};