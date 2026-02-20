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
import RecycleDetailsScreen from '../screens/Recycle/RecycleDetailsScreen';
import PickUpScreen from '../screens/PickUp/PickUpScreen';
import RecycleTypeScreen from '../screens/PickUp/RecycleTypeScreen';
import SchedulePickUpScreen from '../screens/PickUp/SchedulePickUpScreen';
import RecycleCentersListScreen from '../screens/Recycle/RecycleCentersListScreen';
import RecycleCenterSelectionScreen from '../screens/PickUp/RecycleCenterSelectionScreen';
import PickUpConfirmationScreen from '../screens/PickUp/PickUpConfirmationScreen';
import ManageProfileScreen from '../screens/Profile/ManageProfile';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  OTPVerification: undefined;
  Splash: undefined;
  Onboarding: undefined;
  Welcome: undefined;
  Home: undefined;
  ManageProfile: undefined;
  EditProfile: undefined;
  RecycleCenters: undefined;
  RecycleDetail: undefined;
  PickUp: undefined;
  RecycleTypeSelection: undefined;
  SchedulePickUp: undefined;
  RecycleCenterSelection: undefined;
  PickUpConfirmation: undefined;
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
            <Stack.Screen
              name="ManageProfile"
              component={ManageProfileScreen}
            />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen
              name="RecycleCenters"
              component={RecycleCentersListScreen}
            />
            <Stack.Screen
              name="RecycleDetail"
              component={RecycleDetailsScreen}
            />
            <Stack.Screen name="PickUp" component={PickUpScreen} />
            <Stack.Screen
              name="RecycleTypeSelection"
              component={RecycleTypeScreen}
            />
            <Stack.Screen
              name="SchedulePickUp"
              component={SchedulePickUpScreen}
            />
            <Stack.Screen
              name="RecycleCenterSelection"
              component={RecycleCenterSelectionScreen}
            />
            <Stack.Screen
              name="PickUpConfirmation"
              component={PickUpConfirmationScreen}
            />
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
