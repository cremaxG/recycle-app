import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import WdImage from '../../components/common/WdImage';
import WdText from '../../components/common/WdText';
import WdButton from '../../components/common/WdButton';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const styles = createStyles(theme);

  const handleLogin = () => {
    navigation.replace('Login');
    console.log('Iniciar sesión pressed');
  };

  const handleCreateAccount = () => {
    console.log('Crear cuenta pressed');
  };

  const handleSocialLogin = (platform: string) => {
    console.log(`${platform} login pressed`);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recycling Logo */}
        <View style={styles.logoContainer}>
          <WdImage
            source={require('../../assets/images/recycle-icon.png')}
            imageStyle={styles.recycleIcon}
          />
        </View>

        {/* Title */}
        <WdText
          label="YO RECICLO"
          fontSize={28}
          isBold={true}
          style={styles.title}
        />

        {/* Subtitle */}
        <WdText
          label="Solo un paso y estarás listo para ayudar a nuestro planeta!!"
          fontSize={18}
          color={theme.colors.text}
          style={styles.subtitle}
        />

        {/* Login Button */}
        <WdButton
          title="Get Started"
          onPress={handleLogin}
          style={styles.loginButton}
        />

        {/* Create Account Button */}
        <WdButton
          title="Continue as Guest"
          onPress={handleCreateAccount}
          style={[
            styles.createAccountButton,
            { borderColor: theme.colors.appBg },
          ]}
          textStyle={[styles.createAccountText, { color: theme.colors.appBg }]}
        />

        {/* Social Login Section */}
        <View style={styles.socialContainer}>
          <View
            style={[styles.dividerLine, { backgroundColor: theme.colors.text }]}
          />
          <WdText
            label="Redes Sociales"
            fontSize={18}
            style={styles.socialText}
          />
          <View
            style={[styles.dividerLine, { backgroundColor: theme.colors.text }]}
          />
        </View>

        {/* Social Icons */}
        <View style={styles.socialIcons}>
          <TouchableOpacity
            onPress={() => handleSocialLogin('Google')}
            style={styles.socialButton}
          >
            <WdImage
              source={require('../../assets/icons/google.png')}
              imageStyle={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Facebook')}
            style={styles.socialButton}
          >
            <WdImage
              source={require('../../assets/icons/facebook.png')}
              imageStyle={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialLogin('Apple')}
            style={styles.socialButton}
          >
            <WdImage
              source={require('../../assets/icons/apple.png')}
              imageStyle={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 30,
      paddingTop: 40,
      paddingBottom: 40,
    },
    logoContainer: {
      alignItems: 'center',
    },
    recycleIcon: {
      width: 150,
      height: 150,
    },
    title: {
      textAlign: 'center',
      paddingTop: 20,
    },
    subtitle: {
      textAlign: 'center',
      margin: 30,
    },
    loginButton: {
      backgroundColor: theme.colors.appBg,
      marginVertical: 25,
    },
    createAccountButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: theme.colors.appBg,
    },
    createAccountText: {
      color: theme.colors.appBg,
    },
    socialContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 60,
      marginBottom: 30,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#000',
    },
    socialText: {
      marginHorizontal: 15,
    },
    socialIcons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 30,
    },
    socialButton: {
      padding: 5,
    },
    socialIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
  });

export default WelcomeScreen;
