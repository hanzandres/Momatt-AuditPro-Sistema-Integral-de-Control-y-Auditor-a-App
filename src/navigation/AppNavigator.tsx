// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Iconos

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import AuditFormScreen from '../screens/AuditFormScreen';
import SetupAuditScreen from '../screens/SetupAuditScreen';
import AuditResultsScreen from '../screens/AuditResultsScreen';
import SendReportScreen from '../screens/SendReportScreen';
import FollowUpScreen from '../screens/FollowUpScreen';

// 1. Creamos el menú de pestañas
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#D12424', // Rojo activo
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, }
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// 2. Creamos el Stack principal
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} /> 
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="SetupAuditScreen" component={SetupAuditScreen} options={{title: 'Datos del Equipo'}}/>
      <Stack.Screen name="AuditFormScreen" component={AuditFormScreen} options={{title: 'Auditoria en Progreso'}}/>
      <Stack.Screen name="AuditResultsScreen" component={AuditResultsScreen} options={{ title: 'Resultados' }} />
      <Stack.Screen name="SendReportScreen" component={SendReportScreen} options={{ title: 'Envío de Reporte' }} />
      <Stack.Screen name="FollowUpScreen" component={FollowUpScreen} options={{ title: 'Seguimiento'}} />
    </Stack.Navigator>
  );
};

export default AppNavigator;