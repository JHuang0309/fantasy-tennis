import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Text } from 'react-native';
import { COLORS } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import SquadScreen from '../screens/SquadScreen';
import TestControlsScreen from '../screens/TestControlsScreen';
import TournamentScreen from '../screens/TournamentScreen';

const Tab = createBottomTabNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textLight,
          tabBarStyle: {
            backgroundColor: COLORS.card,
            borderTopColor: COLORS.border,
            paddingBottom: 5,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Players',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👥</Text>,
          }}
        />
        <Tab.Screen
          name="Squad"
          component={SquadScreen}
          options={{
            tabBarLabel: 'My Squad',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⭐</Text>,
          }}
        />
        <Tab.Screen
          name="Tournaments"
          component={TournamentScreen}
          options={{
            tabBarLabel: 'Tournaments',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🏆</Text>,
          }}
        />
        <Tab.Screen
          name="Test"
          component={TestControlsScreen}
          options={{
            tabBarLabel: 'Test',
            tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🧪</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;