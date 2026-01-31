import './src/i18n';
import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/context/ThemeContext';
import * as RNLocalize from 'react-native-localize';
import i18n from './src/i18n';
import { AuthProvider } from './src/context/AuthContext';
import ToastProvider from './src/context/ToastProvider';
import { ActivityIndicator, View } from 'react-native';
import { storage } from './src/utils/Storage';

const LANGUAGE_KEY = 'user-language';

const App = () => {
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

  useEffect(() => {
    const setInitialLanguage = async () => {
      try {
        const storedLanguage = storage.getString(LANGUAGE_KEY);
        if (storedLanguage) {
          i18n.changeLanguage(storedLanguage);
        } else {
          const locales = RNLocalize.getLocales();
          if (Array.isArray(locales) && locales.length > 0) {
            const deviceLanguage = locales[0].languageCode;
            i18n.changeLanguage(deviceLanguage);
            storage.set(LANGUAGE_KEY, deviceLanguage);
          }
        }
      } catch (error) {
        console.error('Failed to set language:', error);
      } finally {
        setIsLanguageLoaded(true);
      }
    };

    setInitialLanguage();
  }, []);

  if (!isLanguageLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
