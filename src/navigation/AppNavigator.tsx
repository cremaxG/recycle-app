import React from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

import SplashScreen from '../screens/Auth/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import AppDrawer from './AppDrawer';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import OTPVerificationScreen from '../screens/Auth/OTPVerificationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: undefined;
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Home: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isDarkMode } = useTheme();
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoading ? (
          // Show Splash while checking token
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : isAuthenticated ? (
          <>
            <Stack.Screen name="Home" component={AppDrawer} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="OTPVerification"
              component={OTPVerificationScreen}
            />
            {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
