import React, { useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import WdText from '../../components/common/WdText';
import { useNavigation } from '@react-navigation/native';
import LanguageBottomSheet from '../../components/common/bottom-sheets/LanguageBottomSheet';
import i18n from '../../i18n';
import { storage } from '../../utils/Storage';
import ThemeBottomSheet from '../../components/common/bottom-sheets/ThemeBottomSheet';

const LANGUAGE_KEY = 'user-language';

const ManageProfileScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const [isThemeModalVisible, setThemeModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleEditProfile = () => {
    // Navigate to edit profile screen or show edit modal
    navigation.navigate('EditProfile');
  };

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    storage.set(LANGUAGE_KEY, langCode);
    setLanguageModalVisible(false);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    toggleTheme(mode);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: user?.profileImage || 'https://picsum.photos/150',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={[
                styles.editImageButton,
                { backgroundColor: theme.colors.appBg },
              ]}
              onPress={handleEditProfile}
            >
              <Icon name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>

          <WdText
            label={user?.name || 'Walter Briceno'}
            fontSize={24}
            style={styles.userName}
          />
          <WdText
            label={user?.email || 'walter@example.com'}
            fontSize={14}
            color={theme.colors.textSecondary}
            style={styles.userEmail}
          />

          <TouchableOpacity
            style={[
              styles.editProfileButton,
              { borderColor: theme.colors.appBg },
            ]}
            onPress={handleEditProfile}
          >
            <Icon name="pencil" size={18} color={theme.colors.appBg} />
            <WdText
              label="Edit Profile"
              fontSize={16}
              color={theme.colors.appBg}
              style={styles.editButtonText}
            />
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <WdText
            label="SETTINGS"
            fontSize={12}
            color={theme.colors.textSecondary}
            style={styles.sectionTitle}
          />

          {/* Language Selection */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon name="translate" size={24} color={theme.colors.appBg} />
              </View>
              <View>
                <WdText label="Language" fontSize={16} />
                <WdText
                  label={selectedLanguage}
                  fontSize={12}
                  color={theme.colors.textSecondary}
                />
              </View>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Theme Toggle */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon
                  name={
                    isDarkMode ? 'moon-waning-crescent' : 'white-balance-sunny'
                  }
                  size={24}
                  color={theme.colors.appBg}
                />
              </View>
              <View>
                <WdText label="Theme" fontSize={16} />
                <WdText
                  label={isDarkMode ? 'Dark Mode' : 'Light Mode'}
                  fontSize={12}
                  color={theme.colors.textSecondary}
                />
              </View>
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon
                  name="bell-outline"
                  size={24}
                  color={theme.colors.appBg}
                />
              </View>
              <WdText label="Notifications" fontSize={16} />
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Privacy */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon
                  name="shield-outline"
                  size={24}
                  color={theme.colors.appBg}
                />
              </View>
              <WdText label="Privacy & Security" fontSize={16} />
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.settingsSection}>
          <WdText
            label="ACCOUNT"
            fontSize={12}
            color={theme.colors.textSecondary}
            style={styles.sectionTitle}
          />

          {/* Help & Support */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon
                  name="help-circle-outline"
                  size={24}
                  color={theme.colors.appBg}
                />
              </View>
              <WdText label="Help & Support" fontSize={16} />
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.placeholder,
              },
            ]}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.appBgLight + '20' },
                ]}
              >
                <Icon
                  name="information-outline"
                  size={24}
                  color={theme.colors.appBg}
                />
              </View>
              <WdText label="About" fontSize={16} />
            </View>
            <Icon
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            style={[
              styles.settingItem,
              styles.logoutButton,
              {
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.error,
              },
            ]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.error + '20' },
                ]}
              >
                <Icon name="logout" size={24} color={theme.colors.error} />
              </View>
              <WdText
                label="Log Out"
                fontSize={16}
                color={theme.colors.error}
              />
            </View>
          </TouchableOpacity>
        </View>

        <WdText
          label="Version 1.0.0"
          fontSize={12}
          color={theme.colors.textSecondary}
          style={styles.versionText}
        />
      </ScrollView>

      {/* Language Bottom Sheet */}
      <LanguageBottomSheet
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onSelect={handleLanguageChange}
      />

      {/* Theme Bottom Sheet */}
      <ThemeBottomSheet
        visible={isThemeModalVisible}
        onClose={() => setThemeModalVisible(false)}
        onSelect={handleThemeChange}
      />
    </SafeAreaView>
  );
};

export default ManageProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#000',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    marginBottom: 20,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: 8,
  },
  editButtonText: {
    fontWeight: '600',
  },
  settingsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  logoutButton: {
    marginTop: 8,
  },
  versionText: {
    textAlign: 'center',
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
});
