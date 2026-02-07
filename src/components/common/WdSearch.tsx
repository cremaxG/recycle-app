import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import i18n from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import WdIcon from './WdIcon';

interface Props {
  onSearch: (text: string) => void;
}

export default function SearchBar({ onSearch }: Props) {
  const { theme } = useTheme();

  const placeholderTexts = [
    i18n.t('search.water_cans') || 'Search for water cans',
    i18n.t('search.nearby_suppliers') || 'Search nearby suppliers',
    i18n.t('search.20l_jar') || '20L water jar',
    i18n.t('search.cold_water') || 'Cold water cans',
  ];

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [inputText, setInputText] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animate placeholder only when input is empty
  useEffect(() => {
    if (inputText.trim() !== '') {
      // Stop animation when user is typing
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // If input is empty, start animation
    intervalRef.current = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setPlaceholderIndex(prev => (prev + 1) % placeholderTexts.length);

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease),
        }).start();
      });
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inputText]);

  return (
    <View style={[styles.container]}>
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <WdIcon name="search" size={25} color={theme.colors.text} />

        <Animated.View style={{ flex: 1, opacity: inputText ? 1 : fadeAnim }}>
          <TextInput
            value={inputText}
            onChangeText={text => {
              setInputText(text);
              onSearch(text);
            }}
            placeholder={inputText ? '' : placeholderTexts[placeholderIndex]}
            placeholderTextColor={theme.colors.placeholder}
            style={[styles.input, { color: theme.colors.text }]}
            underlineColorAndroid="transparent"
          />
        </Animated.View>

        {/* <WdIcon name="keyboard-voice" size={25} color={theme.colors.text} /> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    borderRadius: 12,
    marginHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    borderRadius: 30,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    fontSize: 20,
    paddingHorizontal: 8,
    ...Platform.select({
      android: { paddingVertical: 5 },
    }),
  },
});
