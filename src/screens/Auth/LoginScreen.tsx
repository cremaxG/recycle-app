import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import WdButton from '../../components/common/WdButton';
import WdImage from '../../components/common/WdImage';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Expanded country codes data
const COUNTRY_CODES = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: '+7', country: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: '+971', country: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+62', country: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: '+84', country: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+254', country: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: '+92', country: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+880', country: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'LK', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'NP', name: 'Nepal', flag: '🇳🇵' },
  { code: '+64', country: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: '+48', country: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: '+90', country: 'TR', name: 'Turkey', flag: '🇹🇷' },
];

const LoginScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[1]); // Default to Mexico
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [detectingCountry, setDetectingCountry] = useState(true);

  // Detect country from IP on mount
  useEffect(() => {
    detectCountryFromIP();
  }, []);

  const detectCountryFromIP = async () => {
    try {
      setDetectingCountry(true);
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();

      if (data.country_code) {
        const detectedCountry = COUNTRY_CODES.find(
          c => c.country === data.country_code,
        );
        if (detectedCountry) {
          setSelectedCountry(detectedCountry);
        }
      }
    } catch (error) {
      console.log('Could not detect country from IP:', error);
    } finally {
      setDetectingCountry(false);
    }
  };

  const isValidPhoneNumber = (value: string) => {
    return value.length >= 7 && value.length <= 15;
  };

  const handleGetOTP = async () => {
    setSubmitted(true);
    setError('');

    if (!phoneNumber) {
      setError('Por favor ingresa tu número de teléfono');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setError('Número de teléfono inválido');
      return;
    }

    try {
      setLoading(true);
      const fullPhoneNumber = `${selectedCountry.code}${phoneNumber}`;
      console.log('Requesting OTP for:', fullPhoneNumber);
      navigation.navigate('OTPVerification', { phoneNumber: fullPhoneNumber });
    } catch (err: any) {
      setError(err.message || 'Error al enviar OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    setPhoneNumber(numericText);
  };

  const handleCountrySelect = (country: (typeof COUNTRY_CODES)[0]) => {
    setSelectedCountry(country);
    setModalVisible(false);
    setSearchQuery('');
  };

  const filteredCountries = COUNTRY_CODES.filter(
    country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.code.includes(searchQuery) ||
      country.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCountryItem = ({ item }: { item: (typeof COUNTRY_CODES)[0] }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => handleCountrySelect(item)}
      activeOpacity={0.7}
    >
      <WdText style={styles.flagText} label={item.flag} />
      <View style={styles.countryInfo}>
        <WdText style={styles.countryName} label={item.name} />
        <WdText style={styles.countryCode} label={item.code} />
      </View>
      {selectedCountry.country === item.country && (
        <WdText
          style={[styles.checkMark, { color: theme.colors.appBg }]}
          label="✓"
        />
      )}
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <WdImage
              source={require('../../assets/images/recycle-icon.png')}
              imageStyle={styles.recycleIcon}
            />
          </View>

          <WdText label="Welcome" fontSize={35} isBold style={styles.title} />
          <WdText
            label="Get started by entering your mobile number"
            fontSize={16}
            style={styles.subtitle}
          />

          {/* Phone Number Input with Country Code Picker */}
          <View style={styles.inputWrapper}>
            <TouchableOpacity
              style={styles.countryCodeButton}
              onPress={() => setModalVisible(true)}
              disabled={detectingCountry}
              activeOpacity={0.7}
            >
              {detectingCountry ? (
                <ActivityIndicator size="small" color="#666" />
              ) : (
                <>
                  <WdText
                    style={styles.flagEmoji}
                    label={selectedCountry.flag}
                  />
                  <WdText
                    style={styles.countryCodeText}
                    label={selectedCountry.code}
                  />
                  <WdText style={styles.dropdownArrow} label="▼" />
                </>
              )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Error */}
          {error ? (
            <WdText
              label={error}
              color={theme.colors.error}
              style={styles.errorText}
            />
          ) : null}

          {/* Get OTP Button */}
          <WdButton
            title={loading ? 'Sending OTP...' : 'Get OTP'}
            onPress={handleGetOTP}
            disabled={loading}
            style={styles.otpButton}
          />
          {loading && <ActivityIndicator style={{ marginTop: 12 }} />}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Country Code Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery('');
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => {
              setModalVisible(false);
              setSearchQuery('');
            }}
          />

          <View style={styles.modalContent}>
            {/* Drag Handle */}
            <View style={styles.dragHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <WdText label="Select Country" style={styles.modalTitle} />
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setSearchQuery('');
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <WdText label="✕" style={styles.closeButton} />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search country or code..."
                placeholderTextColor="#999"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            {/* Country List */}
            <FlatList
              data={filteredCountries}
              keyExtractor={item => item.country}
              renderItem={renderCountryItem}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              initialNumToRender={15}
              maxToRenderPerBatch={10}
              windowSize={10}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <WdText label="No countries found" style={styles.emptyText} />
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    scrollContent: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 100,
      justifyContent: 'flex-start',
    },
    title: {
      textAlign: 'left',
      paddingTop: 30,
    },
    subtitle: {
      textAlign: 'left',
      marginVertical: 10,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: 12,
      backgroundColor: '#F5F5F5',
      marginTop: 10,
    },
    countryCodeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingRight: 8,
      minWidth: 80,
    },
    flagEmoji: {
      fontSize: 20,
      marginRight: 6,
    },
    countryCodeText: {
      fontSize: 16,
      color: '#000',
      fontWeight: '500',
      marginRight: 4,
    },
    dropdownArrow: {
      fontSize: 10,
      color: '#666',
    },
    divider: {
      width: 1,
      height: 24,
      backgroundColor: '#DDD',
      marginRight: 12,
    },
    input: {
      flex: 1,
      height: 44,
      fontSize: 16,
      color: '#000',
    },
    errorText: {
      textAlign: 'center',
      marginTop: 8,
    },
    otpButton: {
      backgroundColor: theme.colors.appBg,
      marginVertical: 24,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 50,
    },
    recycleIcon: {
      width: 150,
      height: 150,
    },
    // Modal Styles
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: '#FFF',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      height: SCREEN_HEIGHT * 0.7, // 70% of screen height
      paddingBottom: Platform.OS === 'ios' ? 34 : 0, // Safe area for iOS
    },
    dragHandle: {
      width: 40,
      height: 4,
      backgroundColor: '#DDD',
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 8,
      marginBottom: 8,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#EEE',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    closeButton: {
      fontSize: 24,
      color: '#666',
      fontWeight: '300',
    },
    searchContainer: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: '#FFF',
    },
    searchInput: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      fontSize: 16,
      color: '#000',
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
      backgroundColor: '#FFF',
    },
    flagText: {
      fontSize: 24,
      marginRight: 12,
    },
    countryInfo: {
      flex: 1,
    },
    countryName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#000',
      marginBottom: 2,
    },
    countryCode: {
      fontSize: 14,
      color: '#666',
    },
    checkMark: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: '#999',
    },
  });

export default LoginScreen;
