/**
 * Test script to verify SportsAPI Pro V2 connectivity
 * Run with: node test-api.js
 */

require('react-native-dotenv');
const axios = require('axios');

// Load environment variables
const SPORTS_API_BASE_URL = process.env.SPORTS_API_BASE_URL || 'https://v2.tennis.sportsapipro.com';
const SPORTS_API_KEY = process.env.SPORTS_API_KEY;

console.log('='.repeat(60));
console.log('🎾 Testing SportsAPI Pro V2 - Tennis API');
console.log('='.repeat(60));
console.log(`Base URL: ${SPORTS_API_BASE_URL}`);
console.log(`API Key: ${SPORTS_API_KEY ? SPORTS_API_KEY.substring(0, 10) + '...' : 'NOT FOUND'}`);
console.log('='.repeat(60));
console.log('\n');

const api = axios.create({
  baseURL: SPORTS_API_BASE_URL,
  headers: {
    'x-api-key': SPORTS_API_KEY,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Test endpoints
const tests = [
  {
    name: 'ATP Singles Rankings',
    endpoint: '/api/rankings',
    description: 'Get top ATP players (up to 500)',
  },
  {
    name: 'Live Matches',
    endpoint: '/api/live',
    description: 'Get currently ongoing matches',
  },
  {
    name: 'Today\'s Matches',
    endpoint: '/api/today',
    description: 'Get today\'s scheduled matches',
  },
  {
    name: 'Trending Players',
    endpoint: '/api/trending-players',
    description: 'Get popular/trending players',
  },
  {
    name: 'WTA Singles Rankings',
    endpoint: '/api/rankings/wta',
    description: 'Get top WTA players',
  },
];

async function testEndpoint(test) {
  try {
    console.log(`Testing: ${test.name}`);
    console.log(`  Endpoint: ${test.endpoint}`);
    console.log(`  Description: ${test.description}`);

    const response = await api.get(test.endpoint);

    console.log(`  ✅ SUCCESS - Status: ${response.status}`);
    console.log(`  Response keys: ${Object.keys(response.data).join(', ')}`);

    // Try to extract meaningful info
    if (response.data.rankings) {
      console.log(`  Rankings returned: ${response.data.rankings.length} players`);
      if (response.data.rankings[0]) {
        const top = response.data.rankings[0];
        console.log(`  Top player: #${top.ranking} ${top.team?.name || 'Unknown'} (${top.points} pts)`);
      }
    } else if (response.data.events) {
      console.log(`  Events returned: ${response.data.events.length} matches`);
    } else if (Array.isArray(response.data)) {
      console.log(`  Array length: ${response.data.length}`);
    }

    console.log('');
    return { success: true, status: response.status };
  } catch (error) {
    console.log(`  ❌ FAILED - Status: ${error.response?.status || 'Network Error'}`);
    console.log(`  Error: ${error.response?.statusText || error.message}`);
    if (error.response?.data) {
      console.log(`  Details: ${JSON.stringify(error.response.data)}`);
    }
    console.log('');
    return { success: false, status: error.response?.status, error: error.message };
  }
}

async function runTests() {
  console.log('Starting API tests...\n');

  const results = [];
  for (const test of tests) {
    const result = await testEndpoint(test);
    results.push({ ...test, ...result });
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('Failed Tests:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.name} (${r.status || 'Network Error'})`);
    });
    console.log('');
  }

  // Diagnosis
  console.log('='.repeat(60));
  console.log('🔍 DIAGNOSIS');
  console.log('='.repeat(60));

  if (passed === 0) {
    console.log('❌ ALL TESTS FAILED');
    console.log('\nPossible causes:');
    console.log('  1. API Key is invalid or not activated');
    console.log('  2. Your account/subscription is not active');
    console.log('  3. API endpoint has changed');
    console.log('  4. Network connectivity issues');
    console.log('\nRecommendation:');
    console.log('  - Check your SportsAPI Pro dashboard');
    console.log('  - Verify your API key is correct and active');
    console.log('  - Check your subscription status');
    console.log('  - Use mock data for development (set USE_MOCK_DATA = true)');
  } else if (passed < results.length) {
    console.log('⚠️  PARTIAL SUCCESS');
    console.log('\nSome endpoints work, but others fail.');
    console.log('Your API key is valid but may have limited access.');
  } else {
    console.log('✅ ALL TESTS PASSED!');
    console.log('\nYour API is fully functional!');
    console.log('You can now use the real API in your app.');
    console.log('Set USE_MOCK_DATA = false in src/store/playersSlice.js');
  }

  console.log('='.repeat(60));
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error.message);
  process.exit(1);
});
