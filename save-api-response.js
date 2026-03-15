#!/usr/bin/env node
/**
 * Simple script to fetch and save API response
 * Run: node save-api-response.js
 */

const axios = require('axios');
const fs = require('fs');

async function saveApiResponse() {
  try {
    // Read .env
    const envFile = fs.readFileSync('.env', 'utf8');
    const API_KEY = envFile.match(/SPORTS_API_KEY=(.+)/)?.[1]?.trim();
    const BASE_URL = 'https://v2.tennis.sportsapipro.com';

    if (!API_KEY) {
      console.error('❌ API_KEY not found in .env file');
      process.exit(1);
    }

    console.log('🎾 Fetching ATP Rankings from API...');
    console.log('Base URL:', BASE_URL);
    console.log('API Key:', API_KEY.substring(0, 15) + '...\n');

    // Make API call
    const response = await axios.get(`${BASE_URL}/api/rankings`, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('✅ API call successful!');
    console.log('Status:', response.status);
    console.log('Top-level keys:', Object.keys(response.data).join(', '));

    // Save full response
    const fullFile = 'api-response-full.json';
    fs.writeFileSync(fullFile, JSON.stringify(response.data, null, 2));
    console.log(`\n💾 Full response saved to: ${fullFile}`);

    // Save just first 3 players for quick review
    if (response.data.rankings && response.data.rankings.length > 0) {
      const sampleFile = 'api-response-sample.json';
      const sample = {
        totalPlayers: response.data.rankings.length,
        samplePlayers: response.data.rankings.slice(0, 3),
        topLevelKeys: Object.keys(response.data),
        firstPlayerKeys: Object.keys(response.data.rankings[0]),
      };
      fs.writeFileSync(sampleFile, JSON.stringify(sample, null, 2));
      console.log(`💾 Sample (first 3) saved to: ${sampleFile}`);

      console.log('\n📊 Summary:');
      console.log('  Total players:', response.data.rankings.length);
      console.log('  Top player:', response.data.rankings[0].team?.name || 'Unknown');
      console.log('  First player structure:');
      console.log('    Keys:', Object.keys(response.data.rankings[0]).join(', '));
    } else {
      console.log('\n⚠️  No "rankings" array found in response');
      console.log('Available keys:', Object.keys(response.data).join(', '));
    }

    console.log('\n✅ Done! Git commit and push these files:');
    console.log('   git add api-response-*.json');
    console.log('   git commit -m "API response structure"');
    console.log('   git push');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Status Text:', error.response.statusText);
      console.error('Data:', error.response.data);
    }
    process.exit(1);
  }
}

saveApiResponse();
