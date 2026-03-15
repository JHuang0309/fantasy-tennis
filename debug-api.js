/**
 * API Debugging Script
 * Run this on your laptop that can access the API
 *
 * Usage: node debug-api.js
 */

const axios = require('axios');
const fs = require('fs');

// Read .env file
const envFile = fs.readFileSync('.env', 'utf8');
const API_KEY = envFile.match(/SPORTS_API_KEY=(.+)/)?.[1]?.trim();
const BASE_URL = envFile.match(/SPORTS_API_BASE_URL=(.+)/)?.[1]?.trim() || 'https://v2.tennis.sportsapipro.com';

console.log('='.repeat(70));
console.log('🎾 FANTASY TENNIS - API DEBUGGING SCRIPT');
console.log('='.repeat(70));
console.log('Base URL:', BASE_URL);
console.log('API Key:', API_KEY ? API_KEY.substring(0, 15) + '...' : '❌ NOT FOUND');
console.log('='.repeat(70));
console.log('\n');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'x-api-key': API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Test 1: Check API Rankings Response Structure
async function testRankingsStructure() {
  console.log('TEST 1: ATP Rankings Response Structure');
  console.log('-'.repeat(70));

  try {
    const response = await api.get('/api/rankings');

    console.log('✅ SUCCESS - Status:', response.status);
    console.log('\n📦 Response Structure:');
    console.log('  Top-level keys:', Object.keys(response.data).join(', '));

    if (response.data.rankings) {
      console.log('  Rankings array length:', response.data.rankings.length);

      console.log('\n👤 First Player Object:');
      const firstPlayer = response.data.rankings[0];
      console.log(JSON.stringify(firstPlayer, null, 2));

      console.log('\n🔑 Player Object Keys:');
      console.log('  ', Object.keys(firstPlayer).join(', '));

      // Check what ID fields exist
      console.log('\n🆔 ID Fields Available:');
      console.log('  - id:', firstPlayer.id);
      console.log('  - team.id:', firstPlayer.team?.id);
      console.log('  - team.player.id:', firstPlayer.team?.player?.id);

      // Sample 5 players
      console.log('\n📊 Sample Players (Top 5):');
      response.data.rankings.slice(0, 5).forEach(player => {
        console.log(`  #${player.ranking} ${player.team?.name || 'Unknown'} - ${player.points} pts (Team ID: ${player.team?.id})`);
      });

      // Save full response to file for inspection
      fs.writeFileSync('api-response-rankings.json', JSON.stringify(response.data, null, 2));
      console.log('\n💾 Full response saved to: api-response-rankings.json');

    } else {
      console.log('⚠️  No "rankings" key found in response');
      console.log('\n📄 Full Response Preview:');
      console.log(JSON.stringify(response.data, null, 2).substring(0, 1000));
    }

    return { success: true, data: response.data };
  } catch (error) {
    console.log('❌ FAILED - Status:', error.response?.status || 'Network Error');
    console.log('  Error:', error.response?.statusText || error.message);
    if (error.response?.data) {
      console.log('  Details:', JSON.stringify(error.response.data));
    }
    return { success: false, error: error.message };
  }
}

