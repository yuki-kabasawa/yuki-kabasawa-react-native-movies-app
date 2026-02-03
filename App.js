import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import MoviesScreen from './screens/MoviesScreen';
import SearchScreen from './screens/SearchScreen';
import TVScreen from './screens/TVScreen';
import MediaDetailScreen from './screens/MediaDetailScreen';

const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function TabsScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#2c3e50',
        tabBarInactiveTintColor: '#95a5a6',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#fff' },
        tabBarIndicatorStyle: { backgroundColor: '#2c3e50', height: 3 },
      }}
    >
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{ tabBarLabel: 'Movies' }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarLabel: 'Search Results' }}
      />
      <Tab.Screen
        name="TV"
        component={TVScreen}
        options={{ tabBarLabel: 'TV Shows' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2c3e50' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="Home"
          component={TabsScreen}
          options={{ title: 'Movies App' }}
        />
        <Stack.Screen
          name="Detail"
          component={MediaDetailScreen}
          options={{ title: 'Details' }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
