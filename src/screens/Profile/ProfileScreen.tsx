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

const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(false);
    }, 800);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>

          <WdText
            label="Profile"
            fontSize={24}
            isBold
            style={{ marginLeft: 40 }}
          />
        </View>

        <WdText
          label="Help us with your information"
          color={theme.colors.placeholder}
          style={{ marginBottom: 24 }}
        />

        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            style={styles.avatar}
          />
          {isEditing && (
            <TouchableOpacity style={styles.cameraBtn}>
              <Icon name="camera-outline" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* FORM */}
        <WdInput
          labelKey="Full Name"
          value={profile.fullName}
          onChangeText={text => onChange('fullName', text)}
          placeholder="Full Name"
          editable={isEditing}
          appendIcon={{
            name: 'person-outline',
            size: 18,
            color: isEditing ? theme.colors.text : theme.colors.placeholder,
          }}
        />

        <WdInput
          labelKey="Primary Phone"
          value={profile.phone}
          onChangeText={text => onChange('phone', text)}
          placeholder="Phone"
          editable={isEditing}
          appendIcon={{
            name: 'call-outline',
            size: 18,
            color: isEditing ? theme.colors.text : theme.colors.placeholder,
          }}
        />

        <WdInput
          labelKey="Email"
          value={profile.email}
          onChangeText={text => onChange('email', text)}
          placeholder="Email"
          editable={isEditing}
          appendIcon={{
            name: 'mail-outline',
            size: 18,
            color: isEditing ? theme.colors.text : theme.colors.placeholder,
          }}
        />

        <WdInput
          labelKey="Primary Address"
          value={profile.address}
          onChangeText={text => onChange('address', text)}
          placeholder="Address"
          editable={isEditing}
        />

        <WdInput
          labelKey="City"
          value={profile.city}
          onChangeText={text => onChange('city', text)}
          placeholder="City"
          editable={isEditing}
        />

        <WdInput
          labelKey="District"
          value={profile.district}
          onChangeText={text => onChange('district', text)}
          placeholder="District"
          editable={isEditing}
        />

        <WdInput
          labelKey="Province"
          value={profile.province}
          onChangeText={text => onChange('province', text)}
          placeholder="Province"
          editable={isEditing}
        />

        <WdInput
          labelKey="Postal Code"
          value={profile.postalCode}
          onChangeText={text => onChange('postalCode', text)}
          placeholder="Postal Code"
          editable={isEditing}
        />

        {/* BUTTON */}
        {isEditing ? (
          <WdButton
            title="SAVE"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: 24, backgroundColor: theme.colors.appBg }}
          />
        ) : (
          <WdButton
            title="EDIT"
            onPress={() => setIsEditing(true)}
            style={{
              marginTop: 24,
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: theme.colors.appBg,
            }}
            textStyle={{ color: theme.colors.appBg }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backBtn: {
    padding: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 110 / 2 - 10,
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
  },
});