// Test 2: Check what the app needs vs what API returns
async function testDataMapping() {
  console.log('\n\nTEST 2: Data Mapping Analysis');
  console.log('-'.repeat(70));

  try {
    const response = await api.get('/api/rankings');

    if (!response.data.rankings || response.data.rankings.length === 0) {
      console.log('❌ No rankings data returned');
      return;
    }

    const apiPlayer = response.data.rankings[0];

    console.log('📋 What the API returns:');
    console.log(JSON.stringify(apiPlayer, null, 2));

    console.log('\n📋 What the app expects (from mockData.js):');
    console.log(JSON.stringify({
      id: 1,
      name: 'Player Name',
      rank: 1,
      country: 'Country',
      age: 25,
      points: 0,
      recentForm: { winRate: 0.85, wins: 17, losses: 3 }
    }, null, 2));

    console.log('\n🔄 Mapping needed:');
    console.log('  API → App');
    console.log('  ' + '-'.repeat(60));
    console.log(`  team.id (${apiPlayer.team?.id}) → id`);
    console.log(`  team.name (${apiPlayer.team?.name}) → name`);
    console.log(`  ranking (${apiPlayer.ranking}) → rank`);
    console.log(`  team.country.alpha2 (${apiPlayer.team?.country?.alpha2}) → country`);
    console.log(`  points (${apiPlayer.points}) → points`);
    console.log(`  ❌ age → NOT PROVIDED by API`);
    console.log(`  ❌ recentForm → Need to fetch from /api/teams/{id}/events`);

    console.log('\n💡 Suggested transformation function:');
    console.log(`
function transformApiPlayer(apiPlayer) {
  return {
    id: apiPlayer.team?.id,
    name: apiPlayer.team?.name,
    rank: apiPlayer.ranking,
    country: apiPlayer.team?.country?.alpha2 || apiPlayer.team?.country?.name,
    age: null, // Not provided by rankings API
    points: 0, // Game points (not ATP points)
    atpPoints: apiPlayer.points,
    recentForm: null, // Need to fetch separately
  };
}
    `.trim());

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Test 3: Try other endpoints
async function testOtherEndpoints() {
  console.log('\n\nTEST 3: Testing Other Endpoints');
  console.log('-'.repeat(70));

  const endpoints = [
    { name: 'Live Matches', path: '/api/live' },
    { name: 'Today\'s Matches', path: '/api/today' },
    { name: 'Trending Players', path: '/api/trending-players' },
    { name: 'WTA Rankings', path: '/api/rankings/wta' },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`\nTesting: ${endpoint.name} (${endpoint.path})`);
      const response = await api.get(endpoint.path);
      console.log('  ✅ Status:', response.status);
      console.log('  Keys:', Object.keys(response.data).join(', '));

      if (response.data.events) {
        console.log('  Events count:', response.data.events.length);
      } else if (response.data.rankings) {
        console.log('  Rankings count:', response.data.rankings.length);
      } else if (Array.isArray(response.data)) {
        console.log('  Array length:', response.data.length);
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.log('  ❌ Status:', error.response?.status || 'Network Error');
    }
  }
}

// Test 4: Check player match history endpoint
async function testPlayerHistory(teamId = null) {
  console.log('\n\nTEST 4: Player Match History');
  console.log('-'.repeat(70));

  try {
    // If no teamId provided, get one from rankings
    if (!teamId) {
      const rankingsResponse = await api.get('/api/rankings');
      teamId = rankingsResponse.data.rankings[0]?.team?.id;
      console.log(`Using Team ID from top player: ${teamId}`);
    }

    if (!teamId) {
      console.log('❌ Could not get team ID');
      return;
    }

    // Try different possible endpoints for player history
    const possibleEndpoints = [
      `/api/teams/${teamId}/events`,
      `/api/teams/${teamId}`,
      `/api/players/${teamId}`,
    ];

    for (const endpoint of possibleEndpoints) {
      try {
        console.log(`\nTrying: ${endpoint}`);
        const response = await api.get(endpoint);
        console.log('  ✅ SUCCESS - Status:', response.status);
        console.log('  Keys:', Object.keys(response.data).join(', '));

        // Save response
        const filename = `api-response-${endpoint.replace(/\//g, '-')}.json`;
        fs.writeFileSync(filename, JSON.stringify(response.data, null, 2));
        console.log(`  💾 Saved to: ${filename}`);

        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.log('  ❌ Status:', error.response?.status);
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Main execution
async function runAllTests() {
  console.log('Starting comprehensive API tests...\n');

  await testRankingsStructure();
  await testDataMapping();
  await testOtherEndpoints();
  await testPlayerHistory();

  console.log('\n' + '='.repeat(70));
  console.log('✅ ALL TESTS COMPLETE');
  console.log('='.repeat(70));
  console.log('\n📁 Files created:');
  console.log('  - api-response-rankings.json (full rankings response)');
  console.log('  - api-response-*.json (other endpoint responses)');
  console.log('\n📋 Next Steps:');
  console.log('  1. Review the JSON files to understand the data structure');
  console.log('  2. Update getTopPlayers() in sportsApi.js to transform the data');
  console.log('  3. Update playersSlice.js to handle the new data format');
  console.log('  4. Set USE_MOCK_DATA = false to test with real data');
  console.log('\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  console.error(error.stack);
  process.exit(1);
});
