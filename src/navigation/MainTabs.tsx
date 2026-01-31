import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/Home/HomeScreen';
import { useTheme } from '../context/ThemeContext';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 80,
          paddingBottom: 8,
          paddingTop: 0,
          backgroundColor: theme.colors.appBgLight,
          borderTopColor: '#eee',
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 5,
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 14,
          marginTop: 3,
          marginBottom: 2,
        },
        tabBarActiveTintColor: theme.colors.text,
        tabBarInactiveTintColor: theme.colors.background,
        tabBarIcon: ({ focused }) => {
          let iconName = '';

          switch (route.name) {
            case 'DropOff':
              iconName = focused ? 'trash-can' : 'trash-can-outline';
              break;
            case 'PickUp':
              iconName = focused ? 'truck' : 'truck-outline';
              break;
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Learn':
              iconName = focused ? 'book-open' : 'book-open-outline';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return (
            <View style={{ alignItems: 'center' }}>
              {/* Line above icon when focused */}
              {focused && (
                <View
                  style={{
                    position: 'absolute',
                    top: -8,
                    width: 70,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: theme.colors.text,
                  }}
                />
              )}
              <Icon
                name={iconName}
                size={focused ? 28 : 26}
                color={focused ? theme.colors.text : theme.colors.background}
                style={{
                  marginTop: 2,
                }}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="DropOff" component={HomeScreen} />
      <Tab.Screen name="PickUp" component={HomeScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Learn" component={HomeScreen} />
      <Tab.Screen name="Profile" component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
