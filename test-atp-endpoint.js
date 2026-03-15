/**
 * Test which endpoint returns ATP (men's) players
 * Run: node test-atp-endpoint.js
 */

const axios = require('axios');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf8');
const API_KEY = envFile.match(/SPORTS_API_KEY=(.+)/)?.[1]?.trim();
const BASE_URL = 'https://v2.tennis.sportsapipro.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'x-api-key': API_KEY },
  timeout: 10000,
});

async function testEndpoint(name, endpoint) {
  try {
    console.log(`\nTesting: ${name}`);
    console.log(`Endpoint: ${endpoint}`);

    const response = await api.get(endpoint);
    const rankings = response.data?.data?.rankings || response.data?.rankings || [];

    if (rankings.length > 0) {
      const firstPlayer = rankings[0];
      const gender = firstPlayer.team?.gender || 'Unknown';
      const genderText = gender === 'M' ? '👨 MALE (ATP)' : gender === 'F' ? '👩 FEMALE (WTA)' : '❓ Unknown';

      console.log(`  ✅ Status: 200`);
      console.log(`  Players: ${rankings.length}`);
      console.log(`  Gender: ${genderText}`);
      console.log(`  Top player: ${firstPlayer.team?.name || 'Unknown'}`);
      console.log(`  Ranking: #${firstPlayer.ranking}`);

      return { success: true, gender, topPlayer: firstPlayer.team?.name };
    } else {
      console.log(`  ⚠️  No rankings found`);
      return { success: false };
    }
  } catch (error) {
    console.log(`  ❌ Error: ${error.response?.status || error.message}`);
    return { success: false, error: error.message };
  }
}

async function findATPEndpoint() {
  console.log('='.repeat(60));
  console.log('🎾 Finding ATP (Men\'s) Tennis Endpoint');
  console.log('='.repeat(60));

  const tests = [
    { name: 'Default Rankings', endpoint: '/api/rankings' },
    { name: 'ATP Rankings', endpoint: '/api/rankings/atp' },
    { name: 'WTA Rankings', endpoint: '/api/rankings/wta' },
    { name: 'Rankings Type 1', endpoint: '/api/rankings/type/1' },
    { name: 'Rankings Type 2', endpoint: '/api/rankings/type/2' },
    { name: 'Doubles Rankings', endpoint: '/api/rankings/doubles' },
  ];

  const results = [];

  for (const test of tests) {
    const result = await testEndpoint(test.name, test.endpoint);
    results.push({ ...test, ...result });
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const atpEndpoint = results.find(r => r.success && r.gender === 'M');
  const wtaEndpoint = results.find(r => r.success && r.gender === 'F');

  if (atpEndpoint) {
    console.log(`\n✅ ATP (Men's) Endpoint Found:`);
    console.log(`   ${atpEndpoint.endpoint}`);
    console.log(`   Top player: ${atpEndpoint.topPlayer}`);
  } else {
    console.log(`\n❌ ATP (Men's) endpoint NOT found`);
  }

  if (wtaEndpoint) {
    console.log(`\n✅ WTA (Women's) Endpoint Found:`);
    console.log(`   ${wtaEndpoint.endpoint}`);
    console.log(`   Top player: ${wtaEndpoint.topPlayer}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log('💡 RECOMMENDATION');
  console.log('='.repeat(60));

  if (atpEndpoint) {
    console.log(`\nUpdate sportsApi.js line 21 to use:`);
    console.log(`const endpoint = gender === 'female' ? '/api/rankings/wta' : '${atpEndpoint.endpoint}';`);
  } else {
    console.log(`\n⚠️  Could not find ATP endpoint automatically.`);
    console.log(`Try checking the SportsAPI Pro documentation or contact support.`);
  }

  console.log('');
}

findATPEndpoint().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
