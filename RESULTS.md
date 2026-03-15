# node test-atp-endpoint.js

# 🎾 Finding ATP (Men's) Tennis Endpoint

Testing: Default Rankings
Endpoint: /api/rankings
✅ Status: 200
Players: 500
Gender: 👩 FEMALE (WTA)
Top player: Aryna Sabalenka
Ranking: #1

Testing: ATP Rankings
Endpoint: /api/rankings/atp
❌ Error: 404

Testing: WTA Rankings
Endpoint: /api/rankings/wta
✅ Status: 200
Players: 500
Gender: 👨 MALE (ATP)
Top player: Carlos Alcaraz
Ranking: #1

Testing: Rankings Type 1
Endpoint: /api/rankings/type/1
✅ Status: 200
Players: 55
Gender: ❓ Unknown
Top player: Unknown
Ranking: #1

Testing: Rankings Type 2
Endpoint: /api/rankings/type/2
✅ Status: 200
Players: 210
Gender: 👨 MALE (ATP)
Top player: Spain
Ranking: #1

Testing: Doubles Rankings
Endpoint: /api/rankings/doubles
✅ Status: 200
Players: 500
Gender: 👩 FEMALE (WTA)
Top player: Aryna Sabalenka
Ranking: #1

============================================================
📊 SUMMARY
============================================================

✅ ATP (Men's) Endpoint Found:
/api/rankings/wta
Top player: Carlos Alcaraz

✅ WTA (Women's) Endpoint Found:
/api/rankings
Top player: Aryna Sabalenka

============================================================
💡 RECOMMENDATION
============================================================

Update sportsApi.js line 21 to use:
const endpoint = gender === 'female' ? '/api/rankings/wta' : '/api/rankings/wta';

jaydenhuang@Jaydens-MacBook-Air-2 fantasy-tennis % git status  
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
jaydenhuang@Jaydens-MacBook-Air-2 fantasy-tennis % npx expo start -c  
env: load .env
env: export SPORTS_API_BASE_URL SPORTS_API_KEY
Starting project at /Users/jaydenhuang/Desktop/Projects/fantasy-tennis
React Compiler enabled
Starting Metro Bundler
warning: Bundler cache is empty, rebuilding (this may take a minute)
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █▄▄▄ ▀ ▀█ █ ▄▄▄▄▄ █
█ █ █ ██▄▀ █ ▀▄▄█ █ █ █
█ █▄▄▄█ ██▀▄ ▄███▀█ █▄▄▄█ █
█▄▄▄▄▄▄▄█ ▀▄█ ▀ ▀ █▄▄▄▄▄▄▄█
█ █ █▄██▄▀█▄▀█▀ █▄█▀█▀▀▄█
██▄▄██▀▄▀▄▄██▄▄▄▄ ▀███▄▀▀ █
█ █▀▀█▀▄ ▄ █▀█▄ █ ▄▀▀█▀ ██
█ ▄█▀▀▄▄ ▀█▀▄▀ ▄▀ ██▄▀ █
█▄█▄█▄█▄█▀▀█ ▄▄ █ ▄▄▄ ▄▀▄█
█ ▄▄▄▄▄ ███▀▀▄ █ █▄█ ███ █
█ █ █ █ ▄▀▄ ▀█▄ ▄ ▄ █▀▀█
█ █▄▄▄█ █▀▀█ ▀█▄ ▄█▀▀▄█ █
█▄▄▄▄▄▄▄█▄▄█▄██▄▄▄▄█▄▄███▄█

› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Web is waiting on http://localhost:8081

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› shift+m │ more tools
› Press o │ open project code in your editor

› Press ? │ show all commands

Logs for your project will appear below. Press Ctrl+C to exit.
Unable to resolve asset "./assets/images/icon.png" from "icon" in your app.json or app.config.js
iOS Bundled 7604ms node_modules/expo/AppEntry.js (963 modules)
LOG 🔍 API Configuration:
LOG Base URL: https://v2.tennis.sportsapipro.com
LOG API Key: ✅ Loaded (3e10c02f-d...)
WARN SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead. See https://github.com/th3rdwave/react-native-safe-area-context
LOG 🚀 Fetching real players from API...
LOG ✅ API Response received
LOG Endpoint: /api/rankings
LOG Top-level keys: success, data, source, cacheHit
LOG Found 500 players
LOG First player: Aryna Sabalenka (Gender: F)
LOG After gender filter: 0 players
LOG First transformed: undefined
LOG 📥 Received players: 0
ERROR ❌ No players returned from API
