import React, { useRef, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import { useTheme } from '../context/ThemeContext';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import WdText from '../components/common/WdText';
import { useAuth } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AppDrawer = () => {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const panelWidth = Math.min(320, Dimensions.get('window').width * 0.82);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const openPanel = () => {
    setIsPanelOpen(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closePanel = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setIsPanelOpen(false));
  };

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-panelWidth, 0],
  });

  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  const goToTab = (tabName: string) => {
    navigation.navigate(tabName);
    closePanel();
  };

  const handleLogout = () => logout();

  return (
    <View style={styles.root}>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerTitle: 'Recycle App',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: theme.colors.appBgLight,
          },
          headerTintColor: theme.colors.text,
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={openPanel}
              accessibilityLabel="Open menu"
            >
              <Icon name="menu" size={26} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      >
        <Stack.Screen name="Tabs" component={MainTabs} />
      </Stack.Navigator>

      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={closePanel}
        pointerEvents={isPanelOpen ? 'auto' : 'none'}
      >
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.panel,
          {
            width: panelWidth,
            backgroundColor: theme.colors.background,
            transform: [{ translateX }],
          },
        ]}
        pointerEvents={isPanelOpen ? 'auto' : 'none'}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* TOP CONTENT */}
          <View>
            <View style={styles.panelHeader}>
              <TouchableOpacity onPress={closePanel} accessibilityLabel="Close">
                <Icon name="close" size={25} color={theme.colors.error} />
              </TouchableOpacity>
            </View>

            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://your-image-url-here.jpg' }}
                style={styles.avatar}
              />
              <WdText label="Walter Briceno" fontSize={20} />
            </View>

            <TouchableOpacity
              style={styles.panelItem}
              onPress={() => goToTab('Home')}
            >
              <Icon name="home-outline" size={25} color={theme.colors.text} />
              <WdText label="Home" fontSize={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.panelItem}
              onPress={() => goToTab('RecycleCenters')}
            >
              <Icon
                name="trash-can-outline"
                size={25}
                color={theme.colors.text}
              />
              <WdText label="Drop Off" fontSize={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.panelItem}
              onPress={() => goToTab('PickUp')}
            >
              <Icon name="truck-outline" size={25} color={theme.colors.text} />
              <WdText label="Pick Up" fontSize={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.panelItem}
              onPress={() => goToTab('Learn')}
            >
              <Icon
                name="book-open-outline"
                size={25}
                color={theme.colors.text}
              />
              <WdText label="Learn" fontSize={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.panelItem}
              onPress={() => goToTab('Profile')}
            >
              <Icon
                name="account-outline"
                size={25}
                color={theme.colors.text}
              />
              <WdText label="Profile" fontSize={20} />
            </TouchableOpacity>
          </View>

          {/* BOTTOM LOGOUT */}
          <TouchableOpacity
            style={[styles.panelItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Icon name="logout" size={25} color={theme.colors.error} />
            <WdText label="Log Out" fontSize={20} color={theme.colors.error} />
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default AppDrawer;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderRightWidth: 1,
    borderRightColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  panelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    gap: 15,
  },
  avatarContainer: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderColor: '#000',
    borderWidth: 2,
    marginBottom: 20,
  },
  logoutItem: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
});
