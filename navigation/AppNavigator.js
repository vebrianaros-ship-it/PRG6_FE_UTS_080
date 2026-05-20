import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/LoginScreen';
import DashboardScreen from '../pages/DashboardScreen';
import SapiScreen from '../pages/SapiScreen';
import KambingScreen from '../pages/KambingScreen';
import DombaScreen from '../pages/DombaScreen';
import DetailScreen from '../pages/DetailScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5cabf9',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ title: 'Farm Apps 080', headerBackVisible: false }}
      />
      <Stack.Screen 
        name="Sapi" 
        component={SapiScreen} 
        options={{ title: 'Daftar Sapi' }}
      />
      <Stack.Screen 
        name="Domba" 
        component={DombaScreen} 
        options={{ title: 'Daftar Domba' }}
      />
      <Stack.Screen 
        name="Kambing" 
        component={KambingScreen} 
        options={{ title: 'Daftar Kambing' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen} 
        options={{ title: 'Detail Hewan' }}
      />
    </Stack.Navigator>
  );
}