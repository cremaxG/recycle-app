import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import WdText from '../../components/common/WdText';
import WdInput from '../../components/common/WdInput';
import WdButton from '../../components/common/WdButton';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Walter Briceno',
    phone: '8801 - 3234',
    email: 'chuchobd@gmail.com',
    address: '25 mts Oeste del Museo la Carreta',
    city: 'Desamparados',
    district: 'Gravilias',
    province: 'San Jose',
    postalCode: '10312',
  });

  const onChange = (key: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setLoading(true);

    // 🔗 Call API here
    // await updateProfile(profile);

    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {/* FIXED HEADER */}
      <View
        style={[styles.header, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <View>
            <WdText
              label="Edit Profile"
              fontSize={20}
              isBold
              style={{ marginLeft: 15 }}
            />
            <WdText
              label="Update your information"
              color={theme.colors.placeholder}
              style={styles.subtitle}
            />
          </View>
        </View>
      </View>

      {/* SCROLLABLE CONTENT */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: 'https://picsum.photos/150',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity
              style={[
                styles.cameraBtn,
                { backgroundColor: theme.colors.appBg },
              ]}
            >
              <Icon name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FORM */}
        <WdInput
          labelKey="Full Name"
          value={profile.fullName}
          onChangeText={text => onChange('fullName', text)}
          placeholder="Full Name"
          appendIcon={{
            name: 'person-outline',
            size: 18,
            color: theme.colors.text,
          }}
        />

        <WdInput
          labelKey="Primary Phone"
          value={profile.phone}
          onChangeText={text => onChange('phone', text)}
          placeholder="Phone"
          appendIcon={{
            name: 'call-outline',
            size: 18,
            color: theme.colors.text,
          }}
        />

        <WdInput
          labelKey="Email"
          value={profile.email}
          onChangeText={text => onChange('email', text)}
          placeholder="Email"
          appendIcon={{
            name: 'mail-outline',
            size: 18,
            color: theme.colors.text,
          }}
        />

        <WdInput
          labelKey="Primary Address"
          value={profile.address}
          onChangeText={text => onChange('address', text)}
          placeholder="Address"
        />

        <WdInput
          labelKey="City"
          value={profile.city}
          onChangeText={text => onChange('city', text)}
          placeholder="City"
        />

        <WdInput
          labelKey="District"
          value={profile.district}
          onChangeText={text => onChange('district', text)}
          placeholder="District"
        />

        <WdInput
          labelKey="Province"
          value={profile.province}
          onChangeText={text => onChange('province', text)}
          placeholder="Province"
        />

        <WdInput
          labelKey="Postal Code"
          value={profile.postalCode}
          onChangeText={text => onChange('postalCode', text)}
          placeholder="Postal Code"
        />
      </ScrollView>

      {/* FIXED FOOTER WITH SAVE BUTTON */}
      <View
        style={[styles.footer, { backgroundColor: theme.colors.background }]}
      >
        <WdButton
          title="SAVE"
          onPress={handleSave}
          loading={loading}
          style={{ backgroundColor: theme.colors.appBg }}
        />
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    padding: 8,
  },
  subtitle: {
    marginLeft: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
